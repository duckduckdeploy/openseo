import type { RunStatus, Schedule } from "@/components/tracking/kit";

export type Severity = "critical" | "warning" | "info";
export type RenderMode = "off" | "auto" | "always";
export type StatusClass = "2xx" | "3xx" | "4xx" | "5xx" | "none";
export type IssueChange = "new" | "added" | "removed" | "missing";

export type AiBot = { token: string; owner: string; purpose: "search" | "user" | "training"; allowed: boolean; allowedPct: number };

export type Summary = {
  finalStartUrl?: string;
  durationMs?: number;
  stoppedReason?: "completed" | "max_pages" | "rate_limited" | "time_limit" | "aborted";
  truncated?: boolean;
  pagesTotal?: number;
  pagesCrawled?: number;
  pagesBlocked?: number;
  pagesRateLimited?: number;
  pagesRobotsBlocked?: number;
  pagesFailed?: number;
  htmlPages?: number;
  indexablePages?: number;
  urlsDiscovered?: number;
  urlsExcluded?: number;
  robotsTxtFound?: boolean;
  llmsTxtFound?: boolean;
  sitemaps?: string[];
  sitemapUrls?: number;
  avgResponseTimeMs?: number | null;
  ttfbBuckets?: { fast: number; medium: number; slow: number; tooSlow: number };
  statusClasses?: Record<StatusClass, number>;
  statusByDepth?: Record<string, Record<StatusClass, number>>;
  contentTypes?: Record<string, number>;
  linkStatus?: { crawled: number; uncrawled: number; robotsBlocked: number };
  resourcesChecked?: number;
  pace?: { start: number; peak: number; final: number; slowdowns: number };
  urlsWithErrors?: number;
  urlsWithoutErrors?: number;
  httpProbe?: { url: string; status: number; finalUrl: string; redirectsToHttps: boolean } | null;
  aiDiscoverability?: { score: number; botAccess: number; readability: number; speed: number; llmsTxt: boolean; bots: AiBot[] } | null;
  issuesTotal?: number;
  issuesBySeverity?: Partial<Record<Severity, number>>;
  issuesByType?: Record<string, number>;
  /** URLs per report row (IssueGroup.key). */
  issueRows?: Record<string, number>;
  paid?: { rendered: number; unblocked: number; budgetReached: boolean; unavailable: string | null };
  /** The project's Search Console at audit time: clicks per page and the search traffic checks come from it. */
  searchConsole?: { connected: boolean; period?: { startDate: string; endDate: string }; error?: string };
};

export type AuditRow = {
  id: string;
  projectId: string | null;
  trigger: "manual" | "schedule" | "api" | "tool";
  startUrl: string;
  maxPages: number;
  renderMode: RenderMode;
  useFallback: boolean;
  maxCostUsd: number | null;
  status: RunStatus;
  pagesCrawled: number;
  healthScore: number | null;
  aiScore: number | null;
  summary: Summary | null;
  previousAuditId: string | null;
  costUsd: number;
  /** After the last page: the step a running audit is on. */
  phase: "site-files" | "resources" | "external-links" | "analysis" | null;
  error: string | null;
  createdAt: string;
  startedAt: string | null;
  finishedAt: string | null;
};

export type IssueGroup = {
  type: string;
  /** The report row: the type, plus ":indexable" or ":not-indexable" for Links and Content issues. */
  key: string;
  /** Whether the row is about indexable pages; null for issues that are not split. */
  indexable: boolean | null;
  severity: Severity;
  /** Issue rows; usually one per URL. */
  count: number;
  urls: number;
  new: number;
  added: number;
  before: number | null;
  removed: number | null;
  missing: number | null;
  title: string;
  description: string;
  howToFix: string;
  category: string;
  isChange: boolean;
};

export type Audit = AuditRow & {
  project: { id: string; name: string; domain: string | null } | null;
  previous: { id: string; createdAt: string; healthScore: number | null; aiScore: number | null; pagesCrawled: number } | null;
  issueGroups: IssueGroup[];
};

export type Issue = {
  id: string;
  type: string;
  severity: Severity;
  url: string;
  detail: string | null;
  relatedUrls: string[] | null;
  change: IssueChange | null;
  pageRank?: number | null;
  status?: number | null;
  title?: string | null;
  depth?: number | null;
  inlinks?: number | null;
};

export type PageRow = {
  id: string;
  url: string;
  status: number | null;
  title: string | null;
  wordCount: number | null;
  depth: number | null;
  responseMs: number | null;
  loadMs: number | null;
  contentType: string | null;
  indexable: boolean | null;
  pageRank: number | null;
  inlinks: number | null;
  inSitemap: boolean | null;
  /** Clicks from Google in the 28 days before the audit; null without Search Console. */
  clicks: number | null;
  issueCount: number;
};

export type LinkKind = "href" | "redirect" | "canonical" | "hreflang" | "image" | "script" | "stylesheet";
export type LinkRow = {
  source: string;
  target: string;
  kind: LinkKind;
  anchor: string | null;
  nofollow: boolean;
  internal: boolean;
  targetStatus?: number | null;
  targetIndexable?: boolean | null;
  status?: number | null;
};

export type AuditSettings = {
  projectId: string;
  startUrl: string | null;
  maxPages: number;
  renderMode: RenderMode;
  useFallback: boolean;
  maxCostUsd: number | null;
  exclude: string[];
  include: string[];
  checkExternalLinks: boolean;
  schedule: Schedule;
  nextRunAt: string | null;
};

export const SEVERITY_LABEL: Record<Severity, string> = { critical: "Error", warning: "Warning", info: "Notice" };
export const SEVERITY_PLURAL: Record<Severity, string> = { critical: "Errors", warning: "Warnings", info: "Notices" };
export const SEVERITIES: Severity[] = ["critical", "warning", "info"];

/** One entry of GET /audit/issue-catalog. */
export type CatalogEntry = { severity: Severity; title: string; description: string; howToFix: string; category: string; split: boolean };

/** `?indexable=` for one half of a split row, nothing for the rest. */
export const indexableQuery = (group: Pick<IssueGroup, "indexable">): string => (group.indexable === null ? "" : `?indexable=${group.indexable}`);

/** A row's URL count in each of these audits, oldest first; audits from before rows were stored fall back to the type's count. */
export function rowTrend(audits: AuditRow[], group: Pick<IssueGroup, "key" | "type" | "indexable">): number[] {
  return audits.map((a) => a.summary?.issueRows?.[group.key] ?? (a.summary?.issueRows || group.indexable !== null ? 0 : (a.summary?.issuesByType?.[group.type] ?? 0)));
}

export const STOP_REASON: Record<string, string> = {
  completed: "Every reachable page was crawled",
  max_pages: "Stopped at the page limit",
  rate_limited: "Stopped because the site kept answering 429 (too many requests)",
  time_limit: "Stopped at the time limit",
  aborted: "Cancelled before it finished",
};

export const RENDER_LABEL: Record<RenderMode, string> = { off: "plain HTML", auto: "JavaScript rendered where needed", always: "every page rendered" };

const hostOf = (url: string) => {
  try {
    return new URL(/^https?:\/\//i.test(url) ? url : `https://${url}`).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return url.toLowerCase();
  }
};

/** Audits of the same site, oldest first, up to this one: what history and trends compare. */
export function siteHistory(audit: AuditRow, all: AuditRow[], limit = 12): AuditRow[] {
  const host = hostOf(audit.summary?.finalStartUrl ?? audit.startUrl);
  return all
    .filter((a) => a.status === "completed" && new Date(a.createdAt) <= new Date(audit.createdAt))
    .filter((a) => hostOf(a.summary?.finalStartUrl ?? a.startUrl) === host)
    .reverse()
    .slice(-limit);
}
