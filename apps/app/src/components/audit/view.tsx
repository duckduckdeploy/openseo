"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Play, Trash2 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { ConfirmDialog, isActive, Note, RunProgress, StatusBadge, TabPanel, Tabs } from "@/components/tracking/kit";
import { Button, ErrorNote, PageHeader, Select, Spinner } from "@/components/ui";
import { api, dateTime, num } from "@/lib/api";
import { AllIssues } from "./issues";
import { ExportsTab, LinksTab } from "./links";
import { Overview } from "./overview";
import { PagesTab } from "./pages";
import { type AuditForm, HistoryTable, StartAudit } from "./setup";
import { type Audit, type AuditRow, RENDER_LABEL, STOP_REASON } from "./types";

const TABS = ["overview", "issues", "pages", "links", "exports", "history"] as const;
/** What a running audit is doing once every page is crawled. */
const PHASE_TITLE: Record<string, string> = {
  "site-files": "Checking robots.txt, sitemaps and llms.txt",
  resources: "Checking images, scripts and stylesheets",
  "external-links": "Checking links to other sites",
  analysis: "Running the checks and saving the results",
};
type TabId = (typeof TABS)[number];

export type AuditViewProps = {
  auditId: string;
  /** Lists this audit's siblings, newest first: the project's audits or the user's tool audits. */
  historyPath: string;
  hrefOf: (id: string) => string;
  /** Where a new crawl is posted, and the form it starts from. */
  newCrawl: { path: string; form: AuditForm; maxPages: number; paidOptions?: boolean };
  /** Extra content for the History tab, such as the project's schedule settings. */
  historyExtra?: ReactNode;
  /** An extra tab, such as Lighthouse in projects. */
  extraTab?: { label: string; content: ReactNode };
};

export function AuditView({ auditId, historyPath, hrefOf, newCrawl, historyExtra, extraTab }: AuditViewProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  // The tab and the open issue live in the URL, changed together so neither overwrites the other.
  const params = useSearchParams();
  const pathname = usePathname();
  const rawTab = params.get("tab");
  const tab: TabId | "extra" = (TABS as readonly string[]).includes(rawTab ?? "") || (extraTab && rawTab === "extra") ? (rawTab as TabId | "extra") : "overview";
  const issue = params.get("issue") ?? "";
  const setParams = (changes: Record<string, string>) => {
    const copy = new URLSearchParams(params);
    for (const [key, value] of Object.entries(changes)) {
      if (!value || (key === "tab" && value === "overview")) copy.delete(key);
      else copy.set(key, value);
    }
    const query = copy.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };
  const setTab = (next: TabId | "extra") => setParams({ tab: next, issue: next === "issues" ? issue : "" });
  const setIssue = (type: string) => setParams({ issue: type });
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const audit = useQuery({
    queryKey: ["audit", auditId, "detail"],
    queryFn: () => api<Audit>(`/audits/${auditId}`),
    refetchInterval: (query) => (isActive(query.state.data?.status) ? 2000 : false),
  });
  const history = useQuery({ queryKey: ["audits", historyPath], queryFn: () => api<AuditRow[]>(historyPath) });

  // When the crawl ends, its pages, issues and links exist for the first time: refresh them.
  const status = audit.data?.status;
  const wasActive = useRef(false);
  useEffect(() => {
    if (isActive(status)) wasActive.current = true;
    else if (status && wasActive.current) {
      wasActive.current = false;
      void queryClient.invalidateQueries({ queryKey: ["audit", auditId] });
      void queryClient.invalidateQueries({ queryKey: ["audits", historyPath] });
    }
  }, [status, auditId, historyPath, queryClient]);

  const cancel = useMutation({
    mutationFn: () => api(`/audits/${auditId}/cancel`, { method: "POST" }),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["audit", auditId, "detail"] }),
  });
  const remove = useMutation({
    mutationFn: () => api(`/audits/${auditId}`, { method: "DELETE" }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["audits", historyPath] });
      const next = history.data?.find((a) => a.id !== auditId);
      router.push(next ? hrefOf(next.id) : hrefOf(""));
    },
  });

  if (audit.isPending) return <Spinner />;
  if (audit.error) return <ErrorNote error={audit.error} />;

  const data = audit.data;
  const summary = data.summary;
  const running = isActive(data.status);
  const finished = (history.data ?? []).filter((a) => a.status === "completed" || a.id === auditId);
  const anyRunning = (history.data ?? []).some((a) => isActive(a.status));
  const openIssue = (type: string) => setParams({ tab: "issues", issue: type });

  return (
    <>
      <PageHeader
        title="Site audit"
        description={
          <span className="font-mono text-xs break-all">
            {summary?.finalStartUrl ?? data.startUrl} · up to {num(data.maxPages)} pages · {RENDER_LABEL[data.renderMode]}
            {data.useFallback ? " · blocks bypassed" : ""}
          </span>
        }
        action={
          <div className="flex flex-wrap items-center gap-2">
            {finished.length > 1 && (
              <Select aria-label="Audit date" value={auditId} onChange={(e) => router.push(hrefOf(e.target.value))} className="h-8! w-auto!">
                {finished.map((a) => (
                  <option key={a.id} value={a.id}>
                    {dateTime(a.createdAt)}
                  </option>
                ))}
              </Select>
            )}
            <StatusBadge status={data.status} />
            <Button variant="primary" size="sm" onClick={() => setCreating(true)} disabled={anyRunning || creating}>
              <Play className="size-3.5" aria-hidden /> New crawl
            </Button>
            <Button variant="danger" size="sm" onClick={() => setDeleting(true)} disabled={running} aria-label="Delete this audit">
              <Trash2 className="size-3.5" aria-hidden />
            </Button>
          </div>
        }
      />

      {creating && (
        <StartAudit
          path={newCrawl.path}
          form={newCrawl.form}
          maxPages={newCrawl.maxPages}
          paidOptions={newCrawl.paidOptions}
          onCancel={() => setCreating(false)}
          onStarted={(started) => {
            setCreating(false);
            void queryClient.invalidateQueries({ queryKey: ["audits", historyPath] });
            router.push(hrefOf(started.id));
          }}
        />
      )}

      {running && (
        <div className="mb-4 space-y-3">
          <RunProgress
            title={PHASE_TITLE[data.phase ?? ""] ?? "Crawling the site"}
            status={data.status}
            done={data.pagesCrawled}
            total={data.maxPages}
            totalIsLimit
            unit="pages"
            onCancel={() => cancel.mutate()}
            cancelling={cancel.isPending}
            cancelError={cancel.error}
          />
          <Note>
            {data.phase
              ? "Every page is crawled. These last checks wait between requests too, so they can take a few minutes on a large site."
              : "The crawl waits between requests so it does not strain the site. Progress updates every 10 pages; results appear when it finishes."}
          </Note>
        </div>
      )}
      {data.status === "failed" && <ErrorNote error={new Error(`The audit failed: ${data.error ?? "unknown error"}`)} />}
      {data.status === "cancelled" && !summary && <Note>This audit was cancelled before any results were stored.</Note>}

      {summary && (
        <>
          {summary.truncated && (
            <div className="mb-4">
              <Note tone="warn">
                This crawl stopped with URLs still waiting ({STOP_REASON[summary.stoppedReason ?? ""]?.toLowerCase() ?? "it did not finish"}). Findings that compare pages, such as orphan pages and duplicates, are partial.
                Raise the page limit to cover the whole site.
              </Note>
            </div>
          )}
          {summary.paid?.unavailable && (
            <div className="mb-4">
              <Note tone="warn">YepAPI could not be used for rendering or blocked pages: {summary.paid.unavailable}. The crawl ran without it.</Note>
            </div>
          )}
          <Tabs
            label="Audit sections"
            value={tab}
            onChange={setTab}
            tabs={[
              { id: "overview", label: "Overview" },
              { id: "issues", label: "All issues", count: data.issueGroups.filter((g) => g.urls > 0).length },
              { id: "pages", label: "Pages", count: summary.pagesTotal ?? null },
              { id: "links", label: "Links" },
              { id: "exports", label: "Exports" },
              { id: "history", label: "History" },
              ...(extraTab ? [{ id: "extra" as const, label: extraTab.label }] : []),
            ]}
          />
          <TabPanel id={tab}>
            {tab === "overview" && <Overview audit={data} history={history.data ?? []} onOpenIssue={openIssue} />}
            {tab === "issues" && <AllIssues audit={data} history={history.data ?? []} open={issue} onOpen={setIssue} />}
            {tab === "pages" && <PagesTab audit={data} />}
            {tab === "links" && <LinksTab audit={data} />}
            {tab === "exports" && <ExportsTab audit={data} />}
            {tab === "history" && (
              <div className="space-y-4">
                {history.data && <HistoryTable audits={history.data} hrefOf={hrefOf} currentId={auditId} />}
                {historyExtra}
              </div>
            )}
            {tab === "extra" && extraTab?.content}
          </TabPanel>
        </>
      )}
      {!summary && (tab === "history" || !running) && history.data && history.data.length > 1 && <HistoryTable audits={history.data} hrefOf={hrefOf} currentId={auditId} />}

      <ConfirmDialog
        open={deleting}
        onClose={() => setDeleting(false)}
        onConfirm={() => remove.mutate()}
        title="Delete this audit?"
        confirmLabel="Delete audit"
        danger
        pending={remove.isPending}
        error={remove.error}
      >
        <p>The audit of {data.startUrl} and all of its pages, issues and links will be deleted. This cannot be undone.</p>
      </ConfirmDialog>
    </>
  );
}
