"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Download, KeyRound, Plus, RefreshCw, ScanSearch, Send, XCircle } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Suspense, useState } from "react";
import { type Column, DataTable } from "@/components/research/data-table";
import { Pagination } from "@/components/research/pagination";
import { Check, ExtLink, Facts, Note, TabPanel, Tabs, useQueryState } from "@/components/tracking/kit";
import { Badge, Button, Card, CardHeader, EmptyState, ErrorNote, Field, Input, PageHeader, Spinner, Stat, Textarea } from "@/components/ui";
import { api, dateOnly, num } from "@/lib/api";
import { useProject } from "@/lib/hooks";
import { downloadCsv } from "@/lib/lookup";

type Filter = "suggested" | "new" | "changed" | "reindex" | "not_indexed" | "indexed" | "not_inspected" | "excluded" | "all";
type Counts = Record<"total" | "suggested" | "new" | "changed" | "reindex" | "indexed" | "notIndexed" | "notInspected" | "excluded" | "submitted", number>;
type Submission = { id: string; trigger: "manual" | "auto" | "agent"; urlCount: number; urls: string[]; status: number | null; error: string | null; createdAt: string };
type LastSync = {
  pages?: number;
  newPages?: number;
  changedPages?: number;
  gonePages?: number;
  submitted?: number | null;
  inspected?: number | null;
  sitemapsSubmitted?: number | null;
  errors?: string[];
};
type Summary = {
  counts: Counts;
  indexnow: { key: string; keyUrl: string | null; customLocation: string | null; verifiedAt: string | null; checkedAt: string | null; error: string | null; lastSubmission: Submission | null };
  settings: { autoSubmit: boolean; autoSitemaps: boolean; inspectPerDay: number; inspectedToday: number };
  origin: string | null;
  sitemaps: string[];
  lastSync: LastSync | null;
  lastSyncAt: string | null;
  nextSyncAt: string | null;
};
type Page = {
  url: string;
  sources: ("sitemap" | "audit" | "gsc" | "manual")[];
  status: number | null;
  firstSeenAt: string;
  isNew: boolean;
  changedAt: string | null;
  goneAt: string | null;
  excluded: boolean;
  suggested: boolean;
  indexnow: { submittedAt: string | null; status: number | null };
  google: { verdict: string | null; coverage: string | null; crawledAt: string | null; canonical: string | null; inspectedAt: string | null; error: string | null; reindex: string[] };
};
type PageList = { total: number; rows: Page[]; page: number; size: number };
type GoogleState = { configured: boolean; gsc: { siteUrl: string; canWrite: boolean } | null };
type GoogleSitemaps = { siteUrl: string; canSubmit: boolean; sitemaps: { path: string; lastSubmitted: string | null; lastDownloaded: string | null; pending: boolean; errors: number; warnings: number; submittedUrls: number }[] };

const FILTERS: Filter[] = ["suggested", "new", "changed", "reindex", "not_indexed", "indexed", "not_inspected", "excluded", "all"];
const SOURCE: Record<Page["sources"][number], string> = { sitemap: "Sitemap", audit: "Site audit", gsc: "Search Console", manual: "Added" };

function GoogleCell({ page }: { page: Page }) {
  const g = page.google;
  if (g.error) return <span className="text-xs text-neg">{g.error}</span>;
  if (!g.verdict) return <span className="text-xs text-muted">{page.excluded ? "—" : "Not checked yet"}</span>;
  return (
    <div className="space-y-0.5">
      <Badge tone={g.verdict === "PASS" ? "pos" : g.verdict === "FAIL" ? "neg" : "warn"}>{g.verdict === "PASS" ? "Indexed" : "Not indexed"}</Badge>
      {g.coverage && <p className="text-xs text-muted">{g.coverage}</p>}
      {g.crawledAt && <p className="text-xs text-faint">Crawled {dateOnly(g.crawledAt)}</p>}
    </div>
  );
}

function StateCell({ page }: { page: Page }) {
  if (page.goneAt) return <Badge>Gone</Badge>;
  if (page.excluded) return <Badge tone="neg">{page.status && (page.status < 200 || page.status >= 300) ? `HTTP ${page.status}` : "Noindex"}</Badge>;
  return (
    <div className="flex flex-wrap gap-1">
      {page.isNew && <Badge tone="accent">New</Badge>}
      {page.suggested && !page.isNew && page.indexnow.submittedAt && <Badge tone="warn">Changed</Badge>}
      {page.suggested && !page.isNew && !page.indexnow.submittedAt && <Badge tone="accent">To submit</Badge>}
      {page.google.reindex.length > 0 && <Badge tone="warn">Reindex</Badge>}
      {!page.isNew && !page.suggested && !page.google.reindex.length && <span className="text-xs text-muted">Up to date</span>}
    </div>
  );
}

// ── IndexNow setup ──────────────────────────────────────────────────────────

function IndexNowCard({ projectId, summary }: { projectId: string; summary: Summary }) {
  const queryClient = useQueryClient();
  const [advanced, setAdvanced] = useState(false);
  const [location, setLocation] = useState(summary.indexnow.customLocation ?? "");
  const refresh = () => void queryClient.invalidateQueries({ queryKey: ["indexing", projectId] });
  const verify = useMutation({ mutationFn: () => api<{ verified: boolean; keyUrl: string; error: string | null }>(`/projects/${projectId}/indexing/verify`, { method: "POST" }), onSettled: refresh });
  const update = useMutation({ mutationFn: (body: Record<string, unknown>) => api(`/projects/${projectId}/indexing`, { method: "PATCH", body }), onSuccess: refresh });
  const { indexnow } = summary;
  const verified = Boolean(indexnow.verifiedAt);
  const keyUrl = indexnow.keyUrl ?? (summary.origin ? `${summary.origin}/${indexnow.key}.txt` : `https://your-site/${indexnow.key}.txt`);
  return (
    <Card>
      <CardHeader
        title="IndexNow"
        description="Tells Bing, Yandex, Seznam, Naver and Yep the moment a page is new or changed. ChatGPT search and Copilot draw on Bing's index. Google does not take IndexNow; see Google below."
        action={verified ? <Badge tone="pos">Verified</Badge> : <Badge tone="warn">Not set up</Badge>}
      />
      <div className="space-y-4 p-4">
        <ol className="space-y-3 text-[13px]">
          <li className="flex gap-3">
            <span className="font-mono text-faint">1</span>
            <div className="min-w-0 space-y-2">
              <p>Download your key file. It holds only the key, a random code made for this project.</p>
              <div className="flex flex-wrap items-center gap-2">
                <a href={`/api/projects/${projectId}/indexing/key-file`} className="inline-flex h-8 items-center gap-1.5 rounded-md border border-line bg-surface px-3 text-[13px] font-medium hover:bg-sunken">
                  <Download className="size-3.5" aria-hidden /> {indexnow.key}.txt
                </a>
                <code className="rounded-sm bg-sunken px-1.5 py-0.5 font-mono text-xs break-all">{indexnow.key}</code>
              </div>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="font-mono text-faint">2</span>
            <p className="min-w-0">
              Upload it to your site&apos;s root folder, so it opens at <ExtLink href={keyUrl} className="break-all" />. On WordPress, a plugin such as IndexNow or Rank Math can serve the key instead: paste the key above into it.
            </p>
          </li>
          <li className="flex gap-3">
            <span className="font-mono text-faint">3</span>
            <div className="min-w-0 space-y-2">
              <p>Check it is there. OpenSEO checks again before every submission.</p>
              <Button size="sm" variant="primary" loading={verify.isPending} onClick={() => verify.mutate()}>
                <KeyRound className="size-3.5" aria-hidden /> {verified ? "Check again" : "Verify key file"}
              </Button>
            </div>
          </li>
        </ol>
        {verify.data?.verified && <Note>Key file found. The page list is being built; this page fills in within a minute or two.</Note>}
        {indexnow.error && (
          <p role="alert" className="flex items-start gap-2 rounded-md border border-neg/40 bg-neg/5 px-3 py-2 text-[13px] text-neg">
            <XCircle className="mt-0.5 size-4 shrink-0" aria-hidden /> {indexnow.error}
          </p>
        )}
        {verified && (
          <p className="flex items-center gap-2 text-[13px] text-muted">
            <CheckCircle2 className="size-4 text-pos" aria-hidden /> Verified {dateOnly(indexnow.verifiedAt)}
            {indexnow.checkedAt && ` · last checked ${dateOnly(indexnow.checkedAt)}`}
          </p>
        )}
        <Check checked={summary.settings.autoSubmit} disabled={update.isPending} onChange={(autoSubmit) => update.mutate({ autoSubmit })}>
          Submit new and changed pages on their own after each daily sync. A page is only sent again after it changes.
        </Check>
        <ErrorNote error={verify.error ?? update.error} />
        <button type="button" className="text-xs text-muted underline underline-offset-2" onClick={() => setAdvanced(!advanced)} aria-expanded={advanced}>
          {advanced ? "Hide" : "Show"} key options
        </button>
        {advanced && (
          <div className="space-y-3 rounded-md border border-line p-3">
            <Field label="Key file location" hint="Leave empty for the site root. A file in a folder limits submissions to pages inside that folder.">
              <Input value={location} onChange={(event) => setLocation(event.target.value)} placeholder={keyUrl} />
            </Field>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={() => update.mutate({ keyLocation: location.trim() || null })} loading={update.isPending}>
                Save location
              </Button>
              <Button size="sm" variant="ghost" onClick={() => update.mutate({ newKey: true })}>
                Make a new key
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

// ── Google ──────────────────────────────────────────────────────────────────

function GoogleCard({ projectId, summary, google }: { projectId: string; summary: Summary; google: GoogleState | undefined }) {
  const queryClient = useQueryClient();
  const [perDay, setPerDay] = useState(String(summary.settings.inspectPerDay));
  const connected = Boolean(google?.gsc);
  const sitemaps = useQuery({
    queryKey: ["indexing", projectId, "google-sitemaps"],
    queryFn: () => api<GoogleSitemaps>(`/projects/${projectId}/indexing/google-sitemaps`),
    enabled: connected,
  });
  const update = useMutation({ mutationFn: (body: Record<string, unknown>) => api(`/projects/${projectId}/indexing`, { method: "PATCH", body }), onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["indexing", projectId] }) });
  const submit = useMutation({
    mutationFn: () => api<{ submitted: string[]; outsideProperty: string[] }>(`/projects/${projectId}/indexing/google-sitemaps`, { method: "POST", body: {} }),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["indexing", projectId, "google-sitemaps"] }),
  });
  return (
    <Card>
      <CardHeader
        title="Google"
        description="Google takes no pushes for ordinary pages. OpenSEO checks each page with Search Console's URL Inspection and flags the ones Google has not indexed or should crawl again, and can submit your sitemaps."
        action={connected ? <Badge tone="pos">Connected</Badge> : <Badge>Not connected</Badge>}
      />
      <div className="space-y-4 p-4">
        {!connected ? (
          <EmptyState title="Connect Search Console">
            Google&apos;s index status per page and sitemap submission need this project&apos;s Search Console.{" "}
            <Link href={`/p/${projectId}/search`} className="underline underline-offset-2">
              Connect it under Search performance
            </Link>
            .
          </EmptyState>
        ) : (
          <>
            <Facts
              rows={[
                ["Property", google!.gsc!.siteUrl],
                ["Inspected today", `${num(summary.settings.inspectedToday)} of ${num(summary.settings.inspectPerDay)}`],
              ]}
            />
            <form
              className="flex flex-wrap items-end gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                update.mutate({ inspectPerDay: Number(perDay) });
              }}
            >
              <Field label="Inspections per day" hint="Google allows 2,000 a day per property, shared with anything else using it.">
                <Input type="number" min={0} max={2000} value={perDay} onChange={(event) => setPerDay(event.target.value)} className="w-28" />
              </Field>
              <Button size="sm" type="submit" loading={update.isPending}>
                Save
              </Button>
            </form>
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-[13px] font-medium">Sitemaps in Search Console</p>
                <Button size="sm" disabled={!sitemaps.data?.canSubmit || !summary.sitemaps.length} loading={submit.isPending} onClick={() => submit.mutate()}>
                  <Send className="size-3.5" aria-hidden /> Submit {summary.sitemaps.length || ""} sitemap{summary.sitemaps.length === 1 ? "" : "s"}
                </Button>
              </div>
              {sitemaps.isPending && <Spinner />}
              {sitemaps.data && !sitemaps.data.canSubmit && (
                <Note>
                  This Search Console connection is read-only.{" "}
                  <a href={`/api/google/gsc/connect?returnTo=${encodeURIComponent(`/p/${projectId}/indexing`)}`} className="font-medium underline underline-offset-2">
                    Reconnect it
                  </a>{" "}
                  and allow full access to submit sitemaps from here.
                </Note>
              )}
              {sitemaps.data?.sitemaps.length ? (
                <ul className="divide-y divide-line rounded-md border border-line text-[13px]">
                  {sitemaps.data.sitemaps.map((s) => (
                    <li key={s.path} className="flex flex-wrap items-center justify-between gap-2 px-3 py-2">
                      <ExtLink href={s.path} className="max-w-full truncate" />
                      <span className="text-xs text-muted">
                        {s.pending ? "Pending · " : ""}
                        {num(s.submittedUrls)} URLs · read {s.lastDownloaded ? dateOnly(s.lastDownloaded) : "never"}
                        {s.errors ? <span className="text-neg"> · {s.errors} errors</span> : null}
                        {s.warnings ? <span className="text-warn"> · {s.warnings} warnings</span> : null}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : sitemaps.data ? (
                <p className="text-xs text-muted">Google has no sitemaps for this property yet.</p>
              ) : null}
              {submit.data && <p className="text-xs text-muted">Submitted {submit.data.submitted.length} to Google.{submit.data.outsideProperty.length ? ` ${submit.data.outsideProperty.length} were outside the property and skipped.` : ""}</p>}
              <Check checked={summary.settings.autoSitemaps} disabled={update.isPending || !sitemaps.data?.canSubmit} onChange={(autoSitemaps) => update.mutate({ autoSitemaps })}>
                Submit the sitemaps to Google again when a sync finds new pages.
              </Check>
            </div>
            <ErrorNote error={sitemaps.error ?? update.error ?? submit.error} />
          </>
        )}
      </div>
    </Card>
  );
}

// ── Pages ───────────────────────────────────────────────────────────────────

function AddPages({ projectId, onDone }: { projectId: string; onDone: () => void }) {
  const [text, setText] = useState("");
  const add = useMutation({
    mutationFn: () => api<{ added: number }>(`/projects/${projectId}/indexing/pages`, { method: "POST", body: { urls: text.split(/\s+/).map((u) => u.trim()).filter(Boolean) } }),
    onSuccess: () => {
      setText("");
      onDone();
    },
  });
  return (
    <form
      className="space-y-2 border-b border-line p-4"
      onSubmit={(event) => {
        event.preventDefault();
        if (text.trim()) add.mutate();
      }}
    >
      <Field label="Add pages" hint="Full URLs on this site, one per line, for pages no sitemap or crawl has found yet.">
        <Textarea rows={3} value={text} onChange={(event) => setText(event.target.value)} placeholder="https://example.com/new-page" />
      </Field>
      <Button size="sm" type="submit" loading={add.isPending}>
        Add
      </Button>
      <ErrorNote error={add.error} />
    </form>
  );
}

function PagesCard({ projectId, summary, gscConnected }: { projectId: string; summary: Summary; gscConnected: boolean }) {
  const size = 50;
  const queryClient = useQueryClient();
  const [filter, setFilter] = useQueryState<Filter>("filter", FILTERS, "suggested");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [adding, setAdding] = useState(false);
  const query = { filter, page, size, search: search.trim() || undefined };
  const list = useQuery({ queryKey: ["indexing", projectId, "pages", query], queryFn: () => api<PageList>(`/projects/${projectId}/indexing/pages`, { query }), placeholderData: keepPreviousData });
  const refresh = () => {
    setSelected(new Set());
    void queryClient.invalidateQueries({ queryKey: ["indexing", projectId] });
  };
  const submit = useMutation({
    mutationFn: (body: { urls: string[] } | { suggested: true }) => api<{ submitted: number; skipped: string[] }>(`/projects/${projectId}/indexing/indexnow`, { method: "POST", body }),
    onSuccess: refresh,
  });
  const inspect = useMutation({
    mutationFn: () => api<{ results: unknown[]; overQuota: string[]; outsideProperty: string[] }>(`/projects/${projectId}/indexing/inspect`, { method: "POST", body: { urls: [...selected].slice(0, 50) } }),
    onSuccess: refresh,
  });
  const c = summary.counts;
  const verified = Boolean(summary.indexnow.verifiedAt);
  const columns: Column<Page>[] = [
    { key: "url", header: "Page", rowHeader: true, render: (r) => <ExtLink href={r.url} className="max-w-96 truncate" /> },
    { key: "state", header: "State", render: (r) => <StateCell page={r} /> },
    { key: "sources", header: "Found in", render: (r) => <span className="text-xs text-muted">{r.sources.map((s) => SOURCE[s]).join(", ") || "—"}</span> },
    { key: "firstSeenAt", header: "First seen", render: (r) => <span className="text-xs">{dateOnly(r.firstSeenAt)}</span> },
    { key: "changedAt", header: "Changed", render: (r) => <span className="text-xs">{r.changedAt ? dateOnly(r.changedAt) : "—"}</span> },
    {
      key: "indexnow",
      header: "IndexNow",
      render: (r) => <span className="text-xs">{r.indexnow.submittedAt ? `Sent ${dateOnly(r.indexnow.submittedAt)}` : <span className="text-muted">Not sent</span>}</span>,
    },
    { key: "google", header: "Google", render: (r) => <GoogleCell page={r} /> },
    { key: "reasons", header: "To do", render: (r) => <span className="text-xs text-warn">{r.google.reindex.join(" · ")}</span> },
  ];
  const rows = list.data?.rows ?? [];
  return (
    <Card>
      <CardHeader
        title="Pages"
        description="Every page found in your sitemaps, latest site audit and Search Console, refreshed daily."
        action={
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="primary" disabled={!verified || !c.suggested} loading={submit.isPending && !selected.size} onClick={() => submit.mutate({ suggested: true })}>
              <Send className="size-3.5" aria-hidden /> Submit all {num(c.suggested)} suggested
            </Button>
            <Button size="sm" onClick={() => setAdding(!adding)}>
              <Plus className="size-3.5" aria-hidden /> Add pages
            </Button>
            <Button size="sm" disabled={!rows.length} onClick={() => downloadCsv(`indexing-${filter}.csv`, rows.map((r) => ({ url: r.url, sources: r.sources.join(" "), firstSeen: r.firstSeenAt, changed: r.changedAt, indexnowSent: r.indexnow.submittedAt, googleVerdict: r.google.verdict, googleCoverage: r.google.coverage, googleCrawled: r.google.crawledAt, toDo: r.google.reindex.join("; ") })))}>
              <Download className="size-3.5" aria-hidden /> CSV
            </Button>
          </div>
        }
      />
      {adding && <AddPages projectId={projectId} onDone={() => { setAdding(false); refresh(); }} />}
      <div className="px-4 pt-3">
        <Tabs
          label="Page filters"
          value={filter}
          onChange={(value) => {
            setFilter(value);
            setPage(1);
            setSelected(new Set());
          }}
          tabs={[
            { id: "suggested", label: "Suggested", count: c.suggested },
            { id: "new", label: "New", count: c.new },
            { id: "changed", label: "Changed", count: c.changed },
            { id: "reindex", label: "Needs Google", count: c.reindex },
            { id: "not_indexed", label: "Not indexed", count: c.notIndexed },
            { id: "indexed", label: "Indexed", count: c.indexed },
            { id: "not_inspected", label: "Not checked", count: c.notInspected },
            { id: "excluded", label: "Excluded", count: c.excluded },
            { id: "all", label: "All", count: c.total },
          ]}
        />
      </div>
      <TabPanel id={filter}>
        <div className="flex flex-wrap items-center gap-2 border-b border-line px-4 pb-3">
          <Input type="search" placeholder="Filter URLs" aria-label="Filter URLs" className="w-64" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} />
          <Button size="sm" disabled={!verified || !selected.size} loading={submit.isPending && selected.size > 0} onClick={() => submit.mutate({ urls: [...selected] })}>
            <Send className="size-3.5" aria-hidden /> Submit {selected.size || ""} to IndexNow
          </Button>
          <Button size="sm" disabled={!gscConnected || !selected.size} loading={inspect.isPending} onClick={() => inspect.mutate()}>
            <ScanSearch className="size-3.5" aria-hidden /> Check {Math.min(selected.size, 50) || ""} in Google
          </Button>
          {!verified && <span className="text-xs text-muted">Verify the IndexNow key file to submit.</span>}
        </div>
        {submit.data && <p className="border-b border-line px-4 py-2 text-xs text-muted">Sent {num(submit.data.submitted)} to IndexNow.{submit.data.skipped.length ? ` ${submit.data.skipped.length} skipped: not on the key file's host or folder.` : ""}</p>}
        {inspect.data && (
          <p className="border-b border-line px-4 py-2 text-xs text-muted">
            Checked {inspect.data.results.length} in Google.{inspect.data.overQuota.length ? ` ${inspect.data.overQuota.length} left for tomorrow: today's inspections are used up.` : ""}
            {inspect.data.outsideProperty.length ? ` ${inspect.data.outsideProperty.length} are outside the Search Console property.` : ""}
          </p>
        )}
        <div className="px-4">
          <ErrorNote error={submit.error ?? inspect.error ?? list.error} />
        </div>
        {list.isPending && <Spinner />}
        {list.data && (
          <>
            <DataTable
              rows={rows}
              columns={columns}
              rowKey={(r) => r.url}
              caption="Pages"
              manualSort
              selection={{ selected, onChange: setSelected, label: (r) => r.url }}
              empty={<p className="p-4 text-[13px] text-muted">No pages here.</p>}
            />
            <Pagination offset={(page - 1) * size} limit={size} count={rows.length} total={list.data.total} disabled={list.isFetching} onChange={(next) => setPage(next / size + 1)} />
          </>
        )}
      </TabPanel>
    </Card>
  );
}

function SubmissionLog({ projectId }: { projectId: string }) {
  const log = useQuery({ queryKey: ["indexing", projectId, "submissions"], queryFn: () => api<Submission[]>(`/projects/${projectId}/indexing/submissions`) });
  if (!log.data?.length) return null;
  const columns: Column<Submission>[] = [
    { key: "createdAt", header: "When", rowHeader: true, render: (r) => <span className="text-xs">{new Date(r.createdAt).toLocaleString()}</span> },
    { key: "trigger", header: "By", render: (r) => <span className="text-xs">{r.trigger === "auto" ? "Daily sync" : r.trigger === "agent" ? "AI agent" : "You"}</span> },
    { key: "urlCount", header: "Pages", align: "right", render: (r) => num(r.urlCount) },
    { key: "status", header: "Result", render: (r) => (r.error ? <span className="text-xs text-neg">{r.error}</span> : <Badge tone="pos">{r.status === 202 ? "Accepted" : "OK"}</Badge>) },
  ];
  return (
    <Card>
      <CardHeader title="IndexNow log" description="The last 50 submissions." />
      <DataTable rows={log.data} columns={columns} rowKey={(r) => r.id} caption="IndexNow submissions" />
    </Card>
  );
}

// ── Page ────────────────────────────────────────────────────────────────────

function Indexing() {
  const { projectId } = useParams<{ projectId: string }>();
  const queryClient = useQueryClient();
  const project = useProject(projectId);
  const summary = useQuery({ queryKey: ["indexing", projectId, "summary"], queryFn: () => api<Summary>(`/projects/${projectId}/indexing`), refetchInterval: 30_000 });
  const google = useQuery({ queryKey: ["google", projectId], queryFn: () => api<GoogleState>(`/projects/${projectId}/google`) });
  const sync = useMutation({ mutationFn: () => api(`/projects/${projectId}/indexing/sync`, { method: "POST" }), onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["indexing", projectId] }) });
  const data = summary.data;
  const last = data?.lastSync;

  return (
    <>
      <PageHeader
        title="Indexing"
        description="Get new and changed pages found fast: IndexNow for Bing and the engines that share it, and Google's index status for every page. Free."
        action={
          project.data?.domain ? (
            <Button loading={sync.isPending} onClick={() => sync.mutate()}>
              <RefreshCw className="size-4" aria-hidden /> Sync pages now
            </Button>
          ) : undefined
        }
      />
      <div className="space-y-6">
        {(summary.isPending || project.isPending) && <Spinner />}
        <ErrorNote error={summary.error ?? project.error ?? sync.error} />
        {project.data && !project.data.domain && (
          <EmptyState title="Add the website first">
            Indexing needs the project&apos;s website. Set it in{" "}
            <Link href={`/p/${projectId}`} className="underline underline-offset-2">
              project settings
            </Link>
            .
          </EmptyState>
        )}
        {data && project.data?.domain && (
          <>
            {sync.isSuccess && <Note>Sync queued. Pages update within a minute or two.</Note>}
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <Stat label="Pages" value={num(data.counts.total)} sub={data.lastSyncAt ? `Synced ${dateOnly(data.lastSyncAt)}` : "Not synced yet"} />
              <Stat label="Suggested for IndexNow" value={num(data.counts.suggested)} sub={`${num(data.counts.new)} new · ${num(data.counts.changed)} changed`} />
              <Stat label="Indexed in Google" value={num(data.counts.indexed)} sub={`${num(data.counts.notIndexed)} not indexed · ${num(data.counts.notInspected)} not checked`} />
              <Stat label="Need Google's attention" value={num(data.counts.reindex)} sub="Changed since crawled, or not indexed" />
            </div>
            {last?.errors?.length ? (
              <Note tone="warn">
                Last sync: {last.errors.join(" · ")}
              </Note>
            ) : null}
            {last && last.pages != null && (
              <p className="text-xs text-muted">
                Last sync found {num(last.pages)} pages: {num(last.newPages ?? 0)} new, {num(last.changedPages ?? 0)} changed, {num(last.gonePages ?? 0)} gone
                {last.submitted != null ? `, ${num(last.submitted)} sent to IndexNow` : ""}
                {last.inspected != null ? `, ${num(last.inspected)} checked in Google` : ""}.
                {data.sitemaps.length ? ` Sitemaps: ${data.sitemaps.join(", ")}` : ""}
              </p>
            )}
            <div className="grid gap-5 lg:grid-cols-2 [&>*]:min-w-0">
              <IndexNowCard key={`${data.indexnow.key}-${data.indexnow.customLocation ?? ""}`} projectId={projectId} summary={data} />
              <GoogleCard projectId={projectId} summary={data} google={google.data} />
            </div>
            <PagesCard projectId={projectId} summary={data} gscConnected={Boolean(google.data?.gsc)} />
            <SubmissionLog projectId={projectId} />
          </>
        )}
      </div>
    </>
  );
}

export default function IndexingPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <Indexing />
    </Suspense>
  );
}
