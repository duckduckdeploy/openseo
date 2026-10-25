"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Download, RefreshCw, Star } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { type Column, DataTable } from "@/components/research/data-table";
import { Pagination } from "@/components/research/pagination";
import { ExtLink, Note, Segmented } from "@/components/tracking/kit";
import { Badge, Button, Card, CardHeader, ErrorNote, Input, Spinner } from "@/components/ui";
import { api, dateOnly, num } from "@/lib/api";
import { downloadCsv } from "@/lib/lookup";

export type SyncState = { from: string | null; to: string | null; backfillDone: boolean; error: string | null; lastSyncAt: string | null };
type Keyword = { query: string; clicks: number; impressions: number; ctr: number | null; position: number | null; previousPosition: number | null; page: string | null };
type KeywordPage = { synced: boolean; period: { startDate: string; endDate: string } | null; total: number; rows: Keyword[] };
type Suggestion = Keyword & { reason: "striking_distance" | "top_query" | "question" };
type Days = "7" | "28" | "90" | "365" | "480";
type Sort = "impressions" | "clicks" | "position";

const DAYS: { id: Days; label: string }[] = [
  { id: "7", label: "7 days" },
  { id: "28", label: "28 days" },
  { id: "90", label: "3 months" },
  { id: "365", label: "12 months" },
  { id: "480", label: "16 months" },
];
const REASON: Record<Suggestion["reason"], string> = { striking_distance: "Positions 5–20", question: "Question", top_query: "Top query" };

/** Position change: lower is better, so a drop in number reads as up. */
function Movement({ now, before }: { now: number | null; before: number | null }) {
  if (now == null || before == null) return <span className="text-muted">—</span>;
  const delta = Math.round((before - now) * 10) / 10;
  if (delta === 0) return <span className="text-muted">±0</span>;
  return <span className={delta > 0 ? "text-pos" : "text-neg"}>{`${delta > 0 ? "▲" : "▼"} ${Math.abs(delta).toFixed(1)}`}</span>;
}

/** Where the daily sync stands, with a button to run it now. */
export function SyncStatus({ projectId, sync }: { projectId: string; sync: SyncState }) {
  const queryClient = useQueryClient();
  const run = useMutation({
    mutationFn: () => api(`/projects/${projectId}/search-console/sync`, { method: "POST" }),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["google", projectId] }),
  });
  const span = sync.from && sync.to ? `${sync.from} to ${sync.to}` : null;
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
      <span>
        {span ? `Stored daily: ${span}` : "First sync starts within a few minutes of connecting."}
        {span && !sync.backfillDone && " · still fetching older months"}
        {sync.lastSyncAt && ` · last synced ${dateOnly(sync.lastSyncAt)}`}
      </span>
      <Button size="sm" variant="ghost" loading={run.isPending} onClick={() => run.mutate()}>
        <RefreshCw className="size-3.5" aria-hidden /> Sync now
      </Button>
      {run.isSuccess && <span>Queued. New days appear in a minute or two.</span>}
      {sync.error && <span className="text-neg">Last sync failed: {sync.error}</span>}
    </div>
  );
}

function SaveButton({ projectId, keywords, onDone }: { projectId: string; keywords: string[]; onDone: () => void }) {
  const queryClient = useQueryClient();
  const save = useMutation({
    mutationFn: () => api(`/projects/${projectId}/saved-keywords`, { method: "POST", body: { keywords: keywords.map((keyword) => ({ keyword })), tags: ["search-console"] } }),
    onSuccess: () => {
      onDone();
      void queryClient.invalidateQueries({ queryKey: ["saved-keywords", projectId] });
      void queryClient.invalidateQueries({ queryKey: ["search", projectId, "suggestions"] });
    },
  });
  return (
    <>
      <Button size="sm" variant="primary" disabled={!keywords.length} loading={save.isPending} onClick={() => save.mutate()}>
        <Star className="size-3.5" aria-hidden /> Save {keywords.length || ""} as keywords
      </Button>
      {save.error ? <ErrorNote error={save.error} /> : null}
    </>
  );
}

/** Queries not tracked or saved yet, from the stored data: one push from page one first. */
function Suggestions({ projectId }: { projectId: string }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const data = useQuery({
    queryKey: ["search", projectId, "suggestions"],
    queryFn: () => api<{ synced: boolean; rows: Suggestion[] }>(`/projects/${projectId}/search-console/keyword-suggestions`, { query: { limit: 50 } }),
  });
  if (!data.data?.synced || !data.data.rows.length) return null;
  const columns: Column<Suggestion>[] = [
    { key: "query", header: "Query", rowHeader: true, sortValue: (r) => r.query, render: (r) => <span className="font-medium">{r.query}</span> },
    { key: "reason", header: "Why", render: (r) => <Badge tone={r.reason === "striking_distance" ? "accent" : "neutral"}>{REASON[r.reason]}</Badge> },
    { key: "impressions", header: "Impressions", align: "right", sortValue: (r) => r.impressions, render: (r) => num(r.impressions) },
    { key: "position", header: "Position", align: "right", firstOrder: "asc", sortValue: (r) => r.position, render: (r) => r.position?.toFixed(1) ?? "—" },
  ];
  return (
    <Card>
      <CardHeader
        title="Keywords to track"
        description={
          <>
            Search Console queries you have not saved or tracked yet, positions 5 to 20 first. Save them, then add them to a{" "}
            <Link href={`/p/${projectId}/rank`} className="underline underline-offset-2">
              rank tracker
            </Link>{" "}
            to follow them daily.
          </>
        }
        action={<SaveButton projectId={projectId} keywords={[...selected]} onDone={() => setSelected(new Set())} />}
      />
      <DataTable rows={data.data.rows} columns={columns} rowKey={(r) => r.query} caption="Suggested keywords" selection={{ selected, onChange: setSelected, label: (r) => r.query }} />
    </Card>
  );
}

/** Every query from the stored daily sync, with position change against the period before. */
export function StoredKeywords({ projectId, sync }: { projectId: string; sync: SyncState }) {
  const size = 100;
  const [days, setDays] = useState<Days>("28");
  const [sort, setSort] = useState<Sort>("impressions");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const query = { days, sort, search: search.trim() || undefined, page, size };
  const table = useQuery({
    queryKey: ["search", projectId, "stored-keywords", query],
    queryFn: () => api<KeywordPage>(`/projects/${projectId}/search-console/keywords`, { query }),
    placeholderData: keepPreviousData,
  });
  const columns: Column<Keyword>[] = [
    { key: "query", header: "Query", rowHeader: true, render: (r) => <span className="font-medium">{r.query}</span> },
    { key: "page", header: "Top page", render: (r) => (r.page ? <ExtLink href={r.page} className="max-w-72 truncate" /> : "—") },
    { key: "clicks", header: "Clicks", align: "right", render: (r) => num(r.clicks) },
    { key: "impressions", header: "Impressions", align: "right", render: (r) => num(r.impressions) },
    { key: "ctr", header: "CTR", align: "right", render: (r) => (r.ctr == null ? "—" : `${r.ctr}%`) },
    { key: "position", header: "Position", align: "right", render: (r) => r.position?.toFixed(1) ?? "—" },
    { key: "change", header: "Change", align: "right", title: "Against the same number of days before", render: (r) => <Movement now={r.position} before={r.previousPosition} /> },
  ];
  const rows = table.data?.rows ?? [];
  const reset = () => {
    setPage(1);
    setSelected(new Set());
  };
  return (
    <div className="space-y-5">
      <SyncStatus projectId={projectId} sync={sync} />
      {!sync.to ? (
        <Note>The first sync is on its way. Keywords appear here once it has stored a few days.</Note>
      ) : (
        <>
          <Suggestions projectId={projectId} />
          <Card>
            <CardHeader
              title="All keywords"
              description={table.data?.period ? `${num(table.data.total)} queries, ${table.data.period.startDate} to ${table.data.period.endDate}. Free: read from the stored daily sync, not counted against anything.` : undefined}
              action={
                <div className="flex flex-wrap gap-2">
                  <SaveButton projectId={projectId} keywords={[...selected]} onDone={() => setSelected(new Set())} />
                  <Button size="sm" disabled={!rows.length} onClick={() => downloadCsv(`search-console-keywords-${days}d.csv`, rows)}>
                    <Download className="size-3.5" aria-hidden /> CSV
                  </Button>
                </div>
              }
            />
            <div className="flex flex-wrap items-end gap-3 border-b border-line px-4 py-3">
              <Segmented
                label="Period"
                value={days}
                onChange={(value) => {
                  setDays(value);
                  reset();
                }}
                options={DAYS}
              />
              <Segmented
                label="Sort"
                value={sort}
                onChange={(value) => {
                  setSort(value);
                  reset();
                }}
                options={[
                  { id: "impressions", label: "Impressions" },
                  { id: "clicks", label: "Clicks" },
                  { id: "position", label: "Position" },
                ]}
              />
              <Input
                type="search"
                placeholder="Filter queries"
                aria-label="Filter queries"
                className="w-56"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  reset();
                }}
              />
            </div>
            {table.isPending && <Spinner />}
            <ErrorNote error={table.error} />
            {table.data && (
              <>
                <DataTable
                  rows={rows}
                  columns={columns}
                  rowKey={(r) => r.query}
                  caption="Stored Search Console keywords"
                  manualSort
                  selection={{ selected, onChange: setSelected, label: (r) => r.query }}
                  empty={<p className="p-4 text-[13px] text-muted">No queries in this period.</p>}
                />
                <Pagination offset={(page - 1) * size} limit={size} count={rows.length} total={table.data.total} disabled={table.isFetching} onChange={(next) => setPage(next / size + 1)} />
              </>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
