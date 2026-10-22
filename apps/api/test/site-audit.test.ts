import http from "node:http";
import type { AddressInfo } from "node:net";
import { ISSUE_TYPES } from "@openseo/crawler";
import { eq } from "drizzle-orm";
import { strFromU8, unzipSync } from "fflate";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { dataDb, schema } from "../src/db";
import { processAudit } from "../src/services/audit";
import { APP_ORIGIN, getApp, readyUser } from "./client";
import { harness } from "./harness";

/**
 * A small site served locally and crawled for real, twice: version 2 fixes the broken link,
 * renames a page and starts redirecting a sitemap URL, so the second audit has history to show.
 */
let server: http.Server;
let base = "";
let version = 1;
const WORDS = Array.from({ length: 60 }, (_, i) => `Sentence ${i} about the fixture shop and its products.`).join(" ");

function site(): Record<string, (res: http.ServerResponse) => void> {
  const page = (title: string, body: string, head = "") => (res: http.ServerResponse) => {
    res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    res.end(
      `<!doctype html><html lang="en"><head><title>${title}</title><meta name="description" content="A long enough description of ${title} for the audit fixture site."><meta name="viewport" content="width=device-width">${head}</head><body>${body}</body></html>`,
    );
  };
  return {
    "/robots.txt": (res) => {
      res.writeHead(200, { "content-type": "text/plain" });
      res.end(`User-agent: *\nAllow: /\n\nUser-agent: GPTBot\nDisallow: /\n\nSitemap: ${base}/sitemap.xml\n`);
    },
    "/sitemap.xml": (res) => {
      res.writeHead(200, { "content-type": "application/xml" });
      res.end(`<?xml version="1.0"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${["/", "/about", "/legacy"].map((p) => `<url><loc>${base}${p}</loc></url>`).join("")}</urlset>`);
    },
    "/": page(
      "Home of the fixture shop",
      `<h1>Shop</h1><p>${WORDS}</p><a href="/about">About</a> <a href="/blocked">Members</a> <img src="/logo.png">` +
        (version === 1 ? `<a href="/missing">Old offer</a>` : ""),
    ),
    "/about": page(version === 1 ? "About the fixture shop" : "About our fixture shop and team", `<h1>About</h1><p>${WORDS}</p><a href="/">Home</a>`),
    "/legacy":
      version === 1
        ? page("A legacy page still in the sitemap", `<h1>Legacy</h1><p>${WORDS}</p><a href="/">Home</a>`)
        : (res) => {
            res.writeHead(301, { location: "/about" });
            res.end();
          },
    "/blocked": (res) => {
      res.writeHead(403, { "content-type": "text/html" });
      res.end("<html><body>Access denied</body></html>");
    },
    "/logo.png": (res) => {
      res.writeHead(200, { "content-type": "image/png", "content-length": "1200" });
      res.end(Buffer.alloc(1200));
    },
  };
}

beforeAll(async () => {
  server = http.createServer((req, res) => {
    const handler = site()[new URL(req.url ?? "/", "http://x").pathname];
    if (handler) return handler(res);
    res.writeHead(404, { "content-type": "text/html" });
    res.end("<html><head><title>Not found</title></head><body>404</body></html>");
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
});

afterAll(async () => {
  server.closeAllConnections();
  await new Promise((resolve) => server.close(resolve));
});

const crawlLocally = () => ({ allowPrivateNetwork: true, allowedPorts: [Number(new URL(base).port)], delayMs: 0, concurrency: 2 });

async function download(cookie: string, path: string) {
  const res = await (await getApp()).inject({ method: "GET", url: `/api${path}`, headers: { cookie, origin: APP_ORIGIN } });
  return { status: res.statusCode, headers: res.headers, bytes: res.rawPayload, text: res.rawPayload.toString("utf8") };
}

describe("site audit end to end", () => {
  let user: Awaited<ReturnType<typeof readyUser>>;
  let first: { id: string };
  let second: { id: string };

  beforeAll(async () => {
    user = await readyUser();
    version = 1;
    first = await user.api.ok("POST", `/projects/${user.project.id}/audits`, { startUrl: `${base}/`, maxPages: 50, useFallback: true, maxCostUsd: 1 });
    await processAudit(first.id, crawlLocally());
    version = 2;
    second = await user.api.ok("POST", `/projects/${user.project.id}/audits`, { startUrl: `${base}/`, maxPages: 50, useFallback: true, maxCostUsd: 1 });
    await processAudit(second.id, crawlLocally());
  });

  it("crawls, scores and groups issues by report section", async () => {
    const audit = await user.api.ok("GET", `/audits/${first.id}`);
    expect(audit).toMatchObject({ status: "completed", trigger: "manual", useFallback: true, previous: null });
    expect(audit.healthScore).toBeGreaterThan(0);
    expect(audit.healthScore).toBeLessThan(100);
    expect(audit.aiScore).toBeGreaterThan(0);
    const broken = audit.issueGroups.find((g: { type: string }) => g.type === "broken-page");
    expect(broken).toMatchObject({ severity: "critical", category: "Internal pages", title: "4XX page", urls: 1 });
    expect(audit.summary.aiDiscoverability.bots.find((b: { token: string }) => b.token === "GPTBot")).toMatchObject({ allowed: false });
  });

  it("gets past a blocked page through the YepAPI fallback and records the spend", async () => {
    const audit = await user.api.ok("GET", `/audits/${first.id}`);
    expect(audit.summary.paid).toMatchObject({ unblocked: 1, budgetReached: false, unavailable: null });
    expect(audit.costUsd).toBeCloseTo(0.03, 5);
    expect(harness.fake.requests.some((r) => r.path === "/v1/scrape/stealth" && r.body.url === `${base}/blocked`)).toBe(true);
    const { pages } = await user.api.ok("GET", `/audits/${first.id}/pages?q=blocked`);
    expect(pages[0]).toMatchObject({ status: 200, title: "Fetched through residential proxies" });
  });

  it("stores the link graph with each target's status", async () => {
    const { links, total } = await user.api.ok("GET", `/audits/${first.id}/links?targetStatus=4xx`);
    expect(total).toBe(1);
    expect(links[0]).toMatchObject({ source: `${base}/`, target: `${base}/missing`, kind: "href", anchor: "Old offer", targetStatus: 404 });
    const images = await user.api.ok("GET", `/audits/${first.id}/links?kind=image`);
    expect(images.links[0]).toMatchObject({ target: `${base}/logo.png`, anchor: null });
    const resources = await user.api.ok("GET", `/audits/${first.id}/resources?type=image`);
    expect(resources.resources[0]).toMatchObject({ url: `${base}/logo.png`, status: 200, sizeBytes: 1200, broken: false });
  });

  it("compares with the previous audit", async () => {
    const audit = await user.api.ok("GET", `/audits/${second.id}`);
    expect(audit.previous).toMatchObject({ id: first.id });
    const group = (type: string) => audit.issueGroups.find((g: { type: string }) => g.type === type);
    // The broken link is gone: the 4XX page is no longer crawled, the link issue is fixed.
    expect(group("broken-page")).toMatchObject({ count: 0, before: 1, missing: 1 });
    expect(group("broken-internal-link")).toMatchObject({ count: 0, before: 1, removed: 1 });
    expect(group("title-changed")).toMatchObject({ count: 1, isChange: true, category: "Changes" });
    // On a URL crawled both times, so "added" (Ahrefs' meaning); links issues carry their page's indexability.
    expect(group("redirect-in-sitemap")).toMatchObject({ count: 1, added: 1, new: 0 });
    expect(group("broken-internal-link")).toMatchObject({ key: "broken-internal-link:indexable", indexable: true, severity: "critical" });

    const removed = await user.api.ok("GET", `/audits/${second.id}/issues?change=removed`);
    expect(removed.issues.map((i: { type: string; url: string }) => [i.type, i.url])).toContainEqual(["broken-internal-link", `${base}/`]);
    const missing = await user.api.ok("GET", `/audits/${second.id}/issues?change=missing&type=broken-page`);
    expect(missing.issues.map((i: { url: string }) => i.url)).toEqual([`${base}/missing`]);
    const changed = await user.api.ok("GET", `/audits/${second.id}/issues?type=title-changed`);
    expect(changed.issues[0]).toMatchObject({ url: `${base}/about`, change: "added" });
    expect(changed.issues[0].detail).toContain("About our fixture shop and team");
  });

  it("exports one issue as CSV, with its links file", async () => {
    const csv = await download(user.cookie, `/audits/${first.id}/export/issue/broken-page.csv`);
    expect(csv.status).toBe(200);
    expect(csv.headers["content-type"]).toContain("text/csv");
    expect(csv.headers["content-disposition"]).toMatch(/attachment; filename="127.0.0.1_\d{4}-\d{2}-\d{2}_Error-4XX_page.csv"/);
    expect(csv.text.startsWith("﻿\"URL\",\"PR\",\"HTTP status code\"")).toBe(true);
    expect(csv.text).toContain(`"${base}/missing"`);

    const links = await download(user.cookie, `/audits/${first.id}/export/issue/broken-page-links.csv`);
    const rows = links.text.trim().split("\r\n");
    expect(rows[0]).toContain('"Source URL"');
    expect(rows.slice(1)).toEqual([expect.stringContaining(`"href","false","${base}/","200","${base}/missing","404","Old offer"`)]);

    expect((await download(user.cookie, `/audits/${first.id}/export/issue/meta-refresh-redirect-links.csv`)).status).toBe(404);
    expect((await download(user.cookie, `/audits/${first.id}/export/issue/not-a-type.csv`)).status).toBe(404);
  });

  it("exports every issue as a zip with an index and the AI fix brief", async () => {
    const res = await download(user.cookie, `/audits/${first.id}/export/issues.zip`);
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toBe("application/zip");
    const files = unzipSync(new Uint8Array(res.bytes));
    const names = Object.keys(files);
    expect(names).toEqual(expect.arrayContaining(["index.txt", "AI-fix-brief.md", "Error-404_page.csv", "Error-4XX_page.csv", "Error-4XX_page-links.csv", "Error-indexable-Page_has_links_to_broken_page.csv"]));
    expect(strFromU8(files["index.txt"]!).split("\r\n").filter(Boolean)).toHaveLength(names.length - 1);
    expect(strFromU8(files["Error-4XX_page.csv"]!)).toContain(`"${base}/missing"`);
  });

  it("writes a fix brief a coding agent can act on", async () => {
    const { markdown } = await user.api.ok("GET", `/audits/${first.id}/fix-brief`);
    expect(markdown).toMatch(/^# Technical SEO fix brief: /);
    expect(markdown).toContain("## How to use this brief");
    expect(markdown.indexOf("## Errors")).toBeLessThan(markdown.indexOf("## Warnings"));
    expect(markdown).toContain("### Page has links to broken page — 1 URL");
    expect(markdown).toContain(`${base}/missing (HTTP 404), linked from 1 page`);
    const md = await download(user.cookie, `/audits/${first.id}/fix-brief?format=md`);
    expect(md.headers["content-type"]).toContain("text/markdown");
  });

  it("exports site-wide bulk files", async () => {
    const urls = await download(user.cookie, `/audits/${first.id}/export/bulk/internal-urls.csv`);
    expect(urls.text.trim().split("\r\n").length - 1).toBe((await user.api.ok("GET", `/audits/${first.id}/pages`)).total);
    const noAlt = await download(user.cookie, `/audits/${first.id}/export/bulk/images-without-alt.csv`);
    expect(noAlt.text).toContain(`"${base}/logo.png"`);
    expect((await download(user.cookie, `/audits/${first.id}/export/bulk/nope.csv`)).status).toBe(404);
    const list = await user.api.ok("GET", `/audits/${first.id}/exports`);
    expect(list.issues[0].severity).toBe("critical");
    expect(list.bulk.map((b: { kind: string }) => b.kind)).toContain("uncrawled-links");
  });

  it("keeps the link tables of the latest two audits only", async () => {
    version = 2;
    const third = await user.api.ok("POST", `/projects/${user.project.id}/audits`, { startUrl: `${base}/`, maxPages: 50 });
    await processAudit(third.id, crawlLocally());
    const firstLinks = await dataDb.select().from(schema.auditLinks).where(eq(schema.auditLinks.auditId, first.id));
    expect(firstLinks).toHaveLength(0);
    expect((await user.api.ok("GET", `/audits/${first.id}/links`)).linksKept).toBe(false);
    expect((await user.api.ok("GET", `/audits/${second.id}/links`)).total).toBeGreaterThan(0);
    // Pages and issues stay, so the history still works.
    expect((await user.api.ok("GET", `/audits/${first.id}/pages`)).total).toBeGreaterThan(0);
  });
});

describe("the Site Audit tool", () => {
  it("runs one-off audits outside any project, capped at the tool's page limit", async () => {
    const { api, cookie } = await readyUser();
    expect((await api.post("/tools/site-audits", { startUrl: `${base}/`, maxPages: 501 })).status).toBe(400);
    expect((await api.post("/tools/site-audits", {})).status).toBe(400);
    const audit = await api.ok("POST", "/tools/site-audits", { startUrl: `${base}/`, maxPages: 20 });
    expect(audit).toMatchObject({ projectId: null, trigger: "tool", renderMode: "off", useFallback: false });
    await processAudit(audit.id, crawlLocally());
    expect((await api.ok("GET", `/audits/${audit.id}`)).status).toBe("completed");
    expect((await api.ok("GET", "/tools/site-audits")).map((a: { id: string }) => a.id)).toEqual([audit.id]);
    expect((await download(cookie, `/audits/${audit.id}/export/issues.zip`)).status).toBe(200);

    // Another user can neither see it nor open it.
    const other = await readyUser();
    expect(await other.api.ok("GET", "/tools/site-audits")).toEqual([]);
    expect((await other.api.get(`/audits/${audit.id}`)).status).toBe(404);
  });
});

describe("site audit settings and schedules", () => {
  it("saves settings that later runs use, and schedules them", async () => {
    const { api, project } = await readyUser();
    expect(await api.ok("GET", `/projects/${project.id}/audit-settings`)).toBeNull();
    const saved = await api.ok("PUT", `/projects/${project.id}/audit-settings`, { maxPages: 250, renderMode: "auto", useFallback: true, maxCostUsd: 2, exclude: ["/cart*"], schedule: "monthly" });
    expect(saved).toMatchObject({ maxPages: 250, renderMode: "auto", useFallback: true, maxCostUsd: 2, exclude: ["/cart*"], schedule: "monthly" });
    expect(new Date(saved.nextRunAt).getTime()).toBeGreaterThan(Date.now());

    // auto + fallback on 250 pages could reach $12.50; the cap holds it at $2.
    expect((await api.ok("POST", `/projects/${project.id}/audits?dryRun=1`, {})).estimate).toEqual({ min: 0, max: 2 });
    const audit = await api.ok("POST", `/projects/${project.id}/audits`, {});
    expect(audit).toMatchObject({ maxPages: 250, renderMode: "auto", useFallback: true, maxCostUsd: 2, options: { exclude: ["/cart*"] } });

    expect((await api.put(`/projects/${project.id}/audit-settings`, { renderMode: "always", maxPages: 900 })).status).toBe(400);
  });

  it("lists every issue type with its report section", async () => {
    const { api } = await readyUser();
    const catalog = await api.ok("GET", "/audit/issue-catalog");
    expect(Object.keys(catalog)).toHaveLength(ISSUE_TYPES.length);
    expect(catalog["broken-redirect"]).toMatchObject({ severity: "critical", category: "Redirects" });
  });
});
