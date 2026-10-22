"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ExtLink, Facts, isActive, ms, SectionTitle, Segmented, SidePanel } from "@/components/tracking/kit";
import { Badge, Button, cx, ErrorNote, Input, Select, Spinner, Table } from "@/components/ui";
import { api, num } from "@/lib/api";
import { DownloadLink, SeverityIcon, StatusCode } from "./bits";
import type { Audit, Issue, LinkRow, PageRow, StatusClass } from "./types";

type PageData = Partial<{
  finalUrl: string;
  finalStatus: number | null;
  fetchClass: string;
  errorMessage: string | null;
  redirectChain: { url: string; status: number; location: string }[];
  via: "direct" | "render" | "fallback";
  needsJavaScript: boolean;
  sizeBytes: number | null;
  indexabilityReason: string;
  metaDescription: string | null;
  metaRobots: string | null;
  xRobotsTag: string | null;
  canonical: string | null;
  h1s: string[];
  headings: { level: number; text: string }[];
  lang: string | null;
  sitemaps: string[];
  inlinks: { href: number; dofollow: number; nofollow: number; redirect: number; canonical: number; hreflang: number };
  internalLinkCount: number;
  externalLinkCount: number;
  imageCount: number;
  imagesMissingAlt: number;
  openGraph: Record<string, string>;
  hreflang: { lang: string; href: string }[];
  structuredData: { types: string[]; error?: string; problems: string[] }[];
}>;
type PageDetail = { page: PageRow & { data: PageData }; issues: Issue[]; inlinks: LinkRow[]; outlinks: LinkRow[] };

type PageSort = "issues" | "rank" | "url" | "status" | "words" | "response" | "load" | "depth" | "inlinks" | "clicks";
const SORTS: [PageSort, string][] = [
  ["issues", "Most issues"],
  ["rank", "Highest PR"],
  ["inlinks", "Most inlinks"],
  ["url", "URL (A to Z)"],
  ["status", "Status (highest first)"],
  ["words", "Fewest words"],
  ["response", "Slowest first byte"],
  ["load", "Slowest load"],
  ["depth", "Deepest"],
];
const CLICK_SORT: [PageSort, string] = ["clicks", "Most clicks from Google"];
const PAGE_SIZE = 50;

const REASON: Record<string, string> = {
  ok: "Indexable",
  "noindex-meta": "Blocked by a noindex meta tag",
  "noindex-header": "Blocked by an X-Robots-Tag header",
  canonicalised: "Canonical points to another URL",
  redirect: "Redirects elsewhere",
  "http-error": "Returns an HTTP error",
  blocked: "The server refused the crawler",
  "rate-limited": "The server rate-limited the crawler",
  "robots-blocked": "Disallowed by robots.txt",
  "fetch-error": "Could not be fetched",
};
const VIA: Record<string, string> = { direct: "Fetched directly", render: "Rendered with JavaScript (YepAPI)", fallback: "Fetched through YepAPI's proxies (the site blocked the crawler)" };

function LinkList({ links, side }: { links: LinkRow[]; side: "source" | "target" }) {
  if (links.length === 0) return <p className="text-[13px] text-muted">None recorded.</p>;
  return (
    <ul className="max-h-64 divide-y divide-line overflow-y-auto rounded-md border border-line">
      {links.map((link, i) => (
        <li key={`${link[side]}-${link.kind}-${i}`} className="flex items-start gap-2 px-3 py-1.5 text-xs">
          <span className="w-16 shrink-0 font-mono text-[11px] uppercase text-muted">{link.kind}</span>
          <span className="min-w-0 flex-1">
            <ExtLink href={link[side]} className="font-mono" />
            {link.anchor && <span className="block truncate text-muted">“{link.anchor}”</span>}
          </span>
          {link.nofollow && <Badge>nofollow</Badge>}
          {side === "target" && <StatusCode status={link.status} />}
        </li>
      ))}
    </ul>
  );
}

export function PagePanel({ auditId, pageId, titles, onClose }: { auditId: string; pageId: string | null; titles: Map<string, string>; onClose: () => void }) {
  const detail = useQuery({ queryKey: ["audit", auditId, "page", pageId], queryFn: () => api<PageDetail>(`/audits/${auditId}/pages/${pageId}`), enabled: pageId !== null });
  const page = detail.data?.page;
  const data: PageData = page?.data ?? {};
  const types = [...new Set((data.structuredData ?? []).flatMap((block) => block.types))];
  const problems = (data.structuredData ?? []).flatMap((block) => [...(block.error ? [`Invalid JSON: ${block.error}`] : []), ...block.problems]);
  const inl = data.inlinks;

  return (
    <SidePanel open={pageId !== null} onClose={onClose} title={page?.title?.trim() || "Page details"} subtitle={page && <ExtLink href={page.url} className="font-mono text-xs" />}>
      {detail.isPending && <Spinner />}
      <ErrorNote error={detail.error} />
      {page && (
        <>
          <section>
            <SectionTitle>Indexability</SectionTitle>
            <Facts
              rows={[
                ["Status", <StatusCode key="s" status={page.status} />],
                [
                  "Indexable",
                  page.indexable == null ? "—" : (
                    <span className={page.indexable ? "text-pos" : "text-neg"}>
                      {page.indexable ? "Yes" : "No"}
                      {data.indexabilityReason && data.indexabilityReason !== "ok" && <span className="text-ink">: {REASON[data.indexabilityReason] ?? data.indexabilityReason}</span>}
                    </span>
                  ),
                ],
                ["Canonical", data.canonical ? <ExtLink href={data.canonical} className="font-mono text-xs" /> : "None"],
                ["Meta robots", data.metaRobots || "None"],
                ["X-Robots-Tag", data.xRobotsTag || "None"],
                ["Sitemaps", data.sitemaps?.length ? data.sitemaps.map((s) => <ExtLink key={s} href={s} className="block font-mono text-xs" />) : "Not listed"],
                ["Click depth", page.depth ?? "Not reachable through links"],
                ["PR", page.pageRank ?? "—"],
                ["Fetched", VIA[data.via ?? "direct"] ?? "—"],
              ]}
            />
            {data.errorMessage && <p className="mt-2 text-[13px] text-neg">{data.errorMessage}</p>}
          </section>

          {data.redirectChain && data.redirectChain.length > 0 && (
            <section>
              <SectionTitle>Redirect chain ({data.redirectChain.length})</SectionTitle>
              <ol className="space-y-1.5 text-[13px]">
                {data.redirectChain.map((hop, index) => (
                  <li key={`${hop.url}-${index}`} className="rounded-md border border-line px-3 py-2">
                    <span className="mr-2 font-mono text-xs text-warn tabular">{hop.status}</span>
                    <span className="font-mono text-xs break-all">{hop.url}</span>
                    <span className="block font-mono text-xs break-all text-muted">→ {hop.location}</span>
                  </li>
                ))}
              </ol>
              {data.finalStatus != null && (
                <p className="mt-1 text-xs text-muted">
                  Ends with HTTP <StatusCode status={data.finalStatus} />
                </p>
              )}
            </section>
          )}

          <section>
            <SectionTitle>Content</SectionTitle>
            <Facts
              rows={[
                ["Title", page.title ? `${page.title} (${page.title.length} characters)` : "Missing"],
                ["Description", data.metaDescription ? `${data.metaDescription} (${data.metaDescription.length} characters)` : "Missing"],
                ["H1", data.h1s?.length ? data.h1s.join(" · ") : "Missing"],
                ["Word count", num(page.wordCount)],
                ["First byte / load", `${ms(page.responseMs)} / ${ms(page.loadMs)}`],
                ["Page size", data.sizeBytes != null ? `${(data.sizeBytes / 1024).toFixed(1)} KB` : "—"],
                ["Language", data.lang || "—"],
                ["Images", data.imageCount != null ? `${num(data.imageCount)}, ${num(data.imagesMissingAlt)} without alt text` : "—"],
                ["Needs JavaScript", data.needsJavaScript ? <span className="text-warn">Yes: the content only appears after rendering</span> : "No"],
              ]}
            />
          </section>

          <section>
            <SectionTitle>Incoming links</SectionTitle>
            {inl && (
              <p className="mb-2 font-mono text-[11px] text-muted tabular">
                {num(inl.dofollow)} followed · {num(inl.nofollow)} nofollow · {num(inl.redirect)} redirects · {num(inl.canonical)} canonicals · {num(inl.hreflang)} hreflang
              </p>
            )}
            <LinkList links={detail.data?.inlinks ?? []} side="source" />
          </section>

          <section>
            <SectionTitle>
              Outgoing links ({num(data.internalLinkCount)} internal, {num(data.externalLinkCount)} external)
            </SectionTitle>
            <LinkList links={detail.data?.outlinks ?? []} side="target" />
          </section>

          <section>
            <SectionTitle>Structured data</SectionTitle>
            {types.length === 0 ? (
              <p className="text-[13px] text-muted">No JSON-LD found on this page.</p>
            ) : (
              <ul className="flex flex-wrap gap-1.5">
                {types.map((type) => (
                  <li key={type}>
                    <Badge>{type}</Badge>
                  </li>
                ))}
              </ul>
            )}
            {problems.length > 0 && (
              <ul className="mt-2 list-disc space-y-0.5 pl-5 text-[13px] text-neg">
                {problems.map((problem) => (
                  <li key={problem}>{problem}</li>
                ))}
              </ul>
            )}
          </section>

          {data.headings && data.headings.length > 0 && (
            <section>
              <SectionTitle>Headings ({data.headings.length})</SectionTitle>
              <ul className="space-y-1 text-[13px]">
                {data.headings.map((heading, index) => (
                  <li key={index} className="flex gap-2" style={{ paddingLeft: `${Math.max(0, Math.min(5, heading.level - 1)) * 12}px` }}>
                    <span className="shrink-0 font-mono text-[11px] text-muted">H{heading.level}</span>
                    <span className="min-w-0 break-words">{heading.text || <span className="text-faint">empty</span>}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section>
            <SectionTitle>Issues on this page ({detail.data?.issues.length ?? 0})</SectionTitle>
            {detail.data?.issues.length === 0 ? (
              <p className="text-[13px] text-muted">No issues found on this page.</p>
            ) : (
              <ul className="divide-y divide-line rounded-md border border-line">
                {detail.data?.issues.map((issue) => (
                  <li key={issue.id} className="flex items-start gap-2 px-3 py-2 text-[13px]">
                    <SeverityIcon severity={issue.severity} />
                    <span className="min-w-0">
                      <span className="font-medium">{titles.get(issue.type) ?? issue.type}</span>
                      {issue.detail && <span className="block text-muted">{issue.detail}</span>}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </SidePanel>
  );
}

export function PagesTab({ audit }: { audit: Audit }) {
  const [text, setText] = useState("");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<PageSort>("issues");
  // Clicks are recorded when the project's Search Console was connected at audit time.
  const withClicks = Boolean(audit.summary?.searchConsole?.connected && !audit.summary.searchConsole.error);
  const sorts = withClicks ? [SORTS[0]!, CLICK_SORT, ...SORTS.slice(1)] : SORTS;
  const [status, setStatus] = useState<StatusClass | "all">("all");
  const [offset, setOffset] = useState(0);
  const [openId, setOpenId] = useState<string | null>(null);
  useEffect(() => {
    const id = setTimeout(() => {
      setQ(text.trim());
      setOffset(0);
    }, 300);
    return () => clearTimeout(id);
  }, [text]);

  const pages = useQuery({
    queryKey: ["audit", audit.id, "pages", q, sort, status, offset],
    queryFn: () =>
      api<{ total: number; pages: PageRow[] }>(`/audits/${audit.id}/pages`, { query: { q, sort, status: status === "all" ? undefined : status, limit: PAGE_SIZE, offset } }),
    placeholderData: keepPreviousData,
  });
  const total = pages.data?.total ?? 0;
  const titles = new Map(audit.issueGroups.map((group) => [group.type, group.title]));

  return (
    <div className="rounded-lg border border-line bg-surface">
      <div className="flex flex-wrap items-center gap-2 border-b border-line px-4 py-3">
        <div className="w-full sm:w-64">
          <Input type="search" aria-label="Filter by URL or title" placeholder="Filter by URL or title" value={text} onChange={(event) => setText(event.target.value)} className="h-8!" />
        </div>
        <Segmented
          label="HTTP status"
          value={status}
          onChange={(value) => {
            setStatus(value);
            setOffset(0);
          }}
          options={[
            { id: "all", label: "All" },
            { id: "2xx", label: "2xx" },
            { id: "3xx", label: "3xx" },
            { id: "4xx", label: "4xx" },
            { id: "5xx", label: "5xx" },
          ]}
        />
        <Select
          aria-label="Sort pages"
          value={sort}
          onChange={(event) => {
            setSort(event.target.value as PageSort);
            setOffset(0);
          }}
          className="h-8! w-auto!"
        >
          {sorts.map(([id, label]) => (
            <option key={id} value={id}>
              {label}
            </option>
          ))}
        </Select>
        <div className="ml-auto">
          <DownloadLink href={`/audits/${audit.id}/export/bulk/internal-urls.csv`}>All URLs CSV</DownloadLink>
        </div>
      </div>
      {pages.error && (
        <div className="p-3">
          <ErrorNote error={pages.error} />
        </div>
      )}
      {pages.isPending && (
        <div className="px-4">
          <Spinner />
        </div>
      )}
      {pages.data && pages.data.pages.length === 0 && (
        <p className="px-4 py-8 text-center text-sm text-muted">{q || status !== "all" ? "No pages match this filter." : isActive(audit.status) ? "Pages are listed once the crawl has finished." : "No pages were recorded for this audit."}</p>
      )}
      {pages.data && pages.data.pages.length > 0 && (
        <>
          <Table className={pages.isPlaceholderData ? "relative opacity-60" : "relative"}>
            <thead>
              <tr>
                <th scope="col">URL</th>
                <th scope="col" className="text-right">
                  PR
                </th>
                <th scope="col">Status</th>
                <th scope="col">Indexable</th>
                {withClicks && (
                  <th scope="col" className="text-right" title="Clicks from Google in the 28 days before the audit, from Search Console">
                    Clicks
                  </th>
                )}
                <th scope="col" className="text-right">
                  Inlinks
                </th>
                <th scope="col" className="text-right">
                  Words
                </th>
                <th scope="col" className="text-right">
                  Depth
                </th>
                <th scope="col" className="text-right">
                  First byte
                </th>
                <th scope="col" className="text-right">
                  Issues
                </th>
              </tr>
            </thead>
            <tbody>
              {pages.data.pages.map((page) => (
                <tr key={page.id}>
                  <td className="max-w-md min-w-56">
                    <button type="button" onClick={() => setOpenId(page.id)} className="block max-w-full truncate text-left font-mono text-xs underline decoration-line underline-offset-2 hover:decoration-ink">
                      {page.url}
                    </button>
                    {page.title && <span className="block truncate text-xs text-muted">{page.title}</span>}
                  </td>
                  <td className="text-right font-mono tabular">{page.pageRank ?? "—"}</td>
                  <td className="whitespace-nowrap">
                    <StatusCode status={page.status} />
                  </td>
                  <td>{page.indexable == null ? <span className="text-faint">—</span> : page.indexable ? <span className="text-pos">Yes</span> : <span className="text-neg">No</span>}</td>
                  {withClicks && <td className="text-right font-mono tabular">{page.clicks == null ? "—" : num(page.clicks)}</td>}
                  <td className="text-right font-mono tabular">{num(page.inlinks)}</td>
                  <td className="text-right font-mono tabular">{num(page.wordCount)}</td>
                  <td className="text-right font-mono tabular">{page.depth ?? "—"}</td>
                  <td className="text-right font-mono whitespace-nowrap tabular">{ms(page.responseMs)}</td>
                  <td className={cx("text-right font-mono tabular", page.issueCount === 0 && "text-faint")}>{page.issueCount}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-4 py-2">
            <p className="font-mono text-[11px] text-muted tabular">
              {num(offset + 1)}–{num(offset + pages.data.pages.length)} of {num(total)}
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
      <PagePanel auditId={audit.id} pageId={openId} titles={titles} onClose={() => setOpenId(null)} />
    </div>
  );
}
