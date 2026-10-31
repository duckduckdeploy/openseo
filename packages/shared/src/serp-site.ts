/**
 * Where a Google result really points.
 *
 * Since October 2026 Google routes many organic links through `google.com/goto?url=<token>`.
 * The token is opaque (it cannot be decoded, and following it needs a browser), so the URL alone
 * says "google.com" for every such result. YepAPI fills `domain` from the result's breadcrumb or
 * site name instead, but leaves `google.com` when there is neither (mostly forum results such as
 * Reddit threads). This resolves the site from whatever the result carries, in order of trust:
 * a real URL, YepAPI's domain, the breadcrumb, then a known platform's site name.
 */

export type SerpResultLike = {
  url?: string | null;
  domain?: string | null;
  data?: unknown;
};

const GOOGLE_HOST = /(^|\.)google\.[a-z]{2,3}(\.[a-z]{2})?$/i;
const HOSTNAME = /^(?=.{3,253}$)([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i;

const bare = (host: string) => host.trim().toLowerCase().replace(/\.$/, "").replace(/^www\./, "");

function parseUrl(value: string | null | undefined): URL | null {
  if (!value) return null;
  try {
    return new URL(value);
  } catch {
    return null;
  }
}

/** True for a Google redirect link (`/goto`, `/url`), whose host says nothing about the page. */
export function isGoogleRedirect(url: string | null | undefined): boolean {
  const parsed = parseUrl(url);
  return !!parsed && GOOGLE_HOST.test(parsed.hostname) && (parsed.pathname === "/goto" || parsed.pathname === "/url");
}

const isGoogleHost = (host: string) => GOOGLE_HOST.test(host);

/** Site names Google shows for platforms whose results often come without a breadcrumb URL. */
const PLATFORMS: Record<string, string> = {
  reddit: "reddit.com",
  quora: "quora.com",
  youtube: "youtube.com",
  facebook: "facebook.com",
  instagram: "instagram.com",
  linkedin: "linkedin.com",
  x: "x.com",
  twitter: "x.com",
  tiktok: "tiktok.com",
  pinterest: "pinterest.com",
  medium: "medium.com",
  "stack overflow": "stackoverflow.com",
  "stack exchange": "stackexchange.com",
  github: "github.com",
  wikipedia: "wikipedia.org",
  tripadvisor: "tripadvisor.com",
  yelp: "yelp.com",
  amazon: "amazon.com",
  trustpilot: "trustpilot.com",
  "apple podcasts": "podcasts.apple.com",
  spotify: "spotify.com",
};

/** "https://www.example.com › blog › post" or "example.com › blog" to "example.com". */
function hostFromBreadcrumb(breadcrumb: unknown): string | null {
  if (typeof breadcrumb !== "string") return null;
  const head = breadcrumb.split("›")[0]?.trim() ?? "";
  if (!head) return null;
  const parsed = parseUrl(/^https?:\/\//i.test(head) ? head : `https://${head}`);
  const host = parsed ? bare(parsed.hostname) : "";
  return HOSTNAME.test(host) && !isGoogleHost(host) ? host : null;
}

/** "Reddit · r/localseo" to "reddit.com"; a site name that is itself a domain is taken as is. */
function hostFromSiteName(name: unknown): string | null {
  if (typeof name !== "string") return null;
  const head = name.split("·")[0]?.trim().toLowerCase() ?? "";
  if (!head) return null;
  if (PLATFORMS[head]) return PLATFORMS[head];
  const host = bare(head);
  return HOSTNAME.test(host) && !isGoogleHost(host) ? host : null;
}

/**
 * The bare host ("example.com", no "www.") a result points to, or null when it cannot be told.
 * Never returns a Google host for a redirect link.
 */
export function serpResultHost(result: SerpResultLike): string | null {
  const url = parseUrl(result.url);
  const redirect = isGoogleRedirect(result.url);
  if (url && !redirect) return bare(url.hostname);
  const domain = typeof result.domain === "string" ? bare(result.domain) : "";
  if (domain && !isGoogleHost(domain)) return domain;
  const data = (result.data ?? null) as { breadcrumb?: unknown; websiteName?: unknown } | null;
  const fromBreadcrumb = hostFromBreadcrumb(data?.breadcrumb);
  if (fromBreadcrumb) return fromBreadcrumb;
  const fromName = hostFromSiteName(data?.websiteName);
  if (fromName) return fromName;
  // A plain google.com result that is not a redirect (Google's own pages) is google.com.
  return domain && !redirect ? domain : null;
}

/** The page's own URL, or null when Google only gave a redirect link. */
export function serpResultPageUrl(result: SerpResultLike): string | null {
  return result.url && !isGoogleRedirect(result.url) ? result.url : null;
}
