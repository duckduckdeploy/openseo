"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { type ReactNode, useMemo } from "react";
import { VolumeTrend } from "@/components/research/charts";
import { RunPrompt, ViewErrors, ViewMeta } from "@/components/research/lookup-ui";
import { DifficultyPill, IntentBadge } from "@/components/research/pills";
import { SearchBar, useChangeMarket, useMarket, useToolNav } from "@/components/research/search-bar";
import {
  authorityInput,
  featureLabel,
  peopleAlsoAsk,
  RatingRing,
  SerpOverview,
  serpInput,
  Skeleton,
  suggestionsOf,
  topOrganic,
} from "@/components/research/serp-overview";
import { KeywordLink } from "@/components/research/tool-link";
import type { KeywordIdeasData, KeywordIdeasInput, KeywordMetrics, SerpData, SerpInput, TrendPoint, UrlMetricsData, UrlMetricsInput } from "@/components/research/types";
import { chronological, difficultyLevel, estimatedVisits, finite, isQuestion, money } from "@/components/research/util";
import { Badge, Card, cx, PageHeader } from "@/components/ui";
import { compact, num } from "@/lib/api";
import type { Project } from "@/lib/hooks";
import { type LookupQuery, useLookupQuery } from "@/lib/lookup";
import { countryByIso } from "@/lib/countries";
import { languageFor, lookupMarket, type Market, marketName, toolLinks } from "@/lib/scope";
import { safeHref } from "@/lib/url";

type MetricsInput = { keywords: string[]; country?: string; cityLocationCode?: number; language?: string; includeClickstream?: boolean };
type MetricsData = { keywords?: KeywordMetrics[] | null };
type SuggestInput = { query: string; locationCode?: number; language?: string };


// ── Small visual pieces ────────────────────────────────────────────────────

/** The market's country code as a chip (flag emoji do not render on Windows). */
const CountryChip = ({ country }: { country: string }) => (
  <span className="rounded-sm border border-line px-1 py-px font-mono text-[10px] font-semibold uppercase text-muted">{country}</span>
);

const BAND_COLOR = { easy: "var(--color-pos)", medium: "var(--color-warn)", hard: "var(--color-neg)" } as const;

/** The gauge's word and colour: the same levels as the difficulty pill (see difficultyLevel). */
function difficulty(value: number | null | undefined) {
  const level = difficultyLevel(value);
  return level ? { word: level.word, color: BAND_COLOR[level.band] } : { word: "Not rated", color: "var(--color-faint)" };
}

/** The difficulty bands along the gauge, easy (green) to very hard (red). */
const KD_BANDS = [
  { to: 15, color: "#16a34a" },
  { to: 30, color: "#6bb52f" },
  { to: 50, color: "#e2a800" },
  { to: 70, color: "#ee7b1f" },
  { to: 100, color: "#dc3a26" },
] as const;

// The arc runs 240 degrees, open at the bottom, like a speedometer.
const ARC_START = 150;
const ARC_SWEEP = 240;
const polar = (degrees: number, radius: number) => {
  const radians = (degrees * Math.PI) / 180;
  return [100 + radius * Math.cos(radians), 100 + radius * Math.sin(radians)] as const;
};
const arcPath = (from: number, to: number, radius = 78) => {
  const [x1, y1] = polar(ARC_START + (from / 100) * ARC_SWEEP, radius);
  const [x2, y2] = polar(ARC_START + (to / 100) * ARC_SWEEP, radius);
  const large = ((to - from) / 100) * ARC_SWEEP > 180 ? 1 : 0;
  return `M${x1.toFixed(2)} ${y1.toFixed(2)} A${radius} ${radius} 0 ${large} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
};

/** Keyword difficulty as a full-width banded gauge with the score in the middle. */
function DifficultyGauge({ value }: { value: number | null | undefined }) {
  const { word, color } = difficulty(value);
  const score = difficultyLevel(value)?.score ?? 0;
  const gap = 0.9;
  let from = 0;
  return (
    <svg viewBox="0 0 200 168" className="mx-auto block w-full max-w-64" role="img" aria-label={finite(value) ? `Difficulty ${score} of 100, ${word}` : "Difficulty not rated"}>
      {KD_BANDS.map((band) => {
        const start = from + (from ? gap : 0);
        const end = band.to - (band.to < 100 ? gap : 0);
        from = band.to;
        const filled = Math.min(end, score);
        return (
          <g key={band.to}>
            <path d={arcPath(start, end)} fill="none" stroke="var(--color-sunken)" strokeWidth="20" />
            {filled > start && <path d={arcPath(start, filled)} fill="none" stroke={band.color} strokeWidth="20" />}
          </g>
        );
      })}
      <text x="100" y="112" textAnchor="middle" className="fill-ink font-display tabular" style={{ fontSize: 56, fontWeight: 600 }}>
        {finite(value) ? score : "—"}
      </text>
      <text x="100" y="140" textAnchor="middle" className="font-display" style={{ fontSize: 17, fontWeight: 700, fill: color }}>
        {word}
      </text>
    </svg>
  );
}

/** Twelve months of volume as small bars. */
function MiniBars({ trend }: { trend: TrendPoint[] | null | undefined }) {
  const points = chronological(trend).slice(-12);
  if (points.length < 2) return null;
  const max = Math.max(1, ...points.map((p) => p.volume));
  return (
    <div className="flex h-10 items-end gap-[3px]" aria-hidden>
      {points.map((p) => (
        <span key={p.month} className="w-full rounded-sm bg-accent/80" style={{ height: `${Math.max(6, (p.volume / max) * 100)}%` }} title={`${p.month}: ${num(p.volume)}`} />
      ))}
    </div>
  );
}

function Meter({ value }: { value: number | null | undefined }) {
  const share = finite(value) ? Math.min(1, Math.max(0, value)) : 0;
  return (
    <span className="block h-1.5 w-full overflow-hidden rounded-full bg-sunken" aria-hidden>
      <span className="block h-full rounded-full bg-accent" style={{ width: `${share * 100}%` }} />
    </span>
  );
}

function Panel({ title, children, className, action }: { title: string; children: ReactNode; className?: string; action?: ReactNode }) {
  return (
    <section className={cx("rounded-xl border border-line bg-surface p-5", className)}>
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="text-[13px] font-medium text-muted">{title}</h3>
        {action}
      </div>
      {children}
    </section>
  );
}

function IdeaColumn({
  title,
  items,
  total,
  market,
  more,
  empty,
  loading,
}: {
  title: string;
  items: { keyword: string; volume?: number | null; difficulty?: number | null }[];
  /** All the column has, for "View all". */
  total: number;
  market: Market;
  more?: string;
  empty: string;
  loading?: boolean;
}) {
  return (
    <section className="min-w-0">
      <h3 className="mb-2 border-b border-line pb-2 font-display text-sm font-semibold">{title}</h3>
      {loading && items.length === 0 ? (
        <div className="space-y-2.5 py-1.5">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="h-3.5 w-full" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="py-2 text-xs text-muted">{empty}</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.keyword} className="flex items-center justify-between gap-3 py-1.5 text-[13px]">
              <span className="min-w-0 flex-1">
                <KeywordLink keyword={item.keyword} market={market} />
              </span>
              {finite(item.difficulty) && <DifficultyPill value={item.difficulty} />}
              <span className="w-12 shrink-0 text-right font-mono text-xs text-muted tabular">{finite(item.volume) ? compact(item.volume) : ""}</span>
            </li>
          ))}
        </ul>
      )}
      {more && total > 0 && (
        <Link href={more} className="mt-2 inline-flex items-center gap-1 text-[13px] font-medium text-accent-text hover:underline">
          View all {num(total)} <ArrowRight className="size-3.5" aria-hidden />
        </Link>
      )}
    </section>
  );
}

function OverviewSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading keyword overview">
      <div className="space-y-2">
        <Skeleton className="h-8 w-72" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="space-y-3 rounded-xl border border-line bg-surface p-5">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-9 w-28" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
      <div className="grid gap-6 rounded-xl border border-line bg-surface p-5 md:grid-cols-3">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="space-y-2.5">
            <Skeleton className="h-4 w-32" />
            {Array.from({ length: 6 }, (_, j) => (
              <Skeleton key={j} className="h-3.5 w-full" />
            ))}
          </div>
        ))}
      </div>
      <div className="space-y-3 rounded-xl border border-line bg-surface p-5">
        <Skeleton className="h-4 w-40" />
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="size-7" />
            <Skeleton className="h-3.5 flex-1" />
            <Skeleton className="h-3.5 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Markets compared in "Global search volume", besides the one being researched. */
const GLOBAL = ["us", "gb", "in", "ca", "au", "de"];
const IDEAS = 50;

type Inputs = {
  metrics: MetricsInput;
  local: MetricsInput | null;
  terms: KeywordIdeasInput;
  related: KeywordIdeasInput;
  suggest: SuggestInput;
  serp: SerpInput;
};

/** Every lookup the overview runs for a keyword in a market. */
function inputsFor(keyword: string, market: Market): Inputs | null {
  if (!keyword) return null;
  return {
    metrics: { keywords: [keyword], country: market.country, language: market.language },
    // City and state volume comes from its own endpoint; the rest of the metrics stay national.
    local: market.area ? { keywords: [keyword], cityLocationCode: market.area.code, language: market.language } : null,
    terms: { keyword, source: "ideas", limit: IDEAS, ...lookupMarket(market) },
    related: { keyword, source: "related", limit: IDEAS, ...lookupMarket(market) },
    suggest: { query: keyword, ...lookupMarket(market, { area: true }) },
    serp: { ...serpInput(keyword, "desktop"), ...lookupMarket(market, { area: true }) },
  };
}

/**
 * Volume in five other markets: always five, so the page makes the same number of lookups for any
 * market. `clickstream` when Google Ads has no volume for the keyword (see `restricted`).
 */
const globalFor = (keyword: string, market: Market, clickstream: boolean): MetricsInput[] =>
  GLOBAL.filter((country) => country !== market.country)
    .slice(0, 5)
    .map((country) => ({ keywords: [keyword], country, language: languageFor(country), ...(clickstream ? { includeClickstream: true } : {}) }));


const dedupe = (rows: KeywordMetrics[] | null | undefined, seed: string) => {
  const seen = new Map<string, KeywordMetrics>();
  for (const r of rows ?? []) if (r?.keyword && r.keyword.toLowerCase() !== seed.toLowerCase() && !seen.has(r.keyword.toLowerCase())) seen.set(r.keyword.toLowerCase(), r);
  return [...seen.values()].sort((a, b) => (b.volume ?? -1) - (a.volume ?? -1));
};

/** Search volume of the keyword across several markets, largest first, with each one's share. */
function GlobalVolume({ rows, loading }: { rows: { country: string; volume: number | null }[]; loading: boolean }) {
  const known = rows.filter((row): row is { country: string; volume: number } => finite(row.volume) && row.volume > 0).sort((a, b) => b.volume - a.volume);
  const total = known.reduce((sum, row) => sum + row.volume, 0);
  return (
    <Panel title="Search volume by country">
      <p className="font-display text-4xl font-bold tabular">{loading && !known.length ? <Skeleton className="h-9 w-24" /> : compact(total || null)}</p>
      <p className="mt-0.5 text-xs text-muted">across the {known.length} {known.length === 1 ? "market" : "markets"} below</p>
      <ul className="mt-3 space-y-1.5">
        {loading && !known.length
          ? Array.from({ length: 5 }, (_, i) => <Skeleton key={i} className="h-3.5 w-full" />)
          : known.map((row) => (
              <li key={row.country} className="relative text-[13px]">
                <span className="flex items-center justify-between gap-2">
                  <span className="truncate">{countryByIso(row.country)?.[2] ?? row.country.toUpperCase()}</span>
                  <span className="shrink-0 font-mono text-xs tabular">
                    {compact(row.volume)} <span className="text-muted">{Math.round((row.volume / total) * 100)}%</span>
                  </span>
                </span>
                <span className="mt-0.5 block h-0.5 rounded-full bg-accent" style={{ width: `${(row.volume / known[0]!.volume) * 100}%` }} aria-hidden />
              </li>
            ))}
      </ul>
    </Panel>
  );
}

/**
 * The keyword hub, laid out like the overviews SEOs know. The URL names a keyword and a market
 * (?q=&country=&lang=, &loc= for a city or state); everything for it loads at once: metrics,
 * volume in other countries, matching and related terms, Google suggestions, the top 10 and the
 * authority of each of those pages. With a city or state, volume is local and the
 * results and suggestions are what searchers there see; difficulty, intent and the ideas stay
 * national, which is all YepAPI has below country level.
 */
export function KeywordOverview({ project }: { project: Project }) {
  const params = useSearchParams();
  const nav = useToolNav();
  const changeMarket = useChangeMarket();
  const market = useMarket(project);
  const keyword = params.get("q")?.trim() ?? "";

  const inputs = useMemo(() => inputsFor(keyword, market), [keyword, market]);
  const metrics = useLookupQuery<MetricsData, MetricsInput>(project.id, "keyword_metrics", inputs?.metrics ?? null);
  const local = useLookupQuery<MetricsData, MetricsInput>(project.id, "keyword_metrics", inputs?.local ?? null);
  const terms = useLookupQuery<KeywordIdeasData, KeywordIdeasInput>(project.id, "keyword_ideas", inputs?.terms ?? null);
  const related = useLookupQuery<KeywordIdeasData, KeywordIdeasInput>(project.id, "keyword_ideas", inputs?.related ?? null);
  const suggest = useLookupQuery<SerpData, SuggestInput>(project.id, "autocomplete", inputs?.suggest ?? null);
  const serp = useLookupQuery<SerpData, SerpInput>(project.id, "serp", inputs?.serp ?? null);
  const urlMetrics = useLookupQuery<UrlMetricsData, UrlMetricsInput>(project.id, "url_metrics", authorityInput(serp.data));

  const findRow = (data: MetricsData | undefined) => data?.keywords?.find((k) => k?.keyword?.toLowerCase() === keyword.toLowerCase()) ?? data?.keywords?.[0];
  const row = findRow(metrics.data);
  // Google Ads reports no volume for some topics (VPNs, gambling, finance…). Then the volume is
  // the clickstream estimate, fetched for this keyword and the other markets.
  const restricted = Boolean(metrics.result) && !(finite(row?.volume) && row.volume > 0);
  const fallback = useLookupQuery<MetricsData, MetricsInput>(project.id, "keyword_metrics", restricted && inputs ? { ...inputs.metrics, includeClickstream: true } : null);
  const globalInputs = useMemo(() => (keyword && metrics.result ? globalFor(keyword, market, restricted) : null), [keyword, market, metrics.result, restricted]);
  const global = [
    useLookupQuery<MetricsData, MetricsInput>(project.id, "keyword_metrics", globalInputs?.[0] ?? null),
    useLookupQuery<MetricsData, MetricsInput>(project.id, "keyword_metrics", globalInputs?.[1] ?? null),
    useLookupQuery<MetricsData, MetricsInput>(project.id, "keyword_metrics", globalInputs?.[2] ?? null),
    useLookupQuery<MetricsData, MetricsInput>(project.id, "keyword_metrics", globalInputs?.[3] ?? null),
    useLookupQuery<MetricsData, MetricsInput>(project.id, "keyword_metrics", globalInputs?.[4] ?? null),
  ];
  const lookups = [metrics, local, terms, related, suggest, serp, urlMetrics, fallback, ...global] as LookupQuery<unknown>[];
  // Refresh skips the URL metrics: the fresh SERP re-derives their input.
  const refreshable = lookups.filter((lookup) => lookup !== urlMetrics);
  const volumeOf = (r: KeywordMetrics | undefined) => (restricted ? (r?.clickstreamVolume ?? null) : (r?.volume ?? null));

  function search(k: string) {
    nav({ q: k });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const localRow = findRow(local.data);
  const countryVolume = volumeOf(findRow(restricted ? fallback.data : metrics.data));
  const volume = market.area ? (localRow?.volume ?? null) : countryVolume;
  const cpc = (market.area ? localRow?.cpc : null) ?? row?.cpc;
  const trend = (market.area ? localRow?.trend : null) ?? row?.trend;

  const termRows = useMemo(() => dedupe(terms.data?.keywords, keyword), [terms.data, keyword]);
  const relatedRows = useMemo(() => dedupe(related.data?.keywords, keyword), [related.data, keyword]);
  const questions = useMemo(() => {
    // Questions around the topic: from both idea lists and Google's People Also Ask.
    const fromIdeas = dedupe([...termRows, ...relatedRows], keyword)
      .filter((r) => isQuestion(r.keyword))
      .map((r) => ({ keyword: r.keyword, volume: r.volume, difficulty: r.difficulty }));
    const asked = peopleAlsoAsk(serp.data?.results ?? []).map((q) => ({ keyword: q, volume: null, difficulty: null }));
    const seen = new Set<string>();
    return [...fromIdeas, ...asked].filter((q) => !seen.has(q.keyword.toLowerCase()) && Boolean(seen.add(q.keyword.toLowerCase())));
  }, [termRows, relatedRows, serp.data, keyword]);
  const suggestions = useMemo(
    () =>
      suggestionsOf(suggest.data)
        .filter((k) => k.toLowerCase() !== keyword.toLowerCase())
        .map((k) => ({ keyword: k })),
    [suggest.data, keyword],
  );
  const features = useMemo(
    () => [...new Set([...(row?.serpFeatures ?? []), ...(serp.data?.itemTypes ?? [])].filter((t) => t && t !== "organic" && t !== "relatedSearches").map(featureLabel))],
    [row, serp.data],
  );
  const first = topOrganic(serp.data)[0];
  const firstMetrics = urlMetrics.data?.urls?.find((m) => m.url === first?.url);
  // Traffic potential: what the #1 page gets from all its keywords, when known; else an estimate
  // from this keyword alone. Metrics of a URL with a query string ("/search?q=…") cover the whole
  // path, every search on the site, so those are not used; nor are figures over 20 times the
  // keyword's volume, which cover far more than the page (a whole forum, say).
  const rawTraffic = first?.url && !first.url.includes("?") ? firstMetrics?.page?.traffic : null;
  const pageTraffic = finite(rawTraffic) && (!finite(volume) || rawTraffic <= volume * 20) ? rawTraffic : null;
  const potential = finite(pageTraffic) ? pageTraffic : estimatedVisits(volume, 1);
  const top = useMemo(() => {
    const urls = topOrganic(serp.data).map((r) => r.url as string);
    const drs = (urlMetrics.data?.urls ?? []).filter((m) => urls.includes(m.url)).map((m) => m.domain?.domainRating).filter(finite);
    return { avgDr: drs.length ? Math.round(drs.reduce((a, b) => a + b, 0) / drs.length) : null };
  }, [serp.data, urlMetrics.data]);
  const globalRows = [
    { country: market.country, volume: countryVolume },
    ...(globalInputs ?? []).map((input, index) => ({ country: input.country as string, volume: volumeOf(findRow(global[index]?.data)) })),
  ];

  const loading = metrics.loading || local.loading;
  const ideasLink = (view?: string) => toolLinks.ideas(keyword, market, view);

  return (
    <>
      <SearchBar value={keyword} onSearch={search} label="Keyword" placeholder="Enter a keyword, e.g. emergency plumber" market={market} onMarket={changeMarket} areas pending={loading} />

      <ViewErrors lookups={lookups} />

      {!keyword && (
        <>
          <PageHeader title="Keyword overview" description="Everything about one keyword: how many search for it, how hard it is to rank, what else people search, and who ranks today." />
          <Card>
            <RunPrompt title="Start with a keyword">
              Type a keyword and press Enter. You see its volume, difficulty and intent, the keywords around it, and who ranks for it on Google. Pick a city or state for local volume and
              results. Click any keyword to go deeper.
            </RunPrompt>
          </Card>
        </>
      )}

      {keyword && loading && <OverviewSkeleton />}

      {keyword && !loading && (metrics.result || local.result) && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
            <div className="min-w-0">
              <h1 className="flex flex-wrap items-center gap-2 font-display text-2xl font-bold tracking-tight">
                <span className="text-muted">Overview:</span>
                <span className="min-w-0 truncate">{keyword}</span>
                {row?.intent && row.intent !== "unknown" && <IntentBadge intent={row.intent} />}
              </h1>
              <p className="mt-1 text-[13px] text-muted">
                <CountryChip country={market.country} /> {marketName(market)} · <span className="uppercase">{market.language}</span>
              </p>
            </div>
            <div className="w-full sm:w-auto">
              <ViewMeta lookups={lookups} refresh={refreshable} />
            </div>
          </div>

          {row || localRow ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <Panel title="Keyword difficulty">
                <DifficultyGauge value={row?.difficulty} />
                <p className="-mt-3 text-center text-[13px] text-muted">
                  {finite(row?.avgReferringDomains) && row.avgReferringDomains > 0
                    ? `~${num(Math.round(row.avgReferringDomains))} ref. domains to rank in the top 10`
                    : "Links needed to rank are not known for this keyword."}
                  {finite(top.avgDr) && ` · top 10 average DR ${top.avgDr}`}
                </p>
              </Panel>
              <Panel title={market.area ? "Local search volume" : "Search volume"} action={<CountryChip country={market.country} />}>
                <p className="font-display text-4xl font-bold tabular">{restricted && !market.area && fallback.loading ? <Skeleton className="h-9 w-24" /> : compact(volume)}</p>
                {market.area && finite(countryVolume) && <p className="text-xs text-muted">{compact(countryVolume)} in all of {market.locationName}</p>}
                <div className="mt-3">
                  <MiniBars trend={trend} />
                </div>
                <div className="mt-3 space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted">CPC {money(cpc)}</span>
                    <span className="font-mono capitalize text-muted tabular">competition {row?.competitionLevel?.toLowerCase() ?? (finite(row?.competition) ? row.competition.toFixed(2) : "—")}</span>
                  </div>
                  <Meter value={row?.competition} />
                </div>
              </Panel>
              <Panel title="Traffic potential">
                <p className="font-display text-4xl font-bold tabular" title={finite(pageTraffic) ? "Monthly organic visits of the #1 page, from all its keywords" : "Estimated monthly visits to #1 from this keyword alone"}>
                  {compact(potential)}
                </p>
                <p className="text-xs text-muted">{finite(potential) && finite(cpc) && cpc > 0 ? `Value $${compact(potential * cpc)} / month` : "Value unknown: no ad prices for this keyword"}</p>
                <div className="mt-3 border-t border-line pt-3">
                  <p className="text-xs text-muted">Top ranking result</p>
                  {serp.loading ? (
                    <Skeleton className="mt-1 h-8 w-full" />
                  ) : first?.url ? (
                    <>
                      <a href={safeHref(first.url) ?? undefined} target="_blank" rel="noreferrer noopener" className="mt-0.5 line-clamp-2 text-[13px] font-medium text-accent-text hover:underline">
                        {first.title || first.url}
                      </a>
                      <p className="truncate font-mono text-[11px] text-muted" title={first.url}>
                        {first.url.replace(/^https?:\/\//, "")}
                      </p>
                    </>
                  ) : (
                    <p className="text-xs text-muted">No organic results.</p>
                  )}
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {features.slice(0, 6).map((f) => (
                    <Badge key={f}>{f}</Badge>
                  ))}
                </div>
              </Panel>
              <GlobalVolume rows={globalRows} loading={!globalInputs || global.some((g) => g.loading) || fallback.loading} />
            </div>
          ) : (
            <Card>
              <p className="p-5 text-sm text-muted">No data for this keyword in {marketName(market)}. It may be too rare to measure, or misspelled. The keywords and results below may still help.</p>
            </Card>
          )}

          <section className="rounded-xl border border-line bg-surface p-5">
            <h2 className="mb-4 font-display text-base font-semibold">Keyword ideas</h2>
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
              <IdeaColumn title="Terms match" items={termRows.slice(0, 6)} total={termRows.length} market={market} more={ideasLink()} loading={terms.loading} empty="No matching terms came back." />
              <IdeaColumn title="Questions" items={questions.slice(0, 6)} total={questions.length} market={market} more={ideasLink("questions")} loading={terms.loading || related.loading || serp.loading} empty="No questions found around this keyword." />
              <IdeaColumn title="Also rank for" items={relatedRows.slice(0, 6)} total={relatedRows.length} market={market} more={ideasLink("related")} loading={related.loading} empty="No related searches came back." />
              <IdeaColumn title="Search suggestions" items={suggestions.slice(0, 6)} total={suggestions.length} market={market} more={ideasLink("suggestions")} loading={suggest.loading} empty="No suggestions came back." />
            </div>
          </section>

          {trend && trend.length > 1 && (
            <section className="rounded-xl border border-line bg-surface p-5">
              <VolumeTrend trend={trend} />
            </section>
          )}

          <section className="rounded-xl border border-line bg-surface p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-display text-base font-semibold">
                SERP overview for “{keyword}”{market.area ? ` · ${marketName(market)}` : ""}
              </h2>
            </div>
            <SerpOverview market={market} keyword={keyword} volume={volume} serp={serp} metrics={urlMetrics} />
          </section>
        </div>
      )}
    </>
  );
}
