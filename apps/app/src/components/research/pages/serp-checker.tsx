"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { ListOrdered, Monitor, Smartphone } from "lucide-react";
import { RunPrompt, ViewErrors, ViewMeta } from "@/components/research/lookup-ui";
import { DifficultyPill, IntentBadge } from "@/components/research/pills";
import { SearchBar, useChangeMarket, useMarket, useToolNav } from "@/components/research/search-bar";
import { authorityInputs, type Device, featureLabel, SERP_RESULTS, SerpOverview, serpInput, Skeleton, topOrganic } from "@/components/research/serp-overview";
import { KeywordLink } from "@/components/research/tool-link";
import type { KeywordMetrics, SerpData, SerpInput, UrlMetricsData, UrlMetricsInput } from "@/components/research/types";
import { finite } from "@/components/research/util";
import { Badge, Card, PageHeader, Select, WithIcon } from "@/components/ui";
import { compact } from "@/lib/api";
import type { Project } from "@/lib/hooks";
import { type LookupQuery, useLookupQuery } from "@/lib/lookup";
import { lookupMarket, type Market, marketName } from "@/lib/scope";

type MetricsInput = { keywords: string[]; country?: string; cityLocationCode?: number; language?: string; includeClickstream?: boolean };
type MetricsData = { keywords?: KeywordMetrics[] | null };

const inputsFor = (keyword: string, device: Device, market: Market, results: number) =>
  keyword
    ? {
        serp: { ...serpInput(keyword, device, results), ...lookupMarket(market, { area: true }) } satisfies SerpInput,
        // The keyword's volume, for estimated visits per result: local when a city or state is chosen.
        metrics: (market.area
          ? { keywords: [keyword], cityLocationCode: market.area.code, language: market.language }
          : { keywords: [keyword], country: market.country, language: market.language }) satisfies MetricsInput,
      }
    : null;


/**
 * The live Google results for a keyword, page 1 to page 10, as searchers in the market (or a city
 * or state in it) see them on desktop or mobile, with the keyword's volume and the authority of
 * every result. The URL is the view: ?q=&device=&results=&country=&lang=&loc=.
 */
export function SerpChecker({ project }: { project: Project }) {
  const params = useSearchParams();
  const nav = useToolNav();
  const changeMarket = useChangeMarket();
  const market = useMarket(project);
  const keyword = params.get("q")?.trim() ?? "";
  const device: Device = params.get("device") === "mobile" ? "mobile" : "desktop";
  const asked = Number(params.get("results"));
  const results = (SERP_RESULTS as readonly number[]).includes(asked) ? asked : 10;

  const inputs = useMemo(() => inputsFor(keyword, device, market, results), [keyword, device, market, results]);
  const serp = useLookupQuery<SerpData, SerpInput>(project.id, "serp", inputs?.serp ?? null);
  const metrics = useLookupQuery<MetricsData, MetricsInput>(project.id, "keyword_metrics", inputs?.metrics ?? null);

  const row = metrics.data?.keywords?.find((k) => k.keyword?.toLowerCase() === keyword.toLowerCase()) ?? metrics.data?.keywords?.[0];
  // Google Ads reports no volume for some topics (VPNs, gambling, finance…); then the volume is
  // the clickstream estimate, as in the Keyword overview. Not below country level.
  const restricted = Boolean(metrics.result) && !market.area && !(finite(row?.volume) && row.volume > 0);
  const fallback = useLookupQuery<MetricsData, MetricsInput>(project.id, "keyword_metrics", restricted && inputs ? { ...inputs.metrics, includeClickstream: true } : null);
  const fallbackRow = fallback.data?.keywords?.find((k) => k.keyword?.toLowerCase() === keyword.toLowerCase()) ?? fallback.data?.keywords?.[0];
  const volume = restricted ? (fallbackRow?.clickstreamVolume ?? fallbackRow?.volume ?? null) : (row?.volume ?? null);

  // DR, UR, links and traffic of every result shown: one lookup per ten results, ten slots always.
  const chunks = useMemo(() => authorityInputs(serp.data, results), [serp.data, results]);
  const authority = [
    useLookupQuery<UrlMetricsData, UrlMetricsInput>(project.id, "url_metrics", chunks[0] ?? null),
    useLookupQuery<UrlMetricsData, UrlMetricsInput>(project.id, "url_metrics", chunks[1] ?? null),
    useLookupQuery<UrlMetricsData, UrlMetricsInput>(project.id, "url_metrics", chunks[2] ?? null),
    useLookupQuery<UrlMetricsData, UrlMetricsInput>(project.id, "url_metrics", chunks[3] ?? null),
    useLookupQuery<UrlMetricsData, UrlMetricsInput>(project.id, "url_metrics", chunks[4] ?? null),
    useLookupQuery<UrlMetricsData, UrlMetricsInput>(project.id, "url_metrics", chunks[5] ?? null),
    useLookupQuery<UrlMetricsData, UrlMetricsInput>(project.id, "url_metrics", chunks[6] ?? null),
    useLookupQuery<UrlMetricsData, UrlMetricsInput>(project.id, "url_metrics", chunks[7] ?? null),
    useLookupQuery<UrlMetricsData, UrlMetricsInput>(project.id, "url_metrics", chunks[8] ?? null),
    useLookupQuery<UrlMetricsData, UrlMetricsInput>(project.id, "url_metrics", chunks[9] ?? null),
  ];
  const used = authority.filter((_, index) => chunks[index] !== null);
  const urlMetrics = {
    data: { urls: used.flatMap((lookup) => lookup.data?.urls ?? []) } as UrlMetricsData,
    error: used.find((lookup) => lookup.error)?.error ?? null,
  };
  const lookups = [serp, metrics, fallback, ...used] as LookupQuery<unknown>[];
  // Refresh skips the URL metrics: the fresh SERP re-derives their inputs.
  const refreshable = [serp, metrics, fallback] as LookupQuery<unknown>[];

  // Google can return fewer organic results than asked for: say how many are shown.
  const shown = serp.data ? topOrganic(serp.data, results).length : results;
  const features = [...new Set((serp.data?.itemTypes ?? []).filter((t) => t !== "organic").map(featureLabel))];
  const volumeLoading = metrics.loading || fallback.loading;

  return (
    <>
      <PageHeader title="SERP checker" description="The live Google results for any keyword, from page 1 to page 10, in any country, state or city, with each site's authority and links to analyse any page." />
      <SearchBar
        value={keyword}
        onSearch={(q) => nav({ q })}
        label="Keyword"
        placeholder="Enter a keyword"
        market={market}
        onMarket={changeMarket}
        areas
        pending={serp.loading}
        button="Check SERP"
      >
        <WithIcon icon={device === "mobile" ? Smartphone : Monitor} className="w-36">
          <Select value={device} onChange={(event) => nav({ device: event.target.value === "mobile" ? "mobile" : null })} aria-label="Device" className="h-9 pl-9">
            <option value="desktop">Desktop</option>
            <option value="mobile">Mobile</option>
          </Select>
        </WithIcon>
        <WithIcon icon={ListOrdered} className="w-36">
          <Select value={results} onChange={(event) => nav({ results: event.target.value === "10" ? null : event.target.value })} aria-label="Results to show" className="h-9 pl-9">
            {SERP_RESULTS.map((n) => (
              <option key={n} value={n}>
                Top {n}
              </option>
            ))}
          </Select>
        </WithIcon>
        <span className="text-xs text-muted">Page 1 to page {results / 10} of Google</span>
      </SearchBar>

      <ViewErrors lookups={lookups} />

      {keyword ? (
        <section className="space-y-4 rounded-xl border border-line bg-surface p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 space-y-1">
              <h2 className="truncate font-display text-2xl font-bold tracking-tight">
                <KeywordLink keyword={keyword} market={market} />
              </h2>
              <p className="text-[13px] text-muted">
                {marketName(market)} · <span className="uppercase">{market.language}</span> · {device} · {shown < results ? `${shown} results` : `top ${results}`}
              </p>
            </div>
            <dl className="flex flex-wrap gap-x-6 gap-y-2 text-[13px]">
              <div>
                <dt className="text-xs text-muted">{market.area ? "Local volume" : "Volume"}</dt>
                <dd className="font-display text-lg font-semibold tabular">{volumeLoading ? <Skeleton className="mt-1 h-5 w-14" /> : compact(volume)}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Difficulty</dt>
                <dd className="pt-1">{metrics.loading ? <Skeleton className="h-5 w-10" /> : <DifficultyPill value={row?.difficulty} />}</dd>
              </div>
              {row?.intent && row.intent !== "unknown" && (
                <div>
                  <dt className="text-xs text-muted">Intent</dt>
                  <dd className="pt-1">
                    <IntentBadge intent={row.intent} />
                  </dd>
                </div>
              )}
            </dl>
          </div>
          {features.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {features.map((f) => (
                <Badge key={f}>{f}</Badge>
              ))}
            </div>
          )}
          <ViewMeta lookups={lookups} refresh={refreshable} />
          <SerpOverview market={market} keyword={keyword} volume={volume} serp={serp} metrics={urlMetrics} limit={results} />
        </section>
      ) : (
        <Card>
          <RunPrompt title="Check any results page">Type a keyword and press Enter to see who ranks for it today, from page 1 to page 10. Pick a city or state to see local results.</RunPrompt>
        </Card>
      )}
    </>
  );
}
