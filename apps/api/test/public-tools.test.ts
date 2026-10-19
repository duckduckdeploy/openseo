import { describe, expect, it, vi } from "vitest";

// The free tools read their key and limits from the environment at import time.
vi.hoisted(() => {
  Object.assign(process.env, { PUBLIC_TOOLS_YEPAPI_KEY: "yep_sk_test_0123456789", PUBLIC_TOOLS_PER_DAY: "2", PUBLIC_TOOLS_DAILY_USD: "5", CLIENT_IP_HEADER: "x-test-ip" });
});

const { eq } = await import("drizzle-orm");
const { db, schema } = await import("../src/db");
const { ensurePublicToolsAccount, PUBLIC_USER_ID } = await import("../src/services/public-tools");
const { getApp } = await import("./client");
const { harness } = await import("./harness");

const WEB = "http://localhost:3101";

async function call(tool: string, body: unknown, ip = "203.0.113.7") {
  const app = await getApp();
  const res = await app.inject({ method: "POST", url: `/public/tools/${tool}`, payload: body as object, headers: { origin: WEB, "x-test-ip": ip } });
  return { status: res.statusCode, body: res.json(), headers: res.headers };
}

describe("free website tools", () => {
  it("runs as the built-in account with the site's key", async () => {
    await ensurePublicToolsAccount();
    const [settings] = await db.select().from(schema.userSettings).where(eq(schema.userSettings.userId, PUBLIC_USER_ID));
    expect(settings?.monthlyBudgetUsd).toBe(30);

    const before = harness.fake.requests.length;
    const res = await call("serp", { keyword: "seo tools" }, "198.51.100.1");
    expect(res.body).toMatchObject({ ok: true, cached: false, remaining: 1 });
    expect(res.status).toBe(200);
    expect(res.headers["access-control-allow-origin"]).toBe(WEB);
    expect(harness.fake.requests.length).toBe(before + 1);

    // The same check again is served from the shared cache, but still counts as a run.
    const again = await call("serp", { keyword: "seo tools" }, "198.51.100.1");
    expect(again.body).toMatchObject({ cached: true, remaining: 0 });
    expect(harness.fake.requests.length).toBe(before + 1);
  });

  it("caps inputs well below the app's and refuses unknown tools", async () => {
    const res = await call("website-traffic", { domains: ["a.com", "b.com", "c.com", "d.com", "e.com", "f.com"] }, "198.51.100.2");
    expect(res.status).toBe(400);
    expect((await call("backlinks", { target: "a.com" }, "198.51.100.2")).status).toBe(404);
    expect((await call("serp", { keyword: "seo tools", country: "zz" }, "198.51.100.2")).status).toBe(400);
  });

  it("limits each visitor to their runs for the day", async () => {
    for (let i = 0; i < 2; i++) expect((await call("ai-overview", { keywords: [`kw ${i}`] })).status).toBe(200);
    const res = await call("ai-overview", { keywords: ["one more"] });
    expect(res.status).toBe(429);
    expect(res.body.error).toMatchObject({ code: "daily_limit" });
  });
});
