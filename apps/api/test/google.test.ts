import { createHash } from "node:crypto";
import { eq } from "drizzle-orm";
import { describe, expect, it } from "vitest";
import { db, schema } from "../src/db";
import { decrypt, encrypt } from "../src/lib/crypto";
import { gscPeriods, percentileRanks, safeReturnTo, strikingDistance, totalsOf } from "../src/services/google";
import { readyUser, signUp } from "./client";
import { harness } from "./harness";

type User = Awaited<ReturnType<typeof readyUser>>;

/** Runs the dashboard side of a connection: start, then Google's redirect back with a code. */
async function startConnect(user: { api: User["api"] }, provider: "gsc", returnTo = "/p/x/search") {
  const res = await user.api.request("GET", `/api/google/${provider}/connect?returnTo=${encodeURIComponent(returnTo)}`);
  expect(res.status).toBe(302);
  const url = new URL(String(res.headers.location));
  return { url, state: url.searchParams.get("state") as string };
}

async function callback(user: { api: User["api"] }, provider: "gsc", query: Record<string, string>) {
  const res = await user.api.request("GET", `/api/google/${provider}/callback?${new URLSearchParams(query)}`);
  expect(res.status).toBe(302);
  return new URL(String(res.headers.location));
}

async function connected(provider: "gsc", sub = "sub-1") {
  const user = await readyUser();
  const { state } = await startConnect(user, provider, `/p/${user.project.id}/search`);
  await callback(user, provider, { code: `code:${sub}:owner@example.test:${provider}`, state });
  const [account] = await db.select().from(schema.googleAccounts).where(eq(schema.googleAccounts.userId, user.userId));
  return { ...user, account: account! };
}

async function withSearchConsole() {
  const user = await connected("gsc");
  await user.api.ok("PUT", `/projects/${user.project.id}/google/gsc`, { accountId: user.account.id, siteUrl: "sc-domain:acme.com" });
  return user;
}

describe("connecting Google", () => {
  it("sends the user to Google with a read-only scope, PKCE and a single-use state", async () => {
    const user = await readyUser();
    const { url, state } = await startConnect(user, "gsc", `/p/${user.project.id}/search`);
    expect(url.pathname).toBe("/auth/o/oauth2/v2/auth");
    expect(Object.fromEntries(url.searchParams)).toMatchObject({
      redirect_uri: "http://localhost:3200/api/google/gsc/callback",
      response_type: "code",
      access_type: "offline",
      prompt: "select_account consent",
      code_challenge_method: "S256",
    });
    expect(url.searchParams.get("scope")).toBe("openid email https://www.googleapis.com/auth/webmasters");
    expect(state.length).toBeGreaterThanOrEqual(43);

    const back = await callback(user, "gsc", { code: "code:sub-9:me@example.test", state });
    expect(back.origin + back.pathname).toBe(`http://localhost:3200/p/${user.project.id}/search`);
    expect(back.searchParams.get("google_connected")).toBe("gsc");

    // The verifier sent to the token endpoint matches the challenge sent to the consent screen.
    const exchange = harness.google.requests.filter((r) => r.path === "/token/token").at(-1)!;
    expect(createHash("sha256").update(exchange.body.code_verifier).digest("base64url")).toBe(url.searchParams.get("code_challenge"));

    // Tokens are stored encrypted, under the Google account ID from the ID token.
    const [account] = await db.select().from(schema.googleAccounts).where(eq(schema.googleAccounts.userId, user.userId));
    expect(account).toMatchObject({ provider: "gsc", googleSub: "sub-9", email: "me@example.test" });
    expect(account!.accessTokenEnc).not.toMatch(/^at-/);
    expect(decrypt(account!.accessTokenEnc)).toMatch(/^at-/);
    expect(decrypt(account!.refreshTokenEnc!)).toBe("rt-sub-9");

    // A replayed callback finds no state.
    const replay = await callback(user, "gsc", { code: "code:sub-9:me@example.test", state });
    expect(replay.searchParams.get("google_error")).toBe("state_mismatch");
  });

  it("refuses a state issued to someone else, an unknown state, and an unticked scope", async () => {
    const owner = await readyUser();
    const { state } = await startConnect(owner, "gsc");
    const other = await signUp();
    expect((await callback(other, "gsc", { code: "code:a:b", state })).searchParams.get("google_error")).toBe("state_mismatch");
    expect((await callback(owner, "gsc", { code: "code:a:b", state: "made-up" })).searchParams.get("google_error")).toBe("state_mismatch");

    const second = await startConnect(owner, "gsc");
    const denied = await callback(owner, "gsc", { code: "code:a:b:noscope", state: second.state });
    expect(denied.searchParams.get("google_error")).toBe("scope_denied");
    expect(await db.select().from(schema.googleAccounts).where(eq(schema.googleAccounts.userId, owner.userId))).toHaveLength(0);

    const third = await startConnect(owner, "gsc", "/p/abc/search");
    const cancelled = await callback(owner, "gsc", { error: "access_denied", state: third.state });
    expect(cancelled.pathname).toBe("/p/abc/search");
    expect(cancelled.searchParams.get("google_error")).toBe("access_denied");
  });

  it("keeps the refresh token when Google leaves it out of a repeat grant", async () => {
    const user = await connected("gsc", "sub-keep");
    const { state } = await startConnect(user, "gsc");
    await callback(user, "gsc", { code: "code:sub-keep:owner@example.test:norefresh", state });
    const rows = await db.select().from(schema.googleAccounts).where(eq(schema.googleAccounts.userId, user.userId));
    expect(rows).toHaveLength(1);
    expect(decrypt(rows[0]!.refreshTokenEnc!)).toBe("rt-sub-keep");
    expect(decrypt(rows[0]!.accessTokenEnc)).not.toBe(decrypt(user.account.accessTokenEnc));
  });

  it("only returns to paths on the dashboard, and only connects from a signed-in session", async () => {
    expect(safeReturnTo("/p/1/search?tab=pages")).toBe("/p/1/search?tab=pages");
    for (const bad of ["//evil.example", "/\\evil.example", "https://evil.example", "", 42]) expect(safeReturnTo(bad)).toBe("/projects");

    const user = await readyUser();
    const { key } = await user.api.ok<{ key: string }>("POST", "/api-keys", { name: "agent" });
    const res = await (await import("./client")).client({ apiKey: key }).request("GET", "/api/google/gsc/connect");
    expect(res.status).toBe(403);
    expect((await user.api.request("GET", "/api/google/bing/connect")).status).toBe(400);
  });
});

describe("Search Console", () => {
  it("lists properties, refuses unverified ones and connects one per project", async () => {
    const user = await connected("gsc");
    const sites = await user.api.ok("GET", `/projects/${user.project.id}/google/gsc/sites?accountId=${user.account.id}`);
    expect(sites).toEqual([
      { siteUrl: "https://other.example/", permissionLevel: "siteUnverifiedUser", verified: false },
      { siteUrl: "sc-domain:acme.com", permissionLevel: "siteOwner", verified: true },
    ]);
    const unverified = await user.api.put(`/projects/${user.project.id}/google/gsc`, { accountId: user.account.id, siteUrl: "https://other.example/" });
    expect(unverified.status).toBe(400);
    expect((await user.api.put(`/projects/${user.project.id}/google/gsc`, { accountId: user.account.id, siteUrl: "sc-domain:nope.com" })).status).toBe(400);
    await user.api.ok("PUT", `/projects/${user.project.id}/google/gsc`, { accountId: user.account.id, siteUrl: "sc-domain:acme.com" });
    const state = await user.api.ok("GET", `/projects/${user.project.id}/google`);
    expect(state).toMatchObject({ configured: true, gsc: { siteUrl: "sc-domain:acme.com", email: "owner@example.test" } });
    expect(state.accounts).toHaveLength(1);
  });

  it("only lets a signed-in session link or unlink a property, not an API key", async () => {
    const user = await connected("gsc");
    const { key } = await user.api.ok<{ key: string }>("POST", "/api-keys", { name: "agent" });
    const agent = (await import("./client")).client({ apiKey: key });
    const base = `/api/projects/${user.project.id}/google`;
    expect((await agent.request("PUT", `${base}/gsc`, { accountId: user.account.id, siteUrl: "sc-domain:acme.com" })).status).toBe(403);
    await user.api.ok("PUT", `/projects/${user.project.id}/google/gsc`, { accountId: user.account.id, siteUrl: "sc-domain:acme.com" });
    expect((await agent.request("DELETE", `${base}/gsc`)).status).toBe(403);
    expect((await user.api.ok("GET", `/projects/${user.project.id}/google`)).gsc).toMatchObject({ siteUrl: "sc-domain:acme.com" });
  });

  it("reports totals against the previous period, striking-distance queries and countries, for free", async () => {
    const user = await withSearchConsole();
    const yepBefore = harness.fake.requests.length;
    const report = await user.api.ok("GET", `/projects/${user.project.id}/search-performance?range=last_7_days&device=MOBILE`);
    expect(harness.fake.requests.length).toBe(yepBefore);
    expect(report.periods).toEqual(gscPeriods("last_7_days"));
    expect(report.daily).toHaveLength(7);
    expect(report.totals.current.impressions).toBeGreaterThan(0);
    expect(report.totals.previous.impressions).toBeGreaterThan(0);
    for (const row of report.striking) {
      expect(row.position).toBeGreaterThanOrEqual(5);
      expect(row.position).toBeLessThanOrEqual(20);
    }
    const impressions = report.striking.map((r: { impressions: number }) => r.impressions);
    expect(impressions).toEqual([...impressions].sort((a, b) => b - a));
    expect(report.countries.map((c: { country: string }) => c.country).sort()).toEqual(["can", "gbr", "usa"]);
    // The device filter reached Google on the filtered calls.
    const sent = harness.google.requests.filter((r) => r.path.includes("searchAnalytics")).slice(-4);
    expect(sent.every((r) => JSON.stringify(r.body.dimensionFilterGroups).includes("MOBILE"))).toBe(true);
  });

  it("pages through queries by asking for one extra row", async () => {
    const user = await withSearchConsole();
    const table = await user.api.ok("GET", `/projects/${user.project.id}/search-performance/table?dimension=query&size=25&page=1`);
    expect(table).toMatchObject({ page: 1, size: 25, hasMore: false });
    expect(table.rows).toHaveLength(8);
    const sent = harness.google.requests.filter((r) => r.path.includes("searchAnalytics")).at(-1)!;
    expect(sent.body).toMatchObject({ rowLimit: 26, startRow: 0, dimensions: ["query"] });
    expect((await user.api.get(`/projects/${user.project.id}/search-performance/table?size=30`)).status).toBe(400);
  });

  it("inspects URLs and reports a per-URL problem without failing the rest", async () => {
    const user = await withSearchConsole();
    const res = await user.api.ok("POST", `/projects/${user.project.id}/search-console/inspect`, { urls: ["https://acme.com/", "https://acme.com/not-in-property"] });
    expect(res.results[0]).toMatchObject({ verdict: "PASS", coverageState: "Submitted and indexed", error: null });
    expect(res.results[1].error).toMatch(/not in the property/);
  });

  it("refreshes an expired token, and asks to reconnect when the grant was revoked", async () => {
    const user = await withSearchConsole();
    await db.update(schema.googleAccounts).set({ expiresAt: new Date(Date.now() - 1000) }).where(eq(schema.googleAccounts.id, user.account.id));
    await user.api.ok("GET", `/projects/${user.project.id}/search-performance`);
    expect(harness.google.requests.some((r) => r.path === "/token/token" && r.body.grant_type === "refresh_token")).toBe(true);
    const [refreshed] = await db.select().from(schema.googleAccounts).where(eq(schema.googleAccounts.id, user.account.id));
    expect(refreshed!.expiresAt.getTime()).toBeGreaterThan(Date.now());

    await db
      .update(schema.googleAccounts)
      .set({ expiresAt: new Date(Date.now() - 1000), refreshTokenEnc: encrypt("revoked") })
      .where(eq(schema.googleAccounts.id, user.account.id));
    const res = await user.api.get(`/projects/${user.project.id}/search-performance`);
    expect(res.status).toBe(409);
    expect(res.body.error?.code).toBe("google_reconnect_required");
  });

  it("asks to connect first, and keeps accounts and reports private", async () => {
    const user = await readyUser();
    const res = await user.api.get(`/projects/${user.project.id}/search-performance`);
    expect(res.status).toBe(409);
    expect(res.body.error?.code).toBe("google_not_connected");

    const owner = await withSearchConsole();
    const other = await readyUser();
    expect((await other.api.get(`/projects/${other.project.id}/google/gsc/sites?accountId=${owner.account.id}`)).status).toBe(404);
    expect((await other.api.put(`/projects/${other.project.id}/google/gsc`, { accountId: owner.account.id, siteUrl: "sc-domain:acme.com" })).status).toBe(404);
    expect((await other.api.get(`/projects/${owner.project.id}/search-performance`)).status).toBe(404);
    expect((await other.api.delete(`/google/accounts/${owner.account.id}`)).status).toBe(404);
  });

  it("removing a Google account disconnects every project that used it", async () => {
    const user = await withSearchConsole();
    expect(await user.api.ok("DELETE", `/google/accounts/${user.account.id}`)).toEqual({ projects: 1 });
    expect((await user.api.ok("GET", `/projects/${user.project.id}/google`)).gsc).toBeNull();
  });
});

describe("search opportunities", () => {
  it("scores pages at positions 4 to 20 on demand and reachability", async () => {
    const user = await withSearchConsole();
    const { pages } = await user.api.ok("GET", `/projects/${user.project.id}/search-opportunities`);
    expect(pages.length).toBeGreaterThan(0);
    for (const page of pages) {
      expect(page.position).toBeGreaterThanOrEqual(4);
      expect(page.position).toBeLessThanOrEqual(20);
      expect(Object.keys(page.parts)).toEqual(["demand", "reachability"]);
    }
    const scores = pages.map((p: { score: number }) => p.score);
    expect(scores).toEqual([...scores].sort((a, b) => b - a));
  });
});

describe("Google helpers", () => {
  it("ends periods three days ago, with an equal previous period before", () => {
    const periods = gscPeriods("last_7_days", new Date("2026-10-15T12:00:00Z"));
    expect(periods).toEqual({ current: { startDate: "2026-10-06", endDate: "2026-10-12" }, previous: { startDate: "2026-09-29", endDate: "2026-10-05" } });
  });

  it("weights position by impressions and keeps each query's best page in striking distance", () => {
    expect(totalsOf([{ clicks: 10, impressions: 100, ctr: 0.1, position: 2 }, { clicks: 0, impressions: 300, ctr: 0, position: 10 }])).toEqual({ clicks: 10, impressions: 400, ctr: 2.5, position: 8 });
    expect(totalsOf([])).toEqual({ clicks: 0, impressions: 0, ctr: null, position: null });
    const rows = [
      { keys: ["a", "/1"], clicks: 1, impressions: 50, ctr: 0, position: 12 },
      { keys: ["a", "/2"], clicks: 1, impressions: 900, ctr: 0, position: 25 },
      { keys: ["b", "/1"], clicks: 1, impressions: 70, ctr: 0, position: 3 },
      { keys: ["c", "/3"], clicks: 1, impressions: 80, ctr: 0, position: 20.6 },
      { keys: ["d", "/4"], clicks: 1, impressions: 60, ctr: 0, position: 19.96 },
    ];
    // a: its best page (/1 at 12) counts, not the higher-impression one at 25. b is already top 3,
    // c just past 20. Most impressions first.
    expect(strikingDistance(rows).map((r) => [r.query, r.page])).toEqual([
      ["d", "/4"],
      ["a", "/1"],
    ]);
  });

  it("ranks values", () => {
    expect(percentileRanks([10, 20, 20, 40])).toEqual([0, 1 / 3, 1 / 3, 1]);
    expect(percentileRanks([5])).toEqual([1]);
  });
});
