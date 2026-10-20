"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { type Column, DataTable } from "@/components/research/data-table";
import { listParam, ListForm } from "@/components/research/list-form";
import { ExportButton, RunPrompt, ViewErrors, ViewMeta } from "@/components/research/lookup-ui";
import { useChangeMarket, useMarket, useToolNav } from "@/components/research/search-bar";
import { RatingRing, Skeleton } from "@/components/research/serp-overview";
import { domainToolLabel, OpenInTool } from "@/components/research/tool-link";
import type { UrlMetricsData, UrlMetricsInput, UrlMetricsRow } from "@/components/research/types";
import { csvDate, finite, splitLines } from "@/components/research/util";
import { Badge, Card, PageHeader } from "@/components/ui";
import { compact, num } from "@/lib/api";
import type { Project } from "@/lib/hooks";
import { type LookupQuery, useLookupQuery } from "@/lib/lookup";
import { lookupMarket, type Market, marketName, toolLinks } from "@/lib/scope";
import { hostOf } from "@/lib/url";

/** The traffic endpoint takes up to 1,000 domains; the page keeps lists readable. */
const MAX_TRAFFIC = 100;
/** Authority is $0.02 per domain, so the comparison stays small. */
const MAX_AUTHORITY = 10;

type TrafficRow = { domain: string; organicKeywords: number; organicTraffic: number; paidKeywords: number; paidTraffic: number };
type TrafficData = { domains: TrafficRow[] };
type TrafficInput = { domains: string[]; country: string; language: string };

const cleanDomain = (value: string) => (hostOf(/^https?:\/\//i.test(value) ? value : `https://${value}`) ?? value).toLowerCase().replace(/^www\./, "");
const validDomain = (value: string) => value.length >= 3 && !/\s/.test(value) && value.includes(".");

/** The domains in the URL (?domains=), or the project's domain to start from. */
function useDomains(project: Project, max: number) {
  const params = useSearchParams();
  const raw = params.get("domains");
  return useMemo(() => {
    const list = raw != null ? splitLines(raw, { commas: true }).map(cleanDomain) : project.domain ? [cleanDomain(project.domain)] : [];
    return [...new Set(list.filter(validDomain))].slice(0, max);
  }, [raw, project.domain, max]);
}

const isOwn = (project: Project, domain: string) => Boolean(project.domain) && cleanDomain(project.domain as string) === domain;

function DomainCell({ project, domain, market }: { project: Project; domain: string; market: Market }) {
  return (
    <span className="inline-flex max-w-80 items-center gap-1.5 font-medium">
      <span className="truncate">{domain}</span>
      {isOwn(project, domain) && <Badge>you</Badge>}
      <OpenInTool href={toolLinks.domain(domain, market)} label={domainToolLabel(domain)} />
    </span>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-2.5 p-4" aria-busy="true">
      {Array.from({ length: 6 }, (_, i) => (
        <Skeleton key={i} className="h-4 w-full" />
      ))}
    </div>
  );
}

/** A share bar: the number is always shown beside it. */
function Share({ value, total }: { value: number; total: number }) {
  const pct = total > 0 ? (value / total) * 100 : 0;
  return (
    <span className="inline-flex items-center gap-2">
      <span className="h-1.5 w-20 overflow-hidden rounded-full bg-sunken" aria-hidden>
        <span className="block h-full rounded-full bg-accent" style={{ width: `${pct}%` }} />
      </span>
      <span className="w-11 text-right font-mono text-xs tabular">{pct >= 10 ? Math.round(pct) : pct.toFixed(1)}%</span>
    </span>
  );
}

// ── Website traffic ───────────────────────────────────────────────────────────

/**
 * Estimated search traffic of up to 100 websites side by side, in one country: organic and paid
 * visits and keywords, and each site's share of the group's organic traffic.
 * The URL is the view: ?domains=&country=&lang=.
 */
export function TrafficChecker({ project, embedded }: { project: Project; embedded?: boolean }) {
  const nav = useToolNav();
  const changeMarket = useChangeMarket();
  const market = useMarket(project);
  const domains = useDomains(project, MAX_TRAFFIC);
  const input = domains.length ? ({ domains, country: market.country, language: market.language } satisfies TrafficInput) : null;
  const lookup = useLookupQuery<TrafficData, TrafficInput>(project.id, "domain_traffic", input);
  const lookups = [lookup] as LookupQuery<unknown>[];
  const rows = lookup.data?.domains ?? [];
  const total = rows.reduce((sum, row) => sum + (finite(row.organicTraffic) ? row.organicTraffic : 0), 0);

  const columns: Column<TrafficRow>[] = [
    { key: "domain", header: "Website", rowHeader: true, sortValue: (row) => row.domain, render: (row) => <DomainCell project={project} domain={row.domain} market={market} /> },
    { key: "traffic", header: "Organic traffic", title: "Estimated monthly visits from Google organic results", align: "right", sortValue: (row) => row.organicTraffic, render: (row) => <span className="font-medium">{compact(Math.round(row.organicTraffic))}</span> },
    { key: "share", header: "Share", title: "Share of this group's organic traffic", sortValue: (row) => row.organicTraffic, render: (row) => <Share value={row.organicTraffic} total={total} /> },
    { key: "keywords", header: "Organic keywords", align: "right", sortValue: (row) => row.organicKeywords, render: (row) => num(row.organicKeywords) },
    { key: "paid", header: "Paid traffic", title: "Estimated monthly visits from Google Ads", align: "right", sortValue: (row) => row.paidTraffic, render: (row) => compact(Math.round(row.paidTraffic)) },
    { key: "paidKeywords", header: "Paid keywords", align: "right", sortValue: (row) => row.paidKeywords, render: (row) => num(row.paidKeywords) },
  ];

  return (
    <>
      {!embedded && <PageHeader title="Website traffic checker" description="Estimated Google traffic of any website, or up to 100 at once: organic and paid visits and keywords, side by side." />}
      <ListForm
        value={domains.join("\n")}
        onSubmit={(entries) => nav({ domains: listParam(entries) })}
        label="Websites, one per line"
        placeholder={"yourdomain.com\ncompetitor.com"}
        max={MAX_TRAFFIC}
        clean={cleanDomain}
        market={market}
        onMarket={changeMarket}
        button="Check traffic"
        pending={lookup.loading}
      >
      </ListForm>
      <ViewErrors lookups={lookups} />
      {!domains.length ? (
        <Card>
          <RunPrompt title="Start with a website">Enter your site and its competitors to compare their search traffic in {marketName(market)}.</RunPrompt>
        </Card>
      ) : (
        <div className="space-y-4">
          <ViewMeta lookups={lookups} label={`${num(domains.length)} websites · ${marketName(market)}`} />
          <Card>
            <div className="flex flex-wrap items-center gap-2 border-b border-line px-4 py-3">
              <p className="text-xs text-muted">Estimates from ranking positions and search volumes, for {marketName(market)} only. Use them to compare sites, not as exact visit counts.</p>
              <div className="sm:ml-auto">{rows.length > 0 && <ExportButton filename={`website-traffic-${market.country}-${csvDate()}.csv`} rows={() => rows.map((row) => ({ domain: row.domain, organic_traffic: Math.round(row.organicTraffic), organic_keywords: row.organicKeywords, paid_traffic: Math.round(row.paidTraffic), paid_keywords: row.paidKeywords }))} />}</div>
            </div>
            {lookup.loading ? <TableSkeleton /> : <DataTable rows={rows} columns={columns} rowKey={(row) => row.domain} caption={`Estimated search traffic in ${marketName(market)}`} initialSort={{ key: "traffic", order: "desc" }} empty="No data for these websites." />}
          </Card>
          {!embedded && <NextStep domains={domains} market={market} to="authority" />}
        </div>
      )}
    </>
  );
}


// ── Website authority ─────────────────────────────────────────────────────────

type AuthorityRow = { domain: string; metrics: UrlMetricsRow["domain"]; error?: string };

/**
 * Domain Rating (0 to 100), backlinks, referring domains and organic traffic of up to 10 websites
 * side by side. Authority is worldwide, so there is no market. The URL is the view: ?domains=.
 */
export function AuthorityChecker({ project, embedded }: { project: Project; embedded?: boolean }) {
  const nav = useToolNav();
  const market = useMarket(project);
  const domains = useDomains(project, MAX_AUTHORITY);
  const input = domains.length ? ({ urls: domains } satisfies UrlMetricsInput) : null;
  const lookup = useLookupQuery<UrlMetricsData, UrlMetricsInput>(project.id, "url_metrics", input);
  const lookups = [lookup] as LookupQuery<unknown>[];
  const rows: AuthorityRow[] = (lookup.data?.urls ?? []).map((row) => ({ domain: cleanDomain(row.url), metrics: row.domain, error: row.error }));

  const columns: Column<AuthorityRow>[] = [
    { key: "domain", header: "Website", rowHeader: true, sortValue: (row) => row.domain, render: (row) => <DomainCell project={project} domain={row.domain} market={market} /> },
    {
      key: "dr",
      header: "Domain Rating",
      title: "Strength of the site's backlink profile, 0 to 100 (logarithmic)",
      align: "right",
      sortValue: (row) => row.metrics?.domainRating,
      render: (row) => (row.error ? <span className="text-xs text-neg">{row.error}</span> : <span className="inline-flex justify-end"><RatingRing value={row.metrics?.domainRating} label="Domain Rating" /></span>),
    },
    { key: "refDomains", header: "Referring domains", title: "Unique websites linking to it", align: "right", sortValue: (row) => row.metrics?.refDomains, render: (row) => compact(row.metrics?.refDomains) },
    { key: "backlinks", header: "Backlinks", align: "right", sortValue: (row) => row.metrics?.backlinks, render: (row) => compact(row.metrics?.backlinks) },
    {
      key: "links",
      header: "",
      render: (row) => (
        <Link href={toolLinks.backlinks(row.domain)} className="inline-flex items-center gap-1 text-xs font-medium text-muted hover:text-ink">
          Backlinks <ArrowRight className="size-3" aria-hidden />
        </Link>
      ),
    },
  ];

  return (
    <>
      {!embedded && <PageHeader title="Website authority checker" description="Domain Rating, referring domains and backlinks of up to 10 websites side by side, to see how strong a site is next to its competitors." />}
      <ListForm
        value={domains.join("\n")}
        onSubmit={(entries) => nav({ domains: listParam(entries) })}
        label="Websites, one per line"
        placeholder={"yourdomain.com\ncompetitor.com"}
        max={MAX_AUTHORITY}
        clean={cleanDomain}
        button="Check authority"
        pending={lookup.loading}
      >
      </ListForm>
      <ViewErrors lookups={lookups} />
      {!domains.length ? (
        <Card>
          <RunPrompt title="Start with a website">Enter up to 10 sites to compare their authority. Authority is worldwide: no country to pick.</RunPrompt>
        </Card>
      ) : (
        <div className="space-y-4">
          <ViewMeta lookups={lookups} label={`${num(domains.length)} websites · worldwide`} />
          <Card>
            <div className="flex flex-wrap items-center gap-2 border-b border-line px-4 py-3">
              <p className="text-xs text-muted">Domain Rating is relative: compare sites with each other rather than reading one number alone.</p>
              <div className="sm:ml-auto">{rows.length > 0 && <ExportButton filename={`website-authority-${csvDate()}.csv`} rows={() => rows.map((row) => ({ domain: row.domain, domain_rating: row.metrics?.domainRating ?? "", referring_domains: row.metrics?.refDomains ?? "", backlinks: row.metrics?.backlinks ?? "", error: row.error ?? "" }))} />}</div>
            </div>
            {lookup.loading ? <TableSkeleton /> : <DataTable rows={rows} columns={columns} rowKey={(row) => row.domain} caption="Website authority" initialSort={{ key: "dr", order: "desc" }} empty="No data for these websites." />}
          </Card>
          {!embedded && <NextStep domains={domains} market={market} to="traffic" />}
        </div>
      )}
    </>
  );
}


/** Hands the same list to the sister tool. In a project both live on one page as tabs. */
function NextStep({ domains, market, to }: { domains: string[]; market: Market; to: "traffic" | "authority" }) {
  const query = new URLSearchParams({ domains: domains.join("\n"), country: market.country, lang: market.language });
  const href = to === "traffic" ? `/tools/website-traffic-checker?${query}` : `/tools/website-authority-checker?${query}`;
  return (
    <p className="text-[13px] text-muted">
      <Link href={href} className="inline-flex items-center gap-1 font-medium text-ink underline underline-offset-2">
        {to === "traffic" ? "Compare their search traffic" : "Compare their authority"} <ArrowRight className="size-3.5" aria-hidden />
      </Link>
    </p>
  );
}
