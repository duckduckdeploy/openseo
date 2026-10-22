/**
 * The project database: everything a project tracks and researches, kept apart from accounts and
 * billing (core-schema.ts). Users and Google accounts live in the core database, so the columns
 * that point at them (userId, googleAccountId) carry no foreign key, so their rows here are
 * removed in code: removing a Google account deletes its connections (services/google.ts), and
 * anything that deletes a user must delete the user's projects, tool audits (audits with no project)
 * and cache rows here too.
 */
import { relations, sql } from "drizzle-orm";
import {
  boolean,
  doublePrecision,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { createdAt, updatedAt } from "./columns";
import type { GoogleProvider } from "./core-schema";

export const apiCache = pgTable(
  "api_cache",
  {
    userId: text("user_id")
      .notNull(),
    key: text("key").notNull(),
    payload: jsonb("payload").notNull(),
    costUsd: doublePrecision("cost_usd").notNull().default(0),
    createdAt: createdAt(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.key] }), index("api_cache_expiry_idx").on(t.expiresAt)],
);

// ── Projects ────────────────────────────────────────────────────────────────

export const projects = pgTable(
  "projects",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull(),
    name: text("name").notNull(),
    domain: text("domain"),
    locationCode: integer("location_code").notNull().default(2840),
    locationName: text("location_name").notNull().default("United States"),
    // ISO 3166-1 alpha-2, lowercase. Some YepAPI endpoints take this instead of a location code.
    country: text("country").notNull().default("us"),
    language: text("language").notNull().default("en"),
    // Free-form notes shared with agents over MCP (goal, audience, competitors).
    context: jsonb("context").$type<Record<string, unknown>>().notNull().default({}),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [index("projects_user_idx").on(t.userId)],
);

// ── Keywords ────────────────────────────────────────────────────────────────

export const savedKeywords = pgTable(
  "saved_keywords",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    keyword: text("keyword").notNull(),
    locationCode: integer("location_code").notNull(),
    language: text("language").notNull(),
    volume: integer("volume"),
    cpc: doublePrecision("cpc"),
    competition: doublePrecision("competition"),
    difficulty: integer("difficulty"),
    intent: text("intent"),
    trend: jsonb("trend").$type<{ month: string; volume: number }[]>(),
    tags: text("tags").array().notNull().default(sql`'{}'::text[]`),
    metricsUpdatedAt: timestamp("metrics_updated_at", { withTimezone: true }),
    createdAt: createdAt(),
  },
  (t) => [uniqueIndex("saved_keywords_unique").on(t.projectId, t.keyword, t.locationCode, t.language)],
);

// ── Rank tracking ───────────────────────────────────────────────────────────

export type Schedule = "manual" | "daily" | "weekly" | "monthly";
export type Device = "desktop" | "mobile";
export type RunStatus = "queued" | "running" | "completed" | "failed" | "cancelled";

export const rankTrackers = pgTable(
  "rank_trackers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    domain: text("domain").notNull(),
    locationCode: integer("location_code"),
    locationName: text("location_name").notNull(),
    // Set when tracking from an exact point instead of a location code.
    latitude: doublePrecision("latitude"),
    longitude: doublePrecision("longitude"),
    language: text("language").notNull().default("en"),
    devices: text("devices").array().$type<Device[]>().notNull().default(sql`'{desktop}'::text[]`),
    // Results each check reads: 20, 50 or 100 (RANK_DEPTHS). Sets the price of a check.
    depth: integer("depth").notNull().default(100),
    schedule: text("schedule").$type<Schedule>().notNull().default("weekly"),
    nextRunAt: timestamp("next_run_at", { withTimezone: true }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [index("rank_trackers_project_idx").on(t.projectId), index("rank_trackers_due_idx").on(t.nextRunAt)],
);

export const rankKeywords = pgTable(
  "rank_keywords",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    trackerId: uuid("tracker_id")
      .notNull()
      .references(() => rankTrackers.id, { onDelete: "cascade" }),
    keyword: text("keyword").notNull(),
    pinned: boolean("pinned").notNull().default(false),
    tags: text("tags").array().notNull().default(sql`'{}'::text[]`),
    // Removing a keyword only sets this, so its history survives; adding it again clears it.
    removedAt: timestamp("removed_at", { withTimezone: true }),
    createdAt: createdAt(),
  },
  (t) => [uniqueIndex("rank_keywords_unique").on(t.trackerId, t.keyword)],
);

export const rankRuns = pgTable(
  "rank_runs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    trackerId: uuid("tracker_id")
      .notNull()
      .references(() => rankTrackers.id, { onDelete: "cascade" }),
    status: text("status").$type<RunStatus>().notNull().default("queued"),
    trigger: text("trigger").$type<"manual" | "schedule" | "api">().notNull(),
    total: integer("total").notNull().default(0),
    done: integer("done").notNull().default(0),
    failed: integer("failed").notNull().default(0),
    costUsd: doublePrecision("cost_usd").notNull().default(0),
    error: text("error"),
    createdAt: createdAt(),
    // Touched on every bit of progress; cleanup fails runs whose heartbeat has gone quiet.
    heartbeatAt: timestamp("heartbeat_at", { withTimezone: true }),
    startedAt: timestamp("started_at", { withTimezone: true }),
    finishedAt: timestamp("finished_at", { withTimezone: true }),
  },
  (t) => [
    index("rank_runs_tracker_idx").on(t.trackerId, t.createdAt),
    // One active run per tracker; doubles as the run lock.
    uniqueIndex("rank_runs_active_unique").on(t.trackerId).where(sql`status in ('queued','running')`),
  ],
);

export type SerpCompetitor = { position: number; domain: string; url: string; title?: string };

export const rankResults = pgTable(
  "rank_results",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    runId: uuid("run_id")
      .notNull()
      .references(() => rankRuns.id, { onDelete: "cascade" }),
    trackerId: uuid("tracker_id")
      .notNull()
      .references(() => rankTrackers.id, { onDelete: "cascade" }),
    keywordId: uuid("keyword_id")
      .notNull()
      .references(() => rankKeywords.id, { onDelete: "cascade" }),
    device: text("device").$type<Device>().notNull(),
    // null = not found within the checked depth.
    position: integer("position"),
    url: text("url"),
    title: text("title"),
    checkedDepth: integer("checked_depth").notNull(),
    features: text("features").array().notNull().default(sql`'{}'::text[]`),
    ownedFeatures: text("owned_features").array().notNull().default(sql`'{}'::text[]`),
    inLocalPack: boolean("in_local_pack"),
    competitors: jsonb("competitors").$type<SerpCompetitor[]>().notNull().default([]),
    costUsd: doublePrecision("cost_usd").notNull().default(0),
    error: text("error"),
    checkedAt: timestamp("checked_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("rank_results_keyword_idx").on(t.keywordId, t.device, t.checkedAt),
    index("rank_results_run_idx").on(t.runId),
  ],
);

// ── AI visibility ───────────────────────────────────────────────────────────

export type Competitor = { name: string; domain?: string; aliases?: string[] };

export const aiSettings = pgTable("ai_settings", {
  projectId: uuid("project_id")
    .primaryKey()
    .references(() => projects.id, { onDelete: "cascade" }),
  brand: text("brand").notNull().default(""),
  brandAliases: text("brand_aliases").array().notNull().default(sql`'{}'::text[]`),
  domain: text("domain"),
  competitors: jsonb("competitors").$type<Competitor[]>().notNull().default([]),
  // Exact YepAPI model IDs, pinned so a version change is visible in trends.
  models: text("models").array().notNull().default(sql`'{}'::text[]`),
  webSearch: boolean("web_search").notNull().default(true),
  schedule: text("schedule").$type<Schedule>().notNull().default("weekly"),
  nextRunAt: timestamp("next_run_at", { withTimezone: true }),
  updatedAt: updatedAt(),
});

export const aiPrompts = pgTable(
  "ai_prompts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    prompt: text("prompt").notNull(),
    topic: text("topic"),
    active: boolean("active").notNull().default(true),
    createdAt: createdAt(),
  },
  (t) => [index("ai_prompts_project_idx").on(t.projectId)],
);

export const aiRuns = pgTable(
  "ai_runs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    status: text("status").$type<RunStatus>().notNull().default("queued"),
    trigger: text("trigger").$type<"manual" | "schedule" | "api">().notNull(),
    total: integer("total").notNull().default(0),
    done: integer("done").notNull().default(0),
    failed: integer("failed").notNull().default(0),
    costUsd: doublePrecision("cost_usd").notNull().default(0),
    // Spending ceiling for this run. Answers are token-priced with no upper bound, so the
    // ceiling is enforced while the run goes: it stops before an answer that could cross it.
    maxCostUsd: doublePrecision("max_cost_usd"),
    error: text("error"),
    createdAt: createdAt(),
    // Touched on every bit of progress; cleanup fails runs whose heartbeat has gone quiet.
    heartbeatAt: timestamp("heartbeat_at", { withTimezone: true }),
    startedAt: timestamp("started_at", { withTimezone: true }),
    finishedAt: timestamp("finished_at", { withTimezone: true }),
  },
  (t) => [
    index("ai_runs_project_idx").on(t.projectId, t.createdAt),
    uniqueIndex("ai_runs_active_unique").on(t.projectId).where(sql`status in ('queued','running')`),
  ],
);

export type AiSource = { url: string; title?: string };
export type AiBrandHit = { name: string; mentioned: boolean; cited: boolean; position: number | null };

export const aiAnswers = pgTable(
  "ai_answers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    runId: uuid("run_id")
      .notNull()
      .references(() => aiRuns.id, { onDelete: "cascade" }),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    promptId: uuid("prompt_id")
      .notNull()
      .references(() => aiPrompts.id, { onDelete: "cascade" }),
    model: text("model").notNull(),
    webSearch: boolean("web_search").notNull(),
    answer: text("answer"),
    sources: jsonb("sources").$type<AiSource[]>().notNull().default([]),
    mentioned: boolean("mentioned").notNull().default(false),
    cited: boolean("cited").notNull().default(false),
    // Order of first mention among tracked brands (1 = first). null = absent.
    position: integer("position"),
    brands: jsonb("brands").$type<AiBrandHit[]>().notNull().default([]),
    // The prompt names the user's own brand, so a mention says little; left out of rates and trends.
    branded: boolean("branded").notNull().default(false),
    // The user's brand name and domain when the answer was analysed. Trends compare only answers
    // about the same brand, so renaming it shows as a change of scope, not a drop.
    brandKey: text("brand_key"),
    costUsd: doublePrecision("cost_usd").notNull().default(0),
    error: text("error"),
    createdAt: createdAt(),
  },
  (t) => [
    index("ai_answers_prompt_idx").on(t.promptId, t.model, t.createdAt),
    index("ai_answers_run_idx").on(t.runId),
    // Per-model average cost for run estimates and the cost ceiling.
    index("ai_answers_project_model_idx").on(t.projectId, t.model),
  ],
);

// ── Site audit ──────────────────────────────────────────────────────────────

/** off: never render; auto: render only pages whose HTML is an empty app shell; always: render every HTML page. */
export type RenderMode = "off" | "auto" | "always";
export type AuditTrigger = "manual" | "schedule" | "api" | "tool";
/** Crawl options recorded with each audit. Patterns are globs (see packages/crawler UrlPattern). */
export type AuditOptions = { include?: string[]; exclude?: string[]; checkExternalLinks?: boolean };

export const audits = pgTable(
  "audits",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    // Null for one-off audits run from the Site Audit tool, which belong to no project.
    projectId: uuid("project_id").references(() => projects.id, { onDelete: "cascade" }),
    // Owner (core database, no foreign key). Set for every audit, so tool audits can be found and limited.
    userId: text("user_id").notNull(),
    trigger: text("trigger").$type<AuditTrigger>().notNull().default("manual"),
    startUrl: text("start_url").notNull(),
    maxPages: integer("max_pages").notNull(),
    // Kept in step with renderMode === "always" for older readers.
    renderJs: boolean("render_js").notNull().default(false),
    renderMode: text("render_mode").$type<RenderMode>().notNull().default("off"),
    // Fetch pages the site blocks through YepAPI's residential proxies.
    useFallback: boolean("use_fallback").notNull().default(false),
    // Rendering and fallback stop once this much has been spent; the crawl itself carries on.
    maxCostUsd: doublePrecision("max_cost_usd"),
    options: jsonb("options").$type<AuditOptions>().notNull().default({}),
    status: text("status").$type<RunStatus>().notNull().default("queued"),
    pagesCrawled: integer("pages_crawled").notNull().default(0),
    healthScore: integer("health_score"),
    aiScore: integer("ai_score"),
    summary: jsonb("summary").$type<Record<string, unknown>>(),
    // The project's previous completed audit of the same site, which this one is compared with.
    previousAuditId: uuid("previous_audit_id"),
    costUsd: doublePrecision("cost_usd").notNull().default(0),
    // While running, after the last page: the step it is on (site-files, resources, external-links, analysis).
    phase: text("phase"),
    error: text("error"),
    createdAt: createdAt(),
    // Touched on every bit of progress; cleanup fails runs whose heartbeat has gone quiet.
    heartbeatAt: timestamp("heartbeat_at", { withTimezone: true }),
    startedAt: timestamp("started_at", { withTimezone: true }),
    finishedAt: timestamp("finished_at", { withTimezone: true }),
  },
  (t) => [index("audits_project_idx").on(t.projectId, t.createdAt), index("audits_user_idx").on(t.userId, t.createdAt)],
);

/** A project's audit setup: what to crawl and how often. */
export const auditSettings = pgTable("audit_settings", {
  projectId: uuid("project_id")
    .primaryKey()
    .references(() => projects.id, { onDelete: "cascade" }),
  // Null: the project's website.
  startUrl: text("start_url"),
  maxPages: integer("max_pages").notNull().default(500),
  renderMode: text("render_mode").$type<RenderMode>().notNull().default("auto"),
  useFallback: boolean("use_fallback").notNull().default(true),
  maxCostUsd: doublePrecision("max_cost_usd").default(1),
  // Glob patterns (see packages/crawler UrlPattern) for URLs to skip or to keep to.
  exclude: text("exclude").array().notNull().default(sql`'{}'::text[]`),
  include: text("include").array().notNull().default(sql`'{}'::text[]`),
  checkExternalLinks: boolean("check_external_links").notNull().default(true),
  schedule: text("schedule").$type<Schedule>().notNull().default("weekly"),
  nextRunAt: timestamp("next_run_at", { withTimezone: true }),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const auditPages = pgTable(
  "audit_pages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    auditId: uuid("audit_id")
      .notNull()
      .references(() => audits.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    status: integer("status"),
    title: text("title"),
    wordCount: integer("word_count"),
    depth: integer("depth"),
    responseMs: integer("response_ms"),
    // Time to first byte plus downloading the body.
    loadMs: integer("load_ms"),
    contentType: text("content_type"),
    indexable: boolean("indexable"),
    // Internal PageRank, 0-100.
    pageRank: integer("page_rank"),
    // Distinct crawled pages linking here.
    inlinks: integer("inlinks"),
    inSitemap: boolean("in_sitemap"),
    // Clicks from Google in the 28 days before the audit, from the project's Search Console; null without it.
    clicks: integer("clicks"),
    issueCount: integer("issue_count").notNull().default(0),
    data: jsonb("data").$type<Record<string, unknown>>().notNull(),
  },
  (t) => [index("audit_pages_audit_idx").on(t.auditId, t.url)],
);

export type AuditLinkKind = "href" | "redirect" | "canonical" | "hreflang" | "image" | "script" | "stylesheet";

/**
 * Every link the crawl found: anchors, redirects, canonicals, hreflang alternates and the images,
 * scripts and stylesheets pages load. Large, so only a project's latest audits keep theirs (see
 * LINK_RETENTION in services/audit.ts).
 */
export const auditLinks = pgTable(
  "audit_links",
  {
    auditId: uuid("audit_id")
      .notNull()
      .references(() => audits.id, { onDelete: "cascade" }),
    source: text("source").notNull(),
    target: text("target").notNull(),
    kind: text("kind").$type<AuditLinkKind>().notNull(),
    anchor: text("anchor"),
    nofollow: boolean("nofollow").notNull().default(false),
    internal: boolean("internal").notNull(),
  },
  // The source index doubles as the keyset order exports page through.
  (t) => [index("audit_links_target_idx").on(t.auditId, t.target), index("audit_links_source_idx").on(t.auditId, t.source, t.target)],
);

/** Images, scripts and stylesheets the crawl checked, and the external link targets. */
export const auditResources = pgTable(
  "audit_resources",
  {
    auditId: uuid("audit_id")
      .notNull()
      .references(() => audits.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    type: text("type").$type<"image" | "script" | "stylesheet" | "external">().notNull(),
    status: integer("status").notNull(),
    contentType: text("content_type"),
    sizeBytes: integer("size_bytes"),
    broken: boolean("broken").notNull(),
    redirected: boolean("redirected").notNull().default(false),
    sourceCount: integer("source_count").notNull().default(0),
  },
  (t) => [index("audit_resources_audit_idx").on(t.auditId, t.type)],
);

export const auditIssues = pgTable(
  "audit_issues",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    auditId: uuid("audit_id")
      .notNull()
      .references(() => audits.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    severity: text("severity").$type<"critical" | "warning" | "info">().notNull(),
    url: text("url").notNull(),
    detail: text("detail"),
    relatedUrls: jsonb("related_urls").$type<string[]>(),
    // Against the previous audit: "new" on a URL crawled for the first time, "added" on a URL crawled both times that did not have it.
    change: text("change").$type<"new" | "added">(),
    // Links and Content issues are reported separately for indexable and non-indexable pages; null for the rest.
    indexable: boolean("indexable"),
  },
  (t) => [index("audit_issues_audit_idx").on(t.auditId, t.type)],
);

// ── Local SEO ───────────────────────────────────────────────────────────────

export type GridTop = { position: number; placeId: string; name: string; rating?: number };

export const geoGrids = pgTable(
  "geo_grids",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    keyword: text("keyword").notNull(),
    placeId: text("place_id").notNull(),
    placeName: text("place_name").notNull(),
    centerLat: doublePrecision("center_lat").notNull(),
    centerLng: doublePrecision("center_lng").notNull(),
    size: integer("size").notNull(),
    spacingM: integer("spacing_m").notNull(),
    status: text("status").$type<RunStatus>().notNull().default("queued"),
    done: integer("done").notNull().default(0),
    averagePosition: doublePrecision("average_position"),
    foundIn: integer("found_in"),
    costUsd: doublePrecision("cost_usd").notNull().default(0),
    error: text("error"),
    createdAt: createdAt(),
    // Touched on every bit of progress; cleanup fails runs whose heartbeat has gone quiet.
    heartbeatAt: timestamp("heartbeat_at", { withTimezone: true }),
    finishedAt: timestamp("finished_at", { withTimezone: true }),
  },
  (t) => [index("geo_grids_project_idx").on(t.projectId, t.createdAt)],
);

export const geoGridPoints = pgTable(
  "geo_grid_points",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    gridId: uuid("grid_id")
      .notNull()
      .references(() => geoGrids.id, { onDelete: "cascade" }),
    row: integer("row").notNull(),
    col: integer("col").notNull(),
    lat: doublePrecision("lat").notNull(),
    lng: doublePrecision("lng").notNull(),
    // null = not in the returned results.
    position: integer("position"),
    top: jsonb("top").$type<GridTop[]>().notNull().default([]),
    error: text("error"),
  },
  (t) => [uniqueIndex("geo_grid_points_unique").on(t.gridId, t.row, t.col)],
);

// ── Google Search Console and Analytics connections ─────────────────────────

export const gscConnections = pgTable("gsc_connections", {
  projectId: uuid("project_id")
    .primaryKey()
    .references(() => projects.id, { onDelete: "cascade" }),
  googleAccountId: uuid("google_account_id")
    .notNull(),
  // Stored as Google returns it: "sc-domain:example.com" or a URL prefix.
  siteUrl: text("site_url").notNull(),
  createdAt: createdAt(),
});

/** The GA4 property a project reads. One per project. */
export const ga4Connections = pgTable("ga4_connections", {
  projectId: uuid("project_id")
    .primaryKey()
    .references(() => projects.id, { onDelete: "cascade" }),
  googleAccountId: uuid("google_account_id")
    .notNull(),
  // "properties/123456789"
  propertyId: text("property_id").notNull(),
  displayName: text("display_name").notNull(),
  timeZone: text("time_zone"),
  currencyCode: text("currency_code"),
  createdAt: createdAt(),
});

// ── Relations ───────────────────────────────────────────────────────────────

export const projectsRelations = relations(projects, ({ many }) => ({
  trackers: many(rankTrackers),
}));

export const rankTrackersRelations = relations(rankTrackers, ({ one, many }) => ({
  project: one(projects, { fields: [rankTrackers.projectId], references: [projects.id] }),
  keywords: many(rankKeywords),
}));

export const rankKeywordsRelations = relations(rankKeywords, ({ one }) => ({
  tracker: one(rankTrackers, { fields: [rankKeywords.trackerId], references: [rankTrackers.id] }),
}));

