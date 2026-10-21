import { eq } from "drizzle-orm";
import { describe, expect, it } from "vitest";
import { dataDb, schema } from "../src/db";
import { getYep, monthSpend } from "../src/lib/yep";
import { processRankRun } from "../src/services/rank";
import { readyUser } from "./client";
import { harness } from "./harness";

async function settled(userId: string, total: number) {
  // Usage rows are written just after each call returns.
  for (let i = 0; i < 50 && (await monthSpend(userId)) < total - 1e-9; i++) await new Promise((r) => setTimeout(r, 10));
}

describe("monthly budget", () => {
  it("refuses paid lookups once the month's spend reaches the limit", async () => {
    const { api, project, userId } = await readyUser();
    // Its three parts ($0.08, $0.04, $0.02) run together and each reserves its price, so the last
    // one starts at $0.12: under this limit, then the month is over it.
    await api.ok("PUT", "/settings/budget", { monthlyBudgetUsd: 0.13 });
    await api.ok("POST", `/projects/${project.id}/lookups/domain_overview`, { domain: "a.com" }); // $0.14
    await settled(userId, 0.14);

    const before = harness.fake.requests.length;
    const res = await api.post(`/projects/${project.id}/lookups/backlinks_summary`, { target: "a.com" });
    expect(res.status).toBe(402);
    expect(res.body.error).toMatchObject({ code: "budget_reached" });
    expect(harness.fake.requests.length).toBe(before);

    // Free things keep working: cached results, dry runs and the balance.
    expect((await api.ok("POST", `/projects/${project.id}/lookups/domain_overview`, { domain: "a.com" })).cached).toBe(true);
    expect((await api.ok("POST", `/projects/${project.id}/lookups/backlinks_summary?dryRun=1`, { target: "a.com" })).dryRun).toBe(true);
    expect((await api.ok("GET", "/balance")).balanceUsd).toBe(5);
  });

  it("sees spend made by other clients of the same user while a client is in use", async () => {
    const { userId, api } = await readyUser();
    await api.ok("PUT", "/settings/budget", { monthlyBudgetUsd: 0.1 });
    // Two clients created together, as two overlapping runs would be.
    const first = await getYep({ userId, feature: "test" });
    const second = await getYep({ userId, feature: "test" });

    await first.domain.overview({ domain: "a.com" }); // $0.08
    await settled(userId, 0.08);
    await second.domain.whois({ domain: "a.com" }); // $0.02, total $0.10
    await settled(userId, 0.1);

    // The second client spent only $0.02 itself, but the month has reached the limit.
    await expect(second.domain.whois({ domain: "a.com" })).rejects.toMatchObject({ code: "budget_reached" });
    await expect(first.domain.whois({ domain: "a.com" })).rejects.toMatchObject({ code: "budget_reached" });
    // Free calls stay available.
    await expect(second.account.balance()).resolves.toMatchObject({ costUsd: 0 });
  });

  it("counts calls in flight, so calls made together cannot all pass the limit", async () => {
    const { userId, api } = await readyUser();
    await api.ok("PUT", "/settings/budget", { monthlyBudgetUsd: 0.1 });
    const yep = await getYep({ userId, feature: "test" });
    const before = harness.fake.requests.length;
    // $0.08 each. The first reserves its price before any of them has a usage row, so the second
    // still fits ($0.08 < $0.10) and the third sees $0.16 and is refused.
    const results = await Promise.allSettled([1, 2, 3].map(() => yep.domain.overview({ domain: "a.com" })));
    expect(results.filter((r) => r.status === "fulfilled")).toHaveLength(2);
    expect(results.filter((r) => r.status === "rejected").map((r) => (r as PromiseRejectedResult).reason)).toMatchObject([{ code: "budget_reached" }]);
    expect(harness.fake.requests.length - before).toBe(2);
  });

  it("pays once when the same lookup is made twice at the same time", async () => {
    const { api, project } = await readyUser();
    const before = harness.fake.requests.length;
    const [first, second] = await Promise.all([
      api.ok("POST", `/projects/${project.id}/lookups/domain_overview`, { domain: "same.com" }),
      api.ok("POST", `/projects/${project.id}/lookups/domain_overview`, { domain: "same.com" }),
    ]);
    const paid = harness.fake.requests.length - before;
    expect(paid).toBeGreaterThan(0);
    // Only one of them called YepAPI and was charged; the other shared its result.
    expect([first.cached, second.cached].sort()).toEqual([false, true]);
    expect(first.data).toEqual(second.data);
    await api.ok("POST", `/projects/${project.id}/lookups/domain_overview`, { domain: "other.com" });
    expect(harness.fake.requests.length - before).toBe(2 * paid);
  });

  it("stops a background rank run at the limit instead of finishing it", async () => {
    const { api, project, userId } = await readyUser();
    const tracker = await api.ok("POST", `/projects/${project.id}/trackers`, {
      domain: "acme.com",
      locationCode: 2840,
      locationName: "United States",
      schedule: "manual",
      keywords: Array.from({ length: 30 }, (_, i) => `budget keyword ${i}`),
    });
    await api.ok("PUT", "/settings/budget", { monthlyBudgetUsd: 0.25 });
    const run = await api.ok("POST", `/trackers/${tracker.id}/runs`);
    await processRankRun(run.id);

    const [stored] = await dataDb.select().from(schema.rankRuns).where(eq(schema.rankRuns.id, run.id));
    expect(stored?.status).toBe("failed");
    expect(stored?.error).toMatch(/spending limit/);
    // Checks already in flight (four at a time, $0.10 each) may complete, so the month ends a little over.
    await settled(userId, 0.25);
    const spent = await monthSpend(userId);
    expect(spent).toBeGreaterThanOrEqual(0.25);
    expect(spent).toBeLessThan(0.25 + 4 * 0.1 + 1e-9);
    expect(stored?.done).toBeLessThan(30);
  });
});
