"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Fragment, useEffect, useMemo, useState } from "react";
import { ExtLink, Segmented } from "@/components/tracking/kit";
import { Badge, Button, EmptyState, ErrorNote, Input, Spinner, Table } from "@/components/ui";
import { api, num } from "@/lib/api";
import { Delta, DownloadLink, SeverityIcon, StatusCode, TrendStrip } from "./bits";
import { type Audit, type AuditRow, type CatalogEntry, indexableQuery, type Issue, type IssueChange, type IssueGroup, rowTrend, SEVERITIES, type Severity, siteHistory } from "./types";

const PAGE_SIZE = 50;
const CHANGE_LABEL: Record<IssueChange, string> = { new: "New", added: "Added", removed: "Fixed", missing: "Not crawled" };

function IssueDetail({ audit, group, hasLinks }: { audit: Audit; group: IssueGroup; hasLinks: boolean }) {
  const [change, setChange] = useState<IssueChange | "all">("all");
  const [offset, setOffset] = useState(0);
  useEffect(() => setOffset(0), [change]);
  const issues = useQuery({
    queryKey: ["audit", audit.id, "issues", group.key, change, offset],
    queryFn: () =>
      api<{ total: number; issues: Issue[] }>(`/audits/${audit.id}/issues`, { query: { type: group.type, indexable: group.indexable ?? undefined, change: change === "all" ? undefined : change, limit: PAGE_SIZE, offset } }),
    placeholderData: keepPreviousData,
  });
  const total = issues.data?.total ?? 0;
  const changes: { id: IssueChange | "all"; label: string }[] = [
    { id: "all", label: `Now (${num(group.urls)})` },
    ...(audit.previous
      ? ([
          ["new", group.new],
          ["added", group.added],
          ["removed", group.removed ?? 0],
          ["missing", group.missing ?? 0],
        ] as const)
          .filter(([, n]) => n > 0)
          .map(([id, n]) => ({ id, label: `${CHANGE_LABEL[id]} (${num(n)})` }))
      : []),
  ];

  return (
    <div className="space-y-3 border-t border-line bg-sunken/40 px-4 py-3">
      <div className="grid max-w-4xl gap-1.5 text-[13px]">
        <p className="text-muted">{group.description}</p>
        <p>
          <span className="mr-1.5 font-mono text-[11px] font-medium uppercase tracking-wide text-muted">How to fix</span>
          {group.howToFix}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {changes.length > 1 && <Segmented label="Which URLs" value={change} onChange={setChange} options={changes} />}
        <div className="ml-auto flex flex-wrap gap-2">
          <DownloadLink href={`/audits/${audit.id}/export/issue/${group.type}.csv${indexableQuery(group)}`}>Pages CSV</DownloadLink>
          {hasLinks && <DownloadLink href={`/audits/${audit.id}/export/issue/${group.type}-links.csv${indexableQuery(group)}`}>Links CSV</DownloadLink>}
        </div>
      </div>
      {issues.isPending && <Spinner />}
      <ErrorNote error={issues.error} />
      {issues.data && issues.data.issues.length === 0 && <p className="text-[13px] text-muted">No URLs in this view.</p>}
      {issues.data && issues.data.issues.length > 0 && (
        <div className="overflow-hidden rounded-md border border-line bg-surface">
          <Table className={issues.isPlaceholderData ? "relative opacity-60" : "relative"}>
            <thead>
              <tr>
                <th scope="col">URL</th>
                <th scope="col" className="text-right">
                  PR
                </th>
                <th scope="col">Status</th>
                <th scope="col">Detail</th>
                {audit.previous && <th scope="col">Change</th>}
              </tr>
            </thead>
            <tbody>
              {issues.data.issues.map((issue) => (
                <tr key={issue.id}>
                  <td className="max-w-md min-w-56">
                    <ExtLink href={issue.url} className="font-mono text-xs" />
                    {issue.title && <span className="block truncate text-xs text-muted">{issue.title}</span>}
                  </td>
                  <td className="text-right font-mono tabular">{issue.pageRank ?? "—"}</td>
                  <td>
                    <StatusCode status={issue.status} />
                  </td>
                  <td className="min-w-64 text-[13px]">
                    {issue.detail}
                    {issue.relatedUrls && issue.relatedUrls.length > 0 && (
                      <details className="mt-1">
                        <summary className="cursor-pointer text-xs text-muted">
                          {issue.relatedUrls.length} related {issue.relatedUrls.length === 1 ? "URL" : "URLs"}
                        </summary>
                        <ul className="mt-1 space-y-0.5">
                          {issue.relatedUrls.map((related) => (
                            <li key={related}>
                              <ExtLink href={related} className="font-mono text-xs text-muted" />
                            </li>
                          ))}
                        </ul>
                      </details>
                    )}
                  </td>
                  {audit.previous && <td>{issue.change ? <Badge tone={issue.change === "removed" ? "pos" : issue.change === "missing" ? "neutral" : "warn"}>{CHANGE_LABEL[issue.change]}</Badge> : <span className="text-faint">—</span>}</td>}
                </tr>
              ))}
            </tbody>
          </Table>
          {total > PAGE_SIZE && (
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-3 py-2">
              <p className="font-mono text-[11px] text-muted tabular">
                {num(offset + 1)}–{num(offset + issues.data.issues.length)} of {num(total)}
              </p>
              <div className="flex gap-2">
                <Button size="sm" disabled={offset === 0} onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}>
                  Previous
                </Button>
                <Button size="sm" disabled={offset + PAGE_SIZE >= total} onClick={() => setOffset(offset + PAGE_SIZE)}>
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

type View = "actual" | "new" | "all";
const LOWER: Record<Severity, Severity> = { critical: "warning", warning: "info", info: "info" };

/** Every row the audit tracks: the ones it found, plus every other check (each half of a split one) at zero. */
function trackedRows(audit: Audit, catalog: Record<string, CatalogEntry>): IssueGroup[] {
  const found = new Set(audit.issueGroups.map((g) => g.key));
  const rows = [...audit.issueGroups];
  for (const [type, def] of Object.entries(catalog)) {
    for (const indexable of def.split ? [true, false] : [null]) {
      const key = indexable === null ? type : `${type}:${indexable ? "indexable" : "not-indexable"}`;
      if (found.has(key)) continue;
      rows.push({
        type,
        key,
        indexable,
        severity: indexable === false ? LOWER[def.severity] : def.severity,
        count: 0,
        urls: 0,
        new: 0,
        added: 0,
        before: null,
        removed: null,
        missing: null,
        title: def.title,
        description: def.description,
        howToFix: def.howToFix,
        category: def.category,
        isChange: def.category === "Changes",
      });
    }
  }
  return rows;
}

const Count = ({ value, tone }: { value: number | null; tone?: "neg" | "pos" }) =>
  value ? <span className={tone === "neg" ? "font-mono text-neg tabular" : tone === "pos" ? "font-mono text-pos tabular" : "font-mono tabular"}>{num(value)}</span> : <span className="font-mono text-faint tabular">0</span>;

/**
 * Every issue the way Ahrefs' "All issues" lists them: by report section, Links and Content split into
 * indexable and non-indexable pages, with the change since the previous audit and a trend per row.
 */
export function AllIssues({ audit, history, open, onOpen }: { audit: Audit; history: AuditRow[]; open: string; onOpen: (key: string) => void }) {
  const [view, setView] = useState<View>("actual");
  const [severity, setSeverity] = useState<Severity | "all">("all");
  const [search, setSearch] = useState("");
  const categories = useQuery({ queryKey: ["audit-categories"], queryFn: () => api<string[]>("/audit/issue-categories"), staleTime: Infinity });
  const catalog = useQuery({ queryKey: ["audit-catalog"], queryFn: () => api<Record<string, CatalogEntry>>("/audit/issue-catalog"), staleTime: Infinity });
  const exportsList = useQuery({
    queryKey: ["audit", audit.id, "exports"],
    queryFn: () => api<{ issues: { type: string; hasLinks: boolean }[] }>(`/audits/${audit.id}/exports`),
  });
  const withLinks = new Set(exportsList.data?.issues.filter((i) => i.hasLinks).map((i) => i.type));
  const audits = useMemo(() => siteHistory(audit, history), [audit, history]);
  const tracked = useMemo(() => (catalog.data ? trackedRows(audit, catalog.data) : null), [audit, catalog.data]);

  // Scroll an issue opened from the overview into view.
  useEffect(() => {
    if (open) document.getElementById(`issue-${open}`)?.scrollIntoView({ block: "start" });
  }, [open]);

  const isNew = (g: IssueGroup) => g.new + g.added > 0;
  const rows = view === "all" ? (tracked ?? audit.issueGroups) : audit.issueGroups;
  const needle = search.trim().toLowerCase();
  const groups = rows.filter(
    (g) =>
      (view === "all" || (view === "new" ? isNew(g) : g.urls > 0 || g.key === open)) &&
      (severity === "all" || g.severity === severity) &&
      (!needle || g.title.toLowerCase().includes(needle)),
  );
  const order = categories.data ?? [...new Set(groups.map((g) => g.category))];
  const columns = audit.previous ? 8 : 3;
  const actual = audit.issueGroups.filter((g) => g.urls > 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Segmented
          label="Which issues"
          value={view}
          onChange={setView}
          options={[
            { id: "actual", label: `Actual (${num(actual.length)})` },
            ...(audit.previous ? [{ id: "new" as const, label: `New (${num(audit.issueGroups.filter(isNew).length)})` }] : []),
            { id: "all", label: tracked ? `All tracked (${num(tracked.length)})` : "All tracked" },
          ]}
        />
        <Segmented
          label="Severity"
          value={severity}
          onChange={setSeverity}
          options={[{ id: "all", label: "All" }, ...SEVERITIES.map((s) => ({ id: s, label: s === "critical" ? "Errors" : s === "warning" ? "Warnings" : "Notices" }))]}
        />
        <div className="w-full sm:w-56">
          <Input type="search" aria-label="Find an issue" placeholder="Find an issue" value={search} onChange={(e) => setSearch(e.target.value)} className="h-8!" />
        </div>
        <div className="ml-auto">
          <DownloadLink href={`/audits/${audit.id}/export/issues.zip`}>Export all issues</DownloadLink>
        </div>
      </div>
      {view === "actual" && actual.length === 0 ? (
        <EmptyState title="No issues found">The crawl finished without finding a problem on the pages it reached.</EmptyState>
      ) : groups.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted">{view === "new" ? "No issue is new since the previous audit." : "No issues match."}</p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-line bg-surface">
          <Table>
            <thead>
              <tr>
                <th scope="col">Issue</th>
                <th scope="col" className="text-right">
                  URLs
                </th>
                {audit.previous && (
                  <>
                    <th scope="col" className="text-right" title="Change in URLs since the previous audit">
                      Change
                    </th>
                    <th scope="col" className="text-right" title="On URLs crawled both times that did not have it before">
                      Added
                    </th>
                    <th scope="col" className="text-right" title="On URLs crawled for the first time">
                      New
                    </th>
                    <th scope="col" className="text-right" title="Fixed on URLs crawled both times">
                      Removed
                    </th>
                    <th scope="col" className="text-right" title="URLs that had it and were not crawled this time">
                      Missing
                    </th>
                  </>
                )}
                <th scope="col">Trend</th>
              </tr>
            </thead>
            <tbody>
              {order.map((category) => {
                const inCategory = groups.filter((g) => g.category === category).sort((a, b) => SEVERITIES.indexOf(a.severity) - SEVERITIES.indexOf(b.severity) || b.urls - a.urls || a.title.localeCompare(b.title));
                if (inCategory.length === 0) return null;
                const parts = ([null, true, false] as const).map((split) => [split, inCategory.filter((g) => g.indexable === split)] as const).filter(([, list]) => list.length > 0);
                return (
                  <Fragment key={category}>
                    <tr>
                      <th colSpan={columns} scope="colgroup" className="bg-surface! pt-4! font-display! text-[15px]! font-semibold! normal-case! tracking-normal! text-ink!">
                        {category}
                      </th>
                    </tr>
                    {parts.map(([split, list]) => (
                      <Fragment key={String(split)}>
                        {split !== null && (
                          <tr>
                            <th colSpan={columns} scope="colgroup" className="bg-surface!">
                              {split ? "Indexable" : "Not indexable"}
                            </th>
                          </tr>
                        )}
                        {list.map((group) => {
                          const expanded = open === group.key;
                          return (
                            <Fragment key={group.key}>
                              <tr id={`issue-${group.key}`} className="scroll-mt-4">
                                <td className="min-w-64">
                                  <button type="button" aria-expanded={expanded} onClick={() => onOpen(expanded ? "" : group.key)} className="flex items-center gap-2 text-left font-medium hover:underline">
                                    {expanded ? <ChevronDown className="size-4 shrink-0 text-muted" aria-hidden /> : <ChevronRight className="size-4 shrink-0 text-muted" aria-hidden />}
                                    <SeverityIcon severity={group.severity} />
                                    {group.title}
                                  </button>
                                </td>
                                <td className="text-right">
                                  <Count value={group.urls} />
                                </td>
                                {audit.previous && (
                                  <>
                                    <td className="text-right">
                                      <Delta value={group.before == null ? group.urls : group.urls - group.before} worseWhenUp={group.severity !== "info" || !group.isChange} />
                                    </td>
                                    <td className="text-right">
                                      <Count value={group.added} tone="neg" />
                                    </td>
                                    <td className="text-right">
                                      <Count value={group.new} tone="neg" />
                                    </td>
                                    <td className="text-right">
                                      <Count value={group.removed} tone="pos" />
                                    </td>
                                    <td className="text-right">
                                      <Count value={group.missing} />
                                    </td>
                                  </>
                                )}
                                <td>
                                  <TrendStrip values={rowTrend(audits, group)} label={group.title} />
                                </td>
                              </tr>
                              {expanded && (
                                <tr className="hover:bg-transparent!">
                                  <td colSpan={columns} className="p-0!">
                                    <IssueDetail audit={audit} group={group} hasLinks={withLinks.has(group.type)} />
                                  </td>
                                </tr>
                              )}
                            </Fragment>
                          );
                        })}
                      </Fragment>
                    ))}
                  </Fragment>
                );
              })}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
}
