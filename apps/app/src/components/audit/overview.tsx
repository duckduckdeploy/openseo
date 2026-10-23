"use client";

import { useQuery } from "@tanstack/react-query";
import { Bot, FileDown, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { ExtLink, Facts, ms, ScoreGauge, Segmented } from "@/components/tracking/kit";
import { Button, Table } from "@/components/ui";
import { api, num } from "@/lib/api";
import { BarList, Delta, DownloadLink, Meter, Panel, ScoreHistory, SeverityIcon, TrendStrip } from "./bits";
import { type Audit, type AuditRow, type IssueGroup, rowTrend, SEVERITIES, SEVERITY_PLURAL, siteHistory, STOP_REASON } from "./types";

type Bulk = { kind: string; title: string; description: string };

const DEPTHS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "9+", "none"];
const PURPOSE: Record<string, string> = { search: "AI search", user: "Fetch on request", training: "Training" };

/** Issues the way Ahrefs' overview lists them: what changed since the last crawl, or the biggest. */
function IssueTable({ audit, history, onOpenIssue }: { audit: Audit; history: AuditRow[]; onOpenIssue: (type: string) => void }) {
  const [view, setView] = useState<"new" | "top">(audit.previous ? "new" : "top");
  const trends = useMemo(() => {
    const ordered = siteHistory(audit, history).filter((a) => a.summary?.issuesByType);
    return (g: IssueGroup) => rowTrend(ordered, g);
  }, [history, audit]);
  const rank = (g: IssueGroup) => SEVERITIES.indexOf(g.severity);
  const groups =
    view === "new"
      ? audit.issueGroups
          .filter((g) => g.new + g.added + (g.removed ?? 0) + (g.missing ?? 0) > 0)
          .sort((a, b) => b.new + b.added - (a.new + a.added) || rank(a) - rank(b))
      : [...audit.issueGroups].filter((g) => g.urls > 0).sort((a, b) => rank(a) - rank(b) || b.urls - a.urls);
  const shown = groups.slice(0, 12);

  return (
    <section className="rounded-lg border border-line bg-surface">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
        <Segmented
          label="Issue list"
          value={view}
          onChange={setView}
          options={[
            { id: "new", label: "What's new" },
            { id: "top", label: "Top issues" },
          ]}
        />
        <div className="flex flex-wrap gap-2">
          <DownloadLink href={`/audits/${audit.id}/fix-brief?format=md`}>
            <Sparkles className="size-3.5" aria-hidden /> AI fix brief
          </DownloadLink>
          <DownloadLink href={`/audits/${audit.id}/export/issues.zip`}>Export all issues</DownloadLink>
        </div>
      </div>
      {view === "new" && !audit.previous && <p className="px-4 py-6 text-center text-sm text-muted">This is the first audit of the site. Changes show up from the next one.</p>}
      {view === "new" && audit.previous && shown.length === 0 && <p className="px-4 py-6 text-center text-sm text-muted">Nothing changed since the previous audit.</p>}
      {shown.length > 0 && (
        <Table className="relative">
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
            {shown.map((g) => (
              <tr key={g.key}>
                <td className="min-w-64">
                  <button type="button" onClick={() => onOpenIssue(g.key)} className="flex items-center gap-2 text-left font-medium hover:underline">
                    <SeverityIcon severity={g.severity} />
                    {g.title}
                    {g.indexable === false && <span className="font-mono text-[11px] font-normal uppercase tracking-wide text-muted">Not indexable</span>}
                  </button>
                </td>
                <td className="text-right font-mono tabular">{num(g.urls)}</td>
                {audit.previous && (
                  <>
                    <td className="text-right">
                      <Delta value={g.before == null ? g.urls : g.urls - g.before} worseWhenUp={g.severity !== "info" || !g.isChange} />
                    </td>
                    <td className="text-right font-mono tabular">{num(g.added)}</td>
                    <td className="text-right font-mono tabular">{num(g.new)}</td>
                    <td className="text-right font-mono text-pos tabular">{num(g.removed ?? 0)}</td>
                    <td className="text-right font-mono tabular">{num(g.missing ?? 0)}</td>
                  </>
                )}
                <td>
                  <TrendStrip values={trends(g)} label={g.title} />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      {groups.length > shown.length && (
        <div className="border-t border-line px-4 py-2">
          <Button size="sm" variant="ghost" onClick={() => onOpenIssue("")}>
            View all {num(groups.length)} issues
          </Button>
        </div>
      )}
    </section>
  );
}

export function Overview({ audit, history, onOpenIssue }: { audit: Audit; history: AuditRow[]; onOpenIssue: (type: string) => void }) {
  const s = audit.summary ?? {};
  const exports = useQuery({ queryKey: ["audit", audit.id, "exports"], queryFn: () => api<{ bulk: Bulk[] }>(`/audits/${audit.id}/exports`) });
  const scores = siteHistory(audit, history);
  const ai = s.aiDiscoverability;
  const audited = (s.urlsWithErrors ?? 0) + (s.urlsWithoutErrors ?? 0);
  const counts = SEVERITIES.map((severity) => ({ severity, urls: audit.issueGroups.filter((g) => g.severity === severity).reduce((a, g) => a + g.count, 0) }));
  const ttfb = s.ttfbBuckets;
  const statuses = s.statusClasses;
  const blockedBots = ai?.bots.filter((b) => b.allowedPct < 100) ?? [];

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="Health score">
          <div className="flex items-center gap-5">
            <ScoreGauge label="Health" score={audit.healthScore} good={80} fair={50} size={96} />
            <div className="min-w-0 flex-1 text-[13px] text-muted">
              <p>The share of crawled URLs without an error.</p>
              {audit.previous && (
                <p className="mt-1">
                  Previous audit: <span className="font-mono text-ink tabular">{audit.previous.healthScore ?? "—"}</span>{" "}
                  {audit.healthScore != null && audit.previous.healthScore != null && (audit.healthScore === audit.previous.healthScore ? <span className="text-faint">(no change)</span> : <Delta value={audit.healthScore - audit.previous.healthScore} worseWhenUp={false} />)}
                </p>
              )}
            </div>
          </div>
          <div className="mt-3">
            <ScoreHistory label="Health score" points={scores.map((a) => ({ id: a.id, date: a.createdAt, score: a.healthScore }))} />
          </div>
        </Panel>

        <Panel title="AI discoverability" action={<Bot className="size-4 text-muted" aria-hidden />}>
          {ai ? (
            <>
              <div className="flex items-center gap-5">
                <ScoreGauge label="AI score" score={ai.score} good={80} fair={50} size={96} />
                <dl className="grid flex-1 grid-cols-[1fr_auto] gap-x-3 gap-y-1 text-[13px]">
                  <dt className="text-muted">Bot access</dt>
                  <dd className="text-right font-mono tabular">{ai.botAccess}</dd>
                  <dt className="text-muted">Readable without JS</dt>
                  <dd className="text-right font-mono tabular">{ai.readability}</dd>
                  <dt className="text-muted">Fast enough for AI bots</dt>
                  <dd className="text-right font-mono tabular">{ai.speed}</dd>
                  <dt className="text-muted">llms.txt</dt>
                  <dd className={ai.llmsTxt ? "text-right text-pos" : "text-right text-muted"}>{ai.llmsTxt ? "Found" : "Missing"}</dd>
                </dl>
              </div>
              <p className="mt-3 text-xs text-muted">
                {blockedBots.length === 0
                  ? "robots.txt lets every AI crawler in."
                  : `robots.txt blocks ${blockedBots.map((b) => `${b.token} (${PURPOSE[b.purpose]?.toLowerCase()})`).join(", ")}.`}
              </p>
            </>
          ) : (
            <p className="text-[13px] text-muted">No indexable page was crawled, so there is nothing to score.</p>
          )}
        </Panel>

        <Panel title="Issues distribution">
          <ul className="space-y-2">
            {counts.map(({ severity, urls }) => (
              <li key={severity} className="flex items-center justify-between text-[13px]">
                <span className="flex items-center gap-2">
                  <SeverityIcon severity={severity} /> {SEVERITY_PLURAL[severity]}
                </span>
                <span className="font-mono tabular">{num(urls)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <Meter value={s.urlsWithErrors ?? 0} total={audited} label="URLs with errors" />
          </div>
        </Panel>
      </div>

      <IssueTable audit={audit} history={history} onOpenIssue={onOpenIssue} />

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="Time to first byte">
          {ttfb ? (
            <BarList
              caption="HTML pages by time to first byte"
              items={[
                { label: "Fast: under 200 ms", value: ttfb.fast },
                { label: "Medium: 200–300 ms", value: ttfb.medium },
                { label: "Slow: 300–500 ms", value: ttfb.slow },
                { label: "Too slow: over 500 ms", value: ttfb.tooSlow },
              ]}
            />
          ) : (
            <p className="text-xs text-muted">Not recorded for this audit.</p>
          )}
          <p className="mt-3 font-mono text-[11px] text-muted">Average {ms(s.avgResponseTimeMs)}</p>
        </Panel>
        <Panel title="HTTP status codes">
          {statuses ? (
            <BarList
              caption="Crawled URLs by HTTP status"
              items={[
                { label: "Success (2xx)", value: statuses["2xx"] },
                { label: "Redirect (3xx)", value: statuses["3xx"] },
                { label: "Client error (4xx)", value: statuses["4xx"] },
                { label: "Server error (5xx)", value: statuses["5xx"] },
                { label: "No response", value: statuses.none },
              ].filter((i, index) => index < 3 || i.value > 0)}
            />
          ) : (
            <p className="text-xs text-muted">Not recorded for this audit.</p>
          )}
        </Panel>
        <Panel title="Content types">
          {s.contentTypes && Object.keys(s.contentTypes).length > 0 ? (
            <BarList
              caption="Fetched URLs by content type"
              items={Object.entries(s.contentTypes)
                .sort((a, b) => b[1] - a[1])
                .map(([kind, value]) => ({ label: ({ html: "HTML", js: "JavaScript", css: "CSS", pdf: "PDF", image: "Image", other: "Other" } as Record<string, string>)[kind] ?? kind, value }))}
            />
          ) : (
            <p className="text-xs text-muted">Not recorded for this audit.</p>
          )}
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="Crawl status of links found">
          {s.linkStatus ? (
            <BarList
              caption="Internal links by what became of their target"
              items={[
                { label: "Crawled", value: s.linkStatus.crawled },
                { label: "Not crawled", value: s.linkStatus.uncrawled, hint: "Over the page limit, excluded by a pattern or past the depth limit" },
                { label: "Blocked by robots.txt", value: s.linkStatus.robotsBlocked },
              ]}
            />
          ) : (
            <p className="text-xs text-muted">Not recorded for this audit.</p>
          )}
          <p className="mt-3 font-mono text-[11px] text-muted">
            {num(s.pagesTotal)} URLs crawled · {num(s.resourcesChecked)} images, scripts and stylesheets checked
          </p>
        </Panel>
        <Panel title="HTTP status by click depth">
          {s.statusByDepth ? (
            <Table className="relative -mx-4 -mb-4 rounded-b-lg">
              <thead>
                <tr>
                  <th scope="col">Depth</th>
                  <th scope="col" className="text-right">
                    2xx
                  </th>
                  <th scope="col" className="text-right">
                    3xx
                  </th>
                  <th scope="col" className="text-right">
                    4xx/5xx
                  </th>
                </tr>
              </thead>
              <tbody>
                {DEPTHS.filter((d) => s.statusByDepth?.[d]).map((d) => {
                  const row = s.statusByDepth?.[d];
                  return (
                    <tr key={d}>
                      <td className="font-mono tabular">{d === "none" ? "Not linked" : d}</td>
                      <td className="text-right font-mono tabular">{num(row?.["2xx"] ?? 0)}</td>
                      <td className="text-right font-mono tabular">{num(row?.["3xx"] ?? 0)}</td>
                      <td className={(row?.["4xx"] ?? 0) + (row?.["5xx"] ?? 0) > 0 ? "text-right font-mono text-neg tabular" : "text-right font-mono tabular"}>
                        {num((row?.["4xx"] ?? 0) + (row?.["5xx"] ?? 0))}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          ) : (
            <p className="text-xs text-muted">Not recorded for this audit.</p>
          )}
        </Panel>
        <Panel title="Crawl">
          <Facts
            rows={[
              ["Ended", STOP_REASON[s.stoppedReason ?? ""] ?? "—"],
              ["Took", ms(s.durationMs)],
              [
                "Speed",
                s.pace && s.durationMs
                  ? `${num(Math.round(((s.pagesTotal ?? 0) * 60_000) / s.durationMs))} pages a minute, up to ${s.pace.peak} at once${s.pace.slowdowns ? `, slowed ${s.pace.slowdowns}× when the site struggled` : ""}`
                  : "—",
              ],
              ["robots.txt", s.robotsTxtFound == null ? "—" : s.robotsTxtFound ? "Found" : "Not found"],
              [
                "Sitemaps",
                s.sitemaps?.length ? (
                  <span>
                    {s.sitemaps.slice(0, 3).map((sitemap) => (
                      <ExtLink key={sitemap} href={sitemap} className="block font-mono text-xs" />
                    ))}
                    <span className="text-xs text-muted">
                      {s.sitemaps.length > 3 ? `+${s.sitemaps.length - 3} more · ` : ""}
                      {num(s.sitemapUrls)} URLs listed
                    </span>
                  </span>
                ) : (
                  "None found"
                ),
              ],
              [
                "Search Console",
                !audit.projectId
                  ? "Only in projects"
                  : !s.searchConsole?.connected
                    ? "Not connected: connect it to check pages that get search traffic"
                    : s.searchConsole.error
                      ? <span className="text-neg">{s.searchConsole.error}</span>
                      : `Clicks ${s.searchConsole.period?.startDate ?? ""} to ${s.searchConsole.period?.endDate ?? ""}`,
              ],
              ["HTTP version", s.httpProbe ? (s.httpProbe.redirectsToHttps ? "Redirects to HTTPS" : <span className="text-neg">Answers without redirecting</span>) : "—"],
              [
                "YepAPI",
                s.paid
                  ? `${num(s.paid.rendered)} rendered, ${num(s.paid.unblocked)} unblocked${s.paid.budgetReached ? " · cap reached" : ""}${s.paid.unavailable ? ` · ${s.paid.unavailable}` : ""}`
                  : "Not used",
              ],
            ]}
          />
        </Panel>
      </div>

      <Panel title="Bulk export" action={<FileDown className="size-4 text-muted" aria-hidden />}>
        <ul className="divide-y divide-line">
          {(exports.data?.bulk ?? []).map((b) => (
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
    </div>
  );
}
