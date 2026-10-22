import { PassThrough, Readable } from "node:stream";
import { once } from "node:events";
import { DEFAULT_THRESHOLDS, ISSUE_CATALOG, ISSUE_CATEGORY } from "@openseo/crawler";
import type { IssueCategory, IssueType } from "@openseo/crawler";
import { and, asc, desc, eq, gt, gte, inArray, isNull, lt, sql } from "drizzle-orm";
import type { SQL } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { Zip, ZipDeflate, strToU8 } from "fflate";
import { dataDb, schema } from "../db";
import type { AuditLinkKind } from "../db/data-schema";
import { groupKey } from "./audit-history";

type Audit = typeof schema.audits.$inferSelect;
type IssueRow = typeof schema.auditIssues.$inferSelect;
type PageRow = typeof schema.auditPages.$inferSelect;
type Severity = "critical" | "warning" | "info";

/** Ahrefs' words for the three severities, used in file names and the brief. */
export const SEVERITY_LABEL: Record<Severity, string> = { critical: "Error", warning: "Warning", info: "Notice" };
const SEVERITY_ORDER: Severity[] = ["critical", "warning", "info"];
const BATCH = 2000;

const catalog = ISSUE_CATALOG as Record<string, { severity: Severity; title: string; description: string; howToFix: string }>;
const categoryOf = (type: string): IssueCategory | undefined => (ISSUE_CATEGORY as Record<string, IssueCategory>)[type];

// ── CSV ─────────────────────────────────────────────────────────────────────

const cell = (value: unknown): string => {
  if (value === null || value === undefined) return '""';
  const text = Array.isArray(value) ? value.join("\n") : typeof value === "object" ? JSON.stringify(value) : String(value);
  return `"${text.replace(/"/g, '""')}"`;
};
/** One RFC 4180 line: every field quoted, CRLF ending. */
export const csvLine = (values: unknown[]): string => `${values.map(cell).join(",")}\r\n`;
/** UTF-8 byte-order mark, so Excel opens the files as UTF-8. */
export const BOM = "﻿";

/** `Error-4XX_page`, after Ahrefs' naming, safe on every file system. */
export function exportFileName(type: string, indexable: boolean | null = null, severity?: Severity): string {
  const def = catalog[type];
  if (!def) return type;
  const split = indexable === null ? "" : indexable ? "indexable-" : "not_indexable-";
  return `${SEVERITY_LABEL[severity ?? def.severity]}-${split}${def.title.replace(/[\\/:*?"<>|]+/g, "").replace(/\s+/g, "_")}`;
}

// ── Page columns ────────────────────────────────────────────────────────────

/** The parts of a stored page's `data` (services/audit.ts slim()) the exports read. */
interface PageData {
  metaDescription?: string | null;
  h1s?: string[];
  canonical?: string | null;
  headerCanonical?: string | null;
  metaRobots?: string | null;
  xRobotsTag?: string | null;
  indexabilityReason?: string;
  finalUrl?: string;
  finalStatus?: number | null;
  redirectChain?: { url: string; status: number; location: string }[];
  sizeBytes?: number | null;
  openGraph?: Record<string, string>;
  twitter?: Record<string, string>;
  lang?: string | null;
  hreflang?: { lang: string; href: string }[];
  structuredData?: { types: string[]; problems: string[]; error?: string }[];
  sitemaps?: string[];
  inlinks?: { href: number; dofollow: number; nofollow: number; redirect: number; canonical: number; hreflang: number };
  internalLinkCount?: number;
  externalLinkCount?: number;
  imagesWithoutAlt?: string[];
  via?: string;
}

type Row = { issue: Pick<IssueRow, "url" | "detail" | "relatedUrls" | "change">; page: PageRow | null };
type Column = [string, (row: Row, data: PageData) => unknown];

const BASE_COLUMNS: Column[] = [
  ["URL", (r) => r.issue.url],
  ["PR", (r) => r.page?.pageRank],
  ["HTTP status code", (r) => r.page?.status],
  ["Title", (r) => r.page?.title],
  ["Content type", (r) => r.page?.contentType],
  ["Organic traffic", (r) => r.page?.clicks],
  ["Depth", (r) => r.page?.depth],
  ["Is indexable page", (r) => r.page?.indexable],
  ["Indexability", (_, d) => d.indexabilityReason],
  ["No. of inlinks", (r) => r.page?.inlinks],
  ["Is in sitemap", (r) => r.page?.inSitemap],
  ["Issue detail", (r) => r.issue.detail],
  ["Related URLs", (r) => r.issue.relatedUrls],
  ["Change since previous audit", (r) => r.issue.change],
];

const canonicalOf = (d: PageData) => d.canonical ?? d.headerCanonical;

const CATEGORY_COLUMNS: Partial<Record<IssueCategory, Column[]>> = {
  Content: [
    ["Title length", (r) => r.page?.title?.length],
    ["Meta description", (_, d) => d.metaDescription],
    ["Meta description length", (_, d) => d.metaDescription?.length],
    ["H1", (_, d) => d.h1s?.[0]],
    ["No. of H1", (_, d) => d.h1s?.length],
    ["No. of content words", (r) => r.page?.wordCount],
  ],
  Duplicates: [
    ["Meta description", (_, d) => d.metaDescription],
    ["H1", (_, d) => d.h1s?.[0]],
    ["Canonical URL", (_, d) => canonicalOf(d)],
    ["No. of content words", (r) => r.page?.wordCount],
  ],
  Redirects: [
    ["Redirect URL", (_, d) => d.finalUrl],
    ["Redirect URL code", (_, d) => d.finalStatus],
    ["Redirect chain URLs", (_, d) => d.redirectChain?.map((h) => h.url)],
    ["Redirect chain URLs codes", (_, d) => d.redirectChain?.map((h) => h.status)],
  ],
  Indexability: [
    ["Meta robots", (_, d) => d.metaRobots],
    ["Robots information in HTTP headers", (_, d) => d.xRobotsTag],
    ["Canonical URL", (_, d) => canonicalOf(d)],
  ],
  Performance: [
    ["Time to first byte (ms)", (r) => r.page?.responseMs],
    ["Loading time (ms)", (r) => r.page?.loadMs],
    ["Size (bytes)", (_, d) => d.sizeBytes],
  ],
  "AI search": [
    ["Time to first byte (ms)", (r) => r.page?.responseMs],
    ["Loading time (ms)", (r) => r.page?.loadMs],
  ],
  "Social tags": [
    ["og:title", (_, d) => d.openGraph?.["og:title"]],
    ["og:type", (_, d) => d.openGraph?.["og:type"]],
    ["og:image", (_, d) => d.openGraph?.["og:image"]],
    ["og:url", (_, d) => d.openGraph?.["og:url"]],
    ["twitter:card", (_, d) => d.twitter?.["twitter:card"]],
    ["Canonical URL", (_, d) => canonicalOf(d)],
  ],
  Localization: [
    ["HTML lang", (_, d) => d.lang],
    ["Hreflang", (_, d) => d.hreflang?.map((h) => `${h.lang} ${h.href}`)],
  ],
  "Structured data": [
    ["Schema items", (_, d) => d.structuredData?.flatMap((b) => b.types)],
    ["Structured data issues", (_, d) => d.structuredData?.flatMap((b) => (b.error ? [b.error] : b.problems))],
  ],
  Sitemaps: [["Referenced in sitemaps", (_, d) => d.sitemaps]],
  Links: [
    ["No. of inlinks dofollow", (_, d) => d.inlinks?.dofollow],
    ["No. of inlinks nofollow", (_, d) => d.inlinks?.nofollow],
    ["No. of redirect inlinks", (_, d) => d.inlinks?.redirect],
    ["No. of canonical inlinks", (_, d) => d.inlinks?.canonical],
    ["No. of internal outlinks", (_, d) => d.internalLinkCount],
    ["No. of external outlinks", (_, d) => d.externalLinkCount],
  ],
  Images: [["Images without alt (sample)", (_, d) => d.imagesWithoutAlt]],
};

export function pageColumns(type: string): Column[] {
  const category = categoryOf(type);
  return [...BASE_COLUMNS, ...((category && CATEGORY_COLUMNS[category]) ?? [])];
}

// ── Links for an issue ──────────────────────────────────────────────────────

const L = schema.auditLinks;
const sourcePage = alias(schema.auditPages, "source_page");
const targetPage = alias(schema.auditPages, "target_page");
const targetResource = alias(schema.auditResources, "target_resource");

/**
 * Which links explain an issue: those leaving the affected pages (`source`) or arriving at them
 * (`target`), of the given kinds, narrowed by `where`. Issues with no links file are absent.
 */
interface LinkSpec {
  side: "source" | "target";
  kinds: AuditLinkKind[];
  where?: () => SQL | undefined;
}

const INTO_PAGE: AuditLinkKind[] = ["href", "redirect", "canonical", "hreflang"];
const redirectLinks: LinkSpec = { side: "target", kinds: INTO_PAGE };
const canonicalLinks: LinkSpec = { side: "source", kinds: ["canonical"] };
const hreflangLinks: LinkSpec = { side: "source", kinds: ["hreflang"] };

export const LINK_SPECS: Partial<Record<IssueType, LinkSpec>> = {
  "broken-page": { side: "target", kinds: INTO_PAGE },
  "server-error": { side: "target", kinds: INTO_PAGE },
  "broken-internal-link": { side: "source", kinds: ["href"], where: () => gte(targetPage.status, 400) },
  "internal-link-to-redirect": { side: "source", kinds: ["href"], where: () => and(gte(targetPage.status, 300), lt(targetPage.status, 400)) },
  "redirect-3xx": redirectLinks,
  "temporary-redirect": redirectLinks,
  "redirect-chain": redirectLinks,
  "redirect-loop": redirectLinks,
  "broken-redirect": redirectLinks,
  "https-to-http-redirect": redirectLinks,
  "http-to-https-redirect": redirectLinks,
  "images-missing-alt": { side: "source", kinds: ["image"], where: () => isNull(L.anchor) },
  "broken-image": { side: "source", kinds: ["image"], where: () => eq(targetResource.broken, true) },
  "image-too-large": { side: "source", kinds: ["image"], where: () => gt(targetResource.sizeBytes, DEFAULT_THRESHOLDS.largeImageBytes) },
  "broken-css": { side: "source", kinds: ["stylesheet"], where: () => eq(targetResource.broken, true) },
  "broken-js": { side: "source", kinds: ["script"], where: () => eq(targetResource.broken, true) },
  "broken-external-link": { side: "source", kinds: ["href"], where: () => and(eq(L.internal, false), eq(targetResource.broken, true)) },
  "nofollow-internal-links": { side: "source", kinds: ["href"], where: () => and(eq(L.internal, true), eq(L.nofollow, true)) },
  "links-without-anchor": { side: "source", kinds: ["href"], where: () => and(eq(L.internal, true), eq(L.anchor, "")) },
  "single-dofollow-inlink": { side: "target", kinds: ["href"], where: () => eq(L.nofollow, false) },
  "canonical-no-incoming-links": { side: "target", kinds: ["canonical"] },
  "canonicalized-page": canonicalLinks,
  "canonical-to-broken": canonicalLinks,
  "canonical-to-redirect": canonicalLinks,
  "canonical-to-non-indexable": canonicalLinks,
  "canonical-to-http": canonicalLinks,
  "hreflang-missing-return-link": hreflangLinks,
  "hreflang-broken-target": hreflangLinks,
  "hreflang-to-non-canonical": hreflangLinks,
  "hreflang-to-noindex": hreflangLinks,
};

export const LINK_COLUMNS = [
  "Link type",
  "Is nofollow",
  "Source URL",
  "Source HTTP status code",
  "Target URL",
  "Target HTTP status code",
  "Anchor or alt text",
  "Target final redirect URL",
  "Target final redirect HTTP status code",
  "Is source indexable",
  "Is target indexable",
  "Is link internal",
];

const linkSelect = {
  link: L,
  sourceStatus: sourcePage.status,
  sourceIndexable: sourcePage.indexable,
  targetStatus: sql<number | null>`coalesce(${targetPage.status}, ${targetResource.status})`,
  targetIndexable: targetPage.indexable,
  targetFinalUrl: sql<string | null>`case when ${targetPage.status} between 300 and 399 then ${targetPage.data}->>'finalUrl' end`,
  targetFinalStatus: sql<string | null>`case when ${targetPage.status} between 300 and 399 then ${targetPage.data}->>'finalStatus' end`,
};
type LinkExportRow = { link: typeof L.$inferSelect } & Omit<{ [K in keyof typeof linkSelect]: unknown }, "link">;

const linkLine = (r: LinkExportRow): string =>
  csvLine([
    r.link.kind,
    r.link.nofollow,
    r.link.source,
    r.sourceStatus,
    r.link.target,
    r.targetStatus,
    r.link.anchor,
    r.targetFinalUrl,
    r.targetFinalStatus,
    r.sourceIndexable,
    r.targetIndexable,
    r.link.internal,
  ]);

/** Links of an audit matching `where`, in keyset order, a batch at a time. */
async function* linkBatches(auditId: string, where: SQL | undefined): AsyncGenerator<LinkExportRow[]> {
  let after: { source: string; target: string; kind: string; anchor: string } | null = null;
  for (;;) {
    const rows: LinkExportRow[] = await dataDb
      .select(linkSelect)
      .from(L)
      .leftJoin(sourcePage, and(eq(sourcePage.auditId, auditId), eq(sourcePage.url, L.source)))
      .leftJoin(targetPage, and(eq(targetPage.auditId, auditId), eq(targetPage.url, L.target)))
      .leftJoin(targetResource, and(eq(targetResource.auditId, auditId), eq(targetResource.url, L.target)))
      .where(
        and(
          eq(L.auditId, auditId),
          where,
          after ? sql`(${L.source}, ${L.target}, ${L.kind}, coalesce(${L.anchor}, '')) > (${after.source}, ${after.target}, ${after.kind}, ${after.anchor})` : undefined,
        ),
      )
      .orderBy(asc(L.source), asc(L.target), asc(L.kind), sql`coalesce(${L.anchor}, '')`)
      .limit(BATCH);
    if (rows.length === 0) return;
    yield rows;
    if (rows.length < BATCH) return;
    const last = rows[rows.length - 1]!.link;
    after = { source: last.source, target: last.target, kind: last.kind, anchor: last.anchor ?? "" };
  }
}

/** Issue rows of one type, of one indexability when given (null or undefined: all of them). */
const ofIssue = (auditId: string, type: string, indexable?: boolean | null): SQL | undefined =>
  and(eq(schema.auditIssues.auditId, auditId), eq(schema.auditIssues.type, type), indexable == null ? undefined : eq(schema.auditIssues.indexable, indexable));

/** The where clause selecting the links that explain one issue type. */
export function issueLinkFilter(auditId: string, type: string, indexable?: boolean | null): SQL | undefined {
  const spec = LINK_SPECS[type as IssueType];
  if (!spec) return undefined;
  const urls = dataDb
    .select({ url: schema.auditIssues.url })
    .from(schema.auditIssues)
    .where(ofIssue(auditId, type, indexable));
  return and(inArray(spec.side === "source" ? L.source : L.target, urls), inArray(L.kind, spec.kinds), spec.where?.());
}

// ── Streams ─────────────────────────────────────────────────────────────────

/** The pages with one issue, as CSV. */
export async function* issueCsv(auditId: string, type: string, indexable?: boolean | null): AsyncGenerator<string> {
  const columns = pageColumns(type);
  yield BOM + csvLine(columns.map(([name]) => name));
  const I = schema.auditIssues;
  let after: string | null = null;
  for (;;) {
    const rows = await dataDb
      .select({ issue: I, page: schema.auditPages })
      .from(I)
      .leftJoin(schema.auditPages, and(eq(schema.auditPages.auditId, auditId), eq(schema.auditPages.url, I.url)))
      .where(and(ofIssue(auditId, type, indexable), after ? gt(I.id, after) : undefined))
      .orderBy(asc(I.id))
      .limit(BATCH);
    if (rows.length === 0) return;
    let out = "";
    for (const row of rows) {
      const data = (row.page?.data ?? {}) as PageData;
      out += csvLine(columns.map(([, get]) => get(row, data)));
    }
    yield out;
    if (rows.length < BATCH) return;
    after = rows[rows.length - 1]!.issue.id;
  }
}

/** The links behind one issue, as CSV; null when the issue has no links file. */
export function issueLinksCsv(auditId: string, type: string, indexable?: boolean | null): AsyncGenerator<string> | null {
  const where = issueLinkFilter(auditId, type, indexable);
  if (!where) return null;
  return (async function* () {
    yield BOM + csvLine(LINK_COLUMNS);
    for await (const rows of linkBatches(auditId, where)) yield rows.map(linkLine).join("");
  })();
}

/** Site-wide exports, after Ahrefs' "Bulk export" list. */
export const BULK_EXPORTS = {
  "internal-urls": { title: "Internal URLs", description: "Every crawled URL, including non-200 pages." },
  links: { title: "All links", description: "Every link, redirect, canonical, hreflang, image, script and stylesheet reference, with anchor texts." },
  "uncrawled-links": { title: "Uncrawled links", description: "Internal links to URLs the crawl did not reach: over the page limit, excluded by a pattern, or past the depth limit." },
  "images-without-alt": { title: "Image references without alt text", description: "Every image used without an alt attribute." },
  "links-to-robots-blocked": { title: "Links to URLs blocked by robots.txt", description: "Links to URLs the crawler could not fetch because of robots.txt." },
  "links-to-4xx": { title: "Links to 4xx (client error) URLs", description: "Links to URLs answering with a client error." },
  "links-to-redirects": { title: "Links to redirects", description: "Links to URLs that redirect, with where they end up." },
  resources: { title: "Images, scripts and stylesheets", description: "Every resource checked, with status and size." },
  "external-links": { title: "External links", description: "Links to other sites, with each target's status when it was checked." },
} as const;
export type BulkExport = keyof typeof BULK_EXPORTS;

const PAGE_EXPORT_COLUMNS: [string, (p: PageRow, d: PageData) => unknown][] = [
  ["URL", (p) => p.url],
  ["PR", (p) => p.pageRank],
  ["HTTP status code", (p) => p.status],
  ["Content type", (p) => p.contentType],
  ["Title", (p) => p.title],
  ["Meta description", (_, d) => d.metaDescription],
  ["H1", (_, d) => d.h1s?.[0]],
  ["Canonical URL", (_, d) => canonicalOf(d)],
  ["Is indexable page", (p) => p.indexable],
  ["Indexability", (_, d) => d.indexabilityReason],
  ["Meta robots", (_, d) => d.metaRobots],
  ["Redirect URL", (p, d) => (p.status !== null && p.status >= 300 && p.status < 400 ? d.finalUrl : null)],
  ["Organic traffic", (p) => p.clicks],
  ["Depth", (p) => p.depth],
  ["No. of inlinks", (p) => p.inlinks],
  ["No. of content words", (p) => p.wordCount],
  ["Time to first byte (ms)", (p) => p.responseMs],
  ["Loading time (ms)", (p) => p.loadMs],
  ["Is in sitemap", (p) => p.inSitemap],
  ["Fetched via", (_, d) => d.via],
  ["No. of issues", (p) => p.issueCount],
];

async function* pagesCsv(auditId: string): AsyncGenerator<string> {
  yield BOM + csvLine(PAGE_EXPORT_COLUMNS.map(([name]) => name));
  const P = schema.auditPages;
  let after: { url: string; id: string } | null = null;
  for (;;) {
    const rows: PageRow[] = await dataDb
      .select()
      .from(P)
      .where(and(eq(P.auditId, auditId), after ? sql`(${P.url}, ${P.id}) > (${after.url}, ${after.id})` : undefined))
      .orderBy(asc(P.url), asc(P.id))
      .limit(BATCH);
    if (rows.length === 0) return;
    yield rows.map((p) => csvLine(PAGE_EXPORT_COLUMNS.map(([, get]) => get(p, p.data as PageData)))).join("");
    if (rows.length < BATCH) return;
    const last = rows[rows.length - 1]!;
    after = { url: last.url, id: last.id };
  }
}

async function* resourcesCsv(auditId: string, types: ("image" | "script" | "stylesheet" | "external")[]): AsyncGenerator<string> {
  yield BOM + csvLine(["URL", "Type", "HTTP status code", "Is broken", "Content type", "Size (bytes)", "Redirected", "No. of pages using it"]);
  const R = schema.auditResources;
  const rows = await dataDb
    .select()
    .from(R)
    .where(and(eq(R.auditId, auditId), inArray(R.type, types)))
    .orderBy(desc(R.broken), desc(R.sourceCount), asc(R.url));
  yield rows.map((r) => csvLine([r.url, r.type, r.status, r.broken, r.contentType, r.sizeBytes, r.redirected, r.sourceCount])).join("");
}

export function bulkCsv(auditId: string, kind: BulkExport): AsyncGenerator<string> {
  const links = (where: SQL | undefined) =>
    (async function* () {
      yield BOM + csvLine(LINK_COLUMNS);
      for await (const rows of linkBatches(auditId, where)) yield rows.map(linkLine).join("");
    })();
  switch (kind) {
    case "internal-urls":
      return pagesCsv(auditId);
    case "links":
      return links(undefined);
    case "uncrawled-links":
      return links(and(eq(L.kind, "href"), eq(L.internal, true), isNull(targetPage.url)));
    case "images-without-alt":
      return links(and(eq(L.kind, "image"), isNull(L.anchor)));
    case "links-to-robots-blocked":
      return links(sql`${targetPage.data}->>'fetchClass' = 'robots_blocked'`);
    case "links-to-4xx":
      return links(and(inArray(L.kind, INTO_PAGE), gte(targetPage.status, 400), lt(targetPage.status, 500)));
    case "links-to-redirects":
      return links(and(inArray(L.kind, INTO_PAGE), gte(targetPage.status, 300), lt(targetPage.status, 400)));
    case "resources":
      return resourcesCsv(auditId, ["image", "script", "stylesheet"]);
    case "external-links":
      return links(and(eq(L.kind, "href"), eq(L.internal, false)));
  }
}

/** Wraps a generator of strings as a byte stream for a Fastify reply. */
export const toStream = (chunks: AsyncGenerator<string>): Readable => Readable.from((async function* () {
  for await (const chunk of chunks) yield Buffer.from(chunk, "utf8");
})());

/** Report rows an audit has (issue types, split by indexability), worst first, with how many URLs each affects. */
export async function issueTypesOf(auditId: string) {
  const I = schema.auditIssues;
  const rows = await dataDb
    .select({ type: I.type, severity: I.severity, indexable: I.indexable, urls: sql<number>`count(distinct ${I.url})::int` })
    .from(I)
    .where(eq(I.auditId, auditId))
    .groupBy(I.type, I.severity, I.indexable);
  return rows.sort((a, b) => SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity) || b.urls - a.urls);
}

/**
 * The "Export all issues" zip: for each issue a CSV of the affected pages and, where links explain it,
 * a `-links` CSV; an index; and the AI fix brief. Streamed, so a large site never sits in memory.
 */
export function issuesZip(audit: Audit): Readable {
  const out = new PassThrough();
  const zip = new Zip((error, data, final) => {
    if (error) return void out.destroy(error);
    out.write(data);
    if (final) out.end();
  });
  const addFile = async (name: string, chunks: AsyncGenerator<string> | string[]) => {
    const file = new ZipDeflate(name, { level: 6 });
    zip.add(file);
    for await (const chunk of chunks) {
      if (out.destroyed) throw new Error("Download closed");
      file.push(strToU8(chunk));
      // Let the reply drain before reading more rows; a closed download ends the export.
      if (out.writableLength > 4 * 1024 * 1024) await Promise.race([once(out, "drain"), once(out, "close")]);
    }
    file.push(new Uint8Array(0), true);
  };
  void (async () => {
    const types = await issueTypesOf(audit.id);
    const index: string[] = [];
    for (const { type, severity, indexable } of types) {
      const name = exportFileName(type, indexable, severity);
      index.push(`${name}.csv`);
      await addFile(`${name}.csv`, issueCsv(audit.id, type, indexable));
      const links = issueLinksCsv(audit.id, type, indexable);
      if (links) {
        index.push(`${name}-links.csv`);
        await addFile(`${name}-links.csv`, links);
      }
    }
    await addFile("AI-fix-brief.md", [await fixBrief(audit)]);
    await addFile("index.txt", [["AI-fix-brief.md", ...index].join("\r\n") + "\r\n"]);
    zip.end();
  })().catch((error) => {
    if (!out.destroyed) out.destroy(error as Error);
  });
  return out;
}

// ── AI fix brief ────────────────────────────────────────────────────────────

/** `/items/*` for /items/ak-47-redline: the template a URL most likely comes from. */
export function urlPattern(url: string): string {
  try {
    const segments = new URL(url).pathname.split("/").filter(Boolean);
    if (segments.length === 0) return "/";
    if (segments.length === 1) return `/${segments[0]}`;
    return `/${segments[0]}/${segments.length > 2 ? "*/".repeat(segments.length - 2) : ""}*`;
  } catch {
    return url;
  }
}

const plural = (n: number, word: string) => `${n.toLocaleString("en-US")} ${word}${n === 1 ? "" : "s"}`;

/**
 * A Markdown brief for a coding agent: every issue with why it matters and how to fix it, the URL
 * patterns it affects (fix the template once, not each page), the most-linked culprits for link
 * issues, and sample URLs with details.
 */
export async function fixBrief(audit: Audit, options: { samples?: number } = {}): Promise<string> {
  const samples = options.samples ?? 10;
  const summary = (audit.summary ?? {}) as {
    pagesTotal?: number;
    finalStartUrl?: string;
    urlsWithErrors?: number;
    diff?: Record<string, { new: number; added: number; removed: number; missing: number }> | null;
    aiDiscoverability?: { score: number } | null;
  };
  const site = summary.finalStartUrl ?? audit.startUrl;
  const types = await issueTypesOf(audit.id);
  const finished = (audit.finishedAt ?? audit.createdAt).toISOString().slice(0, 10);
  const totals = SEVERITY_ORDER.map((s) => `${types.filter((t) => t.severity === s).length} ${SEVERITY_LABEL[s].toLowerCase()} types`).join(", ");

  const lines: string[] = [
    `# Technical SEO fix brief: ${site}`,
    "",
    `Site audit of ${plural(summary.pagesTotal ?? audit.pagesCrawled, "URL")} on ${finished}. Health score ${audit.healthScore ?? "–"}/100` +
      (summary.aiDiscoverability ? `, AI discoverability ${summary.aiDiscoverability.score}/100` : "") +
      `. ${totals}.`,
    "",
    "## How to use this brief",
    "",
    "You are fixing technical SEO issues found by crawling this site. Work from the top: errors first, then warnings; notices are listed last and are often fine to leave.",
    "",
    "- Most issues repeat across a page template. When an issue affects many URLs that share a pattern (such as `/items/*`), fix the template, layout or shared component once instead of page by page.",
    "- A link problem on almost every page usually lives in the header, footer or navigation.",
    "- Each issue says why it matters and how to fix it, then lists the affected URL patterns, the most common culprits and sample URLs with details.",
    "- Do not change pages that are noindex or blocked on purpose; confirm intent first.",
    "- When you are done, run the audit again to confirm the fixes.",
    "",
  ];

  const I = schema.auditIssues;
  const P = schema.auditPages;
  for (const severity of SEVERITY_ORDER) {
    const group = types.filter((t) => t.severity === severity);
    if (group.length === 0) continue;
    lines.push(`## ${SEVERITY_LABEL[severity]}s`, "");
    for (const { type, urls, indexable } of group) {
      const def = catalog[type];
      if (!def) continue;
      const change = summary.diff?.[groupKey(type, indexable)];
      const changeNote = change && change.new + change.added + change.removed > 0 ? ` (since the last audit: ${change.new + change.added} new, ${change.removed} fixed)` : "";
      lines.push(`### ${def.title}${indexable === false ? " (non-indexable pages)" : ""} — ${plural(urls, "URL")}${changeNote}`, "", `- Issue id: \`${type}\``, `- Why: ${def.description}`, `- Fix: ${def.howToFix}`);

      // Notices get the essentials only.
      if (severity === "info") {
        lines.push("");
        continue;
      }

      const affected = await dataDb
        .select({ url: I.url, detail: I.detail, related: I.relatedUrls, rank: P.pageRank })
        .from(I)
        .leftJoin(P, and(eq(P.auditId, audit.id), eq(P.url, I.url)))
        .where(ofIssue(audit.id, type, indexable))
        .orderBy(sql`${P.pageRank} desc nulls last`, asc(I.url))
        .limit(5000);
      const patterns = new Map<string, number>();
      for (const row of affected) patterns.set(urlPattern(row.url), (patterns.get(urlPattern(row.url)) ?? 0) + 1);
      const topPatterns = [...patterns.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
      if (topPatterns.length > 1 || (topPatterns[0] && topPatterns[0][1] > 1)) {
        lines.push(`- URL patterns: ${topPatterns.map(([p, n]) => `\`${p}\` (${n})`).join(", ")}`);
      }

      const filter = issueLinkFilter(audit.id, type, indexable);
      if (filter) {
        const culprits = await dataDb
          .select({ target: L.target, sources: sql<number>`count(distinct ${L.source})::int`, status: sql<number | null>`max(coalesce(${targetPage.status}, ${targetResource.status}))` })
          .from(L)
          .leftJoin(targetPage, and(eq(targetPage.auditId, audit.id), eq(targetPage.url, L.target)))
          .leftJoin(targetResource, and(eq(targetResource.auditId, audit.id), eq(targetResource.url, L.target)))
          .where(and(eq(L.auditId, audit.id), filter))
          .groupBy(L.target)
          .orderBy(sql`2 desc`, asc(L.target))
          .limit(8);
        if (culprits.length > 0) {
          lines.push("- Most-linked targets:");
          for (const c of culprits) lines.push(`  - ${c.target}${c.status ? ` (HTTP ${c.status})` : ""}, linked from ${plural(c.sources, "page")}`);
        }
      }

      lines.push("- Sample URLs:");
      for (const row of affected.slice(0, samples)) {
        const related = row.related?.length ? `; related: ${row.related.slice(0, 3).join(", ")}${row.related.length > 3 ? ", …" : ""}` : "";
        lines.push(`  - ${row.url}${row.detail ? ` — ${row.detail}` : ""}${related}`);
      }
      if (urls > samples) lines.push(`  - …and ${plural(urls - samples, "more URL")} (see \`${exportFileName(type, indexable, severity)}.csv\` in the full export)`);
      lines.push("");
    }
  }
  if (types.length === 0) lines.push("No issues found. Nothing to fix.", "");
  return lines.join("\n");
}
