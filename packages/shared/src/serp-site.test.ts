import { describe, expect, it } from "vitest";
import { isGoogleRedirect, serpResultHost, serpResultPageUrl } from "./serp-site";

const goto = "https://google.com/goto?url=CAESmgEB6zswFVV8XyT5";

describe("serpResultHost", () => {
  it("uses the real URL when there is one", () => {
    expect(serpResultHost({ url: "https://www.acme.com/a", domain: "acme.com" })).toBe("acme.com");
  });
  it("uses YepAPI's domain for a goto link", () => {
    expect(serpResultHost({ url: goto, domain: "www.quickcreator.io" })).toBe("quickcreator.io");
  });
  it("falls back to the breadcrumb, then a known site name", () => {
    expect(serpResultHost({ url: goto, domain: "google.com", data: { breadcrumb: "https://www.redditmaster.com › reddit › se..." } })).toBe("redditmaster.com");
    expect(serpResultHost({ url: goto, domain: "google.com", data: { breadcrumb: "50+ comments · 5 months ago", websiteName: "Reddit · r/localseo" } })).toBe("reddit.com");
  });
  it("returns null rather than google.com when the site cannot be told", () => {
    expect(serpResultHost({ url: goto, domain: "google.com", data: { breadcrumb: "20+ comments", websiteName: "Some Forum" } })).toBeNull();
  });
  it("keeps Google's own non-redirect pages", () => {
    expect(serpResultHost({ url: "https://support.google.com/x", domain: "support.google.com" })).toBe("support.google.com");
  });
});

describe("redirect links", () => {
  it("detects goto and url redirects only", () => {
    expect(isGoogleRedirect(goto)).toBe(true);
    expect(isGoogleRedirect("https://www.google.co.uk/url?q=x")).toBe(true);
    expect(isGoogleRedirect("https://google.com/search?q=x")).toBe(false);
    expect(serpResultPageUrl({ url: goto })).toBeNull();
    expect(serpResultPageUrl({ url: "https://acme.com/" })).toBe("https://acme.com/");
  });
});
