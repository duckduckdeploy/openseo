import { describe, expect, it } from "vitest";
import { cleanDomain, cleanKeyword, cleanKeywords, cleanQuery, cleanTarget, cleanUrl, splitEntries, zDomain, zKeywords } from "./clean";

describe("cleanKeyword", () => {
  it.each([
    ["  SEO   Tools ", "seo tools"],
    ["seo​tools", "seotools"],
    ["seo tools", "seo tools"],
    ["- seo tools", "seo tools"],
    ["1. seo tools", "seo tools"],
    ["• seo tools,", "seo tools"],
    ['"seo tools"', "seo tools"],
    ["“seo tools”", "seo tools"],
    ["(seo tools)", "seo tools"],
    ["what is seo?", "what is seo"],
    ["seo 😀 tools", "seo tools"],
    ["seo\ttools\n", "seo tools"],
    ["c++ tutorial", "c++ tutorial"],
    ["node.js hosting", "node.js hosting"],
    ["café seo", "café seo"],
    ["   ", ""],
  ])("%j → %j", (input, expected) => expect(cleanKeyword(input)).toBe(expected));
});

describe("cleanQuery", () => {
  it("keeps case, quotes and operators", () => {
    expect(cleanQuery('  site:reddit.com  "SEO blog" ')).toBe('site:reddit.com "SEO blog"');
    expect(cleanQuery("- best crm OR erp")).toBe("best crm OR erp");
  });
});

describe("cleanKeywords", () => {
  it("drops blanks, merges duplicates and splits multi-line entries", () => {
    expect(cleanKeywords(["SEO tools", "seo tools ", "", "a\nb", "  "])).toEqual(["seo tools", "a", "b"]);
  });
});

describe("splitEntries", () => {
  it("splits on lines, and on commas/semicolons/tabs when asked", () => {
    expect(splitEntries("a\r\nb\n\na")).toEqual(["a", "b"]);
    expect(splitEntries("a, b;c\td", { commas: true })).toEqual(["a", "b", "c", "d"]);
  });
});

describe("cleanDomain", () => {
  it.each([
    ["https://www.Example.com/path?q=1#x", "example.com"],
    ["Example.COM", "example.com"],
    ["example.com:443", "example.com"],
    ["example.com/", "example.com"],
    ["http//example.com", "example.com"],
    ["https:/example.com", "example.com"],
    ["//example.com", "example.com"],
    ["site:example.com", "example.com"],
    ["blog.example.co.uk", "blog.example.co.uk"],
    ["user@example.com", "example.com"],
    ["<https://example.com>", "example.com"],
    ["example.com.", "example.com"],
    ["  example.com, ", "example.com"],
    ["münchen.de", "xn--mnchen-3ya.de"],
    ["www2.example.com", "example.com"],
  ])("%j → %j", (input, expected) => expect(cleanDomain(input)).toBe(expected));

  it.each(["example", "exa mple.com", "", "http://", "127.0.0.1", "localhost", "javascript:alert(1)", "-bad-.com"])("rejects %j", (input) => {
    expect(cleanDomain(input)).toBeNull();
  });
});

describe("cleanUrl", () => {
  it.each([
    ["example.com/page", "https://example.com/page"],
    ["http://Example.com/Page#top", "http://example.com/Page"],
    ["https//www.example.com/a b", "https://www.example.com/a%20b"],
    ["HTTPS://EXAMPLE.COM", "https://example.com/"],
  ])("%j → %j", (input, expected) => expect(cleanUrl(input)).toBe(expected));

  it.each(["not a url", "javascript:alert(1)", "http://localhost:3000/x", "https://10.0.0.1/"])("rejects %j", (input) => {
    expect(cleanUrl(input)).toBeNull();
  });
});

describe("cleanTarget", () => {
  it("keeps a page URL and reduces a bare site to its domain", () => {
    expect(cleanTarget("https://www.Example.com/")).toBe("example.com");
    expect(cleanTarget("example.com/")).toBe("example.com");
    expect(cleanTarget("www.example.com")).toBe("example.com");
    expect(cleanTarget("example.com/blog/post")).toBe("https://example.com/blog/post");
    expect(cleanTarget("blog.example.com")).toBe("blog.example.com");
  });
});

describe("schemas", () => {
  it("cleans before validating", () => {
    expect(zDomain().parse(" HTTPS://www.Example.com/x ")).toBe("example.com");
    expect(zDomain().safeParse("nope").success).toBe(false);
    expect(zKeywords(2).parse([" A ", "a", "b"])).toEqual(["a", "b"]);
    expect(zKeywords(2).safeParse(["  ", ""]).success).toBe(false);
  });
});
