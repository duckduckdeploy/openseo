import http from "node:http";
import type { AddressInfo } from "node:net";
import { and, eq } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { dataDb, db, schema } from "../src/db";
import { daysToSync, gscKeywords, gscWindow, keywordSuggestions, positionsFor, syncSearchConsole } from "../src/services/gsc-sync";
import { inProperty, inspectDue, listPages, reindexReasons, sameSite, submitIndexNow, submittable, syncPages, verifyIndexNow } from "../src/services/indexing";
import { readyUser } from "./client";
import { harness } from "./harness";

// Registers the scheduler.tick handler with the recording queue.
await import("../src/jobs/scheduler");

/**
 * A small site served locally. Its sitemap and pages change between syncs to show new, changed
 * and gone pages; its key file is whatever `keyFile` holds.
 */
let server: http.Server;
let base = "";
let keyFile: string | null = null;
let pages: Record<string, string> = {};

beforeAll(async () => {
  server = http.createServer((req, res) => {
    const path = new URL(req.url ?? "/", "http://x").pathname;
    if (path === "/robots.txt") {
      res.writeHead(200, { "content-type": "text/plain" });
      return res.end(`User-agent: *\nAllow: /\nSitemap: ${base}/sitemap.xml\n`);
    }
    if (path === "/sitemap.xml") {
      res.writeHead(200, { "content-type": "application/xml" });
      return res.end(
        `<?xml version="1.0"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${Object.entries(pages)
          .map(([p, lastmod]) => `<url><loc>${base}${p}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}</url>`)
          .join("")}</urlset>`,
      );
    }
    if (keyFile !== null && path.endsWith(".txt")) {
      res.writeHead(200, { "content-type": "text/plain" });
      return res.end(keyFile);
    }
    if (path === "/" || pages[path] !== undefined) {
      res.writeHead(200, { "content-type": "text/html" });
      return res.end(`<html><head><title>${path}</title></head><body>Page ${path}</body></html>`);
    }
    res.writeHead(404);
    res.end("not found");
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
});

afterAll(async () => {
  server.closeAllConnections();
  await new Promise((resolve) => server.close(resolve));
});

const net = () => ({ allowPrivateNetwork: true, allowedPorts: [Number(new URL(base).port)] });

/** A project whose website is the local site. */
async function localProject() {
  const user = await readyUser();
  const [project] = await dataDb.update(schema.projects).set({ domain: new URL(base).host }).where(eq(schema.projects.id, user.project.id)).returning();
  return { ...user, row: project! };
}

async function settingsOf(projectId: string) {
  const [row] = await dataDb.select().from(schema.indexingSettings).where(eq(schema.indexingSettings.projectId, projectId));
  return row!;
}

describe("URL rules", () => {
  it("matches the site with or without www, and IndexNow's host and folder rules", () => {
    expect(sameSite("https://www.acme.com/a", "https://acme.com")).toBe(true);
    expect(sameSite("https://shop.acme.com/a", "https://acme.com")).toBe(false);
    expect(submittable("https://acme.com/blog/post", "https://acme.com/key.txt")).toBe(true);
    expect(submittable("https://www.acme.com/blog/post", "https://acme.com/key.txt")).toBe(false);
    expect(submittable("https://acme.com/blog/post", "https://acme.com/blog/key.txt")).toBe(true);
    expect(submittable("https://acme.com/shop/item", "https://acme.com/blog/key.txt")).toBe(false);
    expect(inProperty("https://www.acme.com/x", "sc-domain:acme.com")).toBe(true);
    expect(inProperty("https://acme.com/x", "https://www.acme.com/")).toBe(false);
  });

  it("explains why Google should look at a page again", () => {
    const base = { url: "https://acme.com/a", goneAt: null, indexable: true, status: 200, googleCanonical: null };
    expect(reindexReasons({ ...base, changedAt: new Date("2026-10-10"), googleCrawledAt: new Date("2026-10-01"), googleCoverage: "Submitted and indexed" })).toEqual(["Changed after Google last crawled it"]);
    expect(reindexReasons({ ...base, changedAt: null, googleCrawledAt: null, googleCoverage: "Discovered - currently not indexed" })).toEqual(["Discovered - currently not indexed"]);
    expect(reindexReasons({ ...base, indexable: false, changedAt: new Date(), googleCrawledAt: new Date(0), googleCoverage: null })).toEqual([]);
  });
});

describe("IndexNow setup", () => {
  it("makes a key, offers the file, and verifies it is on the site", async () => {
    const user = await localProject();
    const summary = await user.api.ok<{ indexnow: { key: string; verifiedAt: string | null } }>("GET", `/projects/${user.project.id}/indexing`);
    expect(summary.indexnow.key).toMatch(/^[0-9a-f]{32}$/);
    expect(summary.indexnow.verifiedAt).toBeNull();

    const file = await user.api.request("GET", `/api/projects/${user.project.id}/indexing/key-file`);
    expect(file.body.raw ?? file.body).toBe(summary.indexnow.key);
    expect(String(file.headers["content-disposition"])).toContain(`${summary.indexnow.key}.txt`);

    keyFile = null;
    const missing = await verifyIndexNow(user.row, net());
    expect(missing.verified).toBe(false);
    expect(missing.error).toMatch(/^No file at http:\/\/127\.0\.0\.1:\d+\/[0-9a-f]{32}\.txt/);

    keyFile = "something-else";
    expect((await verifyIndexNow(user.row, net())).error).toContain('holds "something-else"');

    keyFile = summary.indexnow.key;
    const ok = await verifyIndexNow(user.row, net());
    expect(ok).toMatchObject({ verified: true, error: null, keyUrl: `${base}/${summary.indexnow.key}.txt` });
    const settings = await settingsOf(user.project.id);
    expect(settings.indexnowVerifiedAt).not.toBeNull();
    expect(settings.origin).toBe(base);

    // Losing the file makes the project unverified again.
    keyFile = null;
    await verifyIndexNow(user.row, net());
    expect((await settingsOf(user.project.id)).indexnowVerifiedAt).toBeNull();
  });

  it("checks settings: a key location on another site is refused, a new key needs verifying again", async () => {
    const user = await readyUser();
    const bad = await user.api.request("PATCH", `/api/projects/${user.project.id}/indexing`, { keyLocation: "https://elsewhere.com/key.txt" });
    expect(bad.status).toBe(400);
    const before = await user.api.ok<{ indexnow: { key: string } }>("GET", `/projects/${user.project.id}/indexing`);
    const after = await user.api.ok<{ indexnow: { key: string }; settings: { inspectPerDay: number; autoSubmit: boolean } }>("PATCH", `/projects/${user.project.id}/indexing`, {
      newKey: true,
      autoSubmit: true,
      inspectPerDay: 50,
    });
    expect(after.indexnow.key).not.toBe(before.indexnow.key);
    expect(after.settings).toMatchObject({ inspectPerDay: 50, autoSubmit: true });
  });
});

describe("the page list", () => {
  it("finds pages, then notices new, changed and gone ones, and submits only what changed", async () => {
    const user = await localProject();
    pages = { "/": "", "/about": "2026-09-01", "/old": "" };
    const first = await syncPages(user.project.id, net());
    expect(first.pages).toBe(3);
    // The first sync is the baseline: nothing is "new".
    expect(first.newPages).toBe(0);
    expect(first.sitemaps.found).toEqual([`${base}/sitemap.xml`]);

    // Everything starts as suggested: IndexNow has heard of none of it.
    const suggested = await listPages({ id: user.project.id }, { filter: "suggested" });
    expect(suggested.total).toBe(3);

    keyFile = (await settingsOf(user.project.id)).indexnowKey;
    await verifyIndexNow(user.row, net());
    const sent = await submitIndexNow(user.row, { suggested: true }, "manual", net());
    expect(sent.submitted).toBe(3);
    const request = harness.google.requests.filter((r) => r.path === "/indexnow/indexnow").at(-1)!;
    expect(request.body).toMatchObject({ host: new URL(base).host, key: keyFile, keyLocation: `${base}/${keyFile}.txt` });
    expect(request.body.urlList.sort()).toEqual([`${base}/`, `${base}/about`, `${base}/old`].sort());
    expect((await listPages({ id: user.project.id }, { filter: "suggested" })).total).toBe(0);

    // A new page, a later lastmod and a page dropped from the sitemap.
    pages = { "/": "", "/about": "2026-10-20", "/new": "" };
    await dataDb.update(schema.indexingSettings).set({ createdAt: new Date(Date.now() - 2 * 3_600_000) }).where(eq(schema.indexingSettings.projectId, user.project.id));
    const second = await syncPages(user.project.id, net());
    expect(second).toMatchObject({ pages: 3, newPages: 1, changedPages: 1, gonePages: 1 });
    const now = await listPages({ id: user.project.id }, { filter: "suggested" });
    expect(now.rows.map((r) => r.url).sort()).toEqual([`${base}/about`, `${base}/new`]);
    expect(now.rows.find((r) => r.url.endsWith("/new"))?.isNew).toBe(true);
    const gone = await listPages({ id: user.project.id }, { filter: "excluded" });
    expect(gone.rows.map((r) => r.url)).toEqual([`${base}/old`]);

    // The log keeps each request.
    const log = await user.api.ok<{ urlCount: number; status: number; trigger: string }[]>("GET", `/projects/${user.project.id}/indexing/submissions`);
    expect(log[0]).toMatchObject({ urlCount: 3, status: 200, trigger: "manual" });
  });

  it("submits on its own after a sync when auto-submit is on", async () => {
    const user = await localProject();
    pages = { "/": "", "/a": "" };
    const settings = await user.api.ok<{ indexnow: { key: string } }>("PATCH", `/projects/${user.project.id}/indexing`, { autoSubmit: true });
    keyFile = settings.indexnow.key;
    await verifyIndexNow(user.row, net());
    const summary = await syncPages(user.project.id, net());
    expect(summary.submitted).toBe(2);
    const log = await dataDb.select().from(schema.indexnowSubmissions).where(eq(schema.indexnowSubmissions.projectId, user.project.id));
    expect(log).toHaveLength(1);
    expect(log[0]!.trigger).toBe("auto");
  });

  it("stops and turns unverified when IndexNow refuses the key", async () => {
    const user = await localProject();
    pages = { "/": "" };
    await syncPages(user.project.id, net());
    await dataDb.update(schema.indexingSettings).set({ indexnowKey: "bad-key" }).where(eq(schema.indexingSettings.projectId, user.project.id));
    keyFile = "bad-key";
    await verifyIndexNow(user.row, net());
    await expect(submitIndexNow(user.row, { suggested: true }, "manual", net())).rejects.toMatchObject({ code: "indexnow_error" });
    expect((await settingsOf(user.project.id)).indexnowVerifiedAt).toBeNull();
    expect((await listPages({ id: user.project.id }, { filter: "submitted" })).total).toBe(0);
  });

  it("refuses to submit before the key file is verified", async () => {
    const user = await localProject();
    keyFile = null;
    await expect(submitIndexNow(user.row, { urls: [`${base}/`] }, "manual", net())).rejects.toMatchObject({ code: "indexnow_not_verified" });
  });
});

// ── Search Console ───────────────────────────────────────────────────────────

async function withSearchConsole(code = "code:sub-1:owner@example.test:gsc") {
  const user = await readyUser();
  const start = await user.api.request("GET", `/api/google/gsc/connect?returnTo=${encodeURIComponent(`/p/${user.project.id}/search`)}`);
  const state = new URL(String(start.headers.location)).searchParams.get("state")!;
  await user.api.request("GET", `/api/google/gsc/callback?${new URLSearchParams({ code, state })}`);
  const [account] = await db.select().from(schema.googleAccounts).where(eq(schema.googleAccounts.userId, user.userId));
  await user.api.ok("PUT", `/projects/${user.project.id}/google/gsc`, { accountId: account!.id, siteUrl: "sc-domain:acme.com" });
  return { ...user, account: account! };
}

describe("Search Console sync", () => {
  it("plans recent days, then backfill chunks, never past 16 months", () => {
    const window = gscWindow(new Date("2026-10-26T12:00:00Z"));
    expect(window).toMatchObject({ newest: "2026-10-24", oldest: "2025-06-26" });
    const fresh = daysToSync({ syncedFrom: null, syncedTo: null, backfillDone: false }, new Set(), window);
    expect(fresh.recent).toHaveLength(30);
    expect(fresh.recent.at(-1)).toBe("2026-10-24");
    expect(fresh.backfill).toEqual([]);
    const later = daysToSync({ syncedFrom: "2026-09-25", syncedTo: "2026-10-22", backfillDone: false }, new Set(["2026-10-18"]), window);
    expect(later.recent).toEqual(["2026-10-19", "2026-10-20", "2026-10-21", "2026-10-22", "2026-10-23", "2026-10-24"]);
    expect(later.backfill).toHaveLength(30);
    expect(later.backfill.at(-1)).toBe("2026-09-24");
    const edge = daysToSync({ syncedFrom: "2025-07-01", syncedTo: "2026-10-24", backfillDone: false }, new Set(), window);
    expect(edge.backfill[0]).toBe("2025-06-26");
  });

  it("stores days, serves keywords and suggestions from them, and deletes them on disconnect", async () => {
    const user = await withSearchConsole();
    const today = new Date("2026-10-26T12:00:00Z");
    const first = await syncSearchConsole(user.project.id, today);
    expect(first.days).toBe(30);
    expect(first.rows).toBe(30 * 48);
    const [connection] = await dataDb.select().from(schema.gscConnections).where(eq(schema.gscConnections.projectId, user.project.id));
    expect(connection).toMatchObject({ syncedFrom: "2026-09-25", syncedTo: "2026-10-24", backfillDone: false, syncError: null });

    // The next run walks back another 30 days and refreshes the days that are not final yet.
    // Days older than four days were stored as final, so only the last three come again.
    const second = await syncSearchConsole(user.project.id, today);
    expect(second.days).toBe(33);
    const [after] = await dataDb.select().from(schema.gscConnections).where(eq(schema.gscConnections.projectId, user.project.id));
    expect(after!.syncedFrom).toBe("2026-08-26");

    const keywords = await gscKeywords(user.project.id, { days: 28 });
    expect(keywords.synced).toBe(true);
    expect(keywords.total).toBe(8);
    expect(keywords.rows[0]).toMatchObject({ query: expect.any(String), page: expect.stringContaining("https://acme.com/") });
    expect(keywords.rows[0]!.position).toBeGreaterThan(0);
    expect(keywords.rows[0]!.previousPosition).not.toBeNull();

    const routed = await user.api.ok<{ total: number; rows: { query: string }[] }>("GET", `/projects/${user.project.id}/search-console/keywords?search=plumb&size=10`);
    expect(routed.rows.every((r) => r.query.includes("plumb"))).toBe(true);

    // Saved keywords drop out of the suggestions.
    const before = await keywordSuggestions(user.project.id, 100);
    const saved = before.rows[0]!.query;
    await dataDb.insert(schema.savedKeywords).values({ projectId: user.project.id, keyword: saved, locationCode: 2840, language: "en" });
    const afterSave = await keywordSuggestions(user.project.id, 100);
    expect(afterSave.rows.map((r) => r.query)).not.toContain(saved);
    expect(afterSave.rows.length).toBe(before.rows.length - 1);

    const positions = await positionsFor(user.project.id, ["Plumber Austin", "not a query"]);
    expect(positions.get("plumber austin")?.position).toBeGreaterThan(0);
    expect(positions.has("not a query")).toBe(false);

    await user.api.ok("DELETE", `/projects/${user.project.id}/google/gsc`);
    expect(await dataDb.select().from(schema.gscDaily).where(eq(schema.gscDaily.projectId, user.project.id))).toHaveLength(0);
    expect(await dataDb.select().from(schema.gscDailyTotals).where(eq(schema.gscDailyTotals.projectId, user.project.id))).toHaveLength(0);
  });

  it("queues due syncs from the scheduler", async () => {
    const user = await withSearchConsole();
    harness.enqueued.length = 0;
    await harness.jobs.get("scheduler.tick")!({}, { info() {}, error() {}, warn() {} });
    expect(harness.enqueued).toContainEqual({ name: "gsc.sync", data: { projectId: user.project.id } });
    const [connection] = await dataDb.select().from(schema.gscConnections).where(eq(schema.gscConnections.projectId, user.project.id));
    expect(connection!.nextSyncAt!.getTime()).toBeGreaterThan(Date.now());
  });
});

describe("Google index status", () => {
  it("inspects today's share of pages, stores the verdicts and flags pages to reindex", async () => {
    const user = await withSearchConsole();
    await user.api.ok("PATCH", `/projects/${user.project.id}/indexing`, { inspectPerDay: 2 });
    const url = (path: string) => `https://acme.com${path}`;
    await dataDb.insert(schema.sitePages).values([
      { projectId: user.project.id, url: url("/indexed"), sources: ["sitemap"] },
      { projectId: user.project.id, url: url("/not-indexed"), sources: ["sitemap"] },
      { projectId: user.project.id, url: url("/later"), sources: ["sitemap"] },
    ]);
    const run = await inspectDue({ id: user.project.id });
    expect(run).toEqual({ inspected: 2, left: 0 });
    expect((await inspectDue({ id: user.project.id })).inspected).toBe(0);

    const rows = await dataDb.select().from(schema.sitePages).where(and(eq(schema.sitePages.projectId, user.project.id)));
    const inspected = rows.filter((r) => r.googleInspectedAt);
    expect(inspected).toHaveLength(2);

    const reindex = await user.api.ok<{ rows: { url: string; google: { reindex: string[] } }[] }>("GET", `/projects/${user.project.id}/indexing/pages?filter=reindex`);
    for (const row of reindex.rows) expect(row.google.reindex.length).toBeGreaterThan(0);
    const notIndexed = rows.find((r) => r.url === url("/not-indexed"));
    if (notIndexed?.googleInspectedAt) {
      expect(notIndexed.googleCoverage).toBe("Crawled - currently not indexed");
      expect(reindex.rows.map((r) => r.url)).toContain(url("/not-indexed"));
    }
  });

  it("lists Google's sitemaps and submits sitemaps with full access, not with a read-only grant", async () => {
    const full = await withSearchConsole();
    await dataDb.insert(schema.indexingSettings).values({ projectId: full.project.id, indexnowKey: "k".repeat(32), sitemaps: ["https://acme.com/sitemap.xml", "https://other.com/sitemap.xml"] });
    const listed = await full.api.ok<{ canSubmit: boolean; sitemaps: { path: string; errors: number; submittedUrls: number }[] }>("GET", `/projects/${full.project.id}/indexing/google-sitemaps`);
    expect(listed.canSubmit).toBe(true);
    expect(listed.sitemaps[0]).toMatchObject({ path: "https://acme.com/sitemap.xml", errors: 1, submittedUrls: 42 });
    const sent = await full.api.ok<{ submitted: string[]; outsideProperty: string[] }>("POST", `/projects/${full.project.id}/indexing/google-sitemaps`, {});
    expect(sent).toEqual({ submitted: ["https://acme.com/sitemap.xml"], outsideProperty: ["https://other.com/sitemap.xml"] });
    expect(harness.google.requests.some((r) => r.path.endsWith(`/sitemaps/${encodeURIComponent("https://acme.com/sitemap.xml")}`))).toBe(true);

    const readOnly = await withSearchConsole("code:sub-2:ro@example.test:readonly");
    const refused = await readOnly.api.request("POST", `/api/projects/${readOnly.project.id}/indexing/google-sitemaps`, { paths: ["https://acme.com/sitemap.xml"] });
    expect(refused.status).toBe(403);
    expect(refused.body.error?.code).toBe("google_scope_required");
  });
});
