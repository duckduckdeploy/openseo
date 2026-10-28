"use client";

import { AlertTriangle, ArrowDown, ArrowUp, CircleAlert, Globe, Info, Link2, Minus, Plus, Swords } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { type ReactNode, useMemo } from "react";
import { PositionDistribution } from "@/components/research/charts";
import { type Column, DataTable } from "@/components/research/data-table";
import { ExportButton, RunPrompt, ViewErrors, ViewMeta } from "@/components/research/lookup-ui";
import { UrlCell } from "@/components/research/pills";
import { ProjectRunBar, SearchBar, useChangeMarket, useMarket, useToolNav } from "@/components/research/search-bar";
import { RatingRing, Skeleton } from "@/components/research/serp-overview";
import { KeywordLink, OpenInTool } from "@/components/research/tool-link";
import type { N } from "@/components/research/types";
import { csvDate, finite, fixed, money, slug } from "@/components/research/util";
import { Badge, Card, cx, PageHeader } from "@/components/ui";
import { compact, num } from "@/lib/api";
import type { Project } from "@/lib/hooks";
import { type LookupQuery, useLookupQuery } from "@/lib/lookup";
import { isToolsScope, lookupMarket, type Market, toolLinks } from "@/lib/scope";
import { big, cleanDomain, Metric, Movement, validDomain } from "./domain";

type Finding = { id: string; severity: "high" | "medium" | "low"; title: string; detail: string };
type Striking = { keyword: string; position: number; url: string | null; volume: number; cpc: N; extraVisits: number };
type GapKeyword = { keyword: string; volume: number; difficulty: N; cpc: N; intent: string | null; competitorPosition: N; competitorUrl: string | null };
type LinkProspect = { domain: string; linksTo: string[]; rank: number };
type AuditKeyword = { keyword: string; position: N; url?: string; volume: N; traffic: N; cpc: N };
type AuditPage = { url: string; traffic: N; trafficValue: N; keywords: N; top3: N; top10: N };
type ReferringDomain = { domain: string; rank: N; backlinks: N; dofollow: N; spamScore: N; firstSeen: string };
type Anchor = { anchor: string; backlinks: N; referringDomains: N };
type Competitor = { domain: string; intersections: N; organicCount: N; organicEtv: N; avgPosition: N; compared: boolean };

/** The seo_audit lookup's answer (apps/api/src/services/lookups.ts). */
export type SeoAuditData = {
  domain: string;
  summary: {
    domainRating: N;
    organicTraffic: N;
    trafficValue: N;
    organicKeywords: N;
    backlinks: N;
    referringDomains: N;
    positions: { top3: number; top10: number; page2: number } | null;
    movement: { new: number; up: number; down: number; lost: number } | null;
  };
  findings: Finding[];
  opportunities: {
    strikingDistance: Striking[];
    keywordGap: { competitor: string | null; keywords: GapKeyword[] };
    backlinkGap: { competitors: string[]; domains: LinkProspect[] };
  };
  positionBuckets: Record<string, N> | null;
  keywords: { total: N; top: AuditKeyword[] };
  pages: { total: N; top: AuditPage[] };
  backlinks: {
    summary: { totalBacklinks: N; referringDomains: N; dofollow: N; nofollow: N; brokenBacklinks: N; spamScore: N } | null;
    referringDomains: ReferringDomain[];
    anchors: Anchor[];
  };
  competitors: Competitor[];
  errors?: { part: string; message: string }[];
};

const PART_LABELS: Record<string, string> = {
  overview: "Overview",
  keywords: "Top keywords",
  striking: "Keywords close to the top",
  pages: "Top pages",
  backlinks: "Backlink summary",
  referringDomains: "Referring domains",
  anchors: "Anchor text",
  competitors: "Competitors",
  keywordGap: "Keyword gap",
  backlinkGap: "Backlink gap",
};

const SEVERITY = {
  high: { label: "High", tone: "neg", icon: CircleAlert },
  medium: { label: "Medium", tone: "warn", icon: AlertTriangle },
  low: { label: "Low", tone: "neutral", icon: Info },
} as const;

function Section({ title, description, action, children }: { title: string; description?: ReactNode; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-1">
        <div className="min-w-0">
          <h2 className="font-display text-lg font-semibold tracking-tight">{title}</h2>
          {description && <p className="mt-0.5 text-[13px] text-muted">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function AuditSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Running the SEO audit">
      <Skeleton className="h-8 w-72" />
      <p className="text-[13px] text-muted">Collecting traffic, rankings, backlinks and competitors. This takes about 15 seconds.</p>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="space-y-2 rounded-xl border border-line bg-surface px-4 py-3">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-7 w-24" />
          </div>
        ))}
      </div>
      <div className="space-y-3 rounded-xl border border-line bg-surface p-5">
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
    </div>
  );
}

function Findings({ findings }: { findings: Finding[] }) {
  if (!findings.length) {
    return (
      <Card>
        <p className="px-4 py-6 text-sm text-muted">Nothing stands out: rankings, links and competitors look balanced. The opportunities below are still worth a look.</p>
      </Card>
    );
  }
  return (
    <Card>
      <ol className="divide-y divide-line">
        {findings.map((finding) => {
          const severity = SEVERITY[finding.severity];
          const Icon = severity.icon;
          return (
            <li key={finding.id} className="flex gap-3 px-4 py-3">
              <Icon className={cx("mt-0.5 size-4 shrink-0", finding.severity === "high" ? "text-neg" : finding.severity === "medium" ? "text-warn" : "text-muted")} aria-hidden />
              <div className="min-w-0">
                <p className="flex flex-wrap items-center gap-2 text-sm font-semibold">
                  {finding.title} <Badge tone={severity.tone}>{severity.label}</Badge>
                </p>
                <p className="mt-0.5 text-[13px] text-muted">{finding.detail}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </Card>
  );
}

function TableHeader({ children, exportName, rows }: { children: ReactNode; exportName?: string; rows?: () => Record<string, unknown>[] }) {
  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-line px-4 py-3">
      <div className="text-xs text-muted">{children}</div>
      {exportName && rows && (
        <div className="sm:ml-auto">
          <ExportButton filename={`${exportName}-${csvDate()}.csv`} rows={rows} />
        </div>
      )}
    </div>
  );
}

/**
 * A whole-domain SEO audit from one search (?domain=&country=&lang=): what to do first, the
 * numbers it rests on, and the lists to act on. Search data only; the Site audit crawls pages.
 */
export function SeoAudit({ project }: { project: Project }) {
  const params = useSearchParams();
  const nav = useToolNav();
  const changeMarket = useChangeMarket();
  const market = useMarket(project);
  // In a project the audit is of its own website, run from a button; the tool takes any domain.
  const inProject = !isToolsScope(project.id);
  const domain = cleanDomain(params.get("domain")?.trim() || (inProject ? "" : project.domain) || "");
  const input = useMemo(() => (validDomain(domain) ? { domain, ...lookupMarket(market) } : null), [domain, market]);
  const audit = useLookupQuery<SeoAuditData, object>(project.id, "seo_audit", input);
  const lookups = [audit] as LookupQuery<unknown>[];
  const data = audit.data;

  return (
    <>
      {inProject ? (
        <ProjectRunBar project={project} market={market} button="Run audit" pending={audit.loading} onRun={(own) => nav({ domain: own }, { reset: true })}>
          <span className="text-xs text-muted">Rankings are for the project&apos;s market. Backlinks are worldwide.</span>
        </ProjectRunBar>
      ) : (
      <SearchBar
        value={params.get("domain") ?? project.domain ?? ""}
        onSearch={(text) => nav({ domain: cleanDomain(text) }, { reset: true })}
        label="Domain"
        icon={Globe}
        placeholder="Enter a domain to audit, e.g. example.com"
        maxLength={253}
        market={market}
        onMarket={changeMarket}
        pending={audit.loading}
      >
        <span className="text-xs text-muted">Rankings are for the country you pick. Backlinks are worldwide.</span>
      </SearchBar>
      )}

      <ViewErrors lookups={lookups} />

      {!input && (
        <>
          <PageHeader title="SEO audit" description="A full SEO audit of any website: traffic, keywords, backlinks, competitors and what to do first." />
          <Card>
            {inProject ? (
              <RunPrompt title={`Audit ${project.domain || "your website"}`}>
                Press Run audit for traffic, keywords, backlinks, competitors and what to do first, from search data. For technical issues on your pages, run a Site audit.
              </RunPrompt>
            ) : (
              <RunPrompt title="Start with a domain">
                Type a domain and press Enter. The audit reads search data, so it works for any site, yours or a competitor&apos;s. For technical issues on your own pages, run a Site audit.
              </RunPrompt>
            )}
          </Card>
        </>
      )}

      {input && audit.loading && <AuditSkeleton />}

      {input && data && <AuditReport data={data} domain={domain} market={market} lookups={lookups} />}
    </>
  );
}

function AuditReport({ data, domain, market, lookups }: { data: SeoAuditData; domain: string; market: Market; lookups: LookupQuery<unknown>[] }) {
  const { summary, opportunities } = data;
  const dr = summary.domainRating;
  const missing = (data.errors ?? []).map((error) => PART_LABELS[error.part] ?? error.part);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
          <div className="min-w-0">
            <h1 className="flex flex-wrap items-center gap-2 font-display text-2xl font-bold tracking-tight">
              <span className="text-muted">SEO audit:</span> <span className="min-w-0 truncate">{domain}</span>
            </h1>
            <p className="mt-1 text-[13px] text-muted">
              {market.locationName} · <span className="uppercase">{market.language}</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href={toolLinks.domain(domain, market)} className="inline-flex h-8 items-center gap-1.5 rounded-md border border-line bg-surface px-2.5 text-[13px] hover:border-faint">
              <Globe className="size-3.5" aria-hidden /> Domain overview
            </Link>
            <Link href={toolLinks.backlinks(domain)} className="inline-flex h-8 items-center gap-1.5 rounded-md border border-line bg-surface px-2.5 text-[13px] hover:border-faint">
              <Link2 className="size-3.5" aria-hidden /> Backlinks
            </Link>
            <Link href={toolLinks.competitors(domain, market)} className="inline-flex h-8 items-center gap-1.5 rounded-md border border-line bg-surface px-2.5 text-[13px] hover:border-faint">
              <Swords className="size-3.5" aria-hidden /> Competitors
            </Link>
          </div>
        </div>
        <ViewMeta lookups={lookups} />
        {missing.length > 0 && <p className="text-[13px] text-warn">Some parts could not be loaded: {missing.join(", ")}. Refresh to try them again.</p>}
      </div>

      <Section title="What to do first" description="Findings from the numbers below, most important first.">
        <Findings findings={data.findings} />
      </Section>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <Metric label="Domain Rating" value={finite(dr) ? <span className="inline-flex items-center gap-2">{Math.round(dr)} <RatingRing value={dr} label="Domain Rating" /></span> : "—"} sub="of 100" />
        <Metric label="Organic traffic" value={big(summary.organicTraffic)} sub={finite(summary.trafficValue) ? `worth $${compact(summary.trafficValue)}/mo in ads` : "est. visits / month"} />
        <Metric label="Organic keywords" value={big(summary.organicKeywords)} sub="ranking in the top 100" />
        <Metric label="In the top 10" value={big(summary.positions?.top10)} sub={summary.positions ? `${num(summary.positions.top3)} in the top 3` : undefined} />
        <Metric label="Backlinks" value={big(summary.backlinks)} />
        <Metric label="Referring domains" value={big(summary.referringDomains)} />
      </div>

      <Section title="Rankings" description="How the domain's keywords are spread across Google's top 100, and how they moved since the last update.">
        <section className="rounded-xl border border-line bg-surface p-5">
          {data.positionBuckets || summary.movement ? (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_220px]">
              {data.positionBuckets ? <PositionDistribution positions={data.positionBuckets} /> : <p className="text-sm text-muted">Position data was not returned for this domain.</p>}
              <div>
                <p className="mb-1 text-[13px] font-medium text-muted">Movement since the last update</p>
                {summary.movement ? (
                  <dl>
                    <Movement label="New" value={summary.movement.new} tone="pos" icon={<Plus className="size-3" />} />
                    <Movement label="Improved" value={summary.movement.up} tone="pos" icon={<ArrowUp className="size-3" />} />
                    <Movement label="Declined" value={summary.movement.down} tone="neg" icon={<ArrowDown className="size-3" />} />
                    <Movement label="Lost" value={summary.movement.lost} tone="neg" icon={<Minus className="size-3" />} />
                  </dl>
                ) : (
                  <p className="text-sm text-muted">Movement data was not returned.</p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted">No ranking data in {market.locationName} for this domain. Try another country.</p>
          )}
        </section>
      </Section>

      <Section title="Opportunities" description="Where more traffic is most likely to come from.">
        <div className="space-y-6">
          <StrikingTable rows={opportunities.strikingDistance} domain={domain} market={market} />
          <GapTable gap={opportunities.keywordGap} domain={domain} market={market} />
          <LinkGapTable gap={opportunities.backlinkGap} domain={domain} />
        </div>
      </Section>

      <Section title="Keywords and pages" description="What already brings traffic.">
        <div className="grid grid-cols-1 gap-6 2xl:grid-cols-2">
          <KeywordsTable keywords={data.keywords} domain={domain} market={market} />
          <PagesTable pages={data.pages} domain={domain} market={market} />
        </div>
      </Section>

      <Section title="Backlink profile" description="Who links to the domain, worldwide." action={<Link href={toolLinks.backlinks(domain)} className="text-[13px] font-medium text-accent-text hover:underline">All backlinks</Link>}>
        <BacklinkProfile backlinks={data.backlinks} domain={domain} />
      </Section>

      <Section title="Competitors" description="Sites ranking for the same keywords. The ones marked compared were used for the gaps above." action={<Link href={toolLinks.competitors(domain, market)} className="text-[13px] font-medium text-accent-text hover:underline">All competitors</Link>}>
        <CompetitorsTable rows={data.competitors} domain={domain} market={market} />
      </Section>
    </div>
  );
}

function StrikingTable({ rows, domain, market }: { rows: Striking[]; domain: string; market: Market }) {
  const columns: Column<Striking>[] = [
    { key: "keyword", header: "Keyword", rowHeader: true, sortValue: (row) => row.keyword, render: (row) => <KeywordLink keyword={row.keyword} market={market} /> },
    { key: "position", header: "Pos.", align: "right", firstOrder: "asc", sortValue: (row) => row.position, render: (row) => num(row.position) },
    { key: "volume", header: "Volume", align: "right", sortValue: (row) => row.volume, render: (row) => num(row.volume) },
    { key: "extra", header: "More visits", title: "Estimated extra visits a month in the top 3", align: "right", sortValue: (row) => row.extraVisits, render: (row) => `+${num(row.extraVisits)}` },
    { key: "url", header: "Ranking URL", sortValue: (row) => row.url, render: (row) => <UrlCell url={row.url} market={market} /> },
  ];
  return (
    <Card>
      <TableHeader exportName={`close-to-top-${slug(domain)}`} rows={() => rows.map((row) => ({ keyword: row.keyword, position: row.position, volume: row.volume, extra_visits: row.extraVisits, url: row.url ?? "" }))}>
        <span className="font-semibold text-ink">Keywords close to the top.</span> Ranking 4 to 20; a top-3 spot could bring the extra visits shown.
      </TableHeader>
      <DataTable rows={rows} columns={columns} rowKey={(row) => `${row.keyword} ${row.url ?? ""}`} caption={`Keywords close to the top for ${domain}`} initialSort={{ key: "extra", order: "desc" }} empty="No keywords at positions 4 to 20 with search volume." />
    </Card>
  );
}

function GapTable({ gap, domain, market }: { gap: SeoAuditData["opportunities"]["keywordGap"]; domain: string; market: Market }) {
  const columns: Column<GapKeyword>[] = [
    { key: "keyword", header: "Keyword", rowHeader: true, sortValue: (row) => row.keyword, render: (row) => <KeywordLink keyword={row.keyword} market={market} /> },
    { key: "volume", header: "Volume", align: "right", sortValue: (row) => row.volume, render: (row) => num(row.volume) },
    { key: "difficulty", header: "KD", title: "Keyword difficulty, 0 to 100", align: "right", firstOrder: "asc", sortValue: (row) => row.difficulty, render: (row) => num(row.difficulty) },
    { key: "cpc", header: "CPC", align: "right", sortValue: (row) => row.cpc, render: (row) => money(row.cpc) },
    { key: "intent", header: "Intent", sortValue: (row) => row.intent, render: (row) => <span className="capitalize">{row.intent ?? "—"}</span> },
  ];
  return (
    <Card>
      <TableHeader exportName={`keyword-gap-${slug(domain)}`} rows={() => gap.keywords.map((row) => ({ keyword: row.keyword, volume: row.volume, difficulty: row.difficulty ?? "", cpc: row.cpc ?? "", intent: row.intent ?? "" }))}>
        <span className="font-semibold text-ink">Keyword gap.</span>{" "}
        {gap.competitor ? (
          <>
            Keywords <span className="font-medium text-ink">{gap.competitor}</span> ranks for and {domain} doesn&apos;t, easier ones first.{" "}
            <Link href={toolLinks.gap(domain, gap.competitor, market)} className="font-medium text-accent-text hover:underline">
              Full gap
            </Link>
          </>
        ) : (
          "No competitor to compare with was found."
        )}
      </TableHeader>
      <DataTable rows={gap.keywords} columns={columns} rowKey={(row) => row.keyword} caption={`Keyword gap for ${domain}`} empty={gap.competitor ? "No missing keywords with search volume." : "Add a competitor in the Competitors tool to compare."} />
    </Card>
  );
}

function LinkGapTable({ gap, domain }: { gap: SeoAuditData["opportunities"]["backlinkGap"]; domain: string }) {
  const columns: Column<LinkProspect>[] = [
    { key: "domain", header: "Linking site", rowHeader: true, sortValue: (row) => row.domain, render: (row) => <span className="font-medium">{row.domain}</span> },
    { key: "links", header: "Links to", sortValue: (row) => row.linksTo.length, render: (row) => <span className="text-[13px]">{row.linksTo.join(", ")}</span> },
    { key: "rank", header: "Rank", title: "Strength of the linking site, 0 to 1,000", align: "right", sortValue: (row) => row.rank, render: (row) => num(row.rank) },
  ];
  return (
    <Card>
      <TableHeader exportName={`backlink-gap-${slug(domain)}`} rows={() => gap.domains.map((row) => ({ domain: row.domain, links_to: row.linksTo.join(" "), rank: row.rank }))}>
        <span className="font-semibold text-ink">Backlink gap.</span>{" "}
        {gap.competitors.length ? `Sites linking to ${gap.competitors.join(" or ")} but not to ${domain}: the easiest links to earn.` : "No competitor to compare with was found."}
      </TableHeader>
      <DataTable rows={gap.domains} columns={columns} rowKey={(row) => row.domain} caption={`Backlink gap for ${domain}`} initialSort={{ key: "links", order: "desc" }} empty="No link prospects were found." />
    </Card>
  );
}

function KeywordsTable({ keywords, domain, market }: { keywords: SeoAuditData["keywords"]; domain: string; market: Market }) {
  const columns: Column<AuditKeyword>[] = [
    { key: "keyword", header: "Keyword", rowHeader: true, sortValue: (row) => row.keyword, render: (row) => <KeywordLink keyword={row.keyword} market={market} /> },
    { key: "position", header: "Pos.", align: "right", firstOrder: "asc", sortValue: (row) => row.position, render: (row) => num(row.position) },
    { key: "volume", header: "Volume", align: "right", sortValue: (row) => row.volume, render: (row) => num(row.volume) },
    { key: "traffic", header: "Traffic", align: "right", sortValue: (row) => row.traffic, render: (row) => (finite(row.traffic) ? num(Math.round(row.traffic)) : "—") },
    { key: "url", header: "URL", sortValue: (row) => row.url, render: (row) => <UrlCell url={row.url} market={market} /> },
  ];
  return (
    <Card>
      <TableHeader exportName={`keywords-${slug(domain)}`} rows={() => keywords.top.map((row) => ({ keyword: row.keyword, position: row.position ?? "", volume: row.volume ?? "", traffic: row.traffic ?? "", url: row.url ?? "" }))}>
        <span className="font-semibold text-ink">Top keywords</span> by traffic{finite(keywords.total) ? ` (${compact(keywords.total)} rank in the top 20)` : ""}.{" "}
        <Link href={toolLinks.domain(domain, market)} className="font-medium text-accent-text hover:underline">
          All keywords
        </Link>
      </TableHeader>
      <DataTable rows={keywords.top} columns={columns} rowKey={(row) => `${row.keyword} ${row.url ?? ""}`} caption={`Top keywords of ${domain}`} initialSort={{ key: "traffic", order: "desc" }} empty={`No ranking keywords in ${market.locationName}.`} />
    </Card>
  );
}

function PagesTable({ pages, domain, market }: { pages: SeoAuditData["pages"]; domain: string; market: Market }) {
  const columns: Column<AuditPage>[] = [
    { key: "url", header: "Page", rowHeader: true, sortValue: (row) => row.url, render: (row) => <UrlCell url={row.url} market={market} className="max-w-80 text-ink" /> },
    { key: "traffic", header: "Traffic", align: "right", sortValue: (row) => row.traffic, render: (row) => (finite(row.traffic) ? num(Math.round(row.traffic)) : "—") },
    { key: "keywords", header: "Keywords", align: "right", sortValue: (row) => row.keywords, render: (row) => num(row.keywords) },
    { key: "top10", header: "Top 10", align: "right", sortValue: (row) => row.top10, render: (row) => num(row.top10) },
    { key: "open", header: "", render: (row) => <OpenInTool href={toolLinks.page(row.url, market)} label={`Analyse page ${row.url}`} /> },
  ];
  return (
    <Card>
      <TableHeader exportName={`pages-${slug(domain)}`} rows={() => pages.top.map((row) => ({ url: row.url, traffic: row.traffic ?? "", keywords: row.keywords ?? "", top10: row.top10 ?? "" }))}>
        <span className="font-semibold text-ink">Top pages</span> by organic traffic{finite(pages.total) ? `, of ${compact(pages.total)}` : ""}.
      </TableHeader>
      <DataTable rows={pages.top} columns={columns} rowKey={(row) => row.url} caption={`Top pages of ${domain}`} initialSort={{ key: "traffic", order: "desc" }} empty={`No ranking pages in ${market.locationName}.`} />
    </Card>
  );
}

function BacklinkProfile({ backlinks, domain }: { backlinks: SeoAuditData["backlinks"]; domain: string }) {
  const summary = backlinks.summary;
  const dofollowShare = summary && finite(summary.dofollow) && finite(summary.totalBacklinks) && summary.totalBacklinks > 0 ? summary.dofollow / summary.totalBacklinks : null;
  const domainColumns: Column<ReferringDomain>[] = [
    { key: "domain", header: "Referring domain", rowHeader: true, sortValue: (row) => row.domain, render: (row) => <span className="font-medium">{row.domain}</span> },
    { key: "rank", header: "Rank", align: "right", sortValue: (row) => row.rank, render: (row) => num(row.rank) },
    { key: "backlinks", header: "Links", align: "right", sortValue: (row) => row.backlinks, render: (row) => num(row.backlinks) },
    { key: "spam", header: "Spam", title: "Spam score, 0 to 100", align: "right", firstOrder: "asc", sortValue: (row) => row.spamScore, render: (row) => num(row.spamScore) },
  ];
  const anchorColumns: Column<Anchor>[] = [
    { key: "anchor", header: "Anchor text", rowHeader: true, sortValue: (row) => row.anchor, render: (row) => (row.anchor ? <span className="break-words">{row.anchor}</span> : <span className="text-muted">(no text)</span>) },
    { key: "domains", header: "Domains", align: "right", sortValue: (row) => row.referringDomains, render: (row) => num(row.referringDomains) },
    { key: "backlinks", header: "Links", align: "right", sortValue: (row) => row.backlinks, render: (row) => compact(row.backlinks) },
  ];
  return (
    <div className="space-y-4">
      {summary ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Metric label="Dofollow" value={dofollowShare == null ? "—" : `${Math.round(dofollowShare * 100)}%`} sub={`${big(summary.dofollow)} links`} />
          <Metric label="Nofollow" value={big(summary.nofollow)} />
          <Metric label="Broken backlinks" value={big(summary.brokenBacklinks)} sub="links to pages that fail" />
          <Metric label="Spam score" value={finite(summary.spamScore) ? fixed(summary.spamScore, 0) : "—"} sub="of 100, lower is better" />
        </div>
      ) : (
        <Card>
          <p className="px-4 py-6 text-sm text-muted">No backlinks are known for {domain} yet. New sites often have none.</p>
        </Card>
      )}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
          <TableHeader>Strongest referring domains.</TableHeader>
          <DataTable rows={backlinks.referringDomains} columns={domainColumns} rowKey={(row) => row.domain} caption={`Referring domains of ${domain}`} initialSort={{ key: "rank", order: "desc" }} empty="No referring domains found." />
        </Card>
        <Card>
          <TableHeader>Most used anchor texts.</TableHeader>
          <DataTable rows={backlinks.anchors} columns={anchorColumns} rowKey={(row) => row.anchor || "(empty)"} caption={`Anchor texts of ${domain}`} initialSort={{ key: "domains", order: "desc" }} empty="No anchor texts found." />
        </Card>
      </div>
    </div>
  );
}

function CompetitorsTable({ rows, domain, market }: { rows: Competitor[]; domain: string; market: Market }) {
  const columns: Column<Competitor>[] = [
    {
      key: "domain",
      header: "Competitor",
      rowHeader: true,
      sortValue: (row) => row.domain,
      render: (row) => (
        <span className="inline-flex max-w-80 items-center gap-2">
          <Link href={toolLinks.seoAudit(row.domain, market)} className="truncate font-medium underline decoration-line decoration-2 underline-offset-4 hover:decoration-accent">
            {row.domain}
          </Link>
          {row.compared && <Badge tone="accent">compared</Badge>}
          <OpenInTool href={toolLinks.gap(domain, row.domain, market)} label={`Keyword gap: ${domain} vs ${row.domain}`} />
        </span>
      ),
    },
    { key: "shared", header: "Common keywords", align: "right", sortValue: (row) => row.intersections, render: (row) => num(row.intersections) },
    { key: "position", header: "Avg. position", align: "right", firstOrder: "asc", sortValue: (row) => row.avgPosition, render: (row) => fixed(row.avgPosition) },
    { key: "traffic", header: "Their traffic", align: "right", sortValue: (row) => row.organicEtv, render: (row) => (finite(row.organicEtv) ? compact(row.organicEtv) : "—") },
  ];
  return (
    <Card>
      <DataTable rows={rows} columns={columns} rowKey={(row) => row.domain} caption={`Competitors of ${domain}`} initialSort={{ key: "shared", order: "desc" }} empty="No competing domains were found." />
    </Card>
  );
}

