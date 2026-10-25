/**
 * Keeps a project's Search Console numbers in the project database, so other features can use
 * them without asking Google each time and so history outlives Google's 16-month window.
 *
 * - On connecting, the backfill walks back from the newest day to Google's 16-month limit, 30 days
 *   per run, one run every scheduler tick, until it reaches the limit or a month with no data.
 * - Every day after, the last few days are fetched again: Google keeps revising them for about
 *   three days. Older days are final and never fetched twice.
 * - Per day: whole-site totals (gsc_daily_totals) and up to 50,000 query × page rows (gsc_daily).
 *
 * Free: Search Console's API costs nothing and never touches the YepAPI budget.
 */
import { and, eq, gte, isNull, lte, sql } from "drizzle-orm";
import { dataDb, schema } from "../db";
import { AppError } from "../lib/errors";
import { DAY_MS, gscFor, isoDate, searchAnalytics, type GscRow } from "./google";

const BACKFILL_DAYS = 30;
const REFRESH_DAYS = 5;
/** Days older than this are final in Search Console. */
const FINAL_AFTER_DAYS = 4;
const PAGE_ROWS = 25_000;
const MAX_ROWS_PER_DAY = 50_000;
const INSERT_CHUNK = 1_000;

const addDays = (day: string, n: number) => isoDate(new Date(Date.parse(day) + n * DAY_MS));

/** The newest day Search Console has (about two days ago) and the oldest it keeps (16 months back). */
export function gscWindow(today = new Date()) {
  const midnight = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  const floor = new Date(midnight);
  floor.setUTCMonth(floor.getUTCMonth() - 16);
  return { newest: isoDate(new Date(midnight - 2 * DAY_MS)), oldest: isoDate(floor), finalBefore: isoDate(new Date(midnight - FINAL_AFTER_DAYS * DAY_MS)) };
}

/** Days to fetch this run: recent days not yet final, then one backfill chunk. Oldest-first within each. */
export function daysToSync(
  state: { syncedFrom: string | null; syncedTo: string | null; backfillDone: boolean },
  finalDays: Set<string>,
  window = gscWindow(),
): { recent: string[]; backfill: string[] } {
  const recent: string[] = [];
  const start = state.syncedTo ? addDays(state.syncedTo, -(REFRESH_DAYS - 1)) : addDays(window.newest, -(BACKFILL_DAYS - 1));
  for (let day = start < window.oldest ? window.oldest : start; day <= window.newest; day = addDays(day, 1)) {
    if (!finalDays.has(day)) recent.push(day);
  }
  const backfill: string[] = [];
  if (state.syncedFrom && !state.backfillDone) {
    for (let day = addDays(state.syncedFrom, -1); backfill.length < BACKFILL_DAYS && day >= window.oldest; day = addDays(day, -1)) backfill.push(day);
    backfill.reverse();
  }
  return { recent, backfill };
}

/** One sync run for a project. Returns what it stored; throws when Google refuses. */
export async function syncSearchConsole(projectId: string, today = new Date()) {
  const { connection, account } = await gscFor({ id: projectId });
  const window = gscWindow(today);
  const finalRows = await dataDb
    .select({ date: schema.gscDailyTotals.date })
    .from(schema.gscDailyTotals)
    .where(and(eq(schema.gscDailyTotals.projectId, projectId), eq(schema.gscDailyTotals.final, true), gte(schema.gscDailyTotals.date, addDays(window.newest, -(BACKFILL_DAYS + REFRESH_DAYS)))));
  const plan = daysToSync(connection, new Set(finalRows.map((r) => r.date)), window);
  const days = [...plan.backfill, ...plan.recent];
  let rows = 0;
  let backfillRows = 0;

  if (days.length) {
    const first = days[0]!;
    const last = days[days.length - 1]!;
    // Totals for every day in one call; a day missing from the reply had no impressions.
    const totals = await searchAnalytics(account, connection.siteUrl, { startDate: first, endDate: last }, { dimensions: ["date"], rowLimit: 1000 });
    const byDay = new Map(totals.map((r) => [r.keys?.[0] ?? "", r]));
    for (const day of days) {
      const total = byDay.get(day);
      const pairs = total ? await dayRows(account, connection.siteUrl, day) : [];
      await storeDay(projectId, day, total ?? null, pairs, day < window.finalBefore);
      rows += pairs.length;
      if (plan.backfill.includes(day)) backfillRows += total ? 1 : 0;
    }
  }

  const stored = [connection.syncedFrom, connection.syncedTo, ...days].filter((d): d is string => Boolean(d)).sort();
  // A month with no data at all means the property did not exist yet: nothing older to fetch.
  const backfillDone = connection.backfillDone || (plan.backfill.length > 0 && (backfillRows === 0 || plan.backfill[0]! <= window.oldest)) || (connection.syncedFrom !== null && connection.syncedFrom <= window.oldest);
  const next = backfillDone ? new Date(today.getTime() + DAY_MS) : new Date(today.getTime() + 60_000);
  await dataDb
    .update(schema.gscConnections)
    .set({ syncedFrom: stored[0] ?? null, syncedTo: stored[stored.length - 1] ?? null, backfillDone, syncError: null, lastSyncAt: today, nextSyncAt: next })
    .where(eq(schema.gscConnections.projectId, projectId));
  return { days: days.length, rows, backfillDone };
}

/** Query × page rows for one day, paged 25,000 at a time up to 50,000. */
async function dayRows(account: Parameters<typeof searchAnalytics>[0], siteUrl: string, day: string): Promise<GscRow[]> {
  const out: GscRow[] = [];
  while (out.length < MAX_ROWS_PER_DAY) {
    const page = await searchAnalytics(account, siteUrl, { startDate: day, endDate: day }, { dimensions: ["query", "page"], rowLimit: PAGE_ROWS, startRow: out.length });
    out.push(...page);
    if (page.length < PAGE_ROWS) break;
  }
  return out;
}

async function storeDay(projectId: string, day: string, total: GscRow | null, pairs: GscRow[], final: boolean) {
  await dataDb.transaction(async (tx) => {
    await tx.delete(schema.gscDaily).where(and(eq(schema.gscDaily.projectId, projectId), eq(schema.gscDaily.date, day)));
    const values = pairs
      .filter((r) => r.keys?.[0] && r.keys?.[1])
      .map((r) => ({ projectId, date: day, query: r.keys![0]!, page: r.keys![1]!, clicks: r.clicks, impressions: r.impressions, position: r.position }));
    for (let i = 0; i < values.length; i += INSERT_CHUNK) await tx.insert(schema.gscDaily).values(values.slice(i, i + INSERT_CHUNK)).onConflictDoNothing();
    const totals = { clicks: total?.clicks ?? 0, impressions: total?.impressions ?? 0, position: total?.position ?? null, final };
    await tx
      .insert(schema.gscDailyTotals)
      .values({ projectId, date: day, ...totals })
      .onConflictDoUpdate({ target: [schema.gscDailyTotals.projectId, schema.gscDailyTotals.date], set: totals });
  });
}

/** Records a failed run and when to try again: six hours, or never on its own if access is gone. */
export async function failSync(projectId: string, error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  const reconnect = error instanceof AppError && (error.code === "google_reconnect_required" || error.code === "google_permission");
  await dataDb
    .update(schema.gscConnections)
    .set({ syncError: message, lastSyncAt: new Date(), nextSyncAt: reconnect ? null : new Date(Date.now() + 6 * 3_600_000) })
    .where(eq(schema.gscConnections.projectId, projectId));
}

// ── Reading the stored data ─────────────────────────────────────────────────

const round1 = (n: number | null) => (n == null ? null : Math.round(n * 10) / 10);

/** The stored period ending on the newest synced day, and the one before it. */
async function storedPeriods(projectId: string, days: number) {
  const [connection] = await dataDb
    .select({ syncedTo: schema.gscConnections.syncedTo, syncedFrom: schema.gscConnections.syncedFrom })
    .from(schema.gscConnections)
    .where(eq(schema.gscConnections.projectId, projectId))
    .limit(1);
  if (!connection?.syncedTo) return null;
  const end = connection.syncedTo;
  const start = addDays(end, -(days - 1));
  return { current: { startDate: start, endDate: end }, previous: { startDate: addDays(start, -days), endDate: addDays(start, -1) }, syncedFrom: connection.syncedFrom };
}

export type GscKeyword = {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number | null;
  position: number | null;
  previousPosition: number | null;
  /** The page with the most clicks (then impressions) for the query. */
  page: string | null;
};

/**
 * Every query in the period with clicks, impressions, average position (weighted by impressions),
 * the position in the period before, and its top page. Most impressions first.
 */
export async function gscKeywords(
  projectId: string,
  options: { days?: number; search?: string; minPosition?: number; maxPosition?: number; minImpressions?: number; limit?: number; offset?: number; sort?: "impressions" | "clicks" | "position" } = {},
) {
  const days = options.days ?? 28;
  const periods = await storedPeriods(projectId, days);
  if (!periods) return { synced: false as const, period: null, total: 0, rows: [] as GscKeyword[] };
  const { current, previous } = periods;
  const search = options.search?.trim().toLowerCase();
  const order = options.sort === "clicks" ? sql`clicks desc` : options.sort === "position" ? sql`position asc nulls last` : sql`impressions desc`;
  const result = await dataDb.execute<{ query: string; clicks: number; impressions: number; position: number | null; previous_position: number | null; page: string | null; total: number }>(sql`
    with cur as (
      select query, sum(clicks)::int as clicks, sum(impressions)::int as impressions,
        sum(position * impressions) / nullif(sum(impressions), 0) as position
      from gsc_daily
      where project_id = ${projectId} and date between ${current.startDate} and ${current.endDate}
        ${search ? sql`and lower(query) like ${`%${search.replace(/[\\%_]/g, (c) => `\\${c}`)}%`}` : sql``}
      group by query
    ), prev as (
      select query, sum(position * impressions) / nullif(sum(impressions), 0) as position
      from gsc_daily
      where project_id = ${projectId} and date between ${previous.startDate} and ${previous.endDate} and query in (select query from cur)
      group by query
    ), top_page as (
      select distinct on (query) query, page
      from (select query, page, sum(clicks) as c, sum(impressions) as i from gsc_daily
            where project_id = ${projectId} and date between ${current.startDate} and ${current.endDate} and query in (select query from cur)
            group by query, page) p
      order by query, c desc, i desc
    ), filtered as (
      select cur.*, prev.position as previous_position, top_page.page
      from cur left join prev using (query) left join top_page using (query)
      where true
        ${options.minPosition != null ? sql`and cur.position >= ${options.minPosition}` : sql``}
        ${options.maxPosition != null ? sql`and cur.position <= ${options.maxPosition}` : sql``}
        ${options.minImpressions != null ? sql`and cur.impressions >= ${options.minImpressions}` : sql``}
    )
    select *, (count(*) over ())::int as total from filtered
    order by ${order}, query
    limit ${options.limit ?? 100} offset ${options.offset ?? 0}
  `);
  const rows = result.rows.map((r) => ({
    query: r.query,
    clicks: Number(r.clicks),
    impressions: Number(r.impressions),
    ctr: Number(r.impressions) ? Math.round((Number(r.clicks) / Number(r.impressions)) * 10_000) / 100 : null,
    position: round1(r.position == null ? null : Number(r.position)),
    previousPosition: round1(r.previous_position == null ? null : Number(r.previous_position)),
    page: r.page,
  }));
  return { synced: true as const, period: current, total: Number(result.rows[0]?.total ?? 0), rows };
}

/** Lower-cased keywords the project already tracks (any tracker) or has saved. */
async function knownKeywords(projectId: string): Promise<Set<string>> {
  const tracked = await dataDb
    .select({ keyword: schema.rankKeywords.keyword })
    .from(schema.rankKeywords)
    .innerJoin(schema.rankTrackers, eq(schema.rankTrackers.id, schema.rankKeywords.trackerId))
    .where(and(eq(schema.rankTrackers.projectId, projectId), isNull(schema.rankKeywords.removedAt)));
  const saved = await dataDb.select({ keyword: schema.savedKeywords.keyword }).from(schema.savedKeywords).where(eq(schema.savedKeywords.projectId, projectId));
  return new Set([...tracked, ...saved].map((k) => k.keyword.trim().toLowerCase()));
}

export type KeywordSuggestion = GscKeyword & { reason: "striking_distance" | "top_query" | "question" };

const QUESTION = /^(who|what|when|where|why|how|which|can|does|do|is|are|should|best|vs\b)|\?|\bvs\b/i;

/**
 * Queries worth tracking or saving that the project has not added yet: first those one push from
 * page one (positions 5–20), then the ones with most impressions. At most `limit`.
 */
export async function keywordSuggestions(projectId: string, limit = 50) {
  const { synced, period, rows } = await gscKeywords(projectId, { days: 28, minImpressions: 10, limit: 1000 });
  if (!synced) return { synced, period, rows: [] as KeywordSuggestion[] };
  const known = await knownKeywords(projectId);
  const fresh = rows.filter((r) => !known.has(r.query.toLowerCase()));
  const striking = fresh.filter((r) => r.position != null && r.position >= 5 && r.position <= 20).map((r) => ({ ...r, reason: "striking_distance" as const }));
  const rest = fresh.filter((r) => !striking.some((s) => s.query === r.query)).map((r) => ({ ...r, reason: QUESTION.test(r.query) ? ("question" as const) : ("top_query" as const) }));
  return { synced, period, rows: [...striking, ...rest].slice(0, limit) };
}

/** Question-style queries (how, what, best…) for AI visibility prompts, most impressions first. */
export async function promptIdeas(projectId: string, limit = 20) {
  const { synced, rows } = await gscKeywords(projectId, { days: 90, minImpressions: 5, limit: 2000 });
  return { synced, rows: rows.filter((r) => QUESTION.test(r.query) && r.query.split(/\s+/).length >= 3).slice(0, limit) };
}

/** Search Console's position, clicks and impressions over 28 days for the given keywords, keyed lower-cased. */
export async function positionsFor(projectId: string, keywords: string[]) {
  const periods = await storedPeriods(projectId, 28);
  const out = new Map<string, { position: number | null; clicks: number; impressions: number }>();
  if (!periods || !keywords.length) return out;
  const wanted = [...new Set(keywords.map((k) => k.trim().toLowerCase()))];
  const result = await dataDb.execute<{ q: string; clicks: number; impressions: number; position: number | null }>(sql`
    select lower(query) as q, sum(clicks)::int as clicks, sum(impressions)::int as impressions,
      sum(position * impressions) / nullif(sum(impressions), 0) as position
    from gsc_daily
    where project_id = ${projectId} and date between ${periods.current.startDate} and ${periods.current.endDate}
      and lower(query) in (${sql.join(wanted.map((k) => sql`${k}`), sql`, `)})
    group by lower(query)
  `);
  for (const r of result.rows) out.set(r.q, { position: round1(r.position == null ? null : Number(r.position)), clicks: Number(r.clicks), impressions: Number(r.impressions) });
  return out;
}

/** Daily whole-site totals over the stored history, up to `days` back from the newest day. */
export async function gscHistory(projectId: string, days = 480) {
  const periods = await storedPeriods(projectId, days);
  if (!periods) return { synced: false as const, from: null, to: null, daily: [] };
  const rows = await dataDb
    .select({ date: schema.gscDailyTotals.date, clicks: schema.gscDailyTotals.clicks, impressions: schema.gscDailyTotals.impressions, position: schema.gscDailyTotals.position })
    .from(schema.gscDailyTotals)
    .where(and(eq(schema.gscDailyTotals.projectId, projectId), gte(schema.gscDailyTotals.date, periods.current.startDate), lte(schema.gscDailyTotals.date, periods.current.endDate)))
    .orderBy(schema.gscDailyTotals.date);
  return { synced: true as const, from: periods.syncedFrom, to: periods.current.endDate, daily: rows.map((r) => ({ ...r, position: round1(r.position) })) };
}

/** Pages with impressions in the last `days` stored days, with their clicks. */
export async function gscPages(projectId: string, days = 28): Promise<Map<string, number>> {
  const periods = await storedPeriods(projectId, days);
  if (!periods) return new Map();
  const rows = await dataDb
    .select({ page: schema.gscDaily.page, clicks: sql<number>`sum(${schema.gscDaily.clicks})::int` })
    .from(schema.gscDaily)
    .where(and(eq(schema.gscDaily.projectId, projectId), gte(schema.gscDaily.date, periods.current.startDate), lte(schema.gscDaily.date, periods.current.endDate)))
    .groupBy(schema.gscDaily.page);
  return new Map(rows.map((r) => [r.page, Number(r.clicks)]));
}
