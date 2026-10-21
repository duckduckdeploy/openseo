import { describe, expect, it } from "vitest";
import { readyUser } from "./client";
import { harness } from "./harness";

const callsTo = (path: string, since: number) => harness.fake.requests.slice(since).filter((r) => r.path === path);

describe("SEO audit", () => {
  it("prices the whole audit with a dry run and spends nothing", async () => {
    const { api, project } = await readyUser();
    const before = harness.fake.requests.length;
    const priced = await api.ok("POST", `/projects/${project.id}/lookups/seo_audit?dryRun=1`, { domain: "acme.com" });
    expect(priced.estimate.min).toBeGreaterThan(0.4);
    expect(priced.estimate.max).toBeLessThan(1);
    expect(harness.fake.requests.length).toBe(before);
  });

  it("audits a domain in one call: overview, keywords, backlinks, competitors and opportunities", async () => {
    const { api, project } = await readyUser();
    const before = harness.fake.requests.length;
    const res = await api.ok("POST", `/projects/${project.id}/lookups/seo_audit`, { domain: "https://www.Acme.com/" });
    const data = res.data;

    expect(data.domain).toBe("acme.com");
    expect(data.summary).toMatchObject({ domainRating: expect.any(Number), organicTraffic: 48210, organicKeywords: 3120, referringDomains: 1280 });
    expect(data.summary.positions).toEqual({ top3: 150, top10: 670, page2: 700 });
    expect(data.keywords.top.length).toBeGreaterThan(0);
    expect(data.pages.top.length).toBeGreaterThan(0);
    expect(data.backlinks.referringDomains.length).toBeGreaterThan(0);

    // The domain itself and platforms are left out of the comparison; the top two others are compared.
    expect(data.competitors.map((c: { domain: string }) => c.domain)).not.toContain("acme.com");
    const compared = data.competitors.filter((c: { compared: boolean }) => c.compared).map((c: { domain: string }) => c.domain);
    expect(compared).toEqual(["example.com", "globex.io"]);
    expect(callsTo("/v1/seo/competitors/keywords", before)[0]?.body).toMatchObject({ domain1: "example.com", domain2: "acme.com", intersections: false, filters: [{ field: "difficulty", op: "<=", value: 60 }] });
    expect(callsTo("/v1/seo/backlinks/domain-intersection", before)[0]?.body).toMatchObject({ targets: ["example.com", "globex.io", "acme.com"], intersection_mode: "partial" });

    const { strikingDistance, keywordGap, backlinkGap } = data.opportunities;
    expect(strikingDistance.length).toBeGreaterThan(0);
    for (const row of strikingDistance) expect(row.position).toBeGreaterThanOrEqual(4);
    expect(keywordGap.competitor).toBe("example.com");
    expect(keywordGap.keywords.length).toBeGreaterThan(0);
    expect(backlinkGap.competitors).toEqual(["example.com", "globex.io"]);
    expect(backlinkGap.domains.length).toBeGreaterThan(0);
    expect(data.findings.map((f: { id: string }) => f.id)).toEqual(expect.arrayContaining(["striking-distance", "keyword-gap", "backlink-gap"]));
    expect(data).not.toHaveProperty("errors");

    // Cached: running it again is free and calls nothing.
    const mark = harness.fake.requests.length;
    expect(await api.ok("POST", `/projects/${project.id}/lookups/seo_audit`, { domain: "acme.com" })).toMatchObject({ cached: true, costUsd: 0 });
    expect(harness.fake.requests.length).toBe(mark);
  });

  it("compares with the competitors it is given", async () => {
    const { api, project } = await readyUser();
    const before = harness.fake.requests.length;
    const res = await api.ok("POST", `/projects/${project.id}/lookups/seo_audit`, { domain: "acme.com", competitors: ["Initech.com"] });
    expect(res.data.opportunities.keywordGap.competitor).toBe("initech.com");
    expect(callsTo("/v1/seo/backlinks/domain-intersection", before)[0]?.body).toMatchObject({ targets: ["initech.com", "acme.com"] });
  });

  it("runs standalone, with no project", async () => {
    const { api } = await readyUser();
    const res = await api.ok("POST", "/lookups/seo_audit?locationCode=2826&country=gb&language=en", { domain: "acme.co.uk" });
    expect(res.data.domain).toBe("acme.co.uk");
  });
});
