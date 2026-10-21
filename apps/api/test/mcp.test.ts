import { describe, expect, it } from "vitest";
import { getApp, readyUser, signUp, YEP_KEY } from "./client";
import { harness } from "./harness";

let id = 0;

async function rpc(auth: { apiKey?: string; cookie?: string }, method: string, params: Record<string, unknown> = {}) {
  const headers: Record<string, string> = { accept: "application/json, text/event-stream", "content-type": "application/json" };
  if (auth.apiKey) headers.authorization = `Bearer ${auth.apiKey}`;
  if (auth.cookie) headers.cookie = auth.cookie;
  const res = await (await getApp()).inject({ method: "POST", url: "/mcp", headers, payload: { jsonrpc: "2.0", id: ++id, method, params } });
  return { status: res.statusCode, body: res.body ? JSON.parse(res.body) : null };
}

async function agent() {
  const user = await readyUser();
  const { key } = await user.api.ok<{ key: string }>("POST", "/api-keys", { name: "agent" });
  const call = async (name: string, args: Record<string, unknown> = {}) => {
    const res = await rpc({ apiKey: key }, "tools/call", { name, arguments: args });
    const result = res.body.result as { content: { text: string }[]; isError?: boolean };
    const text = result.content[0]?.text ?? "";
    return { isError: result.isError === true, text, json: (() => { try { return JSON.parse(text); } catch { return null; } })() };
  };
  return { ...user, key, call };
}

describe("MCP server", () => {
  it("only accepts OpenSEO API keys, not browser sessions", async () => {
    const user = await readyUser();
    expect((await rpc({}, "tools/list")).status).toBe(401);
    expect((await rpc({ cookie: user.cookie }, "tools/list")).status).toBe(401);
    const app = await getApp();
    expect((await app.inject({ method: "GET", url: "/mcp" })).statusCode).toBe(405);
  });

  it("initialises and lists all 67 tools, with spending controls on every lookup", async () => {
    const { key } = await agent();
    const init = await rpc({ apiKey: key }, "initialize", { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "test", version: "1" } });
    expect(init.body.result.serverInfo.name).toBe("openseo");
    const { body } = await rpc({ apiKey: key }, "tools/list");
    const tools = body.result.tools as { name: string; inputSchema: { properties: Record<string, unknown> } }[];
    expect(tools).toHaveLength(67);
    // Google tools are free and read-only.
    for (const name of ["get_google_connections", "get_search_performance", "get_search_console_rows", "inspect_urls", "get_analytics_overview", "get_analytics_landing_pages", "get_search_opportunities"]) {
      const found = tools.find((t) => t.name === name) as { annotations?: { readOnlyHint?: boolean }; inputSchema: { properties: Record<string, unknown> } } | undefined;
      expect(found?.annotations?.readOnlyHint, name).toBe(true);
      expect(found?.inputSchema.properties).not.toHaveProperty("max_cost_usd");
    }
    const ideas = tools.find((t) => t.name === "keyword_ideas")!;
    expect(Object.keys(ideas.inputSchema.properties)).toEqual(expect.arrayContaining(["project_id", "max_cost_usd", "dry_run", "refresh"]));
    expect(tools.find((t) => t.name === "run_rank_check")!.inputSchema.properties).toHaveProperty("max_cost_usd");
  });

  it("uses the only project when project_id is left out, and dry runs spend nothing", async () => {
    const { call, project } = await agent();
    expect((await call("list_projects")).json[0].id).toBe(project.id);
    const before = harness.fake.requests.length;
    const priced = await call("keyword_ideas", { keyword: "plumber", dry_run: true });
    // Agents get 50 rows unless they ask for more, so the default price is lower than in the app.
    expect(priced.json).toMatchObject({ dryRun: true, estimate: { max: 0.05 } });
    expect(harness.fake.requests.length).toBe(before);
    const ran = await call("keyword_ideas", { keyword: "plumber", limit: 10 });
    expect(ran.json.data.keywords).toHaveLength(10);
  });

  it("runs lookups standalone when the account has no project yet", async () => {
    const user = await signUp();
    await user.api.ok("PUT", "/settings/yepapi-key", { apiKey: YEP_KEY });
    const { key } = await user.api.ok<{ key: string }>("POST", "/api-keys", { name: "agent" });
    const res = await rpc({ apiKey: key }, "tools/call", { name: "keyword_ideas", arguments: { keyword: "plumber", limit: 5 } });
    const result = res.body.result as { content: { text: string }[]; isError?: boolean };
    expect(result.isError).toBeFalsy();
    expect(JSON.parse(result.content[0]?.text ?? "{}").data.keywords).toHaveLength(5);
  });

  it("reports refusals as tool errors the agent can read", async () => {
    const { call } = await agent();
    const refused = await call("keyword_ideas", { keyword: "plumber", limit: 500, max_cost_usd: 0.05 });
    expect(refused.isError).toBe(true);
    expect(refused.text).toMatch(/above the \$0\.05 ceiling/);
  });

  it("accepts a ceiling equal to the price it documents (no floating-point refusals)", async () => {
    const { call } = await agent();
    const grid = await call("run_geo_grid", {
      keyword: "plumber",
      place_id: "place_1",
      place_name: "Globex Pipes",
      center_latitude: 30.27,
      center_longitude: -97.74,
      size: 3,
      max_cost_usd: 0.63,
    });
    expect(grid.isError).toBe(false);
    const audit = await call("start_site_audit", { start_url: "https://example.com", max_pages: 35, render_js: true, max_cost_usd: 0.7 });
    expect(audit.isError).toBe(false);
    const tooLow = await call("run_geo_grid", { keyword: "x", place_id: "p", place_name: "p", center_latitude: 0, center_longitude: 0, size: 3, max_cost_usd: 0.62 });
    expect(tooLow.isError).toBe(true);
  });

  it("creates rank trackers as manual unless a schedule is asked for", async () => {
    const { call } = await agent();
    const created = await call("create_rank_tracker", { domain: "acme.com", location_code: 2840, location_name: "United States", keywords: ["plumber"] });
    expect(created.json).toMatchObject({ schedule: "manual", nextRunAt: null });
    const { body } = await rpc({ apiKey: (await agent()).key }, "tools/list");
    const tool = (body.result.tools as { name: string; description: string }[]).find((t) => t.name === "create_rank_tracker")!;
    expect(tool.description).toMatch(/paid run every period/);
  });

  it("keeps lookup answers small for agents: 50 rows by default, cost first, trends only on request", async () => {
    const { call, key } = await agent();
    const ran = await call("keyword_ideas", { keyword: "standing desk" });
    expect(Object.keys(ran.json).slice(0, 2)).toEqual(["name", "costUsd"]);
    expect(typeof ran.json.costUsd).toBe("number");
    expect(ran.json.data.keywords).toHaveLength(50);
    expect(ran.json.data.keywords[0]).not.toHaveProperty("trend");
    const withTrend = await call("keyword_ideas", { keyword: "standing desk", limit: 5, include_trend: true });
    expect(withTrend.json.data.keywords[0].trend.length).toBeGreaterThan(0);
    expect(JSON.stringify((await call("list_projects")).json)).not.toContain("userId");
    const { body } = await rpc({ apiKey: key }, "tools/list");
    const description = (body.result.tools as { name: string; description: string }[]).find((t) => t.name === "keyword_ideas")!.description;
    expect(description).toContain("Keyword ideas for a seed keyword");
    expect(description).toContain("Returns 50 rows unless you pass limit.");
  });

  it("prices a geo-grid by size alone, and asks for the business only to run it", async () => {
    const { call } = await agent();
    const before = harness.fake.requests.length;
    expect((await call("run_geo_grid", { size: 5, dry_run: true })).json).toMatchObject({ dryRun: true, estimate: { max: 1.75 }, size: 5 });
    const missing = await call("run_geo_grid", { size: 3, max_cost_usd: 1 });
    expect(missing.isError).toBe(true);
    expect(missing.text).toMatch(/place_id/);
    expect(harness.fake.requests.length).toBe(before);
  });

  it("prices geo-grids, rank checks and audits with dry_run without starting them", async () => {
    const { call } = await agent();
    const before = harness.fake.requests.length;
    const grid = await call("run_geo_grid", { keyword: "plumber", place_id: "place_1", place_name: "Globex Pipes", center_latitude: 30.27, center_longitude: -97.74, size: 3, dry_run: true });
    expect(grid.json).toMatchObject({ dryRun: true, estimate: { max: 0.63 }, size: 3 });
    expect((await call("run_geo_grid", { keyword: "plumber", place_id: "place_1", place_name: "Globex Pipes", center_latitude: 30.27, center_longitude: -97.74 })).isError).toBe(true);
    const audit = await call("start_site_audit", { start_url: "https://example.com", max_pages: 35, render_js: true, dry_run: true });
    expect(audit.json).toMatchObject({ dryRun: true, estimate: { max: 0.7 } });
    expect((await call("list_site_audits")).json).toEqual([]);

    const tracker = (await call("create_rank_tracker", { domain: "acme.com", location_code: 2840, location_name: "United States", keywords: ["a", "b"] })).json;
    const priced = await call("run_rank_check", { tracker_id: tracker.id, dry_run: true });
    expect(priced.json).toMatchObject({ dryRun: true, keywordCount: 2, estimate: { max: 0.2 } });
    expect((await call("run_rank_check", { tracker_id: tracker.id })).isError).toBe(true);
    const tooLow = await call("run_rank_check", { tracker_id: tracker.id, max_cost_usd: 0.19 });
    expect(tooLow.text).toMatch(/above the \$0\.19 ceiling/);
    expect((await call("list_rank_trackers")).json[0].activeRunId).toBeNull();
    expect(harness.fake.requests.length).toBe(before);
  });

  it("creates a project in another market with the right country", async () => {
    const { call } = await agent();
    const created = await call("create_project", { name: "DE", location_code: 2276 });
    expect(created.json).toMatchObject({ country: "de", locationName: "Germany" });
  });

  it("ships skills and a plugin that only name tools that exist", async () => {
    const { readFileSync, readdirSync } = await import("node:fs");
    const root = new URL("../../../", import.meta.url);
    const { key } = await agent();
    const { body } = await rpc({ apiKey: key }, "tools/list");
    const toolNames = new Set((body.result.tools as { name: string }[]).map((t) => t.name));
    // Tool inputs and other identifiers a skill may mention that are not tools.
    const notTools = new Set(["dry_run", "max_cost_usd", "render_js", "last_28_days", "last_3_months", "min_position", "max_position"]);

    const skillsDir = new URL("plugins/openseo/skills/", root);
    const skills = readdirSync(skillsDir);
    expect(skills.sort()).toEqual(["competitor-analysis", "keyword-research", "local-seo", "search-console-review", "seo-audit", "seo-coach", "site-audit"]);
    for (const skill of skills) {
      const text = readFileSync(new URL(`${skill}/SKILL.md`, skillsDir), "utf8");
      expect(text, skill).toMatch(new RegExp(`^---\\nname: ${skill}\\ndescription: .{40,}\\n---`));
      const named = [...text.matchAll(/`([a-z]+(?:_[a-z0-9]+)+)`/g)].map((m) => m[1] as string).filter((n) => !notTools.has(n));
      for (const name of named) expect(toolNames.has(name), `${skill} names ${name}`).toBe(true);
    }

    const plugin = JSON.parse(readFileSync(new URL("plugins/openseo/.claude-plugin/plugin.json", root), "utf8"));
    const marketplace = JSON.parse(readFileSync(new URL(".claude-plugin/marketplace.json", root), "utf8"));
    const mcp = JSON.parse(readFileSync(new URL("plugins/openseo/.mcp.json", root), "utf8"));
    expect(plugin.name).toBe("openseo");
    expect(marketplace.plugins[0]).toMatchObject({ name: "openseo", source: "./plugins/openseo" });
    expect(mcp.mcpServers.openseo).toMatchObject({ type: "http", headers: { Authorization: "Bearer ${OPENSEO_API_KEY}" } });
  });

  it("gives the dashboard this install's agent endpoint for the setup prompt", async () => {
    const { api } = await readyUser();
    expect((await api.ok("GET", "/me")).links).toEqual({ mcpUrl: "http://localhost:4100/mcp", docsUrl: "http://localhost:3101/docs/mcp" });
  });

  it("keeps a lookup's own row ceiling: maps_search returns up to 20, so it defaults to 20", async () => {
    const { call, key } = await agent();
    const { body } = await rpc({ apiKey: key }, "tools/list");
    const maps = (body.result.tools as { name: string; description: string; inputSchema: { properties: { limit: { maximum: number } } } }[]).find((t) => t.name === "maps_search")!;
    expect(maps.inputSchema.properties.limit.maximum).toBe(20);
    expect(maps.description).toContain("Returns 10 rows unless you pass limit.");
    const found = await call("maps_search", { query: "plumber" });
    expect(found.isError).toBe(false);
    expect(found.json.data.results.length).toBeGreaterThan(0);
  });

  it("answers with what an agent reads, not the provider's layout fields", async () => {
    const { call } = await agent();
    expect((await call("autocomplete", { query: "plumber" })).json.data).toEqual({ query: "plumber", suggestions: ["plumber near me", "plumber cost", "plumber best", "plumber vs", "plumber reviews"] });

    const place = (await call("maps_search", { query: "plumber", limit: 2 })).json.data.results[0];
    expect(place).toMatchObject({ id: expect.any(String), name: expect.any(String), photoCount: 1 });
    expect(place).not.toHaveProperty("photos");
    expect(place).not.toHaveProperty("directionsUrl");

    const competitors = (await call("competitors_domain", { domain: "acme.com", limit: 5 })).json.data.competitors as { domain: string }[];
    expect(competitors.map((c) => c.domain)).not.toContain("acme.com");

    const gap = (await call("keyword_gap", { domain: "acme.com", competitor: "globex.com", limit: 2 })).json.data;
    expect(gap).toMatchObject({ mode: "gap", domain: "acme.com", competitor: "globex.com" });
    expect(gap.keywords[0].competitor).toMatchObject({ position: 1, url: "https://globex.com/a-0" });
    expect(gap.keywords[0].yours).toBeUndefined();

    const serp = (await call("serp", { query: "plumber", depth: 10 })).json.data;
    expect(serp.results[0]).toEqual({ position: 1, type: "organic", title: expect.any(String), url: expect.any(String), domain: expect.any(String), description: "Example result." });

    const project = (await call("get_project")).json;
    expect(project).not.toHaveProperty("userId");
    expect(JSON.stringify((await call("get_usage")).json)).not.toContain('"id"');
  });

  it("lists the curated AI models unless asked for all of them", async () => {
    const { call } = await agent();
    const curated = (await call("list_ai_models")).json;
    expect(curated).toHaveProperty("curated");
    expect(curated).not.toHaveProperty("models");
    const all = (await call("list_ai_models", { all: true })).json.models;
    expect(all.length).toBe(curated.otherModels);
    expect(Object.keys(all[0])).toEqual(expect.arrayContaining(["id", "name", "inputPerM", "outputPerM"]));
  });

  it("audits a domain with seo_audit, priced first, and keeps the answer to the head of each list", async () => {
    const { call } = await agent();
    const priced = await call("seo_audit", { domain: "acme.com", dry_run: true });
    expect(priced.json).toMatchObject({ dryRun: true, costUsd: 0 });
    expect(priced.json.estimate.max).toBeLessThan(1);
    const audit = await call("seo_audit", { domain: "acme.com", max_cost_usd: 1 });
    expect(audit.isError).toBe(false);
    expect(Object.keys(audit.json).slice(0, 2)).toEqual(["name", "costUsd"]);
    expect(audit.json.data.findings.length).toBeGreaterThan(0);
    expect(audit.json.data.keywords.top.length).toBeLessThanOrEqual(15);
    expect(audit.json.data.opportunities.strikingDistance.length).toBeGreaterThan(0);
    expect((await call("seo_audit", { domain: "acme.com", max_cost_usd: 0.1 })).isError).toBe(false); // cached: free
    expect((await call("seo_audit", { domain: "globex.io", max_cost_usd: 0.1 })).text).toMatch(/ceiling/);
  });

  it("does not cache an empty Google Trends answer as a result", async () => {
    const { call } = await agent();
    const first = await call("keyword_trends", { keywords: ["no trend data"] });
    expect(first.isError).toBe(true);
    expect(first.text).toMatch(/Google Trends returned no data/);
    const before = harness.fake.requests.length;
    expect((await call("keyword_trends", { keywords: ["no trend data"] })).isError).toBe(true);
    expect(harness.fake.requests.length).toBe(before + 1);
    expect((await call("keyword_trends", { keywords: ["plumber"] })).json.data.timeline.length).toBeGreaterThan(1);
  });

  it("shows a running AI visibility run in the results an agent polls", async () => {
    const { call } = await agent();
    const results = (await call("get_ai_visibility_results")).json;
    expect(results).toHaveProperty("activeRun", null);
  });

  it("tells the agent to have Search Console connected, then reads it once it is", async () => {
    const { call, api, project } = await agent();
    const before = await call("get_search_performance");
    expect(before.isError).toBe(true);
    expect(before.text).toMatch(/Connect Google Search Console/);
    expect((await call("get_google_connections")).json).toMatchObject({ configured: true, gsc: null, ga4: null });

    // The user connects it in the dashboard.
    const start = await api.request("GET", "/api/google/gsc/connect");
    const state = new URL(String(start.headers.location)).searchParams.get("state")!;
    await api.request("GET", `/api/google/gsc/callback?code=code:mcp:a@example.test&state=${state}`);
    const accounts = await api.ok<{ id: string }[]>("GET", "/google/accounts");
    await api.ok("PUT", `/projects/${project.id}/google/gsc`, { accountId: accounts[0]!.id, siteUrl: "sc-domain:acme.com" });

    const rows = await call("get_search_console_rows", { dimensions: ["query", "page"], min_position: 5, max_position: 20, limit: 10 });
    expect(rows.isError).toBe(false);
    expect(rows.json.rows.length).toBeGreaterThan(0);
    expect(rows.json.rows.length).toBeLessThanOrEqual(10);
    for (const row of rows.json.rows) {
      expect(row).toHaveProperty("query");
      expect(row).toHaveProperty("page");
      expect(row.position).toBeGreaterThanOrEqual(5);
      expect(row.position).toBeLessThanOrEqual(20);
    }
  });
});
