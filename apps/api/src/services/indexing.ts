/**
 * Indexing: the pages a project has, where each stands with IndexNow and with Google, and what
 * to send next.
 *
 * - The page list is built from the site's sitemaps, its latest site audit and the pages Search
 *   Console has seen, once a day (syncPages). A page is "changed" when its content hash or sitemap
 *   lastmod moves; new and changed pages are suggested for submission.
 * - IndexNow (Bing, Yandex, Seznam, Naver, Yep) needs a key file on the site. OpenSEO makes the key,
 *   checks the file is there, and checks again before submitting. A page is only resubmitted after
 *   it changes, as IndexNow asks.
 * - Google takes no pushes for ordinary pages. Its index status comes from Search Console's URL
 *   Inspection API (2,000 a day per property), stored per page; sitemaps can be submitted when the
 *   Search Console grant has full access.
 *
 * Everything here is free: no YepAPI calls.
 */
import { randomBytes } from "node:crypto";
import { createSiteFetcher, type SiteFetcherOptions } from "@openseo/crawler";
import { and, desc, eq, isNotNull, sql, type SQL } from "drizzle-orm";
import { dataDb, schema } from "../db";
import type { IndexingTrigger, PageSource } from "../db/schema";
import { env } from "../env";
import { AppError, badRequest } from "../lib/errors";
import { canWriteGsc, DAY_MS, googleCall, gscFor, isoDate } from "./google";
import { gscPages } from "./gsc-sync";

type Project = typeof schema.projects.$inferSelect;
type Settings = typeof schema.indexingSettings.$inferSelect;
type PageRow = typeof schema.sitePages.$inferSelect;
/** Network options for fetching from the site; tests allow private addresses. */
export type NetOptions = Pick<SiteFetcherOptions, "allowPrivateNetwork" | "allowedPorts" | "fetch">;

const INDEXNOW_BATCH = 10_000;
const MAX_INSPECT_PER_DAY = 2_000;
/** Re-check the key file before submitting when the last check is older than this. */
const RECHECK_MS = DAY_MS;
const UPSERT_CHUNK = 500;

// ── Settings and the IndexNow key ───────────────────────────────────────────

/** A new IndexNow key: 32 hex characters (IndexNow allows 8–128 of a-z, A-Z, 0-9 and -). */
export const newIndexNowKey = () => randomBytes(16).toString("hex");

/** The project's indexing settings, created with a fresh key the first time they are asked for. */
export async function indexingSettings(project: Pick<Project, "id">): Promise<Settings> {
  const [existing] = await dataDb.select().from(schema.indexingSettings).where(eq(schema.indexingSettings.projectId, project.id)).limit(1);
  if (existing) return existing;
  const [created] = await dataDb.insert(schema.indexingSettings).values({ projectId: project.id, indexnowKey: newIndexNowKey() }).onConflictDoNothing().returning();
  if (created) return created;
  const [raced] = await dataDb.select().from(schema.indexingSettings).where(eq(schema.indexingSettings.projectId, project.id)).limit(1);
  return raced!;
}

/** The site's origin used for the key file and submissions, before the first check resolves redirects. */
function originOf(project: Pick<Project, "domain">, settings: Pick<Settings, "origin">): string | null {
  if (settings.origin) return settings.origin;
  return project.domain ? `https://${project.domain}` : null;
}

/** Where the key file must be: the custom location, or /<key>.txt at the site root. */
export function keyFileUrl(settings: Pick<Settings, "keyLocation" | "indexnowKey">, origin: string): string {
  return settings.keyLocation ?? `${origin}/${settings.indexnowKey}.txt`;
}

const stripWww = (host: string) => host.toLowerCase().replace(/^www\./, "");

/** Whether a URL belongs to the site, ignoring a www prefix. */
export function sameSite(url: string, origin: string): boolean {
  try {
    return stripWww(new URL(url).hostname) === stripWww(new URL(origin).hostname);
  } catch {
    return false;
  }
}

/**
 * The URLs IndexNow will take with this key: the key's own host, and with a custom key location,
 * only paths inside the location's folder.
 */
export function submittable(url: string, keyUrl: string): boolean {
  try {
    const u = new URL(url);
    const key = new URL(keyUrl);
    if (u.host !== key.host || u.protocol !== key.protocol) return false;
    const folder = key.pathname.slice(0, key.pathname.lastIndexOf("/") + 1);
    return u.pathname.startsWith(folder);
  } catch {
    return false;
  }
}

/**
 * Follows the homepage's redirects to the origin the site really answers on (https://www.… or
 * not). Falls back to http only when https cannot connect at all.
 */
async function resolveOrigin(domain: string, net: NetOptions): Promise<string> {
  const fetcher = createSiteFetcher(net);
  try {
    for (const scheme of ["https", "http"]) {
      const res = await fetcher.file(`${scheme}://${domain}/`);
      if (res.status > 0) return new URL(res.finalUrl).origin;
    }
    return `https://${domain}`;
  } finally {
    fetcher.close();
  }
}

export type KeyCheck = { verified: boolean; keyUrl: string; status: number; error: string | null };

/**
 * Fetches the key file and checks it holds the key. Saves the outcome: a file that disappears
 * turns the project back to not verified, so submissions stop until it is fixed.
 */
export async function verifyIndexNow(project: Project, net: NetOptions = {}): Promise<KeyCheck> {
  if (!project.domain) throw badRequest("Add the project's website first, in project settings");
  const settings = await indexingSettings(project);
  const origin = settings.keyLocation ? new URL(settings.keyLocation).origin : await resolveOrigin(project.domain, net);
  const keyUrl = keyFileUrl(settings, origin);
  const fetcher = createSiteFetcher(net);
  let check: KeyCheck;
  try {
    const res = await fetcher.file(keyUrl);
    const body = res.text?.trim() ?? null;
    let error: string | null = null;
    if (res.status === 0) error = `Could not reach ${keyUrl}${res.error ? `: ${res.error}` : ""}`;
    else if (res.status === 404) error = `No file at ${keyUrl}. Upload the key file to the site's root folder.`;
    else if (res.status < 200 || res.status >= 300) error = `${keyUrl} answered HTTP ${res.status}`;
    else if (new URL(res.finalUrl).href !== new URL(keyUrl).href) error = `${keyUrl} redirects to ${res.finalUrl}. IndexNow needs the file at the address itself.`;
    else if (body !== settings.indexnowKey) error = `${keyUrl} is there but holds ${body ? `"${body.slice(0, 40)}"` : "nothing"}, not the key.`;
    check = { verified: error === null, keyUrl, status: res.status, error };
  } finally {
    fetcher.close();
  }
  const now = new Date();
  await dataDb
    .update(schema.indexingSettings)
    .set({
      origin: settings.keyLocation ? settings.origin ?? origin : origin,
      indexnowCheckedAt: now,
      indexnowError: check.error,
      indexnowVerifiedAt: check.verified ? (settings.indexnowVerifiedAt ?? now) : null,
      updatedAt: now,
    })
    .where(eq(schema.indexingSettings.projectId, project.id));
  return check;
}

export type SettingsInput = { autoSubmit?: boolean; autoSitemaps?: boolean; inspectPerDay?: number; keyLocation?: string | null; newKey?: boolean };

export async function updateIndexingSettings(project: Project, input: SettingsInput): Promise<Settings> {
  const settings = await indexingSettings(project);
  const changes: Partial<Settings> = { updatedAt: new Date() };
  if (input.autoSubmit !== undefined) changes.autoSubmit = input.autoSubmit;
  if (input.autoSitemaps !== undefined) changes.autoSitemaps = input.autoSitemaps;
  if (input.inspectPerDay !== undefined) changes.inspectPerDay = Math.max(0, Math.min(MAX_INSPECT_PER_DAY, Math.round(input.inspectPerDay)));
  if (input.keyLocation !== undefined) {
    if (input.keyLocation) {
      let url: URL;
      try {
        url = new URL(input.keyLocation);
      } catch {
        throw badRequest("The key location must be a full URL, such as https://example.com/keys/key.txt");
      }
      if (url.protocol !== "https:" && url.protocol !== "http:") throw badRequest("The key location must be an http or https URL");
      if (project.domain && !sameSite(url.href, `https://${project.domain}`)) throw badRequest(`The key file must be on ${project.domain}`);
      if (!url.pathname.endsWith(".txt")) throw badRequest("The key file must be a .txt file");
      changes.keyLocation = url.href;
    } else changes.keyLocation = null;
  }
  // A new key or location needs checking again.
  if (input.newKey) changes.indexnowKey = newIndexNowKey();
  if (input.newKey || changes.keyLocation !== undefined) Object.assign(changes, { indexnowVerifiedAt: null, indexnowCheckedAt: null, indexnowError: null });
  const [updated] = await dataDb.update(schema.indexingSettings).set(changes).where(eq(schema.indexingSettings.projectId, settings.projectId)).returning();
  return updated!;
}

// ── Page states ─────────────────────────────────────────────────────────────

/** Gone, noindex, or not answering 2xx: nothing to submit. */
const excludedSql = sql`(${schema.sitePages.goneAt} is not null or coalesce(${schema.sitePages.indexable}, true) = false or (${schema.sitePages.status} is not null and (${schema.sitePages.status} < 200 or ${schema.sitePages.status} >= 300)))`;
/** New or changed since IndexNow last heard about it. */
const suggestedSql = sql`(not ${excludedSql} and (${schema.sitePages.indexnowSubmittedAt} is null or ${schema.sitePages.changedAt} > ${schema.sitePages.indexnowSubmittedAt}))`;
/** Google's coverage states worth acting on: not indexed yet, or indexed under another URL. */
const RETRY_COVERAGE = ["%currently not indexed%", "%unknown to google%", "%different canonical%"];
const reindexSql = sql`(not ${excludedSql} and ((${schema.sitePages.googleCrawledAt} is not null and ${schema.sitePages.changedAt} > ${schema.sitePages.googleCrawledAt}) or coalesce(${schema.sitePages.googleCoverage}, '') ilike any (array[${sql.join(
  RETRY_COVERAGE.map((c) => sql`${c}`),
  sql`, `,
)}]::text[])))`;
const indexedSql = sql`(${schema.sitePages.googleVerdict} = 'PASS')`;
const notIndexedSql = sql`(${schema.sitePages.googleVerdict} is not null and ${schema.sitePages.googleVerdict} <> 'PASS')`;

export type PageFilter = "all" | "suggested" | "new" | "changed" | "reindex" | "indexed" | "not_indexed" | "not_inspected" | "excluded" | "submitted";

function filterSql(filter: PageFilter, settings: Pick<Settings, "createdAt">): SQL | undefined {
  // Pages from the first sync are the baseline, not "new".
  const newSql = sql`(${schema.sitePages.firstSeenAt} > ${new Date(settings.createdAt.getTime() + 3_600_000)} and ${schema.sitePages.firstSeenAt} > now() - interval '30 days' and not ${excludedSql})`;
  switch (filter) {
    case "suggested":
      return suggestedSql;
    case "new":
      return newSql;
    case "changed":
      return sql`(not ${excludedSql} and ${schema.sitePages.changedAt} > ${schema.sitePages.firstSeenAt} and ${schema.sitePages.changedAt} > now() - interval '30 days')`;
    case "reindex":
      return reindexSql;
    case "indexed":
      return indexedSql;
    case "not_indexed":
      return notIndexedSql;
    case "not_inspected":
      return sql`(${schema.sitePages.googleInspectedAt} is null and not ${excludedSql})`;
    case "excluded":
      return excludedSql;
    case "submitted":
      return isNotNull(schema.sitePages.indexnowSubmittedAt);
    default:
      return undefined;
  }
}

/** Why a page needs Google's attention, in plain words; empty when it does not. */
export function reindexReasons(page: Pick<PageRow, "changedAt" | "googleCrawledAt" | "googleCoverage" | "googleCanonical" | "url" | "goneAt" | "indexable" | "status">): string[] {
  if (page.goneAt || page.indexable === false || (page.status != null && (page.status < 200 || page.status >= 300))) return [];
  const reasons: string[] = [];
  if (page.changedAt && page.googleCrawledAt && page.changedAt > page.googleCrawledAt) reasons.push("Changed after Google last crawled it");
  const coverage = page.googleCoverage?.toLowerCase() ?? "";
  if (coverage.includes("currently not indexed")) reasons.push(page.googleCoverage!);
  if (coverage.includes("unknown to google")) reasons.push("Google has not found it yet");
  if (coverage.includes("different canonical")) reasons.push(`Google indexes ${page.googleCanonical ?? "another URL"} instead`);
  return reasons;
}

function present(page: PageRow, createdAt: Date) {
  const excluded = Boolean(page.goneAt) || page.indexable === false || (page.status != null && (page.status < 200 || page.status >= 300));
  return {
    url: page.url,
    sources: page.sources,
    status: page.status,
    indexable: page.indexable,
    firstSeenAt: page.firstSeenAt,
    isNew: !excluded && page.firstSeenAt.getTime() > createdAt.getTime() + 3_600_000 && Date.now() - page.firstSeenAt.getTime() < 30 * DAY_MS,
    changedAt: page.changedAt,
    goneAt: page.goneAt,
    excluded,
    suggested: !excluded && (!page.indexnowSubmittedAt || (page.changedAt !== null && page.changedAt > page.indexnowSubmittedAt)),
    indexnow: { submittedAt: page.indexnowSubmittedAt, status: page.indexnowStatus },
    google: {
      verdict: page.googleVerdict,
      coverage: page.googleCoverage,
      crawledAt: page.googleCrawledAt,
      canonical: page.googleCanonical,
      inspectedAt: page.googleInspectedAt,
      error: page.googleError,
      reindex: reindexReasons(page),
    },
  };
}

export type IndexingPage = ReturnType<typeof present>;

export async function listPages(project: Pick<Project, "id">, options: { filter?: PageFilter; search?: string; limit?: number; offset?: number } = {}) {
  const settings = await indexingSettings(project);
  const where = and(
    eq(schema.sitePages.projectId, project.id),
    filterSql(options.filter ?? "all", settings),
    options.search?.trim() ? sql`${schema.sitePages.url} ilike ${`%${options.search.trim().replace(/[\\%_]/g, (c) => `\\${c}`)}%`}` : undefined,
  );
  const [{ total }] = (await dataDb.select({ total: sql<number>`count(*)::int` }).from(schema.sitePages).where(where)) as [{ total: number }];
  const rows = await dataDb
    .select()
    .from(schema.sitePages)
    .where(where)
    .orderBy(desc(schema.sitePages.firstSeenAt), schema.sitePages.url)
    .limit(options.limit ?? 100)
    .offset(options.offset ?? 0);
  return { total: Number(total), rows: rows.map((row) => present(row, settings.createdAt)) };
}

/** Counts for the overview card and the page's tabs. */
export async function indexingSummary(project: Pick<Project, "id">) {
  const settings = await indexingSettings(project);
  const count = (condition: SQL | undefined) => sql<number>`(count(*) filter (where ${condition ?? sql`true`}))::int`;
  const [row] = await dataDb
    .select({
      total: count(sql`${schema.sitePages.goneAt} is null`),
      suggested: count(filterSql("suggested", settings)),
      new: count(filterSql("new", settings)),
      changed: count(filterSql("changed", settings)),
      reindex: count(filterSql("reindex", settings)),
      indexed: count(filterSql("indexed", settings)),
      notIndexed: count(filterSql("not_indexed", settings)),
      notInspected: count(filterSql("not_inspected", settings)),
      excluded: count(filterSql("excluded", settings)),
      submitted: count(filterSql("submitted", settings)),
    })
    .from(schema.sitePages)
    .where(eq(schema.sitePages.projectId, project.id));
  const [lastSubmission] = await dataDb
    .select()
    .from(schema.indexnowSubmissions)
    .where(eq(schema.indexnowSubmissions.projectId, project.id))
    .orderBy(desc(schema.indexnowSubmissions.createdAt))
    .limit(1);
  return {
    counts: Object.fromEntries(Object.entries(row ?? {}).map(([k, v]) => [k, Number(v)])) as Record<string, number>,
    indexnow: {
      key: settings.indexnowKey,
      keyUrl: settings.origin || settings.keyLocation ? keyFileUrl(settings, settings.origin ?? new URL(settings.keyLocation!).origin) : null,
      customLocation: settings.keyLocation,
      verifiedAt: settings.indexnowVerifiedAt,
      checkedAt: settings.indexnowCheckedAt,
      error: settings.indexnowError,
      lastSubmission: lastSubmission ?? null,
    },
    settings: { autoSubmit: settings.autoSubmit, autoSitemaps: settings.autoSitemaps, inspectPerDay: settings.inspectPerDay, inspectedToday: settings.inspectedDay === isoDate(new Date()) ? settings.inspectedCount : 0 },
    origin: settings.origin,
    sitemaps: settings.sitemaps,
    lastSync: settings.lastSync,
    lastSyncAt: settings.lastSyncAt,
    nextSyncAt: settings.nextSyncAt,
  };
}

// ── Finding pages ───────────────────────────────────────────────────────────

type Found = { sources: Set<PageSource>; lastmod: Date | null; hash: string | null; status: number | null; indexable: boolean | null; canonical: string | null };

function parseLastmod(value: string | null): Date | null {
  if (!value) return null;
  const time = Date.parse(value);
  // Dates in the future are typos or generator bugs; they would mark the page changed forever.
  return Number.isFinite(time) && time <= Date.now() + DAY_MS ? new Date(time) : null;
}

const withoutHash = (url: string) => {
  try {
    const u = new URL(url);
    u.hash = "";
    return u.href;
  } catch {
    return null;
  }
};

export type SyncSummary = {
  origin: string;
  pages: number;
  newPages: number;
  changedPages: number;
  gonePages: number;
  sitemaps: { found: string[]; failed: { url: string; status: number }[]; capped: boolean };
  audit: { id: string; finishedAt: string | null } | null;
  searchConsolePages: number;
  submitted: number | null;
  sitemapsSubmitted: number | null;
  inspected: number | null;
  errors: string[];
};

/**
 * Rebuilds the page list from the sitemaps, the latest audit and Search Console, and records what
 * changed. A source only drops a page when it was read in full: a capped sitemap read or a missing
 * audit leaves earlier sightings alone.
 */
export async function syncPages(projectId: string, net: NetOptions = {}): Promise<SyncSummary> {
  const [project] = await dataDb.select().from(schema.projects).where(eq(schema.projects.id, projectId)).limit(1);
  if (!project) throw badRequest("Project not found");
  if (!project.domain) throw badRequest("Add the project's website first, in project settings");
  const settings = await indexingSettings(project);
  const errors: string[] = [];
  const origin = settings.keyLocation ? (settings.origin ?? `https://${project.domain}`) : await resolveOrigin(project.domain, net);
  const found = new Map<string, Found>();
  const see = (raw: string, source: PageSource, extra: Partial<Omit<Found, "sources">> = {}) => {
    const url = withoutHash(raw);
    if (!url || !sameSite(url, origin)) return;
    const entry = found.get(url) ?? { sources: new Set<PageSource>(), lastmod: null, hash: null, status: null, indexable: null, canonical: null };
    entry.sources.add(source);
    for (const [key, value] of Object.entries(extra)) if (value !== null && value !== undefined) (entry as Record<string, unknown>)[key] = value;
    found.set(url, entry);
  };

  // 1. Sitemaps.
  const fetcher = createSiteFetcher(net);
  let sitemapComplete = false;
  let sitemapInfo: SyncSummary["sitemaps"] = { found: [], failed: [], capped: false };
  try {
    const discovery = await fetcher.sitemaps(origin);
    discovery.urls.forEach((url, i) => see(url, "sitemap", { lastmod: parseLastmod(discovery.lastmods[i] ?? null) }));
    sitemapInfo = { found: discovery.sitemaps, failed: discovery.failed.map((f) => ({ url: f.url, status: f.status })), capped: discovery.capped };
    sitemapComplete = discovery.sitemaps.length > 0 && !discovery.capped && discovery.failed.length === 0;
    if (!discovery.sitemaps.length) errors.push("No sitemap found in robots.txt, /sitemap.xml or /sitemap_index.xml");
  } catch (error) {
    errors.push(`Sitemaps could not be read: ${(error as Error).message}`);
  } finally {
    fetcher.close();
  }

  // 2. The latest finished site audit.
  const [audit] = await dataDb
    .select({ id: schema.audits.id, finishedAt: schema.audits.finishedAt })
    .from(schema.audits)
    .where(and(eq(schema.audits.projectId, projectId), eq(schema.audits.status, "completed")))
    .orderBy(desc(schema.audits.createdAt))
    .limit(1);
  if (audit) {
    const pages = await dataDb
      .select({ url: schema.auditPages.url, status: schema.auditPages.status, indexable: schema.auditPages.indexable, contentType: schema.auditPages.contentType, data: schema.auditPages.data })
      .from(schema.auditPages)
      .where(eq(schema.auditPages.auditId, audit.id));
    for (const page of pages) {
      if (page.contentType && !page.contentType.includes("html")) continue;
      const data = page.data as { contentHash?: unknown; canonical?: unknown };
      see(page.url, "audit", {
        status: page.status,
        indexable: page.indexable,
        hash: typeof data.contentHash === "string" ? data.contentHash : null,
        canonical: typeof data.canonical === "string" ? data.canonical : null,
      });
    }
  }

  // 3. Pages Search Console has shown in results lately.
  const searchConsole = await gscPages(projectId, 28);
  for (const url of searchConsole.keys()) see(url, "gsc");

  // 4. Merge with what was known.
  const existing = new Map((await dataDb.select().from(schema.sitePages).where(eq(schema.sitePages.projectId, projectId))).map((row) => [row.url, row]));
  const now = new Date();
  let newPages = 0;
  let changedPages = 0;
  let gonePages = 0;
  const rows: (typeof schema.sitePages.$inferInsert)[] = [];
  for (const url of new Set([...existing.keys(), ...found.keys()])) {
    const old = existing.get(url);
    const seen = found.get(url);
    const sources = new Set<PageSource>(seen?.sources ?? []);
    // Keep sightings from sources that were not read in full this time.
    for (const source of old?.sources ?? []) {
      if (source === "manual") sources.add(source);
      if (source === "sitemap" && !sitemapComplete) sources.add(source);
      if (source === "audit" && !audit) sources.add(source);
    }
    const hash = seen?.hash ?? old?.contentHash ?? null;
    const lastmod = seen?.lastmod ?? old?.sitemapLastmod ?? null;
    let changedAt = old?.changedAt ?? (old ? null : lastmod);
    if (old) {
      const hashMoved = Boolean(seen?.hash && old.contentHash && seen.hash !== old.contentHash);
      const lastmodMoved = Boolean(seen?.lastmod && (!old.sitemapLastmod || seen.lastmod > old.sitemapLastmod));
      // Dated when it was noticed: a lastmod is often a bare date, earlier than a submission made the same day.
      if (hashMoved || lastmodMoved) {
        changedAt = now;
        changedPages++;
      }
    } else newPages++;
    const goneAt = sources.size ? null : (old?.goneAt ?? now);
    if (goneAt && !old?.goneAt) gonePages++;
    rows.push({
      projectId,
      url,
      sources: [...sources].sort(),
      sitemapLastmod: lastmod,
      contentHash: hash,
      status: seen?.sources.has("audit") ? seen.status : (old?.status ?? null),
      indexable: seen?.sources.has("audit") ? seen.indexable : (old?.indexable ?? null),
      canonical: seen?.sources.has("audit") ? seen.canonical : (old?.canonical ?? null),
      firstSeenAt: old?.firstSeenAt ?? now,
      lastSeenAt: seen ? now : (old?.lastSeenAt ?? now),
      changedAt,
      goneAt,
    });
  }
  for (let i = 0; i < rows.length; i += UPSERT_CHUNK) {
    await dataDb
      .insert(schema.sitePages)
      .values(rows.slice(i, i + UPSERT_CHUNK))
      .onConflictDoUpdate({
        target: [schema.sitePages.projectId, schema.sitePages.url],
        set: {
          sources: sql`excluded.sources`,
          sitemapLastmod: sql`excluded.sitemap_lastmod`,
          contentHash: sql`excluded.content_hash`,
          status: sql`excluded.status`,
          indexable: sql`excluded.indexable`,
          canonical: sql`excluded.canonical`,
          lastSeenAt: sql`excluded.last_seen_at`,
          changedAt: sql`excluded.changed_at`,
          goneAt: sql`excluded.gone_at`,
        },
      });
  }

  const summary: SyncSummary = {
    origin,
    pages: rows.filter((r) => !r.goneAt).length,
    // The first sync finds the whole site; none of it is "new".
    newPages: existing.size ? newPages : 0,
    changedPages,
    gonePages,
    sitemaps: sitemapInfo,
    audit: audit ? { id: audit.id, finishedAt: audit.finishedAt?.toISOString() ?? null } : null,
    searchConsolePages: searchConsole.size,
    submitted: null,
    sitemapsSubmitted: null,
    inspected: null,
    errors,
  };

  await dataDb
    .update(schema.indexingSettings)
    .set({ origin: settings.keyLocation ? settings.origin : origin, sitemaps: sitemapInfo.found, updatedAt: now })
    .where(eq(schema.indexingSettings.projectId, projectId));

  // 5. What runs on its own.
  if (settings.autoSubmit && settings.indexnowVerifiedAt) {
    try {
      summary.submitted = (await submitIndexNow(project, { suggested: true }, "auto", net)).submitted;
    } catch (error) {
      errors.push(`IndexNow: ${(error as Error).message}`);
    }
  }
  if (settings.autoSitemaps && summary.newPages > 0 && sitemapInfo.found.length) {
    try {
      summary.sitemapsSubmitted = (await submitGoogleSitemaps(project)).submitted.length;
    } catch (error) {
      errors.push(`Google sitemaps: ${(error as Error).message}`);
    }
  }
  const [gsc] = await dataDb.select({ id: schema.gscConnections.projectId }).from(schema.gscConnections).where(eq(schema.gscConnections.projectId, projectId)).limit(1);
  if (gsc) {
    try {
      summary.inspected = (await inspectDue(project)).inspected;
    } catch (error) {
      errors.push(`Google inspection: ${(error as Error).message}`);
    }
  }

  await dataDb
    .update(schema.indexingSettings)
    .set({ lastSync: summary as unknown as Record<string, unknown>, lastSyncAt: new Date(), nextSyncAt: new Date(Date.now() + DAY_MS) })
    .where(eq(schema.indexingSettings.projectId, projectId));
  return summary;
}

/** Records a sync that could not run at all, and tries again in six hours. */
export async function failPageSync(projectId: string, error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  await dataDb
    .update(schema.indexingSettings)
    .set({ lastSync: { errors: [message] }, lastSyncAt: new Date(), nextSyncAt: new Date(Date.now() + 6 * 3_600_000) })
    .where(eq(schema.indexingSettings.projectId, projectId));
}

/** Adds pages by hand, for URLs no sitemap or crawl lists yet. */
export async function addPages(project: Project, urls: string[]) {
  const settings = await indexingSettings(project);
  const origin = originOf(project, settings);
  if (!origin) throw badRequest("Add the project's website first, in project settings");
  const clean = [...new Set(urls.map(withoutHash).filter((u): u is string => Boolean(u)))];
  const outside = clean.filter((u) => !sameSite(u, origin));
  if (outside.length) throw badRequest(`Not on ${new URL(origin).hostname}: ${outside.slice(0, 3).join(", ")}`);
  for (const url of clean) {
    await dataDb
      .insert(schema.sitePages)
      .values({ projectId: project.id, url, sources: ["manual"] })
      .onConflictDoUpdate({
        target: [schema.sitePages.projectId, schema.sitePages.url],
        set: { sources: sql`(select array(select distinct unnest(${schema.sitePages.sources} || array['manual']::text[]) order by 1))`, goneAt: null },
      });
  }
  return { added: clean.length };
}

// ── IndexNow ────────────────────────────────────────────────────────────────

const INDEXNOW_ERRORS: Record<number, string> = {
  400: "IndexNow rejected the request as malformed.",
  403: "IndexNow could not confirm the key. Check the key file is still on the site.",
  422: "IndexNow says these URLs do not belong to the key's host, or the key does not match.",
  429: "IndexNow is limiting requests from this site for now. Try again later.",
};

/**
 * Sends URLs to IndexNow: the given ones, or every suggested page. Checks the key file first when
 * the last check is over a day old. Pages IndexNow accepts are marked submitted.
 */
export async function submitIndexNow(project: Project, target: { urls?: string[]; suggested?: boolean }, trigger: IndexingTrigger, net: NetOptions = {}) {
  let settings = await indexingSettings(project);
  if (!settings.indexnowVerifiedAt || !settings.indexnowCheckedAt || Date.now() - settings.indexnowCheckedAt.getTime() > RECHECK_MS) {
    const check = await verifyIndexNow(project, net);
    if (!check.verified) throw new AppError(409, "indexnow_not_verified", check.error ?? "The IndexNow key file is not on the site yet.");
    settings = await indexingSettings(project);
  }
  const origin = settings.origin ?? `https://${project.domain}`;
  const keyUrl = keyFileUrl(settings, origin);

  let urls: string[];
  if (target.suggested) {
    const rows = await dataDb
      .select({ url: schema.sitePages.url })
      .from(schema.sitePages)
      .where(and(eq(schema.sitePages.projectId, project.id), suggestedSql));
    urls = rows.map((r) => r.url);
  } else urls = [...new Set((target.urls ?? []).map(withoutHash).filter((u): u is string => Boolean(u)))];
  const accepted = urls.filter((u) => submittable(u, keyUrl));
  const skipped = urls.filter((u) => !submittable(u, keyUrl));
  if (!accepted.length) return { submitted: 0, skipped, status: null as number | null };

  let lastStatus: number | null = null;
  let submitted = 0;
  for (let i = 0; i < accepted.length; i += INDEXNOW_BATCH) {
    const batch = accepted.slice(i, i + INDEXNOW_BATCH);
    let status: number | null = null;
    let error: string | null = null;
    try {
      const res = await fetch(env.INDEXNOW_ENDPOINT, {
        method: "POST",
        headers: { "content-type": "application/json; charset=utf-8" },
        body: JSON.stringify({ host: new URL(keyUrl).host, key: settings.indexnowKey, keyLocation: keyUrl, urlList: batch }),
        signal: AbortSignal.timeout(30_000),
      });
      status = res.status;
      if (status !== 200 && status !== 202) error = INDEXNOW_ERRORS[status] ?? `IndexNow answered HTTP ${status}.`;
    } catch (e) {
      error = `IndexNow could not be reached: ${(e as Error).message}`;
    }
    await dataDb.insert(schema.indexnowSubmissions).values({ projectId: project.id, trigger, urlCount: batch.length, urls: batch.slice(0, 100), status, error });
    lastStatus = status;
    if (error) {
      if (status === 403) await dataDb.update(schema.indexingSettings).set({ indexnowVerifiedAt: null, indexnowError: error }).where(eq(schema.indexingSettings.projectId, project.id));
      throw new AppError(status === 429 ? 429 : 502, "indexnow_error", error, { status });
    }
    const now = new Date();
    for (let j = 0; j < batch.length; j += UPSERT_CHUNK) {
      const chunk = batch.slice(j, j + UPSERT_CHUNK);
      // Pages submitted by hand that the list does not know yet are added as manual.
      await dataDb
        .insert(schema.sitePages)
        .values(chunk.map((url) => ({ projectId: project.id, url, sources: ["manual" as PageSource], indexnowSubmittedAt: now, indexnowStatus: status })))
        .onConflictDoUpdate({ target: [schema.sitePages.projectId, schema.sitePages.url], set: { indexnowSubmittedAt: now, indexnowStatus: status } });
    }
    submitted += batch.length;
  }
  return { submitted, skipped, status: lastStatus };
}

export async function submissionLog(project: Pick<Project, "id">, limit = 50) {
  return dataDb
    .select()
    .from(schema.indexnowSubmissions)
    .where(eq(schema.indexnowSubmissions.projectId, project.id))
    .orderBy(desc(schema.indexnowSubmissions.createdAt))
    .limit(limit);
}

// ── Google: URL inspection and sitemaps ─────────────────────────────────────

/** Whether a URL is inside a Search Console property ("sc-domain:example.com" or a URL prefix). */
export function inProperty(url: string, siteUrl: string): boolean {
  if (siteUrl.startsWith("sc-domain:")) {
    const domain = siteUrl.slice("sc-domain:".length).toLowerCase();
    try {
      const host = new URL(url).hostname.toLowerCase();
      return host === domain || host.endsWith(`.${domain}`);
    } catch {
      return false;
    }
  }
  return url.startsWith(siteUrl);
}

type Inspection = { verdict: string | null; coverage: string | null; crawledAt: Date | null; canonical: string | null; error: string | null };

async function inspectOne(account: Parameters<typeof googleCall>[0], siteUrl: string, url: string): Promise<Inspection> {
  try {
    const res = await googleCall<{ inspectionResult?: { indexStatusResult?: { verdict?: string; coverageState?: string; lastCrawlTime?: string; googleCanonical?: string } } }>(
      account,
      "searchconsole",
      "/v1/urlInspection/index:inspect",
      { inspectionUrl: url, siteUrl },
    );
    const status = res.inspectionResult?.indexStatusResult ?? {};
    const crawled = status.lastCrawlTime ? new Date(status.lastCrawlTime) : null;
    return { verdict: status.verdict ?? null, coverage: status.coverageState ?? null, crawledAt: crawled && Number.isFinite(crawled.getTime()) ? crawled : null, canonical: status.googleCanonical ?? null, error: null };
  } catch (error) {
    // Quota, permission and expired access stop the run; anything else is about this URL.
    if (error instanceof AppError && error.code !== "bad_request") throw error;
    return { verdict: null, coverage: null, crawledAt: null, canonical: null, error: (error as Error).message };
  }
}

async function saveInspection(projectId: string, url: string, result: Inspection) {
  const values = {
    googleVerdict: result.verdict,
    googleCoverage: result.coverage,
    googleCrawledAt: result.crawledAt,
    googleCanonical: result.canonical,
    googleInspectedAt: new Date(),
    googleError: result.error,
  };
  await dataDb
    .insert(schema.sitePages)
    .values({ projectId, url, sources: ["manual"], ...values })
    .onConflictDoUpdate({ target: [schema.sitePages.projectId, schema.sitePages.url], set: values });
}

/** Takes up to `wanted` inspections from today's allowance; returns how many were granted. */
async function takeQuota(projectId: string, wanted: number): Promise<number> {
  const settings = await indexingSettings({ id: projectId });
  const today = isoDate(new Date());
  const used = settings.inspectedDay === today ? settings.inspectedCount : 0;
  const granted = Math.max(0, Math.min(wanted, settings.inspectPerDay - used));
  if (granted) await dataDb.update(schema.indexingSettings).set({ inspectedDay: today, inspectedCount: used + granted }).where(eq(schema.indexingSettings.projectId, projectId));
  return granted;
}

/**
 * Today's share of URL inspections, most useful pages first: never inspected, changed since the
 * last inspection, not indexed at the last look (after three days), then the oldest results.
 */
export async function inspectDue(project: Pick<Project, "id">) {
  const { connection, account } = await gscFor(project);
  const settings = await indexingSettings(project);
  const today = isoDate(new Date());
  const left = settings.inspectPerDay - (settings.inspectedDay === today ? settings.inspectedCount : 0);
  if (left <= 0) return { inspected: 0, left: 0 };
  const candidates = await dataDb
    .select({ url: schema.sitePages.url })
    .from(schema.sitePages)
    .where(
      and(
        eq(schema.sitePages.projectId, project.id),
        sql`not ${excludedSql}`,
        sql`(${schema.sitePages.googleInspectedAt} is null
          or ${schema.sitePages.changedAt} > ${schema.sitePages.googleInspectedAt}
          or (${notIndexedSql} and ${schema.sitePages.googleInspectedAt} < now() - interval '3 days')
          or ${schema.sitePages.googleInspectedAt} < now() - interval '14 days')`,
      ),
    )
    .orderBy(
      sql`case
        when ${schema.sitePages.googleInspectedAt} is null then 0
        when ${schema.sitePages.changedAt} > ${schema.sitePages.googleInspectedAt} then 1
        when ${notIndexedSql} then 2
        else 3 end`,
      sql`${schema.sitePages.googleInspectedAt} asc nulls first`,
      desc(schema.sitePages.firstSeenAt),
    )
    .limit(left * 2);
  const urls = candidates.map((c) => c.url).filter((u) => inProperty(u, connection.siteUrl)).slice(0, left);
  const granted = await takeQuota(project.id, urls.length);
  let inspected = 0;
  for (const url of urls.slice(0, granted)) {
    await saveInspection(project.id, url, await inspectOne(account, connection.siteUrl, url));
    inspected++;
  }
  return { inspected, left: left - inspected };
}

/** Inspects the given URLs now (at most 50), within today's allowance, and stores the results. */
export async function inspectPages(project: Project, urls: string[]) {
  const { connection, account } = await gscFor(project);
  const clean = [...new Set(urls)].slice(0, 50);
  const outside = clean.filter((u) => !inProperty(u, connection.siteUrl));
  const inside = clean.filter((u) => inProperty(u, connection.siteUrl));
  const granted = await takeQuota(project.id, inside.length);
  const results: { url: string; verdict: string | null; coverage: string | null; crawledAt: Date | null; canonical: string | null; error: string | null }[] = [];
  for (const url of inside.slice(0, granted)) {
    const result = await inspectOne(account, connection.siteUrl, url);
    await saveInspection(project.id, url, result);
    results.push({ url, ...result });
  }
  return { siteUrl: connection.siteUrl, results, outsideProperty: outside, overQuota: inside.slice(granted) };
}

type GoogleSitemap = {
  path: string;
  lastSubmitted?: string;
  lastDownloaded?: string;
  isPending?: boolean;
  isSitemapsIndex?: boolean;
  warnings?: string;
  errors?: string;
  contents?: { type: string; submitted?: string; indexed?: string }[];
};

/** The sitemaps Google has for the property, with when it last read each one and any errors. */
export async function googleSitemaps(project: Pick<Project, "id">) {
  const { connection, account } = await gscFor(project);
  const res = await googleCall<{ sitemap?: GoogleSitemap[] }>(account, "webmasters", `/webmasters/v3/sites/${encodeURIComponent(connection.siteUrl)}/sitemaps`);
  return {
    siteUrl: connection.siteUrl,
    canSubmit: canWriteGsc(account),
    sitemaps: (res.sitemap ?? []).map((s) => ({
      path: s.path,
      lastSubmitted: s.lastSubmitted ?? null,
      lastDownloaded: s.lastDownloaded ?? null,
      pending: s.isPending ?? false,
      index: s.isSitemapsIndex ?? false,
      warnings: Number(s.warnings ?? 0),
      errors: Number(s.errors ?? 0),
      submittedUrls: (s.contents ?? []).reduce((sum, c) => sum + Number(c.submitted ?? 0), 0),
    })),
  };
}

/**
 * Submits sitemaps to Google: the given ones, or every sitemap the last sync found (indexes only
 * when the site has them, since Google reads their children). Needs full Search Console access.
 */
export async function submitGoogleSitemaps(project: Pick<Project, "id">, paths?: string[]) {
  const { connection, account } = await gscFor(project);
  if (!canWriteGsc(account)) {
    throw new AppError(403, "google_scope_required", "This Search Console connection is read-only. Reconnect Search Console and allow full access to let OpenSEO submit sitemaps.", { provider: "gsc" });
  }
  const settings = await indexingSettings(project);
  const wanted = [...new Set(paths?.length ? paths : settings.sitemaps)];
  const inside = wanted.filter((p) => inProperty(p, connection.siteUrl));
  const submitted: string[] = [];
  for (const path of inside) {
    await googleCall(account, "webmasters", `/webmasters/v3/sites/${encodeURIComponent(connection.siteUrl)}/sitemaps/${encodeURIComponent(path)}`, undefined, "PUT");
    submitted.push(path);
  }
  return { submitted, outsideProperty: wanted.filter((p) => !inProperty(p, connection.siteUrl)) };
}
