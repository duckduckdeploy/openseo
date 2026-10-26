import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { resolveUser } from "../lib/context";
import { estimateAudit, MAX_AUDIT_PAGES } from "../services/audit";
import { issuer, SCOPE } from "../services/oauth";
import { estimateGrid } from "../services/geogrid";
import { lookups } from "../services/lookups";

type Json = Record<string, unknown>;
type Shape = Record<string, z.ZodType>;
type ToolResult = { content: { type: "text"; text: string }[]; isError?: boolean };

const MAX_RESULT_CHARS = 120_000;

const projectId = z.string().uuid().optional().describe("Project ID from list_projects. Optional when the account has exactly one project.");
const maxCost = z
  .number()
  .positive()
  .describe("Spending ceiling in USD for this call, agreed with the user. The call is refused if its worst-case price is higher. Spend comes from the user's own YepAPI balance.");

const COORDINATE_KEY = /^(lat|lng|latitude|longitude|centerLat|centerLng)$/;
/** Provider floats come with 15 digits (traffic 374938.47578718886, competition 0.25999999046325684). Coordinates keep theirs. */
const roundNumbers = (key: string, value: unknown) =>
  typeof value === "number" && !Number.isInteger(value) && !COORDINATE_KEY.test(key)
    ? Math.abs(value) >= 1000
      ? Math.round(value)
      : Math.round(value * 100) / 100
    : value;

const text = (value: unknown): ToolResult => {
  let body = typeof value === "string" ? value : JSON.stringify(value, roundNumbers, 1);
  if (body.length > MAX_RESULT_CHARS) body = `${body.slice(0, MAX_RESULT_CHARS)}\n… truncated. Ask for fewer rows (lower limit) or a narrower filter.`;
  return { content: [{ type: "text", text: body }] };
};
const dryRun = z.boolean().optional().describe("Return the price estimate only. Spends nothing.");

// Rows an agent gets when it doesn't pass a limit. Large tables overflow a client's context: 150
// keyword ideas with their monthly trends came to about 120 KB in a test with Claude Code.
const MCP_DEFAULT_LIMIT = 50;
const TREND_KEYS = new Set(["trend", "monthlySearches"]);

const rows = (value: unknown) => (Array.isArray(value) ? (value as Json[]) : []);
/** Keeps the named fields that carry a value; blank strings and nulls are noise to an agent. */
const pick = (row: Json, keys: string[]) => Object.fromEntries(keys.filter((key) => row[key] != null && row[key] !== "").map((key) => [key, row[key]]));
const hostOnly = (value: unknown) => String(value ?? "").toLowerCase().replace(/^www\./, "");

/** One SERP result as an agent reads it: what it is, where it points and its text, without layout data. */
function serpRow(row: Json): Json {
  const data = (row.data ?? {}) as Json;
  const base = pick(row, ["position", "type", "title", "url", "domain", "description"]);
  if (data.isFeaturedSnippet) base.featuredSnippet = true;
  if (row.type === "aiOverview") {
    const items = rows(data.items);
    const sources = new Map<string, Json>();
    for (const ref of items.flatMap((item) => rows(item.references))) if (typeof ref.url === "string") sources.set(ref.url, pick(ref, ["title", "url", "domain"]));
    return { ...base, text: items.map((item) => [item.title, item.text].filter(Boolean).join(": ")).join("\n\n"), sources: [...sources.values()] };
  }
  // Videos, People Also Ask, related searches…: a list of strings or small objects.
  if (Array.isArray(data.items)) {
    base.items = data.items.map((item) => (item && typeof item === "object" ? pick(item as Json, ["title", "question", "url", "domain", "source"]) : item));
  }
  return base;
}

/** Google Places rows: drops photo references, icon and Google redirect links, which are most of the bytes. */
const KEEP_URLS = new Set(["googleMapsUrl", "website"]);
const slimPlace = (value: unknown): unknown =>
  Array.isArray(value)
    ? value.map(slimPlace)
    : value && typeof value === "object"
      ? Object.fromEntries(
          Object.entries(value as Json).flatMap(([key, inner]): [string, unknown][] => {
            if (key === "photos" || key === "images") return [[`${key.slice(0, -1)}Count`, Array.isArray(inner) ? inner.length : 0]];
            if ((/Url$/.test(key) && !KEEP_URLS.has(key)) || ["iconBackgroundColor", "plusCode", "nextPageToken", "reviewId"].includes(key)) return [];
            return [[key, slimPlace(inner)]];
          }),
        )
      : value;

/** Smaller shapes for lookups whose raw rows are mostly empty fields an agent has to wade through. */
const AGENT_VIEWS: Record<string, (data: Json) => unknown> = {
  // Each raw row repeats blank title/url/domain and a long Google search link around one suggestion.
  autocomplete: (data) => ({
    query: data.query,
    suggestions: rows(data.results)
      .map((row) => (typeof (row.data as Json | undefined)?.suggestion === "string" ? (row.data as Json).suggestion : row.title))
      .filter(Boolean),
  }),
  // Raw rows carry every layout field Google has (ampVersion, rectangle, cacheUrl…): about 600 tokens a result.
  serp: (data) => ({ query: data.query, totalResults: data.totalResults, itemTypes: data.itemTypes, results: rows(data.results).map(serpRow) }),
  maps_search: slimPlace,
  maps_place: slimPlace,
  maps_reviews: slimPlace,
  // The app shows every row; an agent gets the findings, opportunities and the head of each list.
  seo_audit: (data) => {
    const keywords = (data.keywords ?? {}) as Json;
    const pages = (data.pages ?? {}) as Json;
    const backlinks = (data.backlinks ?? {}) as Json;
    return {
      ...data,
      keywords: { total: keywords.total, top: rows(keywords.top).slice(0, 15).map((row) => pick(row, ["keyword", "position", "volume", "traffic", "url"])) },
      pages: { total: pages.total, top: rows(pages.top).slice(0, 10) },
      backlinks: { summary: backlinks.summary, referringDomains: rows(backlinks.referringDomains).slice(0, 10).map((row) => pick(row, ["domain", "rank", "backlinks", "spamScore"])), anchors: rows(backlinks.anchors).slice(0, 10).map((row) => pick(row, ["anchor", "backlinks", "referringDomains"])) },
    };
  },
  // The provider lists the domain itself as its own top competitor.
  competitors_domain: (data) => ({ ...data, competitors: rows(data.competitors).filter((row) => hostOnly(row.domain) !== hostOnly(data.domain)) }),
  // domain1/domain2 swap with the mode, so name the sides; and drop a side the provider left blank.
  keyword_gap: (data) => {
    const gap = data.mode === "gap";
    const side = (value: unknown) => {
      const s = (value ?? {}) as Json;
      return s.position || s.url ? pick(s, ["position", "url", "etv"]) : undefined;
    };
    return {
      mode: data.mode,
      domain: gap ? data.domain2 : data.domain1,
      competitor: gap ? data.domain1 : data.domain2,
      keywords: rows(data.keywords).map((row) => ({
        ...pick(row, ["keyword", "volume", "cpc", "competition", "difficulty", "intent"]),
        yours: side(gap ? row.domain2 : row.domain1),
        competitor: side(gap ? row.domain1 : row.domain2),
      })),
    };
  },
};

/** A lookup result for an agent: what it cost first, then the data, without monthly trends unless asked. */
function forAgent(result: unknown, includeTrend: boolean): unknown {
  if (!result || typeof result !== "object" || (result as Json).dryRun) return result;
  const { name, estimate, data: raw, costUsd, cached, fetchedAt, ...rest } = result as Json;
  const view = AGENT_VIEWS[name as string];
  const data = view && raw && typeof raw === "object" ? view(raw as Json) : raw;
  const strip = (value: unknown): unknown =>
    Array.isArray(value)
      ? value.map(strip)
      : value && typeof value === "object"
        ? Object.fromEntries(Object.entries(value as Json).filter(([key]) => !TREND_KEYS.has(key)).map(([key, inner]) => [key, strip(inner)]))
        : value;
  return { name, costUsd, cached, fetchedAt, estimate, ...rest, data: includeTrend ? data : strip(data) };
}

/** Drops fields an agent has no use for (internal user ids) from every answer. */
const withoutUserIds = (value: unknown): unknown =>
  Array.isArray(value)
    ? value.map(withoutUserIds)
    : value && typeof value === "object"
      ? Object.fromEntries(Object.entries(value as Json).filter(([key]) => key !== "userId").map(([key, inner]) => [key, withoutUserIds(inner)]))
      : value;
const fail = (message: string): ToolResult => ({ content: [{ type: "text", text: message }], isError: true });

/**
 * MCP tools are thin wrappers over the REST API: each one calls a route in-process with the
 * caller's own API key, so agents and the web app share validation, pricing and limits.
 */
function buildServer(app: FastifyInstance, authorization: string): McpServer {
  const server = new McpServer(
    { name: "openseo", version: "0.1.0" },
    {
      instructions:
        "OpenSEO gives you SEO data and tracking for the user's projects. Paid tools spend the user's own YepAPI credits: state the price before you run them, pass max_cost_usd, and prefer dry_run to check a price. Results are cached, so repeating a lookup is free until the cache expires. Start with list_projects.",
    },
  );

  async function rest(method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE", url: string, body?: unknown): Promise<unknown> {
    const response = await app.inject({ method, url: `/api${url}`, headers: { authorization }, payload: body === undefined ? undefined : (body as Json) });
    const json = response.json() as { ok?: boolean; data?: unknown; error?: { message?: string } };
    if (response.statusCode >= 400 || json.ok === false) throw new Error(json.error?.message ?? `Request failed (${response.statusCode})`);
    return json.data ?? json;
  }

  async function resolveProject(id: string | undefined): Promise<string> {
    if (id) return id;
    const projects = (await rest("GET", "/projects")) as { id: string }[];
    if (projects.length === 1 && projects[0]) return projects[0].id;
    throw new Error(projects.length ? "This account has several projects. Pass project_id (see list_projects)." : "No projects yet. Create one with create_project.");
  }

  function tool<S extends Shape>(
    name: string,
    description: string,
    shape: S,
    handler: (args: z.infer<z.ZodObject<S>>) => Promise<unknown>,
    readOnly = false,
  ) {
    server.registerTool(name, { description, inputSchema: shape, annotations: { readOnlyHint: readOnly } }, (async (args: unknown) => {
      try {
        const value = withoutUserIds(await handler(args as z.infer<z.ZodObject<S>>));
        // A dry run says outright that it spent nothing, like a paid result says what it spent.
        const isDryRun = value !== null && typeof value === "object" && (value as Json).dryRun === true;
        return text(isDryRun ? { dryRun: true, costUsd: 0, ...(value as Json) } : value);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Tool failed";
        // The REST message points to the dashboard; an agent also needs the tool that checks it.
        if (/^Connect Google Search Console/.test(message)) return fail(`${message} Check with get_google_connections; only the user can connect Google, in the OpenSEO dashboard.`);
        return fail(message);
      }
    }) as never);
  }

  // ── Account and projects ────────────────────────────────────────────────
  tool("whoami", "The signed-in user and whether a YepAPI key is connected.", {}, () => rest("GET", "/me"), true);
  tool("get_balance", "Remaining YepAPI balance for the user's key, whether auto top-up is on, and this month's paid calls, spend and monthly limit. Free.", {}, () => rest("GET", "/balance"), true);
  tool(
    "get_usage",
    "What OpenSEO has spent with the user's YepAPI key this month, by feature and by day, with the 10 latest calls. Free.",
    {},
    async () => {
      // The REST answer lists the last 50 calls with row ids and timings, which an agent can't act on.
      const usage = (await rest("GET", "/usage")) as Json;
      return { ...usage, recent: rows(usage.recent).slice(0, 10).map((call) => pick(call, ["endpoint", "feature", "ok", "status", "costUsd", "createdAt"])) };
    },
    true,
  );
  tool("list_projects", "List the user's projects with their website, market and language.", {}, () => rest("GET", "/projects"), true);
  tool(
    "create_project",
    "Create a project for a website.",
    {
      name: z.string().min(1).max(120),
      domain: z.string().max(253).optional(),
      location_code: z.number().int().optional().describe("Country location code from search_locations. Default 2840 (United States)."),
      location_name: z.string().optional(),
      country: z.string().length(2).optional().describe("ISO country code, e.g. us. Worked out from location_code when omitted."),
      language: z.string().optional(),
    },
    (a) => rest("POST", "/projects", { name: a.name, domain: a.domain, locationCode: a.location_code, locationName: a.location_name, country: a.country, language: a.language }),
  );
  tool(
    "get_project",
    "A project's settings and its shared context notes (goals, audience, competitors, anything saved earlier).",
    { project_id: projectId },
    async (a) => rest("GET", `/projects/${await resolveProject(a.project_id)}`),
    true,
  );
  tool(
    "update_project_context",
    "Replace the project's shared context notes. Read them first with get_project and send back the full object with your changes.",
    { project_id: projectId, context: z.record(z.string(), z.unknown()) },
    async (a) => rest("PATCH", `/projects/${await resolveProject(a.project_id)}`, { context: a.context }),
  );
  tool(
    "search_locations",
    "Find location codes for countries, regions and cities. Free.",
    { query: z.string().min(2), country: z.string().length(2).optional() },
    (a) => rest("GET", `/locations?q=${encodeURIComponent(a.query)}${a.country ? `&country=${a.country}` : ""}`),
    true,
  );
  tool(
    "list_ai_models",
    "Chat models for AI visibility tracking and ai_compare: the curated set (one per assistant, default marks the four tracked unless changed). Pass all: true for every available model with its price per million tokens. Free.",
    { all: z.boolean().optional().describe("List every model (over 100) instead of the curated set") },
    async (a) => {
      const data = (await rest("GET", "/ai/models")) as Json;
      const models = rows(data.models);
      if (a.all) return { curated: data.curated, models: models.map((m) => pick(m, ["id", "name", "inputPerM", "outputPerM", "searchGrounded"])) };
      return { curated: data.curated, otherModels: models.length, note: "Pass all: true to list every model." };
    },
    true,
  );

  // ── Paid lookups (keyword, domain, backlink, competitor, SERP, on-page, Maps, AI) ──
  for (const lookup of lookups) {
    const cache = lookup.ttl ? ` Cached ${lookup.ttl >= 86400 ? `${Math.round(lookup.ttl / 86400)} day(s)` : `${Math.round(lookup.ttl / 3600)} hour(s)`}; a cached result is free.` : "";
    const shape = lookup.input.shape as Shape;
    // Lookups with a row limit default to MCP_DEFAULT_LIMIT here, so an omitted limit is left
    // optional in the schema (the SDK would otherwise fill in the lookup's larger default).
    const hasLimit = "limit" in shape;
    // Keep the lookup's own ceiling (maps_search allows 20) and never default above it.
    const limitSchema = hasLimit ? (shape.limit as z.ZodDefault<z.ZodNumber>) : undefined;
    const maxLimit = limitSchema?.unwrap().maxValue ?? 1000;
    const defaultLimit = Math.min(MCP_DEFAULT_LIMIT, maxLimit, Number(limitSchema?.def.defaultValue ?? MCP_DEFAULT_LIMIT));
    const hasTrend = /trend/i.test(lookup.description) && lookup.name !== "keyword_trends";
    const notes = [
      hasLimit ? `Returns ${defaultLimit} rows unless you pass limit.` : "",
      hasTrend ? "Monthly trends are left out unless include_trend is true." : "",
      "The result starts with costUsd, what this call actually spent (0 when cached).",
    ].join(" ");
    tool(
      lookup.name,
      `${lookup.description}${cache} ${notes}`.replace(/\s+/g, " ").trim(),
      {
        ...shape,
        ...(hasLimit ? { limit: z.number().int().min(1).max(maxLimit).optional().describe(`Rows to return (default ${defaultLimit}, max ${maxLimit}). More rows cost more.`) } : {}),
        ...(hasTrend ? { include_trend: z.boolean().optional().describe("Include the 12-month trend for every row. Large: keep the limit small.") } : {}),
        project_id: projectId,
        max_cost_usd: maxCost.optional(),
        dry_run: dryRun,
        refresh: z.boolean().optional().describe("Ignore the cache and pay for fresh data."),
      },
      async (a) => {
        const { project_id, max_cost_usd, dry_run, refresh, include_trend, ...input } = a as Json;
        if (hasLimit && input.limit === undefined) input.limit = defaultLimit;
        const query = new URLSearchParams();
        if (dry_run) query.set("dryRun", "1");
        if (refresh) query.set("refresh", "1");
        if (max_cost_usd != null) query.set("maxCostUsd", String(max_cost_usd));
        // Without any project, run it standalone in the market the input names (default: US, English).
        if (!project_id && ((await rest("GET", "/projects")) as unknown[]).length === 0) {
          if (typeof input.locationCode === "number") query.set("locationCode", String(input.locationCode));
          if (typeof input.language === "string") query.set("language", input.language);
          return forAgent(await rest("POST", `/lookups/${lookup.name}?${query}`, input), include_trend === true);
        }
        const id = await resolveProject(project_id as string | undefined);
        return forAgent(await rest("POST", `/projects/${id}/lookups/${lookup.name}?${query}`, input), include_trend === true);
      },
    );
  }

  // ── Saved keywords ──────────────────────────────────────────────────────
  tool(
    "list_saved_keywords",
    "Keywords saved in the project, with stored metrics and tags.",
    { project_id: projectId, search: z.string().optional(), tag: z.string().optional(), limit: z.number().int().min(1).max(500).optional() },
    async (a) => {
      const query = new URLSearchParams();
      if (a.search) query.set("q", a.search);
      if (a.tag) query.set("tag", a.tag);
      if (a.limit) query.set("limit", String(a.limit));
      return rest("GET", `/projects/${await resolveProject(a.project_id)}/saved-keywords?${query}`);
    },
    true,
  );
  tool(
    "save_keywords",
    "Save keywords to the project, optionally with metrics you already fetched and tags. Free.",
    {
      project_id: projectId,
      keywords: z
        .array(
          z.object({
            keyword: z.string().min(1).max(200),
            volume: z.number().int().nullable().optional(),
            cpc: z.number().nullable().optional(),
            difficulty: z.number().int().nullable().optional(),
            intent: z.string().nullable().optional(),
          }),
        )
        .min(1)
        .max(1000),
      tags: z.array(z.string()).max(10).optional(),
    },
    async (a) => rest("POST", `/projects/${await resolveProject(a.project_id)}/saved-keywords`, { keywords: a.keywords, tags: a.tags ?? [] }),
  );

  // ── Rank tracking ───────────────────────────────────────────────────────
  tool(
    "list_rank_trackers",
    "Rank trackers in the project with keyword counts, schedule, last run and the price range of one run.",
    { project_id: projectId },
    async (a) => rest("GET", `/projects/${await resolveProject(a.project_id)}/trackers`),
    true,
  );
  tool(
    "create_rank_tracker",
    "Create a Google rank tracker for a domain in one location. Creating it spends nothing, and it only runs when you call run_rank_check unless you set a schedule: daily, weekly or monthly makes a paid run every period with no further confirmation, each costing keywords x devices x $0.02, $0.05 or $0.10 by depth. Leave schedule as manual (the default) unless the user agreed to that recurring spend. depth is how many results each check reads: 20 ($0.02 per keyword and device), 50 ($0.05) or 100 ($0.10, the default). SERP features count toward the depth.",
    {
      project_id: projectId,
      domain: z.string().min(3),
      location_code: z.number().int().optional().describe("Country, region or city code from search_locations"),
      location_name: z.string().describe("Display name of the location"),
      latitude: z.number().optional().describe("With longitude: track from an exact point instead of a location code"),
      longitude: z.number().optional(),
      language: z.string().optional(),
      devices: z.array(z.enum(["desktop", "mobile"])).min(1).max(2).optional(),
      schedule: z.enum(["manual", "daily", "weekly", "monthly"]).optional().describe("Default manual. Any other value spends on every scheduled run."),
      depth: z.union([z.literal(20), z.literal(50), z.literal(100)]).optional().describe("Results per check: 20, 50 or 100 (default)"),
      keywords: z.array(z.string()).max(1000).optional(),
    },
    async (a) =>
      rest("POST", `/projects/${await resolveProject(a.project_id)}/trackers`, {
        domain: a.domain,
        locationCode: a.location_code,
        locationName: a.location_name,
        latitude: a.latitude,
        longitude: a.longitude,
        language: a.language,
        devices: a.devices,
        schedule: a.schedule ?? "manual",
        depth: a.depth,
        keywords: a.keywords,
      }),
  );
  tool(
    "add_rank_keywords",
    "Add keywords to a rank tracker. Free until the next check runs. A keyword removed earlier comes back with its position history.",
    { tracker_id: z.string().uuid(), keywords: z.array(z.string().min(1)).min(1).max(1000) },
    (a) => rest("POST", `/trackers/${a.tracker_id}/keywords`, { keywords: a.keywords }),
  );
  tool(
    "run_rank_check",
    "Check every keyword in a tracker now. Runs in the background; poll get_rank_results. Each keyword and device costs $0.02, $0.05 or $0.10 by the tracker's depth (20, 50 or 100 results); the total is in list_rank_trackers (estimate).",
    { tracker_id: z.string().uuid(), max_cost_usd: maxCost.optional().describe("Required unless dry_run"), dry_run: dryRun },
    async (a) => {
      if (a.dry_run) {
        const tracker = (await rest("GET", `/trackers/${a.tracker_id}`)) as { keywordCount: number; devices: string[]; depth: number; estimate: unknown };
        return { dryRun: true, estimate: tracker.estimate, keywordCount: tracker.keywordCount, devices: tracker.devices, depth: tracker.depth };
      }
      if (a.max_cost_usd == null) throw new Error("Pass max_cost_usd, or dry_run: true to see the price first.");
      // The API prices the run again just before it starts, so keywords added meanwhile count.
      return rest("POST", `/trackers/${a.tracker_id}/runs`, { maxCostUsd: a.max_cost_usd });
    },
  );
  tool(
    "get_rank_results",
    "Latest position for every keyword in a tracker, change since the previous check, ranking URL, SERP features and a short history.",
    { tracker_id: z.string().uuid(), device: z.enum(["desktop", "mobile"]).optional() },
    (a) => rest("GET", `/trackers/${a.tracker_id}/results${a.device ? `?device=${a.device}` : ""}`),
    true,
  );
  tool(
    "get_rank_competitors",
    "Domains that appear most often in the top 10 for a tracker's keywords, from the latest check. Free.",
    { tracker_id: z.string().uuid(), device: z.enum(["desktop", "mobile"]).optional() },
    (a) => rest("GET", `/trackers/${a.tracker_id}/competitors${a.device ? `?device=${a.device}` : ""}`),
    true,
  );

  // ── AI visibility ───────────────────────────────────────────────────────
  tool(
    "get_ai_visibility_setup",
    "AI visibility setup for the project: brand, competitors, tracked models, prompts, schedule and the estimated price of a run.",
    { project_id: projectId },
    async (a) => rest("GET", `/projects/${await resolveProject(a.project_id)}/ai`),
    true,
  );
  tool(
    "update_ai_visibility_setup",
    "Change the brand, aliases, domain, competitors, tracked models, web search or schedule for AI visibility. A brand or competitor with a domain counts as mentioned only when the answer also points to that domain, so set the domain for any name another product shares.",
    {
      project_id: projectId,
      brand: z.string().optional(),
      brand_aliases: z.array(z.string()).optional(),
      domain: z.string().optional(),
      competitors: z.array(z.object({ name: z.string(), domain: z.string().optional(), aliases: z.array(z.string()).optional() })).optional(),
      models: z.array(z.string()).optional().describe("Exact model IDs from list_ai_models"),
      web_search: z.boolean().optional(),
      schedule: z.enum(["manual", "daily", "weekly", "monthly"]).optional(),
    },
    async (a) =>
      rest("PUT", `/projects/${await resolveProject(a.project_id)}/ai/settings`, {
        brand: a.brand,
        brandAliases: a.brand_aliases,
        domain: a.domain,
        competitors: a.competitors,
        models: a.models,
        webSearch: a.web_search,
        schedule: a.schedule,
      }),
  );
  tool(
    "add_ai_prompts",
    "Add prompts to track: questions a buyer would ask an AI assistant, without your brand name in them.",
    { project_id: projectId, prompts: z.array(z.string().min(3)).min(1).max(100), topic: z.string().optional() },
    async (a) => rest("POST", `/projects/${await resolveProject(a.project_id)}/ai/prompts`, { prompts: a.prompts, topic: a.topic }),
  );
  tool(
    "run_ai_visibility",
    "Ask every active prompt to every tracked model now and record mentions, citations and position. Background job; poll get_ai_visibility_results. Each answer is token-priced with a $0.01 minimum, so there is no fixed upper price: the run is refused if its expected cost is above max_cost_usd, and otherwise answers one at a time and stops early (status cancelled) when the next answer would likely cross it. An answer's price is only known afterwards, so the total can end above max_cost_usd by up to the cost of one answer. See the estimate in get_ai_visibility_setup.",
    { project_id: projectId, max_cost_usd: maxCost },
    async (a) => rest("POST", `/projects/${await resolveProject(a.project_id)}/ai/runs`, { maxCostUsd: a.max_cost_usd }),
  );
  tool(
    "get_ai_visibility_results",
    "AI visibility report: mention and citation rates overall and per model, share of voice against competitors, most-cited domains, a prompt-by-model grid and the trend across runs. activeRun shows a run still in progress (done of total answers, spend so far).",
    { project_id: projectId },
    async (a) => {
      const id = await resolveProject(a.project_id);
      // The report only covers finished runs; without the active one an agent polling after run_ai_visibility sees nothing change.
      const [results, setup] = await Promise.all([rest("GET", `/projects/${id}/ai/results`), rest("GET", `/projects/${id}/ai`)]);
      return { activeRun: (setup as Json).activeRun ?? null, ...(results as Json) };
    },
    true,
  );
  tool(
    "get_ai_answers",
    "Full stored answers for one prompt: text, sources and brand hits per model, newest first.",
    { project_id: projectId, prompt_id: z.string().uuid() },
    async (a) => rest("GET", `/projects/${await resolveProject(a.project_id)}/ai/prompts/${a.prompt_id}/answers`),
    true,
  );

  // ── Site audit ──────────────────────────────────────────────────────────
  tool(
    "start_site_audit",
    "Crawl a site and check it for 100+ technical SEO issues (status codes, redirects, broken links, canonicals, sitemaps, hreflang, structured data, AI crawler access). The crawl is free. Paid help from YepAPI is optional: render_mode \"auto\" renders only pages that are empty without JavaScript and \"always\" renders every page ($0.02 a page); use_fallback fetches pages the site blocks through residential proxies ($0.03 a page). Paid help needs max_cost_usd, which caps the audit's spending. Background job; poll get_site_audit.",
    {
      project_id: projectId,
      start_url: z.string().optional().describe("Defaults to the project's website"),
      max_pages: z.number().int().min(1).max(MAX_AUDIT_PAGES).optional().describe("Defaults to the project's audit settings, else 100"),
      render_mode: z.enum(["off", "auto", "always"]).optional(),
      render_js: z.boolean().optional().describe("Deprecated: same as render_mode \"always\""),
      use_fallback: z.boolean().optional(),
      max_cost_usd: maxCost.optional().describe("Spending cap for rendering and the fallback; required when either is on"),
      dry_run: dryRun,
    },
    async (a) => {
      const renderMode = a.render_mode ?? (a.render_js ? "always" : undefined);
      const body = { startUrl: a.start_url, maxPages: a.max_pages, renderMode, useFallback: a.use_fallback, maxCostUsd: a.max_cost_usd };
      const path = `/projects/${await resolveProject(a.project_id)}/audits`;
      if (a.dry_run) return rest("POST", `${path}?dryRun=1`, body);
      if (((renderMode && renderMode !== "off") || a.use_fallback) && a.max_cost_usd == null) {
        const pages = a.max_pages ?? 100;
        const worst = estimateAudit(pages, renderMode ?? "off", a.use_fallback ?? false).max;
        throw new Error(`Rendering and the fallback are paid (up to $${worst.toFixed(2)} for ${pages} pages). Pass max_cost_usd to cap what this audit may spend.`);
      }
      return rest("POST", path, body);
    },
  );
  tool(
    "list_site_audits",
    "Past and running audits for the project with status, pages crawled and health score.",
    { project_id: projectId },
    async (a) => rest("GET", `/projects/${await resolveProject(a.project_id)}/audits`),
    true,
  );
  tool(
    "get_site_audit",
    "One audit: status, health score, crawl summary and issue counts by type with an explanation and fix for each.",
    { audit_id: z.string().uuid() },
    (a) => rest("GET", `/audits/${a.audit_id}`),
    true,
  );
  tool(
    "get_audit_issues",
    "The affected URLs for an audit's issues, optionally one issue type or severity. change filters against the previous audit: new (on a page crawled for the first time), added (appeared on a page crawled both times), removed (fixed) or missing (page no longer crawled).",
    {
      audit_id: z.string().uuid(),
      type: z.string().optional(),
      severity: z.enum(["critical", "warning", "info"]).optional(),
      change: z.enum(["new", "added", "removed", "missing"]).optional(),
      indexable: z.boolean().optional().describe("Links and Content issues are split by page: true for indexable pages, false for non-indexable ones (one severity lower)"),
      limit: z.number().int().min(1).max(1000).optional(),
      offset: z.number().int().min(0).optional(),
    },
    (a) => {
      const query = new URLSearchParams();
      if (a.type) query.set("type", a.type);
      if (a.severity) query.set("severity", a.severity);
      if (a.change) query.set("change", a.change);
      if (a.indexable !== undefined) query.set("indexable", String(a.indexable));
      if (a.limit) query.set("limit", String(a.limit));
      if (a.offset) query.set("offset", String(a.offset));
      return rest("GET", `/audits/${a.audit_id}/issues?${query}`);
    },
    true,
  );
  tool(
    "get_audit_fix_brief",
    "A Markdown brief for fixing a finished audit's issues in code: every issue, worst first, with why it matters, how to fix it, the URL patterns it affects (fix the template once), the most-linked culprits for link issues and sample URLs. Start here when asked to fix a site's technical SEO.",
    { audit_id: z.string().uuid() },
    async (a) => {
      const result = (await rest("GET", `/audits/${a.audit_id}/fix-brief`)) as { markdown?: string };
      return result.markdown ?? result;
    },
    true,
  );
  tool(
    "get_audit_links",
    "Links found by an audit with each target's status: for example every link to a 4xx page (target_status 4xx), every nofollow internal link, or what links to one URL (target). kind: href, redirect, canonical, hreflang, image, script, stylesheet. Only a project's two latest audits keep their links.",
    {
      audit_id: z.string().uuid(),
      source: z.string().optional(),
      target: z.string().optional(),
      kind: z.enum(["href", "redirect", "canonical", "hreflang", "image", "script", "stylesheet"]).optional(),
      target_status: z.enum(["2xx", "3xx", "4xx", "5xx", "uncrawled"]).optional(),
      internal: z.boolean().optional(),
      nofollow: z.boolean().optional(),
      limit: z.number().int().min(1).max(1000).optional(),
      offset: z.number().int().min(0).optional(),
    },
    (a) => {
      const query = new URLSearchParams();
      if (a.source) query.set("source", a.source);
      if (a.target) query.set("target", a.target);
      if (a.kind) query.set("kind", a.kind);
      if (a.target_status) query.set("targetStatus", a.target_status);
      if (a.internal !== undefined) query.set("internal", String(a.internal));
      if (a.nofollow !== undefined) query.set("nofollow", String(a.nofollow));
      if (a.limit) query.set("limit", String(a.limit));
      if (a.offset) query.set("offset", String(a.offset));
      return rest("GET", `/audits/${a.audit_id}/links?${query}`);
    },
    true,
  );

  // ── Local SEO ───────────────────────────────────────────────────────────
  tool(
    "run_geo_grid",
    "Map where a business ranks in Google Maps results for a keyword across a grid of points around it. Costs $0.07 per point: 3x3 $0.63, 5x5 $1.75, 7x7 $3.43, 9x9 $5.67. The price depends only on size: a dry run needs no business. To run it, find the place first with maps_search. Background job; poll get_geo_grid.",
    {
      project_id: projectId,
      keyword: z.string().min(1).optional().describe("Required unless dry_run"),
      place_id: z.string().optional().describe("Place ID from maps_search. Required unless dry_run"),
      place_name: z.string().optional().describe("Required unless dry_run"),
      center_latitude: z.number().optional().describe("Required unless dry_run"),
      center_longitude: z.number().optional().describe("Required unless dry_run"),
      size: z.union([z.literal(3), z.literal(5), z.literal(7), z.literal(9)]).optional(),
      spacing_m: z.number().int().min(100).max(20000).optional().describe("Distance between grid points in metres. Default 1000."),
      max_cost_usd: maxCost.optional().describe("Required unless dry_run"),
      dry_run: dryRun,
    },
    async (a) => {
      const size = a.size ?? 5;
      const cost = estimateGrid(size).max;
      if (a.dry_run) return { dryRun: true, estimate: estimateGrid(size), keyword: a.keyword ?? null, placeName: a.place_name ?? null, size, spacingM: a.spacing_m ?? 1000 };
      if (a.max_cost_usd == null) throw new Error("Pass max_cost_usd, or dry_run: true to see the price first.");
      if (!a.keyword || !a.place_id || !a.place_name || a.center_latitude == null || a.center_longitude == null)
        throw new Error("To run a grid, pass keyword, place_id, place_name, center_latitude and center_longitude (from maps_search).");
      if (cost > a.max_cost_usd) throw new Error(`A ${size}x${size} grid costs $${cost.toFixed(2)}, above max_cost_usd ($${a.max_cost_usd.toFixed(2)}).`);
      return rest("POST", `/projects/${await resolveProject(a.project_id)}/geo-grids`, {
        keyword: a.keyword,
        placeId: a.place_id,
        placeName: a.place_name,
        centerLat: a.center_latitude,
        centerLng: a.center_longitude,
        size,
        spacingM: a.spacing_m ?? 1000,
        maxCostUsd: a.max_cost_usd,
      });
    },
  );
  tool("get_geo_grid", "A geo-grid's status, average position and the position and top results at every point.", { grid_id: z.string().uuid() }, (a) => rest("GET", `/geo-grids/${a.grid_id}`), true);

  // ── Google Search Console (free; the user connects it in the dashboard) ──
  const range = z.enum(["last_7_days", "last_28_days", "last_3_months"]).optional().describe("Default last_28_days. Search Console periods end 3 days ago (its data lag).");
  const gscFilters = {
    device: z.enum(["DESKTOP", "MOBILE", "TABLET"]).optional(),
    country: z.string().length(3).optional().describe("ISO 3166-1 alpha-3 as Search Console uses it, e.g. usa, gbr"),
    page_contains: z.string().optional(),
    query_contains: z.string().optional(),
  };
  const gscParams = (a: { range?: string; device?: string; country?: string; page_contains?: string; query_contains?: string }) => {
    const query = new URLSearchParams();
    if (a.range) query.set("range", a.range);
    if (a.device) query.set("device", a.device);
    if (a.country) query.set("country", a.country);
    if (a.page_contains) query.set("pageText", a.page_contains);
    if (a.query_contains) query.set("queryText", a.query_contains);
    return query;
  };
  tool(
    "get_google_connections",
    "Whether the project has Google Search Console connected, and which property. If not, ask the user to connect it in the dashboard under Search performance; agents cannot connect it.",
    { project_id: projectId },
    async (a) => {
      const data = (await rest("GET", `/projects/${await resolveProject(a.project_id)}/google`)) as Json;
      return { configured: data.configured, gsc: data.gsc };
    },
    true,
  );
  tool(
    "get_search_performance",
    "Search Console clicks, impressions, CTR and average position for the period against the one before, a daily series, the countries seen, and striking-distance queries (each query's best page at positions 5 to 20, by impressions). Free.",
    { project_id: projectId, range, ...gscFilters },
    async (a) => rest("GET", `/projects/${await resolveProject(a.project_id)}/search-performance?${gscParams(a)}`),
    true,
  );
  tool(
    "get_search_console_rows",
    "Search Console rows by up to three dimensions (query, page, country, device, date), from the top 1,000 by clicks, optionally filtered by position and impressions. Free.",
    {
      project_id: projectId,
      range,
      dimensions: z.array(z.enum(["query", "page", "country", "device", "date"])).min(1).max(3).optional().describe("Default [query]"),
      min_position: z.number().min(1).optional(),
      max_position: z.number().min(1).optional(),
      min_impressions: z.number().int().min(0).optional(),
      limit: z.number().int().min(1).max(1000).optional().describe("Default 250"),
      ...gscFilters,
    },
    async (a) => {
      const query = gscParams(a);
      if (a.dimensions) query.set("dimensions", a.dimensions.join(","));
      if (a.min_position != null) query.set("minPosition", String(a.min_position));
      if (a.max_position != null) query.set("maxPosition", String(a.max_position));
      if (a.min_impressions != null) query.set("minImpressions", String(a.min_impressions));
      if (a.limit) query.set("limit", String(a.limit));
      return rest("GET", `/projects/${await resolveProject(a.project_id)}/search-console/rows?${query}`);
    },
    true,
  );
  tool(
    "inspect_urls",
    "Google's index status for 1 to 10 URLs of the connected Search Console property: verdict, coverage, robots.txt, last crawl and canonical. Free, but Google limits inspections per day.",
    { project_id: projectId, urls: z.array(z.string().url()).min(1).max(10) },
    async (a) => rest("POST", `/projects/${await resolveProject(a.project_id)}/search-console/inspect`, { urls: a.urls }),
    true,
  );
  tool(
    "get_search_opportunities",
    "Pages ranking at positions 4 to 20 in Search Console, scored 0 to 100 for where a push is most worth it: 0.7 demand (impressions) and 0.3 reachability (how close to the top). Needs Search Console. Free.",
    { project_id: projectId, range },
    async (a) => rest("GET", `/projects/${await resolveProject(a.project_id)}/search-opportunities?range=${a.range ?? "last_28_days"}`),
    true,
  );

  // ── Indexing: the page list, IndexNow and Google's index status (free) ──
  const indexingFilter = z.enum(["all", "suggested", "new", "changed", "reindex", "indexed", "not_indexed", "not_inspected", "excluded", "submitted"]);
  tool(
    "get_indexing_status",
    "A project's indexing overview: page counts (suggested for IndexNow, new, changed, needing Google reindexing, indexed, not indexed, excluded), the IndexNow key, its key-file URL and whether it is verified, the last submission, auto-submit settings, sitemaps found and the last page sync. Free.",
    { project_id: projectId },
    async (a) => rest("GET", `/projects/${await resolveProject(a.project_id)}/indexing`),
    true,
  );
  tool(
    "list_indexing_pages",
    "The project's pages with where each was found (sitemap, audit, Search Console, manual), when it was first seen and last changed, its IndexNow submission and Google's index verdict, coverage, last crawl and reasons to reindex. Filter: suggested = new or changed since IndexNow last heard of it; reindex = Google should look again. Free.",
    { project_id: projectId, filter: indexingFilter.optional(), search: z.string().max(500).optional(), page: z.number().int().min(1).optional(), size: z.number().int().min(1).max(500).optional() },
    async (a) => {
      const q = new URLSearchParams({ filter: a.filter ?? "suggested", page: String(a.page ?? 1), size: String(a.size ?? 50), ...(a.search ? { search: a.search } : {}) });
      return rest("GET", `/projects/${await resolveProject(a.project_id)}/indexing/pages?${q}`);
    },
    true,
  );
  tool(
    "sync_indexing_pages",
    "Rebuild the project's page list now from its sitemaps, latest site audit and Search Console, then (when switched on) submit new and changed pages to IndexNow and inspect pages in Google. Runs in the background; read the result with get_indexing_status. Free.",
    { project_id: projectId },
    async (a) => rest("POST", `/projects/${await resolveProject(a.project_id)}/indexing/sync`),
  );
  tool(
    "verify_indexnow",
    "Check that the project's IndexNow key file is on the site (the user uploads <key>.txt to the site root; get_indexing_status gives the key and URL). Free.",
    { project_id: projectId },
    async (a) => rest("POST", `/projects/${await resolveProject(a.project_id)}/indexing/verify`),
  );
  tool(
    "submit_indexnow",
    "Notify IndexNow (Bing, Yandex, Seznam, Naver, Yep; not Google) of new or changed pages: pass urls, or suggested: true for every page new or changed since it was last submitted. Needs a verified key file. Only submit pages that changed. Free.",
    { project_id: projectId, urls: z.array(z.string().url()).min(1).max(10_000).optional(), suggested: z.boolean().optional() },
    async (a) => {
      if (!a.urls?.length && !a.suggested) throw new Error("Pass urls, or suggested: true");
      return rest("POST", `/projects/${await resolveProject(a.project_id)}/indexing/indexnow`, a.urls?.length ? { urls: a.urls } : { suggested: true });
    },
  );
  tool(
    "get_google_sitemaps",
    "The sitemaps Google has for the connected Search Console property: last submitted, last read, pending, errors, warnings and URLs submitted, and whether OpenSEO may submit sitemaps. Free.",
    { project_id: projectId },
    async (a) => rest("GET", `/projects/${await resolveProject(a.project_id)}/indexing/google-sitemaps`),
    true,
  );
  tool(
    "submit_google_sitemaps",
    "Submit sitemaps to Google Search Console: the given paths, or every sitemap the last page sync found. Needs a Search Console connection with full access. Free.",
    { project_id: projectId, paths: z.array(z.string().url()).max(50).optional() },
    async (a) => rest("POST", `/projects/${await resolveProject(a.project_id)}/indexing/google-sitemaps`, { paths: a.paths }),
  );
  tool(
    "get_gsc_keywords",
    "Every Search Console query from the stored daily sync over 7 to 480 days: clicks, impressions, CTR, average position, the position in the period before and its top page. Filter by text, position and impressions. Longer history than get_search_console_rows and no 1,000-row cap. Free.",
    {
      project_id: projectId,
      days: z.union([z.literal(7), z.literal(28), z.literal(90), z.literal(180), z.literal(365), z.literal(480)]).optional(),
      search: z.string().max(200).optional(),
      min_position: z.number().min(1).optional(),
      max_position: z.number().min(1).optional(),
      min_impressions: z.number().int().min(0).optional(),
      sort: z.enum(["impressions", "clicks", "position"]).optional(),
      limit: z.number().int().min(1).max(1000).optional(),
    },
    async (a) => {
      const q = new URLSearchParams({ days: String(a.days ?? 28), sort: a.sort ?? "impressions", size: String(a.limit ?? 100) });
      if (a.search) q.set("search", a.search);
      if (a.min_position != null) q.set("minPosition", String(a.min_position));
      if (a.max_position != null) q.set("maxPosition", String(a.max_position));
      if (a.min_impressions != null) q.set("minImpressions", String(a.min_impressions));
      return rest("GET", `/projects/${await resolveProject(a.project_id)}/search-console/keywords?${q}`);
    },
    true,
  );
  tool(
    "get_keyword_suggestions",
    "Search Console queries the project is not tracking or saving yet: first those at positions 5 to 20 (one push from page one), then the most impressions. Good input for add_rank_keywords and save_keywords. Free.",
    { project_id: projectId, limit: z.number().int().min(1).max(200).optional() },
    async (a) => rest("GET", `/projects/${await resolveProject(a.project_id)}/search-console/keyword-suggestions?limit=${a.limit ?? 50}`),
    true,
  );

  return server;
}

/**
 * Stateless streamable HTTP: one server and transport per request. Authenticated by an oseo_ API
 * key or, for clients like ChatGPT, an OAuth access token. A 401 points clients at the OAuth
 * metadata (RFC 9728), which is how they discover where to sign in.
 */
export async function registerMcp(app: FastifyInstance) {
  app.route({
    method: ["POST", "GET", "DELETE"],
    url: "/mcp",
    async handler(request, reply) {
      if (request.method !== "POST") {
        return reply.status(405).header("allow", "POST").send({ jsonrpc: "2.0", error: { code: -32000, message: "Method not allowed. This server is stateless; use POST." }, id: null });
      }
      const user = await resolveUser(request);
      if (!user || user.via === "session") {
        const metadata = `${issuer()}/.well-known/oauth-protected-resource`;
        return reply
          .status(401)
          .header("www-authenticate", `Bearer realm="OpenSEO", resource_metadata="${metadata}", scope="${SCOPE}"`)
          .send({ jsonrpc: "2.0", error: { code: -32001, message: "Sign in with OAuth, or send an OpenSEO API key: Authorization: Bearer oseo_… (create one in Settings)." }, id: null });
      }
      const server = buildServer(app, request.headers.authorization as string);
      const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined, enableJsonResponse: true });
      reply.hijack();
      reply.raw.on("close", () => {
        void transport.close();
        void server.close();
      });
      await server.connect(transport);
      await transport.handleRequest(request.raw, reply.raw, request.body);
    },
  });
}
