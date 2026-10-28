"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Download, Settings, Star } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Suspense, useState } from "react";
import { propertyLabel, projectSettingsHref, useGoogleState } from "@/components/google/connection";
import { type Column, DataTable } from "@/components/research/data-table";
import { Pagination } from "@/components/research/pagination";
import { type SyncState, StoredKeywords } from "@/components/search/stored-keywords";
import { ExtLink, Segmented, TabPanel, Tabs, useQueryState } from "@/components/tracking/kit";
import { Button, Card, CardHeader, EmptyState, ErrorNote, PageHeader, Select, Spinner, Stat } from "@/components/ui";
import { api, num } from "@/lib/api";
import { downloadCsv } from "@/lib/lookup";

type Range = "last_7_days" | "last_28_days" | "last_3_months";
type Totals = { clicks: number; impressions: number; ctr: number | null; position: number | null };
type StrikingRow = { query: string; page: string; clicks: number; impressions: number; position: number };
type Report = {
  siteUrl: string;
  periods: { current: { startDate: string; endDate: string }; previous: { startDate: string; endDate: string } };
  totals: { current: Totals; previous: Totals };
  striking: StrikingRow[];
  countries: { country: string; clicks: number; impressions: number }[];
};
type TableRow = { key: string; clicks: number; impressions: number; ctr: number; position: number };
type TablePage = { page: number; size: number; hasMore: boolean; rows: TableRow[] };
type Opportunity = { url: string; clicks: number; impressions: number; position: number; score: number; parts: { demand: number; reachability: number } };
type Opportunities = { pages: Opportunity[] };

const RANGES: { id: Range; label: string }[] = [
  { id: "last_7_days", label: "7 days" },
  { id: "last_28_days", label: "28 days" },
  { id: "last_3_months", label: "3 months" },
];
/** Percentage change, or the change in position (a lower position is better, so it reads as up). */
function change(current: number | null, previous: number | null, kind: "pct" | "position" = "pct"): { text: string; good: boolean | null } | null {
  if (current == null || previous == null) return null;
  if (kind === "position") {
    const delta = Math.round((previous - current) * 10) / 10;
    return { text: `${delta > 0 ? "▲" : delta < 0 ? "▼" : "±"} ${Math.abs(delta).toFixed(1)} positions`, good: delta === 0 ? null : delta > 0 };
  }
  if (previous === 0) return current === 0 ? { text: "no change", good: null } : null;
  const delta = ((current - previous) / previous) * 100;
  return { text: `${delta > 0 ? "+" : delta < 0 ? "−" : "±"}${Math.abs(delta).toFixed(1)}% vs previous period`, good: Math.abs(delta) < 0.05 ? null : delta > 0 };
}

function Change({ value }: { value: ReturnType<typeof change> }) {
  if (!value) return <span>no earlier data</span>;
  return <span className={value.good === null ? "" : value.good ? "text-pos" : "text-neg"}>{value.text}</span>;
}

// ── Search Console report ───────────────────────────────────────────────────

const TABS = ["striking", "keywords", "queries", "pages", "opportunities"] as const;
type TabId = (typeof TABS)[number];

function StrikingTable({ projectId, rows }: { projectId: string; rows: StrikingRow[] }) {
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const save = useMutation({
    mutationFn: () =>
      api<{ added: number; updated: number }>(`/projects/${projectId}/saved-keywords`, {
        method: "POST",
        body: { keywords: [...selected].map((keyword) => ({ keyword })), tags: ["search-console"] },
      }),
    onSuccess: () => {
      setSelected(new Set());
      void queryClient.invalidateQueries({ queryKey: ["saved-keywords", projectId] });
    },
  });
  const columns: Column<StrikingRow>[] = [
    { key: "query", header: "Query", rowHeader: true, sortValue: (r) => r.query, render: (r) => <span className="font-medium">{r.query}</span> },
    { key: "page", header: "Best page", sortValue: (r) => r.page, render: (r) => <ExtLink href={r.page} className="max-w-72 truncate" /> },
    { key: "impressions", header: "Impressions", align: "right", sortValue: (r) => r.impressions, render: (r) => num(r.impressions) },
    { key: "clicks", header: "Clicks", align: "right", sortValue: (r) => r.clicks, render: (r) => num(r.clicks) },
    { key: "position", header: "Position", align: "right", firstOrder: "asc", sortValue: (r) => r.position, render: (r) => r.position.toFixed(1) },
  ];
  return (
    <Card>
      <CardHeader
        title="Striking distance"
        description="Queries whose best page sits at positions 5 to 20: one push from the top of page one. Most impressions first, up to 100."
        action={
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="primary" disabled={!selected.size} loading={save.isPending} onClick={() => save.mutate()}>
              <Star className="size-3.5" aria-hidden /> Save {selected.size || ""} as keywords
            </Button>
            <Button size="sm" disabled={!rows.length} onClick={() => downloadCsv("search-console-striking-distance.csv", rows)}>
              <Download className="size-3.5" aria-hidden /> CSV
            </Button>
          </div>
        }
      />
      {save.isSuccess && <p className="border-b border-line px-4 py-2 text-xs text-muted">Saved to Saved keywords with the tag “search-console”. Their metrics are filled in when you update them there.</p>}
      <ErrorNote error={save.error} />
      <DataTable
        rows={rows}
        columns={columns}
        rowKey={(r) => r.query}
        caption="Striking-distance queries"
        initialSort={{ key: "impressions", order: "desc" }}
        selection={{ selected, onChange: setSelected, label: (r) => r.query }}
        empty={<p className="p-4 text-[13px] text-muted">No queries at positions 5 to 20 in this period.</p>}
      />
    </Card>
  );
}

function TopTable({ projectId, dimension, params }: { projectId: string; dimension: "query" | "page"; params: Record<string, string> }) {
  const size = 50;
  const [page, setPage] = useState(1);
  const table = useQuery({
    queryKey: ["search", projectId, "table", dimension, params, page],
    queryFn: () => api<TablePage>(`/projects/${projectId}/search-performance/table`, { query: { ...params, dimension, page, size } }),
    placeholderData: keepPreviousData,
  });
  const columns: Column<TableRow>[] = [
    {
      key: "key",
      header: dimension === "query" ? "Query" : "Page",
      rowHeader: true,
      render: (r) => (dimension === "page" ? <ExtLink href={r.key} className="max-w-96 truncate" /> : <span className="font-medium">{r.key}</span>),
    },
    { key: "clicks", header: "Clicks", align: "right", render: (r) => num(r.clicks) },
    { key: "impressions", header: "Impressions", align: "right", render: (r) => num(r.impressions) },
    { key: "ctr", header: "CTR", align: "right", render: (r) => `${r.ctr}%` },
    { key: "position", header: "Position", align: "right", render: (r) => r.position.toFixed(1) },
  ];
  const rows = table.data?.rows ?? [];
  const offset = (page - 1) * size;
  return (
    <Card>
      <CardHeader
        title={dimension === "query" ? "Top queries" : "Top pages"}
        description="By clicks, as Google orders them."
        action={
          <Button size="sm" disabled={!rows.length} onClick={() => downloadCsv(`search-console-${dimension === "query" ? "queries" : "pages"}-page-${page}.csv`, rows)}>
            <Download className="size-3.5" aria-hidden /> CSV
          </Button>
        }
      />
      {table.isPending && <Spinner />}
      <ErrorNote error={table.error} />
      {table.data && (
        <>
          <DataTable rows={rows} columns={columns} rowKey={(r) => r.key} caption={dimension === "query" ? "Top queries" : "Top pages"} manualSort empty={<p className="p-4 text-[13px] text-muted">No data in this period.</p>} />
          <Pagination offset={offset} limit={size} count={rows.length} total={table.data.hasMore ? null : offset + rows.length} disabled={table.isFetching} onChange={(next) => setPage(next / size + 1)} />
        </>
      )}
    </Card>
  );
}

function OpportunitiesTable({ projectId, range }: { projectId: string; range: Range }) {
  const data = useQuery({ queryKey: ["search", projectId, "opportunities", range], queryFn: () => api<Opportunities>(`/projects/${projectId}/search-opportunities`, { query: { range } }) });
  const columns: Column<Opportunity>[] = [
    { key: "score", header: "Score", align: "right", sortValue: (r) => r.score, render: (r) => <span className="font-mono font-semibold tabular">{r.score}</span> },
    { key: "url", header: "Page", rowHeader: true, sortValue: (r) => r.url, render: (r) => <ExtLink href={r.url} className="max-w-80 truncate" /> },
    { key: "position", header: "Position", align: "right", firstOrder: "asc", sortValue: (r) => r.position, render: (r) => r.position.toFixed(1) },
    { key: "impressions", header: "Impressions", align: "right", sortValue: (r) => r.impressions, render: (r) => num(r.impressions) },
    {
      key: "parts",
      header: "Demand · reach",
      title: "Each part is a percentile among these pages, 0 to 1",
      render: (r) => (
        <span className="font-mono text-xs text-muted tabular">
          {r.parts.demand.toFixed(2)} · {r.parts.reachability.toFixed(2)}
        </span>
      ),
    },
  ];
  return (
    <Card>
      <CardHeader
        title="Opportunities"
        description="Pages at positions 4 to 20, scored 0 to 100 for where a push is most worth it: 0.7 demand (impressions) and 0.3 reachability (how close to the top)."
        action={
          <Button size="sm" disabled={!data.data?.pages.length} onClick={() => data.data && downloadCsv("search-opportunities.csv", data.data.pages.map(({ parts, ...row }) => ({ ...row, ...parts })))}>
            <Download className="size-3.5" aria-hidden /> CSV
          </Button>
        }
      />
      {data.isPending && <Spinner />}
      <ErrorNote error={data.error} />
      {data.data && (
        <DataTable rows={data.data.pages} columns={columns} rowKey={(r) => r.url} caption="Search opportunities" initialSort={{ key: "score", order: "desc" }} empty={<p className="p-4 text-[13px] text-muted">No pages at positions 4 to 20 in this period.</p>} />
      )}
    </Card>
  );
}

function SearchConsoleReport({ projectId, sync }: { projectId: string; sync: SyncState }) {
  const [range, setRange] = useState<Range>("last_28_days");
  const [device, setDevice] = useState("");
  const [tab, setTab] = useQueryState<TabId>("tab", TABS, "striking");
  // The tables below are keyed on these, so a new period or device starts them at page 1.
  const params: Record<string, string> = { range, ...(device ? { device } : {}) };
  const report = useQuery({
    queryKey: ["search", projectId, "report", params],
    queryFn: () => api<Report>(`/projects/${projectId}/search-performance`, { query: params }),
    placeholderData: keepPreviousData,
  });
  const totals = report.data?.totals;

  return (
    <section className="space-y-5" aria-label="Search Console">
      <div className="flex flex-wrap items-end gap-3">
        <Segmented label="Period" value={range} onChange={setRange} options={RANGES} />
        <label className="flex items-center gap-2 text-[13px] text-muted">
          Device
          <Select value={device} onChange={(event) => setDevice(event.target.value)} className="w-36">
            <option value="">All</option>
            <option value="DESKTOP">Desktop</option>
            <option value="MOBILE">Mobile</option>
            <option value="TABLET">Tablet</option>
          </Select>
        </label>
        {report.data && (
          <p className="font-mono text-xs text-muted">
            {propertyLabel(report.data.siteUrl)} · {report.data.periods.current.startDate} to {report.data.periods.current.endDate} · Search Console data lags about 3 days
          </p>
        )}
      </div>
      {report.isPending && <Spinner />}
      <ErrorNote error={report.error} />
      {totals && (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Stat label="Clicks" value={num(totals.current.clicks)} sub={<Change value={change(totals.current.clicks, totals.previous.clicks)} />} />
          <Stat label="Impressions" value={num(totals.current.impressions)} sub={<Change value={change(totals.current.impressions, totals.previous.impressions)} />} />
          <Stat label="CTR" value={totals.current.ctr == null ? "—" : `${totals.current.ctr}%`} sub={<Change value={change(totals.current.ctr, totals.previous.ctr)} />} />
          <Stat label="Average position" value={totals.current.position ?? "—"} sub={<Change value={change(totals.current.position, totals.previous.position, "position")} />} />
        </div>
      )}
      <Tabs
        label="Search Console views"
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "striking", label: "Striking distance", count: report.data?.striking.length ?? null },
          { id: "keywords", label: "All keywords" },
          { id: "queries", label: "Queries" },
          { id: "pages", label: "Pages" },
          { id: "opportunities", label: "Opportunities" },
        ]}
      />
      <TabPanel id="striking" hidden={tab !== "striking"}>
        {report.data && <StrikingTable projectId={projectId} rows={report.data.striking} />}
      </TabPanel>
      <TabPanel id="keywords" hidden={tab !== "keywords"}>
        {tab === "keywords" && <StoredKeywords projectId={projectId} sync={sync} />}
      </TabPanel>
      <TabPanel id="queries" hidden={tab !== "queries"}>
        {tab === "queries" && <TopTable key={JSON.stringify(params)} projectId={projectId} dimension="query" params={params} />}
      </TabPanel>
      <TabPanel id="pages" hidden={tab !== "pages"}>
        {tab === "pages" && <TopTable key={JSON.stringify(params)} projectId={projectId} dimension="page" params={params} />}
      </TabPanel>
      <TabPanel id="opportunities" hidden={tab !== "opportunities"}>
        {tab === "opportunities" && <OpportunitiesTable projectId={projectId} range={range} />}
      </TabPanel>
    </section>
  );
}

// ── Page ────────────────────────────────────────────────────────────────────

function SearchPerformance() {
  const { projectId } = useParams<{ projectId: string }>();
  const google = useGoogleState(projectId);
  const state = google.data;

  return (
    <>
      <PageHeader title="Search performance" description="From your own Google Search Console." />
      <div className="space-y-6">
        {google.isPending && <Spinner />}
        <ErrorNote error={google.error} />
        {state &&
          (state.gsc ? (
            <SearchConsoleReport projectId={projectId} sync={state.gsc.sync} />
          ) : (
            <EmptyState
              title="Connect Search Console to see your search data"
              action={
                <Link href={projectSettingsHref(projectId)} className="inline-flex h-8 items-center gap-1.5 rounded-md border border-accent bg-accent px-2.5 text-[13px] font-medium text-accent-fg shadow-card hover:brightness-95">
                  <Settings className="size-3.5" aria-hidden /> Connect in project settings
                </Link>
              }
            >
              Clicks, impressions, positions and every query you rank for, synced daily from Google. Connecting also lets the Indexing page check Google&apos;s index status and submit your sitemaps.
            </EmptyState>
          ))}
      </div>
    </>
  );
}

export default function SearchPerformancePage() {
  return (
    <Suspense fallback={<Spinner />}>
      <SearchPerformance />
    </Suspense>
  );
}
