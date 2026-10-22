"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { ExtLink, Note, Segmented } from "@/components/tracking/kit";
import { Badge, Button, ErrorNote, Input, Select, Spinner, Table } from "@/components/ui";
import { api, num } from "@/lib/api";
import { DownloadLink, Panel, SeverityIcon, StatusCode } from "./bits";
import { type Audit, indexableQuery, type LinkKind, type LinkRow, type Severity } from "./types";

const PAGE_SIZE = 50;
type TargetStatus = "all" | "4xx" | "3xx" | "5xx" | "uncrawled";

/** Every link the crawl recorded, with what the target answered. */
export function LinksTab({ audit }: { audit: Audit }) {
  const [text, setText] = useState("");
  const [q, setQ] = useState("");
  const [kind, setKind] = useState<LinkKind | "all">("href");
  const [scope, setScope] = useState<"all" | "true" | "false">("true");
  const [target, setTarget] = useState<TargetStatus>("all");
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const id = setTimeout(() => {
      setQ(text.trim());
      setOffset(0);
    }, 300);
    return () => clearTimeout(id);
  }, [text]);
  useEffect(() => setOffset(0), [kind, scope, target]);

  const links = useQuery({
    queryKey: ["audit", audit.id, "links", q, kind, scope, target, offset],
    queryFn: () =>
      api<{ total: number; linksKept: boolean; links: LinkRow[] }>(`/audits/${audit.id}/links`, {
        query: { q, kind: kind === "all" ? undefined : kind, internal: scope === "all" ? undefined : scope, targetStatus: target === "all" ? undefined : target, limit: PAGE_SIZE, offset },
      }),
    placeholderData: keepPreviousData,
  });
  const total = links.data?.total ?? 0;

  if (links.data && !links.data.linksKept)
    return <Note>Only the two latest audits of a project keep their full link lists, to save space. Pages, issues and history are kept for every audit.</Note>;

  return (
    <div className="rounded-lg border border-line bg-surface">
      <div className="flex flex-wrap items-center gap-2 border-b border-line px-4 py-3">
        <div className="w-full sm:w-64">
          <Input type="search" aria-label="Filter by target or anchor" placeholder="Filter by target URL or anchor" value={text} onChange={(e) => setText(e.target.value)} className="h-8!" />
        </div>
        <Select aria-label="Link type" value={kind} onChange={(e) => setKind(e.target.value as LinkKind | "all")} className="h-8! w-auto!">
          <option value="all">All link types</option>
          <option value="href">Links</option>
          <option value="redirect">Redirects</option>
          <option value="canonical">Canonicals</option>
          <option value="hreflang">Hreflang</option>
          <option value="image">Images</option>
          <option value="script">Scripts</option>
          <option value="stylesheet">Stylesheets</option>
        </Select>
        <Segmented
          label="Internal or external"
          value={scope}
          onChange={setScope}
          options={[
            { id: "true", label: "Internal" },
            { id: "false", label: "External" },
            { id: "all", label: "Both" },
          ]}
        />
        <Select aria-label="Target status" value={target} onChange={(e) => setTarget(e.target.value as TargetStatus)} className="h-8! w-auto!">
          <option value="all">Any target status</option>
          <option value="4xx">Target 4xx</option>
          <option value="5xx">Target 5xx</option>
          <option value="3xx">Target redirects</option>
          <option value="uncrawled">Target not crawled</option>
        </Select>
        <div className="ml-auto">
          <DownloadLink href={`/audits/${audit.id}/export/bulk/links.csv`}>All links CSV</DownloadLink>
        </div>
      </div>
      {links.error && (
        <div className="p-3">
          <ErrorNote error={links.error} />
        </div>
      )}
      {links.isPending && (
        <div className="px-4">
          <Spinner />
        </div>
      )}
      {links.data && links.data.links.length === 0 && <p className="px-4 py-8 text-center text-sm text-muted">No links match this filter.</p>}
      {links.data && links.data.links.length > 0 && (
        <>
          <Table className={links.isPlaceholderData ? "relative opacity-60" : "relative"}>
            <thead>
              <tr>
                <th scope="col">From</th>
                <th scope="col">To</th>
                <th scope="col">Status</th>
                <th scope="col">Anchor or alt</th>
                <th scope="col">Type</th>
              </tr>
            </thead>
            <tbody>
              {links.data.links.map((link, i) => (
                <tr key={`${link.source}-${link.target}-${link.kind}-${i}`}>
                  <td className="max-w-xs min-w-48">
                    <ExtLink href={link.source} className="font-mono text-xs" />
                  </td>
                  <td className="max-w-xs min-w-48">
                    <ExtLink href={link.target} className="font-mono text-xs" />
                  </td>
                  <td>
                    <StatusCode status={link.targetStatus} />
                  </td>
                  <td className="max-w-56 truncate text-[13px]">{link.anchor ?? (link.kind === "image" ? <span className="text-neg">no alt</span> : <span className="text-faint">—</span>)}</td>
                  <td className="whitespace-nowrap">
                    <span className="font-mono text-[11px] uppercase text-muted">{link.kind}</span> {link.nofollow && <Badge>nofollow</Badge>}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-4 py-2">
            <p className="font-mono text-[11px] text-muted tabular">
              {num(offset + 1)}–{num(offset + links.data.links.length)} of {num(total)}
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
        </>
      )}
    </div>
  );
}

type ExportList = {
  issues: { type: string; key: string; indexable: boolean | null; severity: Severity; urls: number; file: string; hasLinks: boolean }[];
  bulk: { kind: string; title: string; description: string }[];
};

/** Every download in one place, the fix brief first: it is what a coding agent should read. */
export function ExportsTab({ audit }: { audit: Audit }) {
  const list = useQuery({ queryKey: ["audit", audit.id, "exports"], queryFn: () => api<ExportList>(`/audits/${audit.id}/exports`) });
  const titles = new Map(audit.issueGroups.map((g) => [g.type, g.title]));
  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="AI fix brief" action={<Sparkles className="size-4 text-muted" aria-hidden />}>
          <p className="mb-3 text-[13px] text-muted">
            One Markdown file for Claude, Cursor or any coding agent: every issue worst first, why it matters, how to fix it, the URL patterns it affects so the template is fixed once, the most-linked culprits and sample
            URLs. Agents connected to OpenSEO over MCP can read it with <code className="font-mono text-xs">get_audit_fix_brief</code>.
          </p>
          <DownloadLink href={`/audits/${audit.id}/fix-brief?format=md`}>Download fix brief</DownloadLink>
        </Panel>
        <Panel title="Export all issues">
          <p className="mb-3 text-[13px] text-muted">
            A zip with one CSV per issue (the affected pages) and, where links explain the issue, a matching <code className="font-mono text-xs">-links</code> CSV of the source and target of every link. The fix brief is
            included.
          </p>
          <DownloadLink href={`/audits/${audit.id}/export/issues.zip`}>Download zip</DownloadLink>
        </Panel>
      </div>
      <ErrorNote error={list.error} />
      {list.isPending && <Spinner />}
      {list.data && (
        <>
          <Panel title="Issue files">
            <ul className="divide-y divide-line">
              {list.data.issues.map((issue) => (
                <li key={issue.key} className="flex flex-wrap items-center gap-3 py-2 text-[13px]">
                  <SeverityIcon severity={issue.severity} />
                  <span className="min-w-0 flex-1">
                    <span className="font-medium">{titles.get(issue.type) ?? issue.type}</span>
                    {issue.indexable === false && <span className="ml-2 font-mono text-[11px] uppercase tracking-wide text-muted">Not indexable</span>}
                    <span className="ml-2 font-mono text-xs text-muted tabular">{num(issue.urls)} {issue.urls === 1 ? "URL" : "URLs"}</span>
                  </span>
                  <DownloadLink variant="link" href={`/audits/${audit.id}/export/issue/${issue.type}.csv${indexableQuery(issue)}`}>
                    Pages
                  </DownloadLink>
                  {issue.hasLinks && (
                    <DownloadLink variant="link" href={`/audits/${audit.id}/export/issue/${issue.type}-links.csv${indexableQuery(issue)}`}>
                      Links
                    </DownloadLink>
                  )}
                </li>
              ))}
            </ul>
          </Panel>
          <Panel title="Bulk export">
            <ul className="divide-y divide-line">
              {list.data.bulk.map((b) => (
                <li key={b.kind} className="flex flex-wrap items-center justify-between gap-3 py-2 text-[13px]">
                  <span className="min-w-0 flex-1">
                    <span className="font-medium">{b.title}</span>
                    <span className="block text-xs text-muted">{b.description}</span>
                  </span>
                  <DownloadLink href={`/audits/${audit.id}/export/bulk/${b.kind}.csv`}>CSV</DownloadLink>
                </li>
              ))}
            </ul>
          </Panel>
        </>
      )}
    </div>
  );
}
