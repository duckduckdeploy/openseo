import type { GoogleSerpData } from "@openseo/yepapi";
import { describe, expect, it, vi } from "vitest";

// parseSerp and estimateRun are pure; the module's database import is stubbed out.
vi.mock("../db", () => ({ db: {}, schema: {} }));
vi.mock("../lib/yep", () => ({ getYep: vi.fn(), errorMessage: vi.fn(), isFatalForRun: vi.fn() }));

const { estimateRun, parseSerp } = await import("./rank");

const item = (type: string, domain: string, path = "/") => ({
  position: 0,
  type,
  title: `${domain}${path}`,
  url: domain ? `https://${domain}${path}` : "",
  description: "",
  domain,
  data: null as unknown,
});

function serp(results: ReturnType<typeof item>[], extra: Partial<GoogleSerpData> = {}): GoogleSerpData {
  return { query: "q", totalResults: 1, itemTypes: [...new Set(results.map((r) => r.type))], results, ...extra } as GoogleSerpData;
}

describe("parseSerp", () => {
  it("ranks among organic results only, so features do not shift the position", () => {
    const parsed = parseSerp(
      serp([item("paid", "ads.com"), item("organic", "a.com"), item("peopleAlsoAsk", ""), item("organic", "www.acme.com", "/pricing"), item("organic", "b.com")]),
      "acme.com",
      20,
    );
    expect(parsed.position).toBe(2);
    expect(parsed.url).toBe("https://www.acme.com/pricing");
    expect(parsed.features).toEqual(["paid", "peopleAlsoAsk"]);
    expect(parsed.competitors.map((c) => [c.position, c.domain])).toEqual([
      [1, "a.com"],
      [3, "b.com"],
    ]);
  });

  it("matches subdomains but not lookalike domains", () => {
    expect(parseSerp(serp([item("organic", "notacme.com"), item("organic", "blog.acme.com")]), "acme.com", 10).position).toBe(2);
  });

  it("reports not found with the depth that was actually checked", () => {
    const parsed = parseSerp(serp([item("organic", "a.com")], { pagesFetched: 3 }), "acme.com", 50);
    expect(parsed.position).toBeNull();
    expect(parsed.checkedDepth).toBe(30);
    expect(parseSerp(serp([item("organic", "a.com")]), "acme.com", 50).checkedDepth).toBe(50);
  });

  it("detects owned SERP features and local pack presence", () => {
    const parsed = parseSerp(serp([item("featuredSnippet", "acme.com"), item("localPack", "rival.com"), item("organic", "acme.com")]), "acme.com", 10);
    expect(parsed.ownedFeatures).toEqual(["featuredSnippet"]);
    expect(parsed.inLocalPack).toBe(false);
    expect(parseSerp(serp([item("organic", "acme.com")]), "acme.com", 10).inLocalPack).toBeNull();
  });
});

describe("AI Overview citations", () => {
  const overview = (urls: string[]) => ({
    ...item("aiOverview", ""),
    data: { references: urls.map((url) => ({ url, domain: new URL(url).hostname, title: "t", type: "ai_overview_reference" })) },
  });

  it("owns the AI Overview when it cites the domain, though the overview's own url is empty", () => {
    const parsed = parseSerp(serp([overview(["https://rival.com/a", "https://blog.acme.com/guide"]), item("organic", "acme.com")]), "acme.com", 10);
    expect(parsed.features).toContain("aiOverview");
    expect(parsed.ownedFeatures).toEqual(["aiOverview"]);
  });

  it("does not own an AI Overview that cites only others", () => {
    expect(parseSerp(serp([overview(["https://rival.com/a"]), item("organic", "acme.com")]), "acme.com", 10).ownedFeatures).toEqual([]);
  });
});

describe("estimateRun", () => {
  it("prices every check by the tracker's depth: $0.01 per 10 results, per keyword and device", () => {
    expect(estimateRun({ devices: ["desktop", "mobile"], depth: 100 }, 100)).toEqual({ checks: 200, min: 20, max: 20 });
    expect(estimateRun({ devices: ["desktop"], depth: 100 }, 5)).toEqual({ checks: 5, min: 0.5, max: 0.5 });
    expect(estimateRun({ devices: ["desktop"], depth: 50 }, 100)).toEqual({ checks: 100, min: 5, max: 5 });
    expect(estimateRun({ devices: ["desktop", "mobile"], depth: 20 }, 100)).toEqual({ checks: 200, min: 4, max: 4 });
  });
});
