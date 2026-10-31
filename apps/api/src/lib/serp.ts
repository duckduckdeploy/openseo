import { serpResultHost } from "@openseo/shared";
import type { GoogleSerpData } from "@openseo/yepapi";
import { hostMatches, hostOf } from "./domain";

type SerpItem = GoogleSerpData["results"][number];
export type AiOverviewSource = { url: string; domain: string; title: string | null };

/**
 * The pages an AI Overview cites. YepAPI returns the overview as one result with an empty url;
 * its sources sit in `data.references` (and, on some answers, inside each text block's own
 * `references`). Deduplicated by URL, in the order shown.
 */
export function aiOverviewSources(result: SerpItem): AiOverviewSource[] {
  const data = (result as { data?: unknown }).data as
    | { references?: unknown[] | null; items?: { references?: unknown[] | null }[] | null }
    | null
    | undefined;
  const raw = [...(data?.references ?? []), ...(data?.items ?? []).flatMap((item) => item?.references ?? [])];
  const seen = new Set<string>();
  const sources: AiOverviewSource[] = [];
  for (const ref of raw) {
    const r = ref as { url?: unknown; domain?: unknown; title?: unknown } | null;
    if (!r || typeof r.url !== "string" || !r.url || seen.has(r.url)) continue;
    seen.add(r.url);
    const domain = serpResultHost({ url: r.url, domain: typeof r.domain === "string" ? r.domain : null }) ?? "";
    sources.push({ url: r.url, domain, title: typeof r.title === "string" && r.title ? r.title : null });
  }
  return sources;
}

/**
 * The results with `domain` set to the site each one really points to (see serpResultHost).
 * Google now serves many organic links as google.com/goto redirects, so neither the URL nor
 * YepAPI's domain can be taken as is. `domain` is "" when the site cannot be told; `url` is left
 * as Google served it, so it still opens the page in a browser.
 */
export function normalizeSerp<T extends GoogleSerpData>(data: T): T {
  return {
    ...data,
    results: (data.results ?? []).map((r) => (r.url || r.domain ? { ...r, domain: serpResultHost(r) ?? "" } : r)),
  };
}

const isAiOverview = (type: string) => type === "aiOverview" || type === "ai_overview";

/**
 * The SERP features on a results page and the ones a domain owns. A feature is owned when one of
 * its results links to the domain; an AI Overview is owned when it cites the domain.
 */
export function serpFeatures(data: GoogleSerpData, domain: string | null) {
  const others = data.results.filter((r) => r.type !== "organic");
  const features = [...new Set([...(data.itemTypes ?? []), ...others.map((r) => r.type)])].filter((t) => t !== "organic");
  const overview = others.find((r) => isAiOverview(r.type));
  const aiSources = overview ? aiOverviewSources(overview) : [];
  const owned = new Set<string>();
  if (domain) {
    for (const r of others) {
      if (isAiOverview(r.type)) {
        if (aiSources.some((source) => hostMatches(source.domain, domain) || hostMatches(hostOf(source.url), domain))) owned.add(r.type);
      } else if (hostMatches(serpResultHost(r), domain)) owned.add(r.type);
    }
  }
  return { features, ownedFeatures: [...owned], aiOverview: overview ? { sources: aiSources } : null };
}
