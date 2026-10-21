import { hostMatches, hostOf } from "./domain";

export type TrackedBrand = { name: string; aliases?: string[]; domain?: string | null };
export type BrandHit = { name: string; mentioned: boolean; cited: boolean; position: number | null };
export type Source = { url: string; title?: string };

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Index of the first whole-word, case-insensitive occurrence of any term; -1 if none.
// Terms under two characters are ignored: they would match almost anything.
export function firstMention(text: string, terms: string[]): number {
  let best = -1;
  for (const raw of terms) {
    const term = raw.trim();
    if (term.length < 2) continue;
    // Unicode-aware boundaries so "Acme" does not match inside "Acmeology".
    const pattern = new RegExp(`(?<![\\p{L}\\p{N}])${escapeRegExp(term)}(?![\\p{L}\\p{N}])`, "iu");
    const match = pattern.exec(text);
    if (match && (best === -1 || match.index < best)) best = match.index;
  }
  return best;
}

const LOOKS_LIKE_LINK = /^(?:https?:\/\/|www\.)\S+$|^[\p{L}\p{N}-]+(?:\.[\p{L}\p{N}-]+)+(?:\/\S*)?$/iu;

/**
 * The answer as prose, for matching. Links, email addresses and citation markers are blanked, so
 * a model linking to a site or citing a source is not counted as naming the brand:
 * - `[Acme's guide](https://acme.com)` keeps its words; `[acme.com](https://acme.com)` and `[1](…)` go
 * - citation pills such as `[1]` or `[2, 3]` go
 * - bare URLs and email addresses go
 * Blanked text is replaced by spaces of the same length, so offsets still line up with the answer.
 */
export function proseForMatching(answer: string): string {
  const blank = (match: string) => " ".repeat(match.length);
  return answer
    .replace(/\[([^\]\n]*)\]\(([^)\s]*)\)/g, (match, text: string) => {
      const label = text.trim();
      return label === "" || /^\d+$/.test(label) || LOOKS_LIKE_LINK.test(label) ? blank(match) : ` ${text}${" ".repeat(match.length - text.length - 1)}`;
    })
    .replace(/[[【]\s*\d+(?:\s*[,–-]\s*\d+)*\s*[\]】]/g, blank)
    .replace(/\b(?:https?:\/\/|www\.)[^\s<>()[\]]+/gi, blank)
    .replace(/[\p{L}\p{N}._%+-]+@[\p{L}\p{N}-]+(?:\.[\p{L}\p{N}-]+)+/gu, blank);
}

const TRACKING_PARAM = /^(?:utm_.+|gclid|fbclid|msclkid|dclid|gbraid|wbraid|mc_cid|mc_eid)$/i;

/** A cited URL with its fragment and tracking parameters removed; null for anything but http(s). */
export function cleanSourceUrl(raw: string): string | null {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return null;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return null;
  url.hash = "";
  for (const key of [...url.searchParams.keys()]) if (TRACKING_PARAM.test(key)) url.searchParams.delete(key);
  return url.toString();
}

/** Sources with clean URLs, duplicates dropped, in the order the model cited them. */
export function cleanSources(sources: Source[]): Source[] {
  const seen = new Set<string>();
  const out: Source[] = [];
  for (const source of sources) {
    const url = cleanSourceUrl(source.url);
    if (!url || seen.has(url)) continue;
    seen.add(url);
    out.push(source.title ? { url, title: source.title } : { url });
  }
  return out;
}

const REDIRECT_HOSTS = new Set(["vertexaisearch.cloud.google.com"]);

/**
 * The page a cited link really points at. Some models cite through a redirect (Gemini's grounding
 * links): it is followed once, without loading the page. Search-engine junk glued onto a path
 * ("/best-desk&c=123&mkt=en-us") is cut. Null when the link cannot be read.
 */
export async function resolveCitation(source: { url: string; title?: string }): Promise<{ url: string; title?: string } | null> {
  let url: URL;
  try {
    url = new URL(source.url);
  } catch {
    return null;
  }
  if (REDIRECT_HOSTS.has(url.hostname)) {
    try {
      const res = await fetch(url, { redirect: "manual", signal: AbortSignal.timeout(4000) });
      const location = res.headers.get("location");
      if (location) url = new URL(location, url);
    } catch {
      // Unreachable: fall back to the domain the model gave as the title.
    }
    if (REDIRECT_HOSTS.has(url.hostname)) {
      const domain = source.title?.trim();
      if (!domain || !/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(domain)) return null;
      return { url: `https://${domain}/` };
    }
    // The title of a redirected citation is only its domain.
    return { url: url.toString() };
  }
  if (!url.search && url.pathname.includes("&")) url.pathname = url.pathname.slice(0, url.pathname.indexOf("&"));
  // A title that is only the URL again adds nothing.
  const title = source.title && !/^https?:\/\//i.test(source.title.trim()) ? source.title : undefined;
  return title ? { url: url.toString(), title } : { url: url.toString() };
}

const brandTerms = (brand: TrackedBrand) => [brand.name, ...(brand.aliases ?? []), ...(brand.domain ? [brand.domain] : [])];

const URL_IN_TEXT = /\b(?:https?:\/\/|www\.)[^\s<>()[\]"']+/gi;

/** Hosts the answer links to: its sources, links and bare URLs in the text. */
function linkedHosts(answer: string, sources: Source[]): string[] {
  const inText = [...answer.matchAll(URL_IN_TEXT)].map((m) => {
    // A URL that ends a sentence keeps its full stop: "see www.acme.com."
    const url = m[0].replace(/[.,;:!?]+$/, "");
    return hostOf(url.startsWith("www.") ? `https://${url}` : url);
  });
  return [...sources.map((s) => hostOf(s.url)), ...inText].filter((host): host is string => !!host);
}

/**
 * A prompt that names the brand itself ("Is Acme any good?"). Answers to it nearly always mention
 * the brand, so they are kept out of mention rates and trends.
 */
export function isBrandedPrompt(prompt: string, brand: TrackedBrand): boolean {
  return firstMention(proseForMatching(prompt), brandTerms(brand)) >= 0;
}

/**
 * Identifies the brand an answer was analysed for, so trends only compare like with like. The
 * "|url" suffix marks answers checked against the domain (see analyseAnswer); answers stored before
 * that counted the name alone, so they are not compared with them.
 */
export function brandKey(brand: TrackedBrand): string {
  const domain = (brand.domain ?? "").trim().toLowerCase();
  return `${brand.name.trim().toLowerCase()}|${domain}${domain ? "|url" : ""}`;
}

/**
 * Deterministic visibility check for one answer.
 * - mentioned: brand name, an alias, or its domain appears in the prose (not in a link or citation).
 *   For a brand with a domain, the answer must also point to that domain (a source, a link or the
 *   domain written out), so a different product with the same name is not counted as the brand.
 * - cited: one of the answer's sources is on the brand's domain
 * - position: order of first mention among all tracked brands (1 = first)
 * The first brand in `brands` is the user's own.
 */
export function analyseAnswer(answer: string, sources: Source[], brands: TrackedBrand[]): BrandHit[] {
  const prose = proseForMatching(answer);
  const sourceHosts = sources.map((s) => hostOf(s.url));
  const hosts = linkedHosts(answer, sources);
  const found = brands.map((brand) => {
    const named = firstMention(prose, brandTerms(brand));
    const domain = brand.domain;
    const pointsToDomain = !domain || firstMention(prose, [domain]) >= 0 || hosts.some((host) => hostMatches(host, domain));
    const cited = domain ? sourceHosts.some((host) => hostMatches(host, domain)) : false;
    return { name: brand.name, index: pointsToDomain ? named : -1, cited };
  });
  const order = found
    .filter((f) => f.index >= 0)
    .sort((a, b) => a.index - b.index)
    .map((f) => f.name);
  return found.map((f) => ({
    name: f.name,
    mentioned: f.index >= 0,
    cited: f.cited,
    position: f.index >= 0 ? order.indexOf(f.name) + 1 : null,
  }));
}
