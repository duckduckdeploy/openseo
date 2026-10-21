/**
 * The judgement part of the SEO audit (lookup "seo_audit"): which competitors to compare with,
 * and what the numbers say to do. Pure functions over provider data, so they can be tested alone.
 */

/**
 * Sites that share keywords with almost everyone. They show up as "competitors" of any domain but
 * are not ones a site can learn from or take keywords from.
 */
const PLATFORMS = new Set([
  "youtube.com", "reddit.com", "google.com", "wikipedia.org", "amazon.com", "facebook.com", "linkedin.com", "quora.com",
  "medium.com", "x.com", "twitter.com", "instagram.com", "pinterest.com", "github.com", "apple.com", "microsoft.com",
  "tiktok.com", "yelp.com", "forbes.com", "nytimes.com", "indeed.com", "glassdoor.com", "ebay.com", "walmart.com",
]);

const bare = (host: string) => host.toLowerCase().replace(/^www\./, "");
const isPlatform = (host: string) => {
  const h = bare(host);
  return [...PLATFORMS].some((p) => {
    const name = p.split(".")[0] as string;
    // Country versions too (amazon.co.uk, google.de), but not short names like x.com's "x.".
    return h === p || h.endsWith(`.${p}`) || (name.length > 3 && h.startsWith(`${name}.`) && /^[a-z]{2,3}(\.[a-z]{2})?$/.test(h.slice(name.length + 1)));
  });
};

export type CompetitorRow = { domain: string; intersections: number; organicCount: number; organicEtv: number; avgPosition: number };

/** Competitors worth comparing with: not the domain itself, not a platform, most shared keywords first. */
export function pickCompetitors(domain: string, rows: CompetitorRow[], count: number): CompetitorRow[] {
  return rows
    .filter((row) => bare(row.domain) !== bare(domain) && !isPlatform(row.domain))
    .sort((a, b) => b.intersections - a.intersections)
    .slice(0, count);
}

/**
 * Share of clicks by Google position, roughly what public CTR studies report for an organic
 * result without heavy SERP features. Used only to rank opportunities, never shown as a promise.
 */
const CTR = [0, 0.28, 0.15, 0.1, 0.07, 0.05, 0.04, 0.03, 0.025, 0.02, 0.018];
export const ctrAt = (position: number) => (position >= 1 && position <= 10 ? (CTR[Math.round(position)] ?? 0.018) : position <= 20 ? 0.01 : 0.002);

type RankedKeyword = { keyword: string; position: number; url?: string; volume?: number; traffic?: number; cpc?: number };

/** Keywords at positions 4 to 20, by the extra visits a move into the top 3 could bring. */
export function strikingDistance(rows: RankedKeyword[], max = 20) {
  return rows
    .filter((row) => row.position >= 4 && row.position <= 20 && (row.volume ?? 0) > 0)
    .map((row) => {
      const volume = row.volume ?? 0;
      const now = row.traffic ?? volume * ctrAt(row.position);
      return { keyword: row.keyword, position: row.position, url: row.url ?? null, volume, cpc: row.cpc ?? null, extraVisits: Math.max(0, Math.round(volume * ctrAt(3) - now)) };
    })
    .filter((row) => row.extraVisits > 0)
    .sort((a, b) => b.extraVisits - a.extraVisits)
    .slice(0, max);
}

type GapKeyword = { keyword: string; volume?: number; difficulty?: number; cpc?: number; intent?: string; domain1?: { position?: number; url?: string } };

const STOPWORDS = new Set([
  "the", "and", "for", "with", "what", "how", "best", "free", "from", "your", "you", "are", "can", "does", "near", "that", "this", "online", "vs",
  "top", "new", "who", "why", "when", "where", "which", "about", "into", "more", "most", "make", "use", "get", "com", "www", "app",
]);
const ADULT = /\b(porn\w*|sex\w*|xxx|nude\w*|nsfw|escort\w*|hentai|onlyfans|camgirl\w*|xvideos|xhamster|pornhub)\b/i;

const words = (text: string) => text.toLowerCase().split(/[^\p{L}\p{N}]+/u).filter((word) => word.length >= 3 && !STOPWORDS.has(word));

/** The words a domain's own keywords are made of: what it is about, for judging if a gap keyword fits. */
export function topicWords(keywords: string[]): Set<string> {
  return new Set(keywords.flatMap(words));
}

/**
 * At least two thirds of a keyword's words are ones the domain already ranks with. One shared brand
 * word is not enough: "google doodle" shares "google" with an automation site's "google sheets".
 */
const onTopic = (keyword: string, topic: Set<string>) => {
  const own = words(keyword);
  return own.length > 0 && own.filter((word) => topic.has(word)).length / own.length >= 2 / 3;
};

/**
 * A competitor's keywords the domain lacks, easiest worthwhile first: volume discounted by
 * difficulty. Left out: searches for one particular site (navigational), adult terms, and, when the
 * domain's topic is known, keywords that share no word with it. A big site like Semrush ranks for
 * thousands of other sites' names through its traffic pages; none of those are an opportunity.
 */
export function keywordGapOpportunities(rows: GapKeyword[], topic: Set<string> = new Set(), max = 20) {
  return rows
    .filter((row) => (row.volume ?? 0) > 0 && row.intent !== "navigational" && !ADULT.test(row.keyword))
    .filter((row) => !topic.size || onTopic(row.keyword, topic))
    .map((row) => ({
      keyword: row.keyword,
      volume: row.volume ?? 0,
      difficulty: row.difficulty ?? null,
      cpc: row.cpc ?? null,
      intent: row.intent ?? null,
      competitorPosition: row.domain1?.position || null,
      competitorUrl: row.domain1?.url || null,
      score: Math.round((row.volume ?? 0) * (1 - Math.min(row.difficulty ?? 50, 100) / 100)),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, max);
}

type Intersection = { domain: string; links: Record<string, { rank?: number; backlinks?: number }>; targets: Record<string, boolean> };

/**
 * Sites linking to competitors but not to the domain, from link_intersect run in partial mode with
 * the competitors first and the domain last. Strongest linking site first.
 */
export function backlinkGap(rows: Intersection[], competitors: string[], domain: string, max = 20) {
  const own = String(competitors.length + 1);
  // The domain's own subdomains and the competitors themselves show up as "linking sites" too.
  const inside = (host: string) => [domain, ...competitors].some((site) => bare(host) === bare(site) || bare(host).endsWith(`.${bare(site)}`));
  return rows
    .filter((row) => !row.targets[own] && !inside(row.domain))
    .map((row) => {
      const linksTo = competitors.filter((_, index) => row.targets[String(index + 1)]);
      const rank = Math.max(0, ...Object.values(row.links).map((link) => link.rank ?? 0));
      return { domain: row.domain, linksTo, rank };
    })
    .filter((row) => !isPlatform(row.domain))
    .sort((a, b) => b.linksTo.length - a.linksTo.length || b.rank - a.rank)
    .slice(0, max);
}

export type Finding = { id: string; severity: "high" | "medium" | "low"; title: string; detail: string };

export type AuditFacts = {
  domain: string;
  organicKeywords: number | null;
  organicTraffic: number | null;
  domainRating: number | null;
  referringDomains: number | null;
  movement: { new: number; up: number; down: number; lost: number } | null;
  positions: { top3: number; top10: number; page2: number } | null;
  topPageShare: { url: string; share: number } | null;
  striking: ReturnType<typeof strikingDistance>;
  keywordGap: { competitor: string | null; keywords: ReturnType<typeof keywordGapOpportunities> };
  backlinkGap: { competitors: string[]; domains: ReturnType<typeof backlinkGap> };
};

const n = (value: number) => Math.round(value).toLocaleString("en-US");
/** Two significant figures: an estimate shouldn't look more exact than it is (433,178 → 430,000). */
const roughly = (value: number) => n(Number(value.toPrecision(2)));

/** What the audit says, most important first. Each finding states the number it rests on. */
export function findings(f: AuditFacts): Finding[] {
  const out: Finding[] = [];
  if (f.organicKeywords === 0) {
    out.push({ id: "no-rankings", severity: "high", title: "Not ranking in Google's top 100 yet", detail: `${f.domain} has no keywords in the top 100 in this market. Start with low-difficulty keywords from the gap list below and a page for each.` });
  }
  if (f.striking.length) {
    // Named one by one: a total over head terms with millions of searches means nothing.
    const [best] = f.striking;
    const extra = f.striking.reduce((total, row) => total + row.extraVisits, 0);
    out.push({
      id: "striking-distance",
      severity: extra >= 500 ? "high" : "medium",
      title: `${f.striking.length} keywords close to the top`,
      detail: best
        ? `They rank at positions 4 to 20. The biggest is "${best.keyword}" at position ${best.position}: a top-3 spot could bring about ${roughly(best.extraVisits)} more visits a month. Improving these pages is usually faster than ranking new ones.`
        : "They rank at positions 4 to 20.",
    });
  }
  if (f.keywordGap.competitor && f.keywordGap.keywords.length) {
    const [easiest] = f.keywordGap.keywords;
    out.push({
      id: "keyword-gap",
      severity: "medium",
      title: `${f.keywordGap.competitor} ranks for ${f.keywordGap.keywords.length} related keywords you don't`,
      detail: easiest
        ? `The best start is "${easiest.keyword}": ${n(easiest.volume)} searches a month${easiest.difficulty != null ? ` at difficulty ${easiest.difficulty}` : ""}. Each needs a page that answers it.`
        : "Each needs a page that answers it.",
    });
  }
  if (f.backlinkGap.domains.length) {
    const both = f.backlinkGap.domains.filter((row) => row.linksTo.length > 1).length;
    out.push({
      id: "backlink-gap",
      severity: "medium",
      title: `${f.backlinkGap.domains.length} sites link to competitors but not to you`,
      detail: both ? `${both} of them link to more than one competitor, which makes them likely to link to you too.` : "Sites that already link to similar businesses are the easiest links to earn.",
    });
  }
  if (f.movement && f.movement.lost > f.movement.new && f.movement.lost >= 10) {
    out.push({
      id: "losing-rankings",
      severity: "high",
      title: "Losing more rankings than it gains",
      detail: `${n(f.movement.lost)} keywords dropped out of the top 100 and ${n(f.movement.new)} came in. Check the pages that lost traffic for changes, decay or new competition.`,
    });
  }
  if (f.domainRating != null && f.domainRating < 20 && (f.organicKeywords ?? 0) > 0) {
    out.push({ id: "low-authority", severity: "medium", title: `Low Domain Rating (${f.domainRating})`, detail: "Competitive keywords are hard to win with few strong links. Pair new content with link building." });
  }
  if (f.referringDomains != null && f.referringDomains < 10) {
    out.push({ id: "few-links", severity: "medium", title: `Only ${f.referringDomains} referring domains`, detail: "Few sites link here. The backlink gap list shows where to start." });
  }
  if (f.topPageShare && f.topPageShare.share >= 0.5 && (f.organicTraffic ?? 0) >= 100) {
    out.push({
      id: "traffic-concentration",
      severity: "low",
      title: `One page brings ${Math.round(f.topPageShare.share * 100)}% of organic traffic`,
      detail: `${f.topPageShare.url}. A ranking drop there would hit the whole site; spread traffic with more pages that rank.`,
    });
  }
  if (f.positions && f.positions.page2 > f.positions.top10 && f.positions.page2 >= 10) {
    out.push({ id: "page-two", severity: "low", title: "More keywords on page 2 than on page 1", detail: `${n(f.positions.page2)} keywords rank at 11 to 20 against ${n(f.positions.top10)} in the top 10. Most of them need a stronger page, not a new one.` });
  }
  const order = { high: 0, medium: 1, low: 2 };
  return out.sort((a, b) => order[a.severity] - order[b.severity]);
}
