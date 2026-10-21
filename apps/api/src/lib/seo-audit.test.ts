import { describe, expect, it } from "vitest";
import { backlinkGap, findings, keywordGapOpportunities, pickCompetitors, strikingDistance, topicWords } from "./seo-audit";

const row = (domain: string, intersections: number) => ({ domain, intersections, organicCount: 1000, organicEtv: 5000, avgPosition: 10 });

describe("pickCompetitors", () => {
  it("leaves out the domain itself and platforms, most shared keywords first", () => {
    const rows = [row("acme.com", 9000), row("www.youtube.com", 8000), row("reddit.com", 7000), row("amazon.co.uk", 6500), row("globex.io", 500), row("initech.com", 900), row("x.ai", 100)];
    expect(pickCompetitors("acme.com", rows, 3).map((r) => r.domain)).toEqual(["initech.com", "globex.io", "x.ai"]);
  });
});

describe("strikingDistance", () => {
  it("ranks positions 4 to 20 by the visits a top-3 spot could add", () => {
    const rows = strikingDistance([
      { keyword: "top", position: 2, volume: 9000, traffic: 1300 },
      { keyword: "small", position: 5, volume: 200, traffic: 10 },
      { keyword: "big", position: 12, volume: 5000, traffic: 50 },
      { keyword: "far", position: 35, volume: 9000, traffic: 5 },
    ]);
    expect(rows.map((r) => r.keyword)).toEqual(["big", "small"]);
    expect(rows[0]).toMatchObject({ position: 12, extraVisits: 450 });
  });
});

describe("keywordGapOpportunities", () => {
  it("puts easier worthwhile keywords first", () => {
    const rows = keywordGapOpportunities([
      { keyword: "hard", volume: 10000, difficulty: 95 },
      { keyword: "easy", volume: 3000, difficulty: 10 },
      { keyword: "none", volume: 0, difficulty: 0 },
    ]);
    expect(rows.map((r) => r.keyword)).toEqual(["easy", "hard"]);
  });

  it("keeps the gap on topic: no other sites' names, no adult terms, nothing unrelated", () => {
    // What Semrush ranks for and an SEO blog does not, as seen live for backlinko.com.
    const topic = topicWords(["seo tools", "google trends", "backlink checker", "spotify statistics"]);
    const rows = keywordGapOpportunities(
      [
        { keyword: "stripchat", volume: 6120000, difficulty: 0, intent: "informational" },
        { keyword: "ome.tv", volume: 4090000, difficulty: 41, intent: "navigational" },
        { keyword: "asian porn", volume: 450000, difficulty: 0, intent: "informational" },
        { keyword: "word counter", volume: 1220000, difficulty: 65, intent: "informational" },
        { keyword: "seo checker", volume: 5400, difficulty: 63, intent: "commercial" },
        { keyword: "free backlink checker", volume: 2900, difficulty: 30, intent: "commercial" },
        // One shared brand word is not enough (seen live for zapier.com against techradar.com).
        { keyword: "google doodle", volume: 6120000, difficulty: 39, intent: "informational" },
        { keyword: "tryst link", volume: 90000, difficulty: 10, intent: "informational" },
      ],
      topic,
    );
    expect(rows.map((r) => r.keyword)).toEqual(["free backlink checker", "seo checker"]);
  });
});

describe("backlinkGap", () => {
  it("keeps sites that link to competitors but not to the domain, those linking to both first", () => {
    const rows = backlinkGap(
      [
        { domain: "a.com", links: { "1": { rank: 300 } }, targets: { "1": true, "2": false, "3": false } },
        { domain: "b.com", links: { "1": { rank: 100 }, "2": { rank: 100 } }, targets: { "1": true, "2": true, "3": false } },
        { domain: "c.com", links: { "1": { rank: 500 } }, targets: { "1": true, "2": false, "3": true } },
        { domain: "medium.com", links: { "1": { rank: 900 } }, targets: { "1": true, "2": true, "3": false } },
        // Seen live: the audited domain listed as linking to its competitors.
        { domain: "acme.com", links: { "1": { rank: 800 } }, targets: { "1": true, "2": true, "3": false } },
        { domain: "blog.globex.io", links: { "1": { rank: 800 } }, targets: { "1": true, "2": true, "3": false } },
      ],
      ["globex.io", "initech.com"],
      "acme.com",
    );
    expect(rows).toEqual([
      { domain: "b.com", linksTo: ["globex.io", "initech.com"], rank: 100 },
      { domain: "a.com", linksTo: ["globex.io"], rank: 300 },
    ]);
  });
});

describe("findings", () => {
  const base = {
    domain: "acme.com",
    organicKeywords: 500,
    organicTraffic: 2000,
    domainRating: 40,
    referringDomains: 300,
    movement: { new: 20, up: 30, down: 10, lost: 5 },
    positions: { top3: 20, top10: 80, page2: 60 },
    topPageShare: null,
    striking: [],
    keywordGap: { competitor: null, keywords: [] },
    backlinkGap: { competitors: [], domains: [] },
  };

  it("says nothing it has no number for", () => {
    expect(findings(base)).toEqual([]);
  });

  it("puts high-severity findings first and states their numbers", () => {
    const out = findings({
      ...base,
      domainRating: 12,
      movement: { new: 5, up: 0, down: 0, lost: 40 },
      topPageShare: { url: "https://acme.com/", share: 0.7 },
      striking: strikingDistance([{ keyword: "big", position: 12, volume: 9000, traffic: 50 }]),
    });
    expect(out.map((f) => f.id)).toEqual(["striking-distance", "losing-rankings", "low-authority", "traffic-concentration"]);
    expect(out[0]?.detail).toContain('"big" at position 12');
    expect(out[0]?.detail).toContain("850");
    expect(out.find((f) => f.id === "losing-rankings")?.detail).toContain("40 keywords dropped");
  });

  it("flags a site with no rankings", () => {
    expect(findings({ ...base, organicKeywords: 0, organicTraffic: 0 })[0]).toMatchObject({ id: "no-rankings", severity: "high" });
  });
});
