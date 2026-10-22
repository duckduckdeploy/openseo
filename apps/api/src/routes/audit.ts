import { CHANGE_ISSUE_TYPES, INDEXABILITY_SPLIT, ISSUE_CATALOG, ISSUE_CATEGORIES, ISSUE_CATEGORY } from "@openseo/crawler";
import { and, asc, desc, eq, exists, gte, ilike, inArray, isNull, lt, notExists, or, sql } from "drizzle-orm";
import type { SQL } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { dataDb, schema } from "../db";
import { requireProject, requireUser } from "../lib/context";
import { badRequest, notFound, parse, uuidParam } from "../lib/errors";
import { firstRunAt } from "../lib/pool";
import { dispatch } from "../jobs/dispatch";
import {
  auditSettingsOf,
  buildAuditRequest,
  estimateAudit,
  failAudit,
  MAX_AUDIT_PAGES,
  MAX_RENDERED_PAGES,
  MAX_TOOL_PAGES,
  requireAudit,
  startAudit,
  TOOL_AUDITS_KEPT,
} from "../services/audit";
import type { AuditInput } from "../services/audit";
import {
  BULK_EXPORTS,
  bulkCsv,
  exportFileName,
  fixBrief,
  issueCsv,
  issueLinksCsv,
  issuesZip,
  issueTypesOf,
  LINK_SPECS,
  toStream,
} from "../services/audit-export";
import type { BulkExport } from "../services/audit-export";
import { groupKey, hostKey } from "../services/audit-history";

const renderMode = z.enum(["off", "auto", "always"]);
const patterns = z.array(z.string().trim().min(1).max(300)).max(50);
const schedule = z.enum(["manual", "daily", "weekly", "monthly"]);

const auditInput = z.object({
  startUrl: z.string().trim().min(3).max(2000).optional(),
  maxPages: z.number().int().min(1).max(MAX_AUDIT_PAGES).optional(),
  renderMode: renderMode.optional(),
  // Older clients: true means render every page.
  renderJs: z.boolean().optional(),
  useFallback: z.boolean().optional(),
  maxCostUsd: z.number().min(0).max(1000).nullable().optional(),
  include: patterns.optional(),
  exclude: patterns.optional(),
  checkExternalLinks: z.boolean().optional(),
});

const settingsInput = z.object({
  startUrl: z.string().trim().min(3).max(2000).nullable().optional(),
  maxPages: z.number().int().min(1).max(MAX_AUDIT_PAGES).optional(),
  renderMode: renderMode.optional(),
  useFallback: z.boolean().optional(),
  maxCostUsd: z.number().min(0).max(1000).nullable().optional(),
  include: patterns.optional(),
  exclude: patterns.optional(),
  checkExternalLinks: z.boolean().optional(),
  schedule: schedule.optional(),
});

/** Converts the request body into an AuditInput, folding the old renderJs flag into renderMode. */
export function toAuditInput(body: z.infer<typeof auditInput>): AuditInput {
  const { renderJs, ...rest } = body;
  return { ...rest, renderMode: rest.renderMode ?? (renderJs === undefined ? undefined : renderJs ? "always" : "off") };
}
export { auditInput };

const severityRank = sql`case severity when 'critical' then 0 when 'warning' then 1 else 2 end`;
const changeTypes = new Set<string>(CHANGE_ISSUE_TYPES);

/** The catalog with each issue's report section and whether it is split by page indexability, as the app and exports read it. */
export const catalogWithCategories = Object.fromEntries(
  Object.entries(ISSUE_CATALOG).map(([type, def]) => [
    type,
    { ...def, category: ISSUE_CATEGORY[type as keyof typeof ISSUE_CATEGORY], split: INDEXABILITY_SPLIT.has(type as keyof typeof ISSUE_CATALOG) },
  ]),
);

/** `?indexable=true|false` on issue lists and exports: one half of a split issue row. */
const indexableParam = z.enum(["true", "false"]).transform((v) => v === "true").optional();
const LOWER = { critical: "warning", warning: "info", info: "info" } as const;

const escapeLike = (q: string) => `%${q.replace(/[%_\\]/g, "\\$&")}%`;

/** Pages of an audit in the shape exports and lists use, keyed by URL. */
const targetPages = alias(schema.auditPages, "target_page");

export async function auditRoutes(app: FastifyInstance) {
  app.get("/audit/issue-catalog", async (request) => {
    await requireUser(request);
    return { ok: true, data: catalogWithCategories };
  });

  app.get("/audit/issue-categories", async (request) => {
    await requireUser(request);
    return { ok: true, data: ISSUE_CATEGORIES };
  });

  app.get<{ Params: { projectId: string } }>("/projects/:projectId/audits", async (request) => {
    const user = await requireUser(request);
    const project = await requireProject(user.id, request.params.projectId);
    const rows = await dataDb
      .select()
      .from(schema.audits)
      .where(eq(schema.audits.projectId, project.id))
      .orderBy(desc(schema.audits.createdAt))
      .limit(50);
    return { ok: true, data: rows };
  });

  // The crawl itself is free. Rendering ($0.02 a page) and the fallback for blocked pages ($0.03 a
  // page) are paid at YepAPI, up to the audit's cost cap.
  app.post<{ Params: { projectId: string }; Querystring: { dryRun?: string } }>("/projects/:projectId/audits", async (request, reply) => {
    const user = await requireUser(request);
    const project = await requireProject(user.id, request.params.projectId);
    const input = toAuditInput(parse(auditInput, request.body ?? {}));
    const settings = await auditSettingsOf(project.id);
    const req = buildAuditRequest(project, settings, input, "manual");
    if (request.query.dryRun === "1") {
      const sample = req ?? buildAuditRequest({ domain: "example.com" }, settings, input, "manual");
      if (!sample) throw new Error("unreachable");
      if (sample.renderMode === "always" && sample.maxPages > MAX_RENDERED_PAGES) throw badRequest(`Audits that render every page are limited to ${MAX_RENDERED_PAGES} pages`);
      return { ok: true, data: { estimate: estimateAudit(sample.maxPages, sample.renderMode, sample.useFallback, sample.maxCostUsd), dryRun: true } };
    }
    if (!req) throw badRequest("Give a start URL, or set the project's website");
    if (req.renderMode === "always" && req.maxPages > MAX_RENDERED_PAGES) throw badRequest(`Audits that render every page are limited to ${MAX_RENDERED_PAGES} pages`);
    const audit = await startAudit(user.id, project.id, req);
    await dispatch("audit.run", { auditId: audit.id }, (message) => failAudit(audit.id, message));
    return reply.status(202).send({ ok: true, data: { ...audit, estimate: estimateAudit(req.maxPages, req.renderMode, req.useFallback, req.maxCostUsd) } });
  });

  // ── The Site Audit tool: one-off audits outside any project ───────────────

  app.get("/tools/site-audits", async (request) => {
    const user = await requireUser(request);
    const rows = await dataDb
      .select()
      .from(schema.audits)
      .where(and(eq(schema.audits.userId, user.id), isNull(schema.audits.projectId)))
      .orderBy(desc(schema.audits.createdAt))
      .limit(TOOL_AUDITS_KEPT);
    return { ok: true, data: rows };
  });

  app.post<{ Querystring: { dryRun?: string } }>("/tools/site-audits", async (request, reply) => {
    const user = await requireUser(request);
    const input = toAuditInput(parse(auditInput.extend({ maxPages: z.number().int().min(1).max(MAX_TOOL_PAGES).optional() }), request.body ?? {}));
    const req = buildAuditRequest({ domain: input.startUrl ?? (request.query.dryRun === "1" ? "example.com" : null) }, null, input, "tool");
    if (!req) throw badRequest("Give the URL of the site to audit");
    if (req.renderMode === "always" && req.maxPages > MAX_RENDERED_PAGES) throw badRequest(`Audits that render every page are limited to ${MAX_RENDERED_PAGES} pages`);
    const estimate = estimateAudit(req.maxPages, req.renderMode, req.useFallback, req.maxCostUsd);
    if (request.query.dryRun === "1") return { ok: true, data: { estimate, dryRun: true } };
    const audit = await startAudit(user.id, null, req);
    await dispatch("audit.run", { auditId: audit.id }, (message) => failAudit(audit.id, message));
    return reply.status(202).send({ ok: true, data: { ...audit, estimate } });
  });

  app.get<{ Params: { projectId: string } }>("/projects/:projectId/audit-settings", async (request) => {
    const user = await requireUser(request);
    const project = await requireProject(user.id, request.params.projectId);
    const settings = await auditSettingsOf(project.id);
    return { ok: true, data: settings };
  });

  // Saving settings creates them; a schedule change starts counting from now.
  app.put<{ Params: { projectId: string } }>("/projects/:projectId/audit-settings", async (request) => {
    const user = await requireUser(request);
    const project = await requireProject(user.id, request.params.projectId);
    const input = parse(settingsInput, request.body ?? {});
    if (input.renderMode === "always" && (input.maxPages ?? 0) > MAX_RENDERED_PAGES) {
      throw badRequest(`Audits that render every page are limited to ${MAX_RENDERED_PAGES} pages`);
    }
    const current = await auditSettingsOf(project.id);
    const nextSchedule = input.schedule ?? current?.schedule ?? "weekly";
    const scheduleChanged = !current || (input.schedule !== undefined && input.schedule !== current.schedule);
    const values = { ...input, updatedAt: new Date(), ...(scheduleChanged ? { nextRunAt: firstRunAt(nextSchedule) } : {}) };
    const [saved] = await dataDb
      .insert(schema.auditSettings)
      .values({ projectId: project.id, ...values })
      .onConflictDoUpdate({ target: schema.auditSettings.projectId, set: values })
      .returning();
    return { ok: true, data: saved };
  });

  app.get<{ Params: { auditId: string } }>("/audits/:auditId", async (request) => {
    const user = await requireUser(request);
    const { audit, project } = await requireAudit(user.id, request.params.auditId);
    const [groups, previous] = await Promise.all([
      dataDb
        .select({
          type: schema.auditIssues.type,
          severity: schema.auditIssues.severity,
          indexable: schema.auditIssues.indexable,
          count: sql<number>`count(*)::int`,
          urls: sql<number>`count(distinct ${schema.auditIssues.url})::int`,
          new: sql<number>`count(*) filter (where ${schema.auditIssues.change} = 'new')::int`,
          added: sql<number>`count(*) filter (where ${schema.auditIssues.change} = 'added')::int`,
        })
        .from(schema.auditIssues)
        .where(eq(schema.auditIssues.auditId, audit.id))
        .groupBy(schema.auditIssues.type, schema.auditIssues.severity, schema.auditIssues.indexable)
        .orderBy(severityRank, sql`4 desc`),
      audit.previousAuditId
        ? dataDb
            .select({ id: schema.audits.id, createdAt: schema.audits.createdAt, healthScore: schema.audits.healthScore, aiScore: schema.audits.aiScore, pagesCrawled: schema.audits.pagesCrawled })
            .from(schema.audits)
            .where(eq(schema.audits.id, audit.previousAuditId))
            .limit(1)
        : Promise.resolve([]),
    ]);
    const diff = ((audit.summary as { diff?: Record<string, { before: number; removed: number; missing: number }> } | null)?.diff ?? {}) as Record<
      string,
      { before: number; removed: number; missing: number }
    >;
    const seen = new Set(groups.map((g) => groupKey(g.type, g.indexable)));
    // Issue rows that disappeared since the previous audit still get a row, at zero.
    const gone = Object.entries(diff)
      .filter(([key, d]) => !seen.has(key) && d.before > 0)
      .map(([key]) => {
        const [type = key, split] = key.split(":");
        const indexable = split === undefined ? null : split === "indexable";
        const severity = ISSUE_CATALOG[type as keyof typeof ISSUE_CATALOG]?.severity ?? "info";
        return { type, indexable, severity: indexable === false ? LOWER[severity] : severity, count: 0, urls: 0, new: 0, added: 0 };
      });
    return {
      ok: true,
      data: {
        ...audit,
        project: project ? { id: project.id, name: project.name, domain: project.domain } : null,
        previous: previous[0] ?? null,
        issueGroups: [...groups, ...gone].map((g) => {
          const def = catalogWithCategories[g.type];
          const key = groupKey(g.type, g.indexable);
          const d = diff[key];
          return {
            ...g,
            key,
            title: def?.title ?? g.type,
            description: def?.description ?? "",
            howToFix: def?.howToFix ?? "",
            category: def?.category ?? "Internal pages",
            isChange: changeTypes.has(g.type),
            before: d?.before ?? null,
            removed: d?.removed ?? null,
            missing: d?.missing ?? null,
          };
        }),
      },
    };
  });

  app.get<{ Params: { auditId: string }; Querystring: Record<string, string> }>("/audits/:auditId/issues", async (request) => {
    const user = await requireUser(request);
    const { audit } = await requireAudit(user.id, request.params.auditId);
    const query = parse(
      z.object({
        type: z.string().max(80).optional(),
        severity: z.enum(["critical", "warning", "info"]).optional(),
        change: z.enum(["new", "added", "removed", "missing"]).optional(),
        indexable: indexableParam,
        q: z.string().trim().max(200).optional(),
        limit: z.coerce.number().int().min(1).max(1000).default(200),
        offset: z.coerce.number().int().min(0).default(0),
      }),
      request.query,
    );

    // Removed and missing issues live in the previous audit: rows there with no counterpart now.
    if (query.change === "removed" || query.change === "missing") {
      if (!audit.previousAuditId) return { ok: true, data: { total: 0, issues: [] } };
      const now = alias(schema.auditIssues, "now_issue");
      const crawledNow = exists(
        dataDb.select({ one: sql`1` }).from(schema.auditPages).where(and(eq(schema.auditPages.auditId, audit.id), eq(schema.auditPages.url, schema.auditIssues.url))),
      );
      const where = and(
        eq(schema.auditIssues.auditId, audit.previousAuditId),
        query.type ? eq(schema.auditIssues.type, query.type) : undefined,
        query.indexable === undefined ? undefined : eq(schema.auditIssues.indexable, query.indexable),
        query.severity ? eq(schema.auditIssues.severity, query.severity) : undefined,
        query.q ? ilike(schema.auditIssues.url, escapeLike(query.q)) : undefined,
        query.change === "missing"
          ? sql`not ${crawledNow}`
          : and(
              crawledNow,
              notExists(dataDb.select({ one: sql`1` }).from(now).where(and(eq(now.auditId, audit.id), eq(now.type, schema.auditIssues.type), eq(now.url, schema.auditIssues.url)))),
            ),
      );
      const [rows, [count]] = await Promise.all([
        dataDb.select().from(schema.auditIssues).where(where).orderBy(severityRank, asc(schema.auditIssues.type), asc(schema.auditIssues.url)).limit(query.limit).offset(query.offset),
        dataDb.select({ total: sql<number>`count(*)::int` }).from(schema.auditIssues).where(where),
      ]);
      return { ok: true, data: { total: count?.total ?? 0, issues: rows.map((r) => ({ ...r, change: query.change })) } };
    }

    const where = and(
      eq(schema.auditIssues.auditId, audit.id),
      query.type ? eq(schema.auditIssues.type, query.type) : undefined,
      query.indexable === undefined ? undefined : eq(schema.auditIssues.indexable, query.indexable),
      query.severity ? eq(schema.auditIssues.severity, query.severity) : undefined,
      query.change ? eq(schema.auditIssues.change, query.change) : undefined,
      query.q ? ilike(schema.auditIssues.url, escapeLike(query.q)) : undefined,
    );
    const [rows, [count]] = await Promise.all([
      dataDb
        .select({
          issue: schema.auditIssues,
          pageRank: schema.auditPages.pageRank,
          status: schema.auditPages.status,
          title: schema.auditPages.title,
          depth: schema.auditPages.depth,
          inlinks: schema.auditPages.inlinks,
        })
        .from(schema.auditIssues)
        .leftJoin(schema.auditPages, and(eq(schema.auditPages.auditId, audit.id), eq(schema.auditPages.url, schema.auditIssues.url)))
        .where(where)
        .orderBy(severityRank, asc(schema.auditIssues.type), sql`${schema.auditPages.pageRank} desc nulls last`, asc(schema.auditIssues.url))
        .limit(query.limit)
        .offset(query.offset),
      dataDb.select({ total: sql<number>`count(*)::int` }).from(schema.auditIssues).where(where),
    ]);
    return {
      ok: true,
      data: {
        total: count?.total ?? 0,
        issues: rows.map(({ issue, ...page }) => ({ ...issue, ...page })),
      },
    };
  });

  app.get<{ Params: { auditId: string }; Querystring: Record<string, string> }>("/audits/:auditId/pages", async (request) => {
    const user = await requireUser(request);
    const { audit } = await requireAudit(user.id, request.params.auditId);
    const query = parse(
      z.object({
        q: z.string().trim().max(200).optional(),
        sort: z.enum(["issues", "url", "status", "words", "response", "load", "depth", "rank", "inlinks", "clicks"]).default("issues"),
        status: z.enum(["2xx", "3xx", "4xx", "5xx", "none"]).optional(),
        indexable: z.enum(["true", "false"]).optional(),
        limit: z.coerce.number().int().min(1).max(500).default(100),
        offset: z.coerce.number().int().min(0).default(0),
      }),
      request.query,
    );
    const p = schema.auditPages;
    const statusFilter: Record<string, SQL | undefined> = {
      "2xx": and(gte(p.status, 200), lt(p.status, 300)),
      "3xx": and(gte(p.status, 300), lt(p.status, 400)),
      "4xx": and(gte(p.status, 400), lt(p.status, 500)),
      "5xx": gte(p.status, 500),
      none: or(isNull(p.status), lt(p.status, 100)),
    };
    const where = and(
      eq(p.auditId, audit.id),
      query.q ? or(ilike(p.url, escapeLike(query.q)), ilike(p.title, escapeLike(query.q))) : undefined,
      query.status ? statusFilter[query.status] : undefined,
      query.indexable ? eq(p.indexable, query.indexable === "true") : undefined,
    );
    const order = {
      issues: desc(p.issueCount),
      url: asc(p.url),
      status: desc(p.status),
      words: asc(p.wordCount),
      response: sql`${p.responseMs} desc nulls last`,
      load: sql`${p.loadMs} desc nulls last`,
      depth: sql`${p.depth} desc nulls last`,
      rank: sql`${p.pageRank} desc nulls last`,
      inlinks: sql`${p.inlinks} desc nulls last`,
      clicks: sql`${p.clicks} desc nulls last`,
    }[query.sort];
    const [rows, [count]] = await Promise.all([
      dataDb
        .select({
          id: p.id,
          url: p.url,
          status: p.status,
          title: p.title,
          wordCount: p.wordCount,
          depth: p.depth,
          responseMs: p.responseMs,
          loadMs: p.loadMs,
          contentType: p.contentType,
          indexable: p.indexable,
          pageRank: p.pageRank,
          inlinks: p.inlinks,
          inSitemap: p.inSitemap,
          clicks: p.clicks,
          issueCount: p.issueCount,
        })
        .from(p)
        .where(where)
        .orderBy(order, asc(p.url))
        .limit(query.limit)
        .offset(query.offset),
      dataDb.select({ total: sql<number>`count(*)::int` }).from(p).where(where),
    ]);
    return { ok: true, data: { total: count?.total ?? 0, pages: rows } };
  });

  // Everything recorded for one page, plus its issues and a sample of the links in and out.
  app.get<{ Params: { auditId: string; pageId: string } }>("/audits/:auditId/pages/:pageId", async (request) => {
    const user = await requireUser(request);
    const { audit } = await requireAudit(user.id, request.params.auditId);
    const [page] = await dataDb
      .select()
      .from(schema.auditPages)
      .where(and(eq(schema.auditPages.auditId, audit.id), eq(schema.auditPages.id, uuidParam(request.params.pageId, "Page"))))
      .limit(1);
    if (!page) throw notFound("Page");
    const l = schema.auditLinks;
    const [issues, inlinks, outlinks] = await Promise.all([
      dataDb
        .select()
        .from(schema.auditIssues)
        .where(and(eq(schema.auditIssues.auditId, audit.id), eq(schema.auditIssues.url, page.url)))
        .orderBy(severityRank),
      dataDb.select().from(l).where(and(eq(l.auditId, audit.id), eq(l.target, page.url))).orderBy(asc(l.kind), asc(l.source)).limit(100),
      dataDb
        .select({ link: l, status: targetPages.status })
        .from(l)
        .leftJoin(targetPages, and(eq(targetPages.auditId, audit.id), eq(targetPages.url, l.target)))
        .where(and(eq(l.auditId, audit.id), eq(l.source, page.url)))
        .orderBy(asc(l.kind), asc(l.target))
        .limit(500),
    ]);
    return { ok: true, data: { page, issues, inlinks, outlinks: outlinks.map(({ link, status }) => ({ ...link, status })) } };
  });

  // Link explorer: every link with its target's status, filterable the way the issue exports need.
  app.get<{ Params: { auditId: string }; Querystring: Record<string, string> }>("/audits/:auditId/links", async (request) => {
    const user = await requireUser(request);
    const { audit } = await requireAudit(user.id, request.params.auditId);
    const query = parse(
      z.object({
        source: z.string().max(2000).optional(),
        target: z.string().max(2000).optional(),
        q: z.string().trim().max(200).optional(),
        kind: z.enum(["href", "redirect", "canonical", "hreflang", "image", "script", "stylesheet"]).optional(),
        internal: z.enum(["true", "false"]).optional(),
        nofollow: z.enum(["true", "false"]).optional(),
        targetStatus: z.enum(["2xx", "3xx", "4xx", "5xx", "uncrawled"]).optional(),
        limit: z.coerce.number().int().min(1).max(1000).default(200),
        offset: z.coerce.number().int().min(0).default(0),
      }),
      request.query,
    );
    const l = schema.auditLinks;
    const status = {
      "2xx": and(gte(targetPages.status, 200), lt(targetPages.status, 300)),
      "3xx": and(gte(targetPages.status, 300), lt(targetPages.status, 400)),
      "4xx": and(gte(targetPages.status, 400), lt(targetPages.status, 500)),
      "5xx": gte(targetPages.status, 500),
      uncrawled: isNull(targetPages.url),
    } as const;
    const where = and(
      eq(l.auditId, audit.id),
      query.source ? eq(l.source, query.source) : undefined,
      query.target ? eq(l.target, query.target) : undefined,
      query.q ? or(ilike(l.target, escapeLike(query.q)), ilike(l.anchor, escapeLike(query.q))) : undefined,
      query.kind ? eq(l.kind, query.kind) : undefined,
      query.internal ? eq(l.internal, query.internal === "true") : undefined,
      query.nofollow ? eq(l.nofollow, query.nofollow === "true") : undefined,
      query.targetStatus ? status[query.targetStatus] : undefined,
    );
    const join = and(eq(targetPages.auditId, audit.id), eq(targetPages.url, l.target));
    const [rows, [count]] = await Promise.all([
      dataDb
        .select({ link: l, targetStatus: targetPages.status, targetIndexable: targetPages.indexable })
        .from(l)
        .leftJoin(targetPages, join)
        .where(where)
        .orderBy(asc(l.target), asc(l.source))
        .limit(query.limit)
        .offset(query.offset),
      dataDb.select({ total: sql<number>`count(*)::int` }).from(l).leftJoin(targetPages, join).where(where),
    ]);
    const kept = rows.length > 0 || (await dataDb.select({ one: sql`1` }).from(l).where(eq(l.auditId, audit.id)).limit(1)).length > 0;
    return {
      ok: true,
      data: {
        total: count?.total ?? 0,
        // Older audits drop their link tables to save space.
        linksKept: kept || audit.status !== "completed",
        links: rows.map(({ link, ...target }) => ({ ...link, ...target })),
      },
    };
  });

  app.get<{ Params: { auditId: string }; Querystring: Record<string, string> }>("/audits/:auditId/resources", async (request) => {
    const user = await requireUser(request);
    const { audit } = await requireAudit(user.id, request.params.auditId);
    const query = parse(
      z.object({
        type: z.enum(["image", "script", "stylesheet", "external"]).optional(),
        broken: z.enum(["true", "false"]).optional(),
        limit: z.coerce.number().int().min(1).max(1000).default(200),
        offset: z.coerce.number().int().min(0).default(0),
      }),
      request.query,
    );
    const r = schema.auditResources;
    const where = and(
      eq(r.auditId, audit.id),
      query.type ? eq(r.type, query.type) : undefined,
      query.broken ? eq(r.broken, query.broken === "true") : undefined,
    );
    const [rows, [count]] = await Promise.all([
      dataDb.select().from(r).where(where).orderBy(desc(r.broken), desc(r.sourceCount), asc(r.url)).limit(query.limit).offset(query.offset),
      dataDb.select({ total: sql<number>`count(*)::int` }).from(r).where(where),
    ]);
    return { ok: true, data: { total: count?.total ?? 0, resources: rows } };
  });

  // ── Exports ───────────────────────────────────────────────────────────────

  /** `skins.cs2.ad_2026-10-23_` so downloads from several audits sort and never collide. */
  const filePrefix = (audit: { startUrl: string; finishedAt: Date | null; createdAt: Date }) =>
    `${hostKey(audit.startUrl)}_${(audit.finishedAt ?? audit.createdAt).toISOString().slice(0, 10)}_`;
  const attachment = (name: string) => `attachment; filename="${name.replace(/[^\w.-]+/g, "_")}"`;
  const requireFinished = (audit: { status: string }) => {
    if (audit.status !== "completed" && audit.status !== "cancelled") throw badRequest("The audit has not finished yet");
  };

  // What can be downloaded: one file per issue (plus its links file), and the bulk exports.
  app.get<{ Params: { auditId: string } }>("/audits/:auditId/exports", async (request) => {
    const user = await requireUser(request);
    const { audit } = await requireAudit(user.id, request.params.auditId);
    const types = await issueTypesOf(audit.id);
    return {
      ok: true,
      data: {
        issues: types.map((t) => ({ ...t, key: groupKey(t.type, t.indexable), file: `${exportFileName(t.type, t.indexable, t.severity)}.csv`, hasLinks: Boolean(LINK_SPECS[t.type as keyof typeof LINK_SPECS]) })),
        bulk: Object.entries(BULK_EXPORTS).map(([kind, def]) => ({ kind, ...def })),
      },
    };
  });

  app.get<{ Params: { auditId: string } }>("/audits/:auditId/export/issues.zip", async (request, reply) => {
    const user = await requireUser(request);
    const { audit } = await requireAudit(user.id, request.params.auditId);
    requireFinished(audit);
    return reply
      .header("content-type", "application/zip")
      .header("content-disposition", attachment(`${filePrefix(audit)}all-issues.zip`))
      .send(issuesZip(audit));
  });

  app.get<{ Params: { auditId: string; type: string }; Querystring: Record<string, string> }>("/audits/:auditId/export/issue/:type", async (request, reply) => {
    const user = await requireUser(request);
    const { audit } = await requireAudit(user.id, request.params.auditId);
    requireFinished(audit);
    const [, type, links] = /^([a-z0-9-]+?)(-links)?\.csv$/.exec(request.params.type) ?? [];
    if (!type || !catalogWithCategories[type]) throw notFound("Issue type");
    const { indexable } = parse(z.object({ indexable: indexableParam }), request.query);
    const body = links ? issueLinksCsv(audit.id, type, indexable) : issueCsv(audit.id, type, indexable);
    if (!body) throw notFound("Links file");
    const severity = catalogWithCategories[type]!.severity;
    return reply
      .header("content-type", "text/csv; charset=utf-8")
      .header("content-disposition", attachment(`${filePrefix(audit)}${exportFileName(type, indexable ?? null, indexable === false ? LOWER[severity] : severity)}${links ? "-links" : ""}.csv`))
      .send(toStream(body));
  });

  app.get<{ Params: { auditId: string; kind: string } }>("/audits/:auditId/export/bulk/:kind", async (request, reply) => {
    const user = await requireUser(request);
    const { audit } = await requireAudit(user.id, request.params.auditId);
    requireFinished(audit);
    const kind = request.params.kind.replace(/\.csv$/, "");
    if (!(kind in BULK_EXPORTS)) throw notFound("Export");
    return reply
      .header("content-type", "text/csv; charset=utf-8")
      .header("content-disposition", attachment(`${filePrefix(audit)}${kind}.csv`))
      .send(toStream(bulkCsv(audit.id, kind as BulkExport)));
  });

  // The fix brief for coding agents: Markdown to download, or JSON for the MCP tool.
  app.get<{ Params: { auditId: string }; Querystring: { format?: string } }>("/audits/:auditId/fix-brief", async (request, reply) => {
    const user = await requireUser(request);
    const { audit } = await requireAudit(user.id, request.params.auditId);
    requireFinished(audit);
    const markdown = await fixBrief(audit);
    if (request.query.format === "md") {
      return reply
        .header("content-type", "text/markdown; charset=utf-8")
        .header("content-disposition", attachment(`${filePrefix(audit)}AI-fix-brief.md`))
        .send(markdown);
    }
    return { ok: true, data: { markdown } };
  });

  app.post<{ Params: { auditId: string } }>("/audits/:auditId/cancel", async (request) => {
    const user = await requireUser(request);
    const { audit } = await requireAudit(user.id, request.params.auditId);
    await dataDb
      .update(schema.audits)
      .set({ status: "cancelled", finishedAt: new Date() })
      .where(and(eq(schema.audits.id, audit.id), inArray(schema.audits.status, ["queued", "running"])));
    return { ok: true };
  });

  app.delete<{ Params: { auditId: string } }>("/audits/:auditId", async (request) => {
    const user = await requireUser(request);
    const { audit } = await requireAudit(user.id, request.params.auditId);
    await dataDb.delete(schema.audits).where(eq(schema.audits.id, audit.id));
    // A later audit compared with this one loses the comparison, not its own data.
    await dataDb.update(schema.audits).set({ previousAuditId: null }).where(eq(schema.audits.previousAuditId, audit.id));
    return { ok: true };
  });
}

