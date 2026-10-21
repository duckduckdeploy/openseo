import { afterEach, describe, expect, it, vi } from "vitest";
import { analyseAnswer, brandKey, cleanSources, cleanSourceUrl, firstMention, isBrandedPrompt, proseForMatching, resolveCitation } from "./brand-analysis";
import { hostMatches, toDomain } from "./domain";
import { buildGrid } from "./geo";
import { firstRunAt, nextRunAfter } from "./pool";

describe("firstMention", () => {
  it("matches whole words only, case-insensitively", () => {
    expect(firstMention("Try acme for this", ["Acme"])).toBe(4);
    expect(firstMention("Acmeology is unrelated", ["Acme"])).toBe(-1);
    expect(firstMention("Use Ahrefs (ahrefs.com).", ["ahrefs.com"])).toBe(12);
  });
});

describe("analyseAnswer", () => {
  const brands = [
    { name: "Acme", domain: "acme.com", aliases: ["Acme Tools"] },
    { name: "Globex", domain: "globex.io" },
    { name: "Initech" },
  ];

  it("orders brands by first mention and detects citations by domain", () => {
    const hits = analyseAnswer(
      "Globex is the usual pick. Acme Tools is a newer option.",
      [{ url: "https://blog.acme.com/guide" }, { url: "https://example.org" }, { url: "https://globex.io/pricing" }],
      brands,
    );
    expect(hits).toEqual([
      { name: "Acme", mentioned: true, cited: true, position: 2 },
      { name: "Globex", mentioned: true, cited: true, position: 1 },
      { name: "Initech", mentioned: false, cited: false, position: null },
    ]);
  });

  it("reports cited without a mention", () => {
    const [own] = analyseAnswer("No names here.", [{ url: "https://www.acme.com/" }], brands);
    expect(own).toEqual({ name: "Acme", mentioned: false, cited: true, position: null });
  });

  it("does not count links, emails or citation markers as mentions", () => {
    for (const text of [
      "See https://acme.com/guide for details.",
      "Read more at www.acme.com today.",
      "Sources: [acme.com](https://acme.com/guide) and [1](https://acme.com).",
      "Write to hello@acme.com for help.",
    ]) {
      expect(analyseAnswer(text, [], brands)[0]?.mentioned, text).toBe(false);
    }
  });

  it("still counts the brand in link text that is words, and in plain prose", () => {
    expect(analyseAnswer("Try [Acme Tools](https://acme.com) first.", [], brands)[0]).toMatchObject({ mentioned: true, position: 1 });
    expect(analyseAnswer("Many teams use acme.com for this [2].", [], brands)[0]?.mentioned).toBe(true);
  });

  it("counts a named brand with a domain only when the answer points to that domain", () => {
    // A different product with the same name, linked to its own site.
    expect(analyseAnswer("Acme is a solid choice.", [{ url: "https://acme.so/features" }], brands)[0]).toEqual({ name: "Acme", mentioned: false, cited: false, position: null });
    expect(analyseAnswer("Acme is a solid choice.", [], brands)[0]?.mentioned).toBe(false);
    // The domain in a source, a link, a bare URL or the prose ties the name to the brand.
    expect(analyseAnswer("Acme is a solid choice.", [{ url: "https://docs.acme.com/" }], brands)[0]).toMatchObject({ mentioned: true, cited: true, position: 1 });
    expect(analyseAnswer("Acme is a solid choice ([site](https://acme.com/)).", [], brands)[0]).toMatchObject({ mentioned: true, cited: false });
    expect(analyseAnswer("Acme is a solid choice, see www.acme.com.", [], brands)[0]?.mentioned).toBe(true);
    expect(analyseAnswer("Acme (acme.com) is a solid choice.", [], brands)[0]?.mentioned).toBe(true);
    // Not a lookalike host.
    expect(analyseAnswer("Acme is a solid choice.", [{ url: "https://notacme.com/" }], brands)[0]?.mentioned).toBe(false);
    // A brand without a domain is still matched by name.
    expect(analyseAnswer("Initech works too.", [], brands)[2]).toMatchObject({ mentioned: true, position: 1 });
  });

  it("orders only the brands the answer points to", () => {
    const hits = analyseAnswer("Acme first, then Globex.", [{ url: "https://globex.io/" }], brands);
    expect(hits.slice(0, 2)).toEqual([
      { name: "Acme", mentioned: false, cited: false, position: null },
      { name: "Globex", mentioned: true, cited: true, position: 1 },
    ]);
  });

  it("keeps positions in answer order after blanking", () => {
    const hits = analyseAnswer("[1] https://acme.com Globex (globex.io) comes first, then Acme.", [], brands);
    expect(hits.slice(0, 2)).toEqual([
      { name: "Acme", mentioned: true, cited: false, position: 2 },
      { name: "Globex", mentioned: true, cited: false, position: 1 },
    ]);
  });
});

describe("resolveCitation", () => {
  afterEach(() => vi.unstubAllGlobals());
  const grounding = { url: "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQ", title: "acme.com" };

  it("follows a Gemini grounding redirect to the cited page", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response(null, { status: 302, headers: { location: "https://www.acme.com/guide" } })));
    expect(await resolveCitation(grounding)).toEqual({ url: "https://www.acme.com/guide" });
  });

  it("falls back to the domain Gemini gives as the title when the redirect can't be followed", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => { throw new Error("offline"); }));
    const resolved = await resolveCitation(grounding);
    expect(resolved).toEqual({ url: "https://acme.com/" });
    // So an answer that names the brand and cites it through Gemini counts as both.
    expect(analyseAnswer("Acme is a solid choice.", [resolved!], [{ name: "Acme", domain: "acme.com" }])[0]).toMatchObject({ mentioned: true, cited: true });
  });
});

describe("proseForMatching", () => {
  it("keeps the length of the text", () => {
    const text = "A [b](https://c.d) e [1] f@g.hi www.x.y";
    expect(proseForMatching(text)).toHaveLength(text.length);
  });
});

describe("firstMention", () => {
  it("ignores terms under two characters", () => {
    expect(firstMention("X marks the spot", ["X"])).toBe(-1);
    expect(firstMention("Use HP for this", ["HP"])).toBe(4);
  });
});

describe("branded prompts", () => {
  const acme = { name: "Acme", aliases: ["Acme Tools"], domain: "acme.com" };
  it("detects prompts that name the brand, an alias or its domain", () => {
    expect(isBrandedPrompt("Is Acme any good?", acme)).toBe(true);
    expect(isBrandedPrompt("acme tools vs globex", acme)).toBe(true);
    expect(isBrandedPrompt("Reviews of acme.com", acme)).toBe(true);
    expect(isBrandedPrompt("Best plumbing software?", acme)).toBe(false);
  });

  it("keys answers by brand name and domain", () => {
    expect(brandKey({ name: " Acme ", domain: "Acme.com" })).toBe("acme|acme.com|url");
    expect(brandKey({ name: "Acme" })).toBe("acme|");
  });
});

describe("cleanSources", () => {
  it("strips tracking parameters and fragments, drops duplicates and non-web links", () => {
    expect(
      cleanSources([
        { url: "https://acme.com/guide?utm_source=chatgpt.com&id=4#top", title: "Guide" },
        { url: "https://acme.com/guide?id=4&gclid=abc" },
        { url: "mailto:hi@acme.com" },
        { url: "not a url" },
        { url: "https://globex.io/?fbclid=1&msclkid=2" },
      ]),
    ).toEqual([{ url: "https://acme.com/guide?id=4", title: "Guide" }, { url: "https://globex.io/" }]);
    expect(cleanSourceUrl("ftp://acme.com/file")).toBeNull();
  });
});

describe("domain helpers", () => {
  it("normalises input and matches subdomains", () => {
    expect(toDomain("https://www.Example.com/path?q=1")).toBe("example.com");
    expect(hostMatches("blog.example.com", "example.com")).toBe(true);
    expect(hostMatches("notexample.com", "example.com")).toBe(false);
  });
});

describe("schedules", () => {
  const at = (iso: string) => new Date(iso);

  it("places a new schedule one period out, between 04:00 and 09:59 UTC", () => {
    const now = at("2026-10-15T17:42:00Z");
    expect(firstRunAt("manual", now)).toBeNull();
    expect(firstRunAt("daily", now, () => 0)?.toISOString()).toBe("2026-10-16T04:00:00.000Z");
    expect(firstRunAt("weekly", now, () => 0.999)?.toISOString()).toBe("2026-10-22T09:59:00.000Z");
    expect(firstRunAt("monthly", now, () => 0.5)?.toISOString()).toBe("2026-11-15T07:00:00.000Z");
  });

  it("advances from the anchor, not from when the run happened, so it does not drift", () => {
    const anchor = at("2026-10-15T05:30:00Z");
    // The tick that claims it runs 4 minutes late; the next run keeps 05:30.
    expect(nextRunAfter("weekly", anchor, at("2026-10-15T05:34:00Z"))?.toISOString()).toBe("2026-10-22T05:30:00.000Z");
    // A worker that was down for days skips the missed periods instead of running them back to back.
    expect(nextRunAfter("daily", anchor, at("2026-10-18T12:00:00Z"))?.toISOString()).toBe("2026-10-19T05:30:00.000Z");
    expect(nextRunAfter("manual", anchor)).toBeNull();
  });

  it("keeps the day of the month, or the last day when the month is shorter", () => {
    const now = at("2026-01-31T06:00:00Z");
    expect(nextRunAfter("monthly", at("2026-01-31T06:00:00Z"), now)?.toISOString()).toBe("2026-02-28T06:00:00.000Z");
    expect(nextRunAfter("monthly", at("2026-03-15T06:00:00Z"), at("2026-03-15T06:00:00Z"))?.toISOString()).toBe("2026-04-15T06:00:00.000Z");
  });

  it("returns to the schedule's own day after a short month instead of drifting to the 28th", () => {
    // Set up on the 31st: February is clamped, March and April go back to the 31st (or the last day).
    const feb = nextRunAfter("monthly", at("2026-01-31T06:00:00Z"), at("2026-01-31T06:00:00Z"), 31) as Date;
    expect(feb.toISOString()).toBe("2026-02-28T06:00:00.000Z");
    const mar = nextRunAfter("monthly", feb, feb, 31) as Date;
    expect(mar.toISOString()).toBe("2026-03-31T06:00:00.000Z");
    expect(nextRunAfter("monthly", mar, mar, 31)?.toISOString()).toBe("2026-04-30T06:00:00.000Z");
    // An anchor that is not a clamped last day keeps its own day, whatever the hint says.
    expect(nextRunAfter("monthly", at("2026-03-15T06:00:00Z"), at("2026-03-15T06:00:00Z"), 31)?.toISOString()).toBe("2026-04-15T06:00:00.000Z");
    // A worker down for months still lands on the schedule's day.
    expect(nextRunAfter("monthly", feb, at("2026-05-01T00:00:00Z"), 30)?.toISOString()).toBe("2026-05-30T06:00:00.000Z");
  });
});

describe("buildGrid", () => {
  it("centres the grid and spaces points by the requested distance", () => {
    const grid = buildGrid(30.2672, -97.7431, 3, 1000);
    expect(grid).toHaveLength(9);
    const centre = grid[4];
    expect(centre).toMatchObject({ row: 1, col: 1, lat: 30.2672, lng: -97.7431 });
    const north = grid[1];
    expect(((north?.lat ?? 0) - 30.2672) * 111_320).toBeCloseTo(1000, 0);
    expect(grid[0]?.lng).toBeLessThan(grid[2]?.lng ?? 0);
  });
});
