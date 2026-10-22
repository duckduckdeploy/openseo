import { ISSUE_CATALOG, markIndexability } from "@openseo/crawler";
import type { Issue, IssueType, PageResult } from "@openseo/crawler";
import { and, desc, eq, isNull, lt, ne, sql } from "drizzle-orm";
import { dataDb, schema } from "../db";

type Audit = typeof schema.audits.$inferSelect;

/**
 * The report row an issue belongs to: its type, split by page indexability for Links and Content
 * issues ("broken-internal-link:not-indexable"). Diffs and the app key issue rows by it.
 */
export const groupKey = (type: string, indexable: boolean | null | undefined): string =>
  indexable == null ? type : `${type}:${indexable ? "indexable" : "not-indexable"}`;

/** Per report row (see groupKey), against the previous audit. */
export interface IssueDiff {
  /** URLs with the issue in the previous audit. */
  before: number;
  /** URLs with the issue that the previous audit did not crawl (Ahrefs' "New"). */
  new: number;
  /** URLs crawled both times that have the issue now and did not before (Ahrefs' "Added"). */
  added: number;
  /** URLs crawled both times that had the issue and no longer do. */
  removed: number;
  /** URLs that had the issue and were not crawled this time. */
  missing: number;
}

export interface Comparison {
  previousAuditId: string;
  /** Changes since the previous audit, reported as issues (title changed, became non-indexable...). */
  changeIssues: Issue[];
  /** "new" or "added" for an issue of this audit, null when the previous audit had it too. */
  classify(issue: Issue): "new" | "added" | null;
  diff: Record<string, IssueDiff>;
}

/** Word counts that moved by less than this share are not reported as changed. */
const WORD_COUNT_CHANGE = 0.1;

export const hostKey = (url: string): string => {
  try {
    return new URL(/^https?:\/\//i.test(url) ? url : `https://${url}`).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return url.toLowerCase();
  }
};

/**
 * The audit this one is compared with: the latest completed audit before it of the same site, in
 * the same project (or, for tool audits, by the same user outside any project).
 */
export async function findPreviousAudit(audit: Audit): Promise<string | null> {
  const scope = audit.projectId ? eq(schema.audits.projectId, audit.projectId) : and(isNull(schema.audits.projectId), eq(schema.audits.userId, audit.userId));
  const candidates = await dataDb
    .select({ id: schema.audits.id, startUrl: schema.audits.startUrl, summary: schema.audits.summary })
    .from(schema.audits)
    .where(and(scope, eq(schema.audits.status, "completed"), ne(schema.audits.id, audit.id), lt(schema.audits.createdAt, audit.createdAt)))
    .orderBy(desc(schema.audits.createdAt))
    .limit(20);
  const host = hostKey(audit.startUrl);
  const match = candidates.find((c) => {
    const finalStart = (c.summary as { finalStartUrl?: string } | null)?.finalStartUrl;
    return hostKey(c.startUrl) === host || (finalStart !== undefined && hostKey(finalStart) === host);
  });
  return match?.id ?? null;
}

const key = (type: string, url: string): string => `${type}\n${url}`;

/** Compares a finished crawl with an earlier audit. */
export async function compareWithPrevious(previousAuditId: string, pages: PageResult[], issues: Issue[]): Promise<Comparison> {
  const [previousPages, previousIssues] = await Promise.all([
    dataDb
      .select({
        url: schema.auditPages.url,
        status: schema.auditPages.status,
        title: schema.auditPages.title,
        wordCount: schema.auditPages.wordCount,
        indexable: schema.auditPages.indexable,
        metaDescription: sql<string | null>`${schema.auditPages.data}->>'metaDescription'`,
        h1: sql<string | null>`${schema.auditPages.data}->'h1s'->>0`,
      })
      .from(schema.auditPages)
      .where(eq(schema.auditPages.auditId, previousAuditId)),
    dataDb
      .select({ type: schema.auditIssues.type, url: schema.auditIssues.url, indexable: schema.auditIssues.indexable })
      .from(schema.auditIssues)
      .where(eq(schema.auditIssues.auditId, previousAuditId)),
  ]);

  const before = new Map(previousPages.map((p) => [p.url, p]));
  const now = new Set(pages.map((p) => p.url));

  const changeIssues: Issue[] = [];
  const change = (type: IssueType, url: string, detail: string): void => {
    changeIssues.push({ type, severity: ISSUE_CATALOG[type].severity, url, detail });
  };
  for (const page of pages) {
    const old = before.get(page.url);
    if (!old) continue;
    if (old.status !== null && old.status > 0 && page.status > 0 && old.status !== page.status) {
      change("status-code-changed", page.url, `${old.status} → ${page.status}`);
    }
    if (old.indexable && !page.indexable && page.fetchClass !== "robots_blocked") {
      change("became-non-indexable", page.url, `Now ${page.indexabilityReason}`);
    }
    if (!page.indexable || !old.indexable || page.fetchClass !== "ok" || !page.isHtml) continue;
    if ((old.title ?? null) !== page.title) change("title-changed", page.url, `“${old.title ?? ""}” → “${page.title ?? ""}”`);
    if ((old.metaDescription ?? null) !== page.metaDescription) change("meta-description-changed", page.url, "Meta description differs from the previous audit");
    const h1 = page.h1s[0] ?? null;
    if ((old.h1 ?? null) !== h1) change("h1-changed", page.url, `“${old.h1 ?? ""}” → “${h1 ?? ""}”`);
    const oldWords = old.wordCount ?? 0;
    if (oldWords > 0 && Math.abs(page.wordCount - oldWords) / oldWords >= WORD_COUNT_CHANGE) {
      change("word-count-changed", page.url, `${oldWords} → ${page.wordCount} words`);
    }
  }

  markIndexability(changeIssues, pages);

  const previousKeys = new Set(previousIssues.map((i) => key(i.type, i.url)));
  const classify = (issue: Issue): "new" | "added" | null => {
    if (!before.has(issue.url)) return "new";
    return previousKeys.has(key(issue.type, issue.url)) ? null : "added";
  };

  const diff: Record<string, IssueDiff> = {};
  const entry = (type: string): IssueDiff => (diff[type] ??= { before: 0, new: 0, added: 0, removed: 0, missing: 0 });
  const currentKeys = new Set<string>();
  for (const issue of [...issues, ...changeIssues]) {
    const k = key(issue.type, issue.url);
    if (currentKeys.has(k)) continue;
    currentKeys.add(k);
    const kind = classify(issue);
    if (kind) entry(groupKey(issue.type, issue.indexable))[kind]++;
  }
  const counted = new Set<string>();
  for (const issue of previousIssues) {
    const k = key(issue.type, issue.url);
    if (counted.has(k)) continue;
    counted.add(k);
    const d = entry(groupKey(issue.type, issue.indexable));
    d.before++;
    if (!now.has(issue.url)) d.missing++;
    else if (!currentKeys.has(k)) d.removed++;
  }
  return { previousAuditId, changeIssues, classify, diff };
}
