"use client";

import { useMutation } from "@tanstack/react-query";
import { Globe, Monitor, Smartphone } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { type Column, DataTable } from "@/components/research/data-table";
import { listParam, ListForm } from "@/components/research/list-form";
import { ExportButton, RunPrompt, ViewErrors, ViewMeta } from "@/components/research/lookup-ui";
import { UrlCell } from "@/components/research/pills";
import { useChangeMarket, useMarket, useToolNav } from "@/components/research/search-bar";
import { featureLabel, Skeleton } from "@/components/research/serp-overview";
import { KeywordLink } from "@/components/research/tool-link";
import type { SavedKeywordsList } from "@/components/research/types";
import { csvDate, slug, splitLines } from "@/components/research/util";
import { Badge, Button, Card, CardHeader, ErrorNote, Input, PageHeader, Select, Stat, WithIcon } from "@/components/ui";
import { api, num } from "@/lib/api";
import type { Project } from "@/lib/hooks";
import { type LookupQuery, useLookupQuery } from "@/lib/lookup";
import { isToolsScope, lookupMarket, type Market, marketName } from "@/lib/scope";
import { hostOf } from "@/lib/url";

const MAX = 100;
const AIO = new Set(["aiOverview", "ai_overview"]);
/** Feature names in sentence case ("Popular products"), keeping "AI" upper case. */
const label = (feature: string) => {
  const text = featureLabel(feature);
  return (text.charAt(0) + text.slice(1).toLowerCase()).replace(/^Ai /, "AI ");
};

type Source = { url: string; domain: string; title: string | null };
type Row = {
  keyword: string;
  features: string[];
  ownedFeatures: string[];
  aiOverview: { cited: boolean | null; sources: Source[] } | null;
  position: number | null;
  url: string | null;
  error: string | null;
};
type Data = { domain: string | null; device: "desktop" | "mobile"; keywords: Row[] };
type Input = { keywords: string[]; domain?: string; device: "desktop" | "mobile"; locationCode: number; language: string };

const cleanDomain = (value: string) => (hostOf(/^https?:\/\//i.test(value) ? value : `https://${value}`) ?? value).toLowerCase().replace(/^www\./, "");
const validDomain = (value: string) => value.length >= 3 && !/\s/.test(value) && value.includes(".");

function inputFor(keywords: string[], domain: string, device: Input["device"], market: Market): Input | null {
  if (!keywords.length) return null;
  return { keywords, ...(validDomain(domain) ? { domain } : {}), device, ...lookupMarket(market) };
}

/**
 * Which Google features a list of keywords triggers, AI Overviews first: whether each shows one,
 * which pages it cites and whether one of them is the domain's. The URL is the view:
 * ?keywords=&domain=&device=&country=&lang=. In a project the domain defaults to the project's.
 */
export function AiOverviewChecker({ project }: { project: Project }) {
  const params = useSearchParams();
  const nav = useToolNav();
  const changeMarket = useChangeMarket();
  const market = useMarket(project);
  const raw = params.get("keywords") ?? "";
  const keywords = useMemo(() => splitLines(raw).slice(0, MAX), [raw]);
  const domainText = params.get("domain") ?? project.domain ?? "";
  const domain = domainText ? cleanDomain(domainText) : "";
  const device: Input["device"] = params.get("device") === "mobile" ? "mobile" : "desktop";

  const input = useMemo(() => inputFor(keywords, domain, device, market), [keywords, domain, device, market]);
  const lookup = useLookupQuery<Data, Input>(project.id, "serp_features", input);
  const lookups = [lookup] as LookupQuery<unknown>[];
  const saved = useMutation({ mutationFn: () => api<SavedKeywordsList>(`/projects/${project.id}/saved-keywords`, { query: { limit: MAX, sort: "volume", order: "desc" } }) });

  return (
    <>
      <PageHeader
        title="AI Overview checker"
        description="Check up to 100 keywords at once: which ones show a Google AI Overview, which sites it cites, and every other SERP feature on the first page. Add your domain to see where you are cited."
      />
      <ListForm
        value={keywords.join("\n")}
        onSubmit={(entries) => nav({ keywords: listParam(entries) })}
        label="Keywords, one per line"
        placeholder={"best running shoes\nhow to clean suede shoes"}
        max={MAX}
        market={market}
        onMarket={changeMarket}
        button="Check keywords"
        pending={lookup.loading}
        actions={(setText) => (
          <>
            <DomainField domain={domainText} onChange={(value) => nav({ domain: value ? cleanDomain(value) : null }, { replace: true })} />
            <WithIcon icon={device === "mobile" ? Smartphone : Monitor} className="w-[calc(50%-0.25rem)] sm:w-36">
              <Select value={device} onChange={(event) => nav({ device: event.target.value === "mobile" ? "mobile" : null })} aria-label="Device" className="h-11 pl-9">
                <option value="desktop">Desktop</option>
                <option value="mobile">Mobile</option>
              </Select>
            </WithIcon>
            {!isToolsScope(project.id) && (
              <Button type="button" className="h-11" loading={saved.isPending} onClick={() => saved.mutate(undefined, { onSuccess: (list) => setText(list.keywords.map((row) => row.keyword).join("\n")) })}>
                Use my saved keywords
              </Button>
            )}
          </>
        )}
      >
      </ListForm>
      <ErrorNote error={saved.error} />
      <ViewErrors lookups={lookups} />

      {!keywords.length ? (
        <Card>
          <RunPrompt title="Start with your keywords">
            Paste the keywords you care about. Each check reads Google&apos;s first page as searchers in {marketName(market)} see it.
          </RunPrompt>
        </Card>
      ) : lookup.loading ? (
        <Card>
          <div className="space-y-2.5 p-4" aria-busy="true">
            {Array.from({ length: 8 }, (_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </Card>
      ) : lookup.data ? (
        <Results data={lookup.data} market={market} lookups={lookups} />
      ) : null}
    </>
  );
}

function DomainField({ domain, onChange }: { domain: string; onChange: (value: string) => void }) {
  return (
    <WithIcon icon={Globe} className="w-full sm:w-56">
      <Input
        defaultValue={domain}
        key={domain}
        onBlur={(event) => event.target.value.trim() !== domain && onChange(event.target.value.trim())}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            onChange(event.currentTarget.value.trim());
          }
        }}
        placeholder="Your domain (optional)"
        aria-label="Your domain, to see where you are cited (optional)"
        autoCapitalize="none"
        spellCheck={false}
        className="h-11 pl-9"
      />
    </WithIcon>
  );
}


function Results({ data, market, lookups }: { data: Data; market: Market; lookups: LookupQuery<unknown>[] }) {
  const rows = data.keywords;
  const checked = rows.filter((row) => !row.error);
  const withAio = checked.filter((row) => row.aiOverview);
  const cited = withAio.filter((row) => row.aiOverview?.cited);
  const own = data.domain;

  // How often each feature appears, and how often the domain owns it.
  const featureCounts = useMemo(() => {
    const counts = new Map<string, { shown: number; owned: number }>();
    for (const row of checked) {
      for (const feature of row.features) {
        const name = label(feature);
        const entry = counts.get(name) ?? { shown: 0, owned: 0 };
        entry.shown++;
        if (row.ownedFeatures.includes(feature)) entry.owned++;
        counts.set(name, entry);
      }
    }
    return [...counts.entries()].sort((a, b) => b[1].shown - a[1].shown);
  }, [checked]);

  // The sites AI Overviews cite most across these keywords: who to learn from (or to beat).
  const topSources = useMemo(() => {
    const counts = new Map<string, Set<string>>();
    for (const row of withAio) for (const source of row.aiOverview?.sources ?? []) {
      const set = counts.get(source.domain) ?? new Set();
      set.add(row.keyword);
      counts.set(source.domain, set);
    }
    return [...counts.entries()].map(([domain, set]) => ({ domain, keywords: set.size })).sort((a, b) => b.keywords - a.keywords).slice(0, 15);
  }, [withAio]);

  const columns: Column<Row>[] = [
    { key: "keyword", header: "Keyword", rowHeader: true, sortValue: (row) => row.keyword, render: (row) => <KeywordLink keyword={row.keyword} market={market} /> },
    {
      key: "aio",
      header: "AI Overview",
      title: "Whether Google shows an AI Overview, and whether it cites your domain",
      sortValue: (row) => (row.aiOverview ? (row.aiOverview.cited ? 2 : 1) : 0),
      render: (row) =>
        row.error ? (
          <span className="text-xs text-neg">{row.error}</span>
        ) : !row.aiOverview ? (
          <span className="text-faint">None</span>
        ) : row.aiOverview.cited ? (
          <Badge tone="pos">Cites you</Badge>
        ) : (
          <span className="inline-flex items-center gap-1.5">
            <Badge tone="accent">Shown</Badge>
            {own && <span className="text-xs text-muted">not citing you</span>}
          </span>
        ),
    },
    { key: "sources", header: "Cited sites", title: "Pages the AI Overview links to", align: "right", sortValue: (row) => row.aiOverview?.sources.length ?? null, render: (row) => (row.aiOverview ? num(row.aiOverview.sources.length) : "—") },
    {
      key: "features",
      header: "Other SERP features",
      render: (row) => {
        const others = row.features.filter((feature) => !AIO.has(feature));
        if (!others.length) return <span className="text-faint">—</span>;
        return (
          <span className="flex flex-wrap gap-1">
            {others.slice(0, 5).map((feature) => (
              <Badge key={feature} tone={row.ownedFeatures.includes(feature) ? "pos" : "neutral"}>
                {label(feature)}
                {row.ownedFeatures.includes(feature) ? " · yours" : ""}
              </Badge>
            ))}
            {others.length > 5 && <span className="text-xs text-muted">+{others.length - 5}</span>}
          </span>
        );
      },
    },
    ...(own
      ? ([
          { key: "position", header: "Page-one rank", title: "Your organic position on the first page; a dash means not on page one", align: "right", firstOrder: "asc", sortValue: (row) => row.position, render: (row) => (row.position ? num(row.position) : <span className="text-faint">—</span>) },
          { key: "url", header: "Your page", sortValue: (row) => row.url, render: (row) => <UrlCell url={row.url} /> },
        ] satisfies Column<Row>[])
      : []),
  ];

  return (
    <div className="space-y-6">
      <ViewMeta lookups={lookups} label={`${num(checked.length)} keywords · ${marketName(market)} · ${data.device}`} />
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Show an AI Overview" value={`${num(withAio.length)} of ${num(checked.length)}`} sub={checked.length ? `${Math.round((withAio.length / checked.length) * 100)}% of keywords` : undefined} />
        <Stat
          label={own ? `AI Overviews citing ${own}` : "AI Overviews citing you"}
          value={own ? num(cited.length) : "—"}
          sub={own ? (withAio.length ? `${Math.round((cited.length / withAio.length) * 100)}% of AI Overviews` : "no AI Overviews") : "add your domain to see this"}
        />
        <Stat label="Most common feature" value={featureCounts[0]?.[0] ?? "—"} sub={featureCounts[0] ? `on ${num(featureCounts[0][1].shown)} keywords` : undefined} />
      </div>

      <Card>
        <div className="flex flex-wrap items-center gap-2 border-b border-line px-4 py-3">
          <p className="text-xs text-muted">Google&apos;s first page for each keyword. A green badge is a feature your domain appears in.</p>
          <div className="sm:ml-auto">
            <ExportButton
              filename={`ai-overviews-${slug(own ?? "keywords")}-${csvDate()}.csv`}
              rows={() =>
                rows.map((row) => ({
                  keyword: row.keyword,
                  ai_overview: row.aiOverview ? "yes" : "no",
                  cites_you: row.aiOverview?.cited == null ? "" : row.aiOverview.cited ? "yes" : "no",
                  cited_sites: (row.aiOverview?.sources ?? []).map((source) => source.domain).join(" "),
                  features: row.features.map(label).join("; "),
                  your_features: row.ownedFeatures.map(label).join("; "),
                  your_position: row.position ?? "",
                  your_url: row.url ?? "",
                  error: row.error ?? "",
                }))
              }
            />
          </div>
        </div>
        <DataTable rows={rows} columns={columns} rowKey={(row) => row.keyword} caption="SERP features and AI Overviews per keyword" initialSort={{ key: "aio", order: "desc" }} empty="No results." />
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Sites AI Overviews cite most" description="Across these keywords: the pages Google's AI answers lean on." />
          {topSources.length ? (
            <ol className="divide-y divide-line">
              {topSources.map((row, index) => (
                <li key={row.domain} className="flex items-center gap-3 px-4 py-2.5 text-sm">
                  <span className="w-5 font-mono text-xs text-muted tabular">{index + 1}</span>
                  <span className="min-w-0 flex-1 truncate font-medium">
                    {row.domain}
                    {own && (row.domain === own || row.domain.endsWith(`.${own}`)) && (
                      <span className="ml-2">
                        <Badge tone="pos">you</Badge>
                      </span>
                    )}
                  </span>
                  <span className="font-mono text-xs text-muted tabular">{num(row.keywords)} {row.keywords === 1 ? "keyword" : "keywords"}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="px-4 pb-4 text-sm text-muted">None of these keywords shows an AI Overview with sources.</p>
          )}
        </Card>
        <Card>
          <CardHeader title="SERP features on these keywords" description={own ? `How often each appears, and how often ${own} is in it.` : "How often each appears on the first page."} />
          <ul className="divide-y divide-line">
            {featureCounts.map(([name, count]) => (
              <li key={name} className="flex items-center gap-3 px-4 py-2.5 text-sm">
                <span className="min-w-0 flex-1 truncate">{name}</span>
                <span className="h-1.5 w-24 overflow-hidden rounded-full bg-sunken" aria-hidden>
                  <span className="block h-full rounded-full bg-accent" style={{ width: `${checked.length ? (count.shown / checked.length) * 100 : 0}%` }} />
                </span>
                <span className="w-24 text-right font-mono text-xs text-muted tabular">
                  {num(count.shown)}
                  {own ? ` · yours ${num(count.owned)}` : ""}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
