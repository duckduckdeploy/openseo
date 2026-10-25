import { env } from "../env";
import { computeHealthScore, crawlSite, trafficByPage, trafficIssues } from "@openseo/crawler";
import type { CrawlOptions, Issue, PageResult, PageTraffic } from "@openseo/crawler";
import type { YepApi } from "@openseo/yepapi";
import { and, desc, eq, gte, inArray, isNull, lt, notInArray, sql } from "drizzle-orm";
import { dataDb, schema } from "../db";
import type { AuditLinkKind, AuditOptions, AuditTrigger, RenderMode } from "../db/data-schema";
import { AppError, notFound, runInProgress } from "../lib/errors";
import { errorMessage, getYep, isFatalForRun } from "../lib/yep";
import { compareWithPrevious, findPreviousAudit, groupKey, hostKey } from "./audit-history";
import { auditTraffic } from "./google";
import { dispatch } from "../jobs/dispatch";

export const MAX_AUDIT_PAGES = env.AUDIT_MAX_PAGES;
export const MAX_TOOL_PAGES = env.AUDIT_TOOL_MAX_PAGES;
/** Audits that render every page are capped lower: each rendered page is a paid call. */
export const MAX_RENDERED_PAGES = 500;
export const RENDER_PRICE = 0.02;
export const FALLBACK_PRICE = 0.03;
/** A project keeps the link tables of its latest audits only; older ones keep their pages and issues. */
export const LINK_RETENTION = 2;
/** One-off tool audits kept per user; older ones are deleted. */
export const TOOL_AUDITS_KEPT = 10;
const MAX_DURATION_MS = 4 * 60 * 60_000;
const MAX_EXTERNAL_LINKS = 300;
const MAX_RESOURCES = 500;
// Crawls are free, so these keep one account from tying up the shared crawler: one audit per
// project at a time, a few per user, and a daily cap. Self-hosters can raise them.
export const AUDIT_LIMITS = {
  activePerUser: env.AUDIT_MAX_ACTIVE_PER_USER,
  perDay: env.AUDIT_MAX_PER_DAY,
};

type Audit = typeof schema.audits.$inferSelect;
type CrawlResult = Awaited<ReturnType<typeof crawlSite>>;
type PaidUse = { spent: number; rendered: number; unblocked: number; budgetReached: boolean; unavailable: string | null };

export interface AuditRequest {
  startUrl: string;
  maxPages: number;
  renderMode: RenderMode;
  useFallback: boolean;
  maxCostUsd: number | null;
  options: AuditOptions;
  trigger: AuditTrigger;
}

const round2 = (n: number): number => Math.round(n * 100) / 100;

type AuditSettings = typeof schema.auditSettings.$inferSelect;

/** What a run asks for; anything left out comes from the project's audit settings. */
export type AuditInput = Partial<Omit<AuditRequest, "options" | "trigger">> & AuditOptions;

/** Without saved settings an audit is a plain, free crawl of 100 pages. */
const UNSET = { maxPages: 100, renderMode: "off" as RenderMode, useFallback: false, maxCostUsd: null as number | null };

/** Fills a run's settings from the request, then the project's saved settings, then the defaults. */
export function buildAuditRequest(
  project: { domain: string | null },
  settings: AuditSettings | null,
  input: AuditInput,
  trigger: AuditTrigger,
): AuditRequest | null {
  const startUrl = input.startUrl ?? settings?.startUrl ?? project.domain;
  if (!startUrl) return null;
  return {
    startUrl,
    maxPages: input.maxPages ?? settings?.maxPages ?? UNSET.maxPages,
    renderMode: input.renderMode ?? settings?.renderMode ?? UNSET.renderMode,
    useFallback: input.useFallback ?? settings?.useFallback ?? UNSET.useFallback,
    maxCostUsd: input.maxCostUsd !== undefined ? input.maxCostUsd : settings ? settings.maxCostUsd : UNSET.maxCostUsd,
    options: {
      include: input.include ?? settings?.include ?? [],
      exclude: input.exclude ?? settings?.exclude ?? [],
      checkExternalLinks: input.checkExternalLinks ?? settings?.checkExternalLinks ?? true,
    },
    trigger,
  };
}

export async function auditSettingsOf(projectId: string): Promise<AuditSettings | null> {
  const [row] = await dataDb.select().from(schema.auditSettings).where(eq(schema.auditSettings.projectId, projectId)).limit(1);
  return row ?? null;
}

/**
 * Crawling is done by OpenSEO itself and costs nothing. YepAPI is paid only for rendering pages
 * ($0.02 each) and for fetching pages the site blocks ($0.03 each). "always" renders every page;
 * "auto" and the fallback pay only for the pages that need them, so their price is a ceiling.
 */
export function estimateAudit(maxPages: number, renderMode: RenderMode, useFallback = false, maxCostUsd: number | null = null) {
  let max = renderMode === "off" ? 0 : maxPages * RENDER_PRICE;
  if (useFallback) max += maxPages * FALLBACK_PRICE;
  if (maxCostUsd !== null) max = Math.min(max, maxCostUsd);
  return { min: 0, max: round2(max) };
}

/** The audit, if it belongs to the user, with its project (null for tool audits). */
export async function requireAudit(userId: string, auditId: string) {
  if (!/^[0-9a-f-]{36}$/i.test(auditId)) throw notFound("Audit");
  const [row] = await dataDb
    .select({ audit: schema.audits, project: schema.projects })
    .from(schema.audits)
    .leftJoin(schema.projects, eq(schema.projects.id, schema.audits.projectId))
    .where(and(eq(schema.audits.id, auditId), eq(schema.audits.userId, userId)))
    .limit(1);
  if (!row) throw notFound("Audit");
  return row;
}

/**
 * Creates a queued audit after checking the caps: one running audit per project, a few per user,
 * and a daily limit. The caller dispatches the `audit.run` job.
 */
export async function startAudit(userId: string, projectId: string | null, request: AuditRequest): Promise<Audit> {
  const audit = await dataDb.transaction(async (tx) => {
    // One user's audits are counted under a lock, so parallel requests cannot pass the caps together.
    await tx.execute(sql`select pg_advisory_xact_lock(hashtext(${`audit:${userId}`}))`);
    const [counts] = await tx
      .select({
        activeHere: projectId
          ? sql<number>`count(*) filter (where ${schema.audits.status} in ('queued', 'running') and ${schema.audits.projectId} = ${projectId})::int`
          : sql<number>`0`,
        active: sql<number>`count(*) filter (where ${schema.audits.status} in ('queued', 'running'))::int`,
        today: sql<number>`count(*) filter (where ${schema.audits.createdAt} > now() - interval '1 day')::int`,
      })
      .from(schema.audits)
      .where(eq(schema.audits.userId, userId));
    if ((counts?.activeHere ?? 0) > 0) throw runInProgress("An audit is already running for this project");
    if ((counts?.active ?? 0) >= AUDIT_LIMITS.activePerUser) throw runInProgress(`You can run ${AUDIT_LIMITS.activePerUser} audits at a time. Wait for one to finish.`);
    if ((counts?.today ?? 0) >= AUDIT_LIMITS.perDay) throw new AppError(429, "rate_limited", `You can start ${AUDIT_LIMITS.perDay} audits a day. Try again tomorrow.`);
    const [row] = await tx
      .insert(schema.audits)
      .values({
        projectId,
        userId,
        trigger: request.trigger,
        startUrl: request.startUrl,
        maxPages: request.maxPages,
        renderJs: request.renderMode === "always",
        renderMode: request.renderMode,
        useFallback: request.useFallback,
        maxCostUsd: request.maxCostUsd,
        options: request.options,
      })
      .returning();
    return row;
  });
  if (!audit) throw new Error("Insert failed");
  return audit;
}

/** What gets stored per page: link and image lists live in audit_links, so only counts and samples stay here. */
function slim(page: PageResult) {
  const { internalLinks, externalLinks, images, headings, scripts, stylesheets, ...rest } = page;
  return {
    ...rest,
    internalLinkCount: internalLinks.length,
    externalLinkCount: externalLinks.length,
    headings: headings.slice(0, 40),
    imagesWithoutAlt: images.filter((i) => i.alt === null).slice(0, 20).map((i) => i.url ?? i.src),
  };
}

async function insertChunks<T>(rows: T[], size: number, insert: (chunk: T[]) => Promise<unknown>) {
  for (let i = 0; i < rows.length; i += size) await insert(rows.slice(i, i + size));
}

// Postgres rejects U+0000 in text and jsonb, and crawled pages do contain it now and then.
const NUL = /\u0000/g;
export function withoutNul<T>(value: T): T {
  if (typeof value === "string") return value.replace(NUL, "") as T;
  if (Array.isArray(value)) return value.map(withoutNul) as T;
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, inner]) => [key.replace(NUL, ""), withoutNul(inner)])) as T;
  }
  return value;
}

type LinkRow = typeof schema.auditLinks.$inferInsert;

/** Every link the crawl saw, one row per source, target and kind. */
export function linkRows(auditId: string, pages: PageResult[]): LinkRow[] {
  const siteHosts = new Set(pages.map((p) => hostKey(p.url)));
  const internal = (url: string) => siteHosts.has(hostKey(url));
  const rows: LinkRow[] = [];
  const push = (source: string, target: string, kind: AuditLinkKind, anchor: string | null, nofollow: boolean, isInternal: boolean) =>
    rows.push({ auditId, source, target, kind, anchor, nofollow, internal: isInternal });
  for (const page of pages) {
    if (page.fetchClass === "redirect") {
      push(page.url, page.finalUrl, "redirect", null, false, internal(page.finalUrl));
      continue;
    }
    if (page.fetchClass !== "ok" || !page.isHtml) continue;
    for (const link of page.internalLinks) push(page.url, link.url, "href", link.anchor, link.nofollow, true);
    for (const link of page.externalLinks) push(page.url, link.url, "href", link.anchor, link.nofollow, false);
    const canonical = page.canonical ?? page.headerCanonical;
    if (canonical && canonical !== page.url) push(page.url, canonical, "canonical", null, false, internal(canonical));
    for (const alt of page.hreflang) if (alt.href !== page.url) push(page.url, alt.href, "hreflang", alt.lang, false, internal(alt.href));
    const images = new Map<string, string | null>();
    for (const image of page.images) if (image.url && !images.has(image.url)) images.set(image.url, image.alt);
    // For images the anchor column holds the alt text; null means the attribute is missing.
    for (const [url, alt] of images) push(page.url, url, "image", alt, false, internal(url));
    for (const url of page.scripts) push(page.url, url, "script", null, false, internal(url));
    for (const url of page.stylesheets) push(page.url, url, "stylesheet", null, false, internal(url));
  }
  return rows;
}

/** Marks a queued or running audit failed; a finished or cancelled one is left as it is. */
export async function failAudit(auditId: string, message: string) {
  await dataDb
    .update(schema.audits)
    .set({ status: "failed", error: message, finishedAt: new Date() })
    .where(and(eq(schema.audits.id, auditId), inArray(schema.audits.status, ["queued", "running"])));
}

/** How often a running audit touches its heartbeat, and how long a silent one is given before it is restarted. */
const HEARTBEAT_MS = 30_000;
const STALE_AFTER = sql`interval '2 minutes'`;
/** Restarts after an interruption before the audit is failed instead. */
const MAX_RESTARTS = 2;

/**
 * Audits whose heartbeat stopped because their worker was restarted (a deploy) or crashed. Each goes
 * back to the queue and starts over: the crawl is free, and paid rendering keeps counting against
 * the same cap. After MAX_RESTARTS it fails instead. Returns how many were restarted.
 */
export async function resumeInterruptedAudits(): Promise<number> {
  const stale = and(eq(schema.audits.status, "running"), lt(sql`coalesce(${schema.audits.heartbeatAt}, ${schema.audits.createdAt})`, sql`now() - ${STALE_AFTER}`));
  await dataDb
    .update(schema.audits)
    .set({ status: "failed", error: "Interrupted more than once; start it again", finishedAt: new Date() })
    .where(and(stale, gte(schema.audits.attempts, MAX_RESTARTS)));
  const requeued = await dataDb
    .update(schema.audits)
    .set({ status: "queued", attempts: sql`${schema.audits.attempts} + 1`, phase: null, pagesCrawled: 0, heartbeatAt: null, startedAt: null })
    .where(stale)
    .returning({ id: schema.audits.id });
  for (const { id } of requeued) await dispatch("audit.run", { auditId: id }, (message) => failAudit(id, message)).catch(() => {});
  return requeued.length;
}

/**
 * Runs a queued audit: crawls, compares with the previous audit and stores everything in one
 * transaction. `overrides` reach the crawler unchanged; tests use them to crawl a local site.
 */
export async function processAudit(auditId: string, overrides: Partial<CrawlOptions> = {}) {
  const [audit] = await dataDb.select().from(schema.audits).where(eq(schema.audits.id, auditId)).limit(1);
  if (!audit || audit.status !== "queued") return;
  if (audit.projectId) {
    const [project] = await dataDb.select({ id: schema.projects.id }).from(schema.projects).where(eq(schema.projects.id, audit.projectId)).limit(1);
    // The project was deleted after the audit was queued (its audits normally go with it).
    if (!project) return failAudit(auditId, "The project no longer exists");
  }

  // Claimed only while still queued, so a cancel that lands first is not overwritten.
  const now = new Date();
  const [claimed] = await dataDb
    .update(schema.audits)
    .set({ status: "running", startedAt: now, heartbeatAt: now })
    .where(and(eq(schema.audits.id, auditId), eq(schema.audits.status, "queued")))
    .returning({ id: schema.audits.id });
  if (!claimed) return;

  const controller = new AbortController();
  let processed = 0;
  let cancelled = false;

  // A steady heartbeat while the audit runs, through the checks after the last page and the storing
  // too, so one that stops beating was interrupted (see resumeInterruptedAudits). It also notices a
  // cancel between pages.
  const heartbeat = setInterval(() => {
    void dataDb
      .update(schema.audits)
      .set({ heartbeatAt: new Date() })
      .where(and(eq(schema.audits.id, auditId), eq(schema.audits.status, "running")))
      .returning({ id: schema.audits.id })
      .then((rows) => {
        if (rows.length === 0 && !controller.signal.aborted) {
          cancelled = true;
          controller.abort();
        }
      })
      .catch(() => {});
  }, HEARTBEAT_MS);
  heartbeat.unref();

  try {

    // Paid help from YepAPI: rendering, and the fallback for pages the site blocks. Without a key, or
    // once the audit's cap or the account's budget is spent, the crawl carries on without it and the
    // summary says why.
    // A restarted audit keeps counting what it already spent against its cap.
    const paid: PaidUse = { spent: audit.costUsd, rendered: 0, unblocked: 0, budgetReached: false, unavailable: null };
    let yep: YepApi | null = null;
    if (audit.renderMode !== "off" || audit.useFallback) {
      try {
        yep = await getYep({ userId: audit.userId, projectId: audit.projectId, feature: "site_audit" });
      } catch (error) {
        paid.unavailable = errorMessage(error);
      }
    }
    const affordable = (price: number): boolean => {
      if (paid.unavailable) return false;
      if (audit.maxCostUsd !== null && paid.spent + price > audit.maxCostUsd + 1e-9) {
        paid.budgetReached = true;
        return false;
      }
      return true;
    };
    const paidCall = async (price: number, call: () => Promise<{ costUsd: number; data: { content?: string; statusCode?: number } }>) => {
      if (!affordable(price)) return null;
      try {
        const res = await call();
        paid.spent += res.costUsd;
        return res.data.content ? { html: res.data.content, status: res.data.statusCode } : null;
      } catch (error) {
        // Out of credits, a bad key or the monthly budget: every later call would fail the same way.
        if (isFatalForRun(error)) paid.unavailable = errorMessage(error);
        throw error;
      }
    };
    const client = yep;
    const render =
      client && audit.renderMode !== "off"
        ? async (url: string) => {
            const page = await paidCall(RENDER_PRICE, () => client.scrape.js({ url, format: "html" }));
            if (page) paid.rendered++;
            return page;
          }
        : undefined;
    const fallback =
      client && audit.useFallback
        ? async (url: string) => {
            const page = await paidCall(FALLBACK_PRICE, () => client.scrape.stealth({ url, format: "html" }));
            if (page) paid.unblocked++;
            return page;
          }
        : undefined;

    const options = audit.options ?? {};
    let result: CrawlResult;
    try {
      result = await crawlSite(
        {
          startUrl: audit.startUrl,
          maxPages: audit.maxPages,
          maxDurationMs: MAX_DURATION_MS,
          // Starts at two pages at once and adds more while the site answers quickly (up to six), with
          // request starts to one host at least 250 ms apart: at most four a second.
          concurrency: 2,
          maxConcurrency: 6,
          delayMs: 250,
          userAgent: "OpenSEOBot/0.1 (+https://openseo.gg/bot)",
          signal: controller.signal,
          render,
          renderWhen: audit.renderMode === "always" ? "always" : "suspected",
          fallback,
          include: options.include?.length ? options.include : undefined,
          exclude: options.exclude?.length ? options.exclude : undefined,
          checkExternalLinks: options.checkExternalLinks ?? true,
          maxExternalLinks: MAX_EXTERNAL_LINKS,
          maxResources: MAX_RESOURCES,
          ...overrides,
        },
        {
          onPage: async (_page, progress) => {
            processed = progress.pagesProcessed;
            if (processed % 10 !== 0) return;
            const [current] = await dataDb
              .update(schema.audits)
              .set({ pagesCrawled: processed, costUsd: paid.spent, heartbeatAt: new Date() })
              .where(eq(schema.audits.id, auditId))
              .returning({ status: schema.audits.status });
            if (current?.status !== "running") {
              cancelled = true;
              controller.abort();
            }
          },
          onPhase: async (phase) => {
            await dataDb.update(schema.audits).set({ phase, pagesCrawled: processed, heartbeatAt: new Date() }).where(eq(schema.audits.id, auditId));
          },
        },
      );
    } catch (error) {
      // crawlSite rejects only for an unusable start URL (malformed, or a private/internal address).
      await failAudit(auditId, error instanceof Error ? error.message : "Audit failed");
      return;
    }

    try {
      await storeAudit(audit, result, cancelled, paid);
    } catch (error) {
      await failAudit(auditId, `The crawl finished but its results could not be stored: ${errorMessage(error)}`);
      return;
    }
    await pruneOldAudits(audit).catch(() => {});
  } finally {
    clearInterval(heartbeat);
  }
}

async function storeAudit(audit: Audit, result: CrawlResult, cancelled: boolean, paid: PaidUse) {
  const auditId = audit.id;
  // A cancelled crawl is partial, so comparing it with a full one would invent removed issues.
  const previousId = cancelled ? null : await findPreviousAudit(audit);

  // Search traffic from the project's Search Console, when connected. A failure there only leaves the
  // traffic checks out; the summary says why.
  let searchConsole: { connected: boolean; period?: { startDate: string; endDate: string }; error?: string } = { connected: false };
  let traffic = new Map<string, PageTraffic>();
  if (audit.projectId && !cancelled) {
    try {
      const found = await auditTraffic(audit.projectId);
      if (found) {
        traffic = trafficByPage(found.pages);
        searchConsole = { connected: true, period: found.period };
      }
    } catch (error) {
      searchConsole = { connected: true, error: errorMessage(error) };
    }
  }
  const found = [...result.issues, ...trafficIssues(result.pages, traffic)];
  const comparison = previousId ? await compareWithPrevious(previousId, result.pages, found) : null;
  const issues: Issue[] = [...found, ...(comparison?.changeIssues ?? [])];

  const issueCounts = new Map<string, number>();
  for (const issue of issues) issueCounts.set(issue.url, (issueCounts.get(issue.url) ?? 0) + 1);
  const summary = { ...result.summary };
  for (const issue of issues.slice(result.issues.length)) {
    summary.issuesBySeverity[issue.severity]++;
    summary.issuesByType[issue.type] = (summary.issuesByType[issue.type] ?? 0) + 1;
  }
  // Traffic issues can add errors (a redirect Google still sends visitors to), so the score is redone.
  summary.healthScore = computeHealthScore(result.pages, issues);
  const errored = new Set(issues.filter((i) => i.severity === "critical").map((i) => i.url));
  const audited = result.pages.filter((p) => p.fetchClass !== "robots_blocked");
  summary.urlsWithErrors = audited.filter((p) => errored.has(p.url)).length;
  summary.urlsWithoutErrors = audited.length - summary.urlsWithErrors;
  summary.issuesTotal = issues.length;
  // URLs per report row (see groupKey), for the trend of each row across audits.
  const rowUrls = new Map<string, Set<string>>();
  for (const issue of issues) {
    const key = groupKey(issue.type, issue.indexable);
    if (!rowUrls.has(key)) rowUrls.set(key, new Set());
    rowUrls.get(key)!.add(issue.url);
  }
  const stored = {
    ...summary,
    searchConsole,
    issueRows: Object.fromEntries([...rowUrls].map(([key, urls]) => [key, urls.size])),
    diff: comparison?.diff ?? null,
    paid: { rendered: paid.rendered, unblocked: paid.unblocked, budgetReached: paid.budgetReached, unavailable: paid.unavailable },
  };

  const resources = [
    ...result.resources.map((r) => ({
      auditId,
      url: r.url,
      type: r.type,
      status: r.status,
      contentType: r.contentType,
      sizeBytes: r.sizeBytes,
      broken: r.broken,
      redirected: r.redirected,
      sourceCount: r.sourceCount,
    })),
    ...result.externalLinks.map((l) => ({
      auditId,
      url: l.url,
      type: "external" as const,
      status: l.status,
      contentType: null,
      sizeBytes: null,
      broken: l.broken,
      redirected: false,
      sourceCount: l.sources.length,
    })),
  ];

  // One transaction: an audit either has all its pages, issues and links or none of them.
  await dataDb.transaction(async (tx) => {
    await insertChunks(result.pages, 200, (chunk) =>
      tx.insert(schema.auditPages).values(
        chunk.map((page) =>
          withoutNul({
            auditId,
            url: page.url,
            status: page.status,
            title: page.title,
            wordCount: page.wordCount,
            depth: page.depth,
            responseMs: page.responseTimeMs == null ? null : Math.round(page.responseTimeMs),
            loadMs: page.loadTimeMs == null ? null : Math.round(page.loadTimeMs),
            contentType: page.contentType,
            indexable: page.indexable,
            pageRank: page.pageRank,
            inlinks: page.inlinks.href,
            inSitemap: page.inSitemap,
            clicks: traffic.get(page.url)?.clicks ?? (searchConsole.connected && !searchConsole.error ? 0 : null),
            issueCount: issueCounts.get(page.url) ?? 0,
            data: slim(page) as Record<string, unknown>,
          }),
        ),
      ),
    );
    await insertChunks(issues, 500, (chunk) =>
      tx.insert(schema.auditIssues).values(
        chunk.map((issue) =>
          withoutNul({
            auditId,
            type: issue.type,
            severity: issue.severity,
            url: issue.url,
            detail: issue.detail ?? null,
            relatedUrls: issue.relatedUrls?.slice(0, 50) ?? null,
            change: comparison?.classify(issue) ?? null,
            indexable: issue.indexable ?? null,
          }),
        ),
      ),
    );
    await insertChunks(linkRows(auditId, result.pages), 2000, (chunk) => tx.insert(schema.auditLinks).values(withoutNul(chunk)));
    await insertChunks(resources, 1000, (chunk) => tx.insert(schema.auditResources).values(withoutNul(chunk)));
    await tx
      .update(schema.audits)
      .set({
        status: cancelled ? "cancelled" : "completed",
        phase: null,
        pagesCrawled: summary.pagesTotal,
        healthScore: summary.healthScore,
        aiScore: summary.aiDiscoverability?.score ?? null,
        summary: withoutNul(stored) as unknown as Record<string, unknown>,
        previousAuditId: previousId,
        costUsd: paid.spent,
        finishedAt: new Date(),
      })
      .where(and(eq(schema.audits.id, auditId), inArray(schema.audits.status, ["running", "cancelled"])));
    // A finished crawl may have found new or changed pages: sync the indexing page list at the next tick.
    if (audit.projectId && !cancelled) await tx.update(schema.indexingSettings).set({ nextSyncAt: new Date() }).where(eq(schema.indexingSettings.projectId, audit.projectId));
  });
}

/**
 * Keeps storage in check: a project's older audits drop their link tables (pages, issues and the
 * summary stay for history), and a user's one-off tool audits beyond the newest few are deleted.
 */
export async function pruneOldAudits(audit: Pick<Audit, "projectId" | "userId">) {
  if (audit.projectId) {
    const keep = await dataDb
      .select({ id: schema.audits.id })
      .from(schema.audits)
      .where(and(eq(schema.audits.projectId, audit.projectId), eq(schema.audits.status, "completed")))
      .orderBy(desc(schema.audits.createdAt))
      .limit(LINK_RETENTION);
    const older = dataDb
      .select({ id: schema.audits.id })
      .from(schema.audits)
      .where(and(eq(schema.audits.projectId, audit.projectId), keep.length ? notInArray(schema.audits.id, keep.map((k) => k.id)) : undefined));
    await dataDb.delete(schema.auditLinks).where(inArray(schema.auditLinks.auditId, older));
    return;
  }
  const keep = await dataDb
    .select({ id: schema.audits.id })
    .from(schema.audits)
    .where(and(eq(schema.audits.userId, audit.userId), isNull(schema.audits.projectId)))
    .orderBy(desc(schema.audits.createdAt))
    .limit(TOOL_AUDITS_KEPT);
  if (keep.length < TOOL_AUDITS_KEPT) return;
  await dataDb
    .delete(schema.audits)
    .where(
      and(
        eq(schema.audits.userId, audit.userId),
        isNull(schema.audits.projectId),
        notInArray(schema.audits.id, keep.map((k) => k.id)),
        notInArray(schema.audits.status, ["queued", "running"]),
      ),
    );
}
