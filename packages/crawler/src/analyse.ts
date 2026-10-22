import { INDEXABILITY_SPLIT, ISSUE_CATALOG } from './catalog';
import type { IssueType } from './catalog';
import { computeLinkGraph, isNofollowPage } from './graph';
import type {
  AiDiscoverability,
  CrawlSummary,
  ExternalLinkCheck,
  HttpProbe,
  IndexabilityReason,
  Issue,
  PageResult,
  PageTraffic,
  ResourceResult,
  Severity,
  StatusClass,
  Thresholds,
} from './types';
import { normalizeUrl, stripWww } from './url';

export const DEFAULT_THRESHOLDS: Thresholds = {
  titleMinLength: 10,
  titleMaxLength: 60,
  descriptionMinLength: 70,
  descriptionMaxLength: 160,
  thinContentWords: 150,
  slowResponseMs: 600,
  slowAiResponseMs: 1000,
  slowPageMs: 1500,
  deepPageDepth: 5,
  largeHtmlBytes: 1_000_000,
  largeImageBytes: 100 * 1024,
  urlMaxLength: 115,
};

const MAX_RELATED = 20;

const HREFLANG_CODE = /^(x-default|[a-z]{2,3}(-[a-z]{4})?(-([a-z]{2}|\d{3}))?)$/i;
const TEMPORARY_REDIRECT = new Set([302, 303, 307]);
const NOINDEX_REASONS = new Set<IndexabilityReason>(['noindex-meta', 'noindex-header']);

export function makeIssue(type: IssueType, url: string, detail?: string, relatedUrls?: string[]): Issue {
  const issue: Issue = { type, severity: ISSUE_CATALOG[type].severity, url };
  if (detail !== undefined) issue.detail = detail;
  if (relatedUrls && relatedUrls.length > 0) issue.relatedUrls = relatedUrls.slice(0, MAX_RELATED);
  return issue;
}

const ONE_LOWER: Record<Severity, Severity> = { critical: 'warning', warning: 'info', info: 'info' };

/**
 * Marks issues of the split types (Links, Content and content changes) with whether their page is
 * indexable. On a non-indexable page they count one severity lower: a broken link on a noindex page
 * is a warning, not an error. Issues on URLs that were not crawled stay unmarked.
 */
export function markIndexability(issues: Issue[], pages: Pick<PageResult, 'url' | 'indexable'>[]): Issue[] {
  const indexable = new Map(pages.map((page) => [page.url, page.indexable]));
  for (const issue of issues) {
    if (!INDEXABILITY_SPLIT.has(issue.type)) continue;
    const value = indexable.get(issue.url);
    if (value === undefined) continue;
    issue.indexable = value;
    if (!value) issue.severity = ONE_LOWER[issue.severity];
  }
  return issues;
}

/** Clicks a page needed in the earlier 28 days before a fall counts as "Organic traffic dropped", and the share it must lose. */
export const TRAFFIC_DROP = { minPreviousClicks: 10, share: 0.5 };

/**
 * Search Console rows keyed the way the crawler keys pages (tracking parameters stripped, trailing
 * slash kept), summed when two URLs normalise alike.
 */
export function trafficByPage(rows: PageTraffic[]): Map<string, PageTraffic> {
  const byUrl = new Map<string, PageTraffic>();
  for (const row of rows) {
    const url = normalizeUrl(row.url, undefined, { stripTrackingParams: true, trailingSlash: 'preserve' });
    if (!url) continue;
    const sum = byUrl.get(url);
    if (sum) {
      sum.clicks += row.clicks;
      sum.previousClicks += row.previousClicks;
    } else byUrl.set(url, { url, clicks: row.clicks, previousClicks: row.previousClicks });
  }
  return byUrl;
}

/**
 * Issues that need search traffic: a redirecting, broken, noindex or non-canonical page Google still
 * sends visitors to, and pages whose clicks fell by half or more.
 */
export function trafficIssues(pages: PageResult[], traffic: Map<string, PageTraffic>): Issue[] {
  const issues: Issue[] = [];
  for (const page of pages) {
    const t = traffic.get(page.url);
    if (!t) continue;
    const clicks = `${t.clicks} ${t.clicks === 1 ? 'click' : 'clicks'} from Google in the last 28 days`;
    if (t.clicks > 0) {
      if (page.fetchClass === 'redirect') issues.push(makeIssue('redirect-receives-traffic', page.url, `${clicks}; HTTP ${page.status} to ${page.finalUrl}`));
      else if (page.fetchClass === 'client_error') issues.push(makeIssue('broken-page-receives-traffic', page.url, `${clicks}; HTTP ${page.status}`));
      else if (page.fetchClass === 'ok' && NOINDEX_REASONS.has(page.indexabilityReason)) issues.push(makeIssue('noindex-page-receives-traffic', page.url, clicks));
      else if (page.fetchClass === 'ok' && page.indexabilityReason === 'canonicalised') {
        issues.push(makeIssue('non-canonical-receives-traffic', page.url, `${clicks}; canonical is ${page.canonical ?? page.headerCanonical ?? 'another URL'}`));
      }
    }
    if (t.previousClicks >= TRAFFIC_DROP.minPreviousClicks && t.clicks <= t.previousClicks * (1 - TRAFFIC_DROP.share)) {
      issues.push(makeIssue('organic-traffic-dropped', page.url, `${t.previousClicks} → ${t.clicks} clicks (last 28 days against the 28 before)`));
    }
  }
  return issues;
}

// Directives whose value follows a colon, so "max-image-preview: none" is not a user-agent prefix.
const VALUED_DIRECTIVES = new Set(['unavailable_after', 'max-snippet', 'max-image-preview', 'max-video-preview']);

/**
 * True when a robots meta / X-Robots-Tag value carries a whole `noindex` or `none` directive that applies to us.
 * `bingbot: noindex` style entries count only for googlebot, `*` or one of `agents`; unprefixed ones always count.
 */
export function hasNoindex(value: string, agents: string[] = []): boolean {
  const ours = new Set(['googlebot', '*', ...agents.map((a) => a.toLowerCase())]);
  let applies = true;
  for (const part of value.split(',')) {
    let directive = part.trim().toLowerCase();
    const prefixed = /^([^\s:]+)\s*:\s*(.*)$/.exec(directive);
    if (prefixed && !VALUED_DIRECTIVES.has(prefixed[1] ?? '')) {
      applies = ours.has(prefixed[1] ?? '');
      directive = (prefixed[2] ?? '').trim();
    }
    if (applies && (directive === 'noindex' || directive === 'none')) return true;
  }
  return false;
}

/** Sets `indexable` and `indexabilityReason` from the page's own signals. `agent` is our robots user-agent token. */
export function computeIndexability(page: PageResult, agent?: string): { indexable: boolean; reason: IndexabilityReason } {
  const no = (reason: IndexabilityReason): { indexable: boolean; reason: IndexabilityReason } => ({ indexable: false, reason });
  switch (page.fetchClass) {
    case 'robots_blocked':
      return no('robots-blocked');
    case 'redirect':
      return no('redirect');
    case 'blocked':
      return no('blocked');
    case 'rate_limited':
      return no('rate-limited');
    case 'error':
      return no('fetch-error');
    case 'client_error':
    case 'server_error':
      return no('http-error');
    case 'ok':
      break;
  }
  const agents = agent ? [agent] : [];
  if (page.xRobotsTag && hasNoindex(page.xRobotsTag, agents)) return no('noindex-header');
  if (page.metaRobots && hasNoindex(page.metaRobots, agents)) return no('noindex-meta');
  const canonical = page.canonical ?? page.headerCanonical;
  if (canonical && canonical !== page.url) return no('canonicalised');
  return { indexable: true, reason: 'ok' };
}

const primaryLanguage = (code: string): string => code.toLowerCase().split(/[-_]/)[0] ?? '';

/** Issues that can be decided from one page alone. Access failures stop all content checks. */
export function pageIssues(page: PageResult, thresholds: Thresholds = DEFAULT_THRESHOLDS): Issue[] {
  const issues: Issue[] = [];
  const add = (type: IssueType, detail?: string, related?: string[]): void => {
    issues.push(makeIssue(type, page.url, detail, related));
  };

  switch (page.fetchClass) {
    case 'robots_blocked':
      add('blocked-by-robots');
      return issues;
    case 'blocked':
      add('blocked-page', `HTTP ${page.status}`);
      return issues;
    case 'rate_limited':
      add('rate-limited-page', 'HTTP 429 after retries');
      return issues;
    case 'error':
      if (page.errorKind !== 'aborted') add('fetch-failed', `${page.errorKind ?? 'unknown'}: ${page.errorMessage ?? ''}`.trim());
      return issues;
    case 'redirect':
      redirectIssues(page, add);
      return issues;
    case 'server_error':
      add('server-error', `HTTP ${page.status}`);
      return issues;
    case 'client_error':
      if (page.status === 404) add('page-404', 'HTTP 404');
      add('broken-page', `HTTP ${page.status}`);
      return issues;
    case 'ok':
      break;
  }

  if (page.responseTimeMs !== null && page.responseTimeMs > thresholds.slowResponseMs) {
    add('slow-response', `${page.responseTimeMs} ms to first byte`);
  }
  if (!page.isHtml) return issues;

  if (page.via !== 'fallback' && page.loadTimeMs !== null && page.loadTimeMs > thresholds.slowPageMs) {
    add('slow-page', `${page.loadTimeMs} ms (${page.responseTimeMs ?? '?'} ms to first byte)`);
  }
  if (page.indexable && page.responseTimeMs !== null && page.responseTimeMs > thresholds.slowAiResponseMs) {
    add('slow-response-ai-crawlers', `${page.responseTimeMs} ms to first byte`);
  }
  if (page.url.length > thresholds.urlMaxLength) add('url-too-long', `${page.url.length} characters`);
  if (/[A-Z]/.test(new URL(page.url).pathname)) add('url-uppercase');

  const noindex = page.indexabilityReason === 'noindex-meta' || page.indexabilityReason === 'noindex-header';
  const nofollow = isNofollowPage(page);
  if (noindex) {
    add('noindex-page', page.indexabilityReason === 'noindex-meta' ? `meta robots: ${page.metaRobots}` : `X-Robots-Tag: ${page.xRobotsTag}`);
    if (!nofollow) add('noindex-follow-page');
  }
  if (nofollow) add('nofollow-page', page.metaRobots ? `meta robots: ${page.metaRobots}` : `X-Robots-Tag: ${page.xRobotsTag}`);
  if (page.metaRefresh) add('meta-refresh-redirect', `Refreshes to ${page.metaRefresh}`, [page.metaRefresh]);
  if (page.canonical && page.headerCanonical && page.canonical !== page.headerCanonical) {
    add('canonical-conflict', `HTML: ${page.canonical}, header: ${page.headerCanonical}`);
  }
  if (page.canonicalCount > 1) add('multiple-canonical', `${page.canonicalCount} canonical link elements`);
  const canonical = page.canonical ?? page.headerCanonical;
  if (canonical && canonical !== page.url) add('canonicalized-page', `Canonical: ${canonical}`, [canonical]);
  if (canonical && page.url.startsWith('https://') && canonical.startsWith('http://')) {
    add('canonical-to-http', `Canonical: ${canonical}`, [canonical]);
  }
  if (page.truncated || (page.sizeBytes ?? 0) > thresholds.largeHtmlBytes) {
    add('large-html', page.truncated ? `Cut at ${page.sizeBytes} bytes` : `${page.sizeBytes} bytes`);
  }

  if (page.jsRenderingSuspected) {
    add('javascript-rendering-suspected');
    return issues;
  }
  if (page.needsJavaScript) add('javascript-rendering-suspected', 'The content only appears after JavaScript runs');

  const title = page.title ?? '';
  if (!title) add('missing-title');
  else if (title.length > thresholds.titleMaxLength) add('title-too-long', `${title.length} characters`);
  else if (title.length < thresholds.titleMinLength) add('title-too-short', `${title.length} characters`);
  if (page.titleCount > 1) add('multiple-titles', `${page.titleCount} title elements`);

  const description = page.metaDescription ?? '';
  if (!description) add('missing-meta-description');
  else if (description.length > thresholds.descriptionMaxLength) add('meta-description-too-long', `${description.length} characters`);
  else if (description.length < thresholds.descriptionMinLength) add('meta-description-too-short', `${description.length} characters`);
  if (page.metaDescriptionCount > 1) add('multiple-meta-descriptions', `${page.metaDescriptionCount} meta descriptions`);

  // A truncated body lacks its tail, so absence-based checks (H1, links, word count) are skipped.
  if (page.h1s.length === 0 && !page.truncated) add('missing-h1');
  else if (page.h1s.length > 1) add('multiple-h1', `${page.h1s.length} H1s`);

  let previous = 0;
  for (const heading of page.headings) {
    if (previous > 0 && heading.level > previous + 1) {
      add('heading-order-skip', `H${previous} followed by H${heading.level}`);
      break;
    }
    previous = heading.level;
  }

  if (page.indexable && !page.truncated && page.wordCount < thresholds.thinContentWords) add('thin-content', `${page.wordCount} words`);
  if (page.imagesMissingAlt > 0) {
    add(
      'images-missing-alt',
      `${page.imagesMissingAlt} of ${page.imageCount} images`,
      page.images.filter((i) => i.alt === null && i.url !== null).map((i) => i.url as string),
    );
  }
  if (page.indexable && !page.truncated && page.internalLinks.length + page.externalLinks.length === 0) add('no-outgoing-links');
  if (!nofollow) {
    const nofollowed = page.internalLinks.filter((l) => l.nofollow).map((l) => l.url);
    if (nofollowed.length > 0) add('nofollow-internal-links', `${nofollowed.length} nofollow links to your own pages`, nofollowed);
  }
  const unnamed = page.internalLinks.filter((l) => l.anchor === '').map((l) => l.url);
  if (unnamed.length > 0) add('links-without-anchor', `${unnamed.length} links without anchor text`, unnamed);
  if (!page.viewport) add('missing-viewport');
  if (!page.lang) add('missing-lang');

  const missingOg = ['og:title', 'og:type', 'og:image', 'og:url'].filter((k) => !page.openGraph[k]);
  if (missingOg.length > 0) add('missing-open-graph', `Missing ${missingOg.join(', ')}`);
  const ogUrl = page.openGraph['og:url'];
  if (ogUrl) {
    const expected = canonical ?? page.url;
    const resolved = normalizeUrl(ogUrl, page.url);
    if (resolved !== expected) add('open-graph-url-mismatch', `og:url ${ogUrl}, canonical ${expected}`, [expected]);
  }
  if (!page.twitter['twitter:card']) add('twitter-card-missing');
  if (page.mixedContent.length > 0) add('mixed-content', `${page.mixedContent.length} HTTP resources`, page.mixedContent);

  for (const block of page.structuredData) {
    if (block.error) {
      add('structured-data-parse-error', block.error);
      continue;
    }
    const untyped = block.problems.filter((p) => p.includes('"@type"'));
    const invalid = block.problems.filter((p) => !p.includes('"@type"'));
    if (untyped.length > 0) add('structured-data-missing-type');
    if (invalid.length > 0) add('structured-data-invalid', invalid.join('; '));
  }

  if (page.hreflang.length > 0) {
    const bad = page.hreflang.filter((h) => !HREFLANG_CODE.test(h.lang)).map((h) => h.lang);
    if (bad.length > 0) add('hreflang-invalid-code', `Invalid: ${[...new Set(bad)].join(', ')}`);
    const self = page.hreflang.find((h) => h.href === page.url && h.lang.toLowerCase() !== 'x-default');
    if (!self) add('hreflang-missing-self-reference');
    if (!page.hreflang.some((h) => h.lang.toLowerCase() === 'x-default')) add('hreflang-missing-x-default');
    if (self && page.lang && primaryLanguage(self.lang) !== primaryLanguage(page.lang)) {
      add('hreflang-lang-mismatch', `html lang="${page.lang}", hreflang="${self.lang}"`);
    }
  }
  return issues;
}

function redirectIssues(page: PageResult, add: (type: IssueType, detail?: string, related?: string[]) => void): void {
  const hops = page.redirectChain;
  const urls = hops.map((h) => h.url);
  if (page.redirectLoop) {
    add('redirect-loop', `Loops back to ${page.finalUrl}`, urls);
    return;
  }
  const codes = hops.map((h) => h.status).join(' → ');
  add('redirect-3xx', `${codes} → ${page.finalUrl}${page.finalStatus ? ` (${page.finalStatus})` : ''}`, [page.finalUrl]);
  if (hops.length >= 2) {
    const suffix = page.errorKind === 'too_many_redirects' ? ' (gave up)' : '';
    add('redirect-chain', `${hops.length} redirects before ${page.finalUrl}${suffix}`, [...urls, page.finalUrl]);
  }
  const temporary = hops.filter((h) => TEMPORARY_REDIRECT.has(h.status));
  if (temporary.length > 0) add('temporary-redirect', `${temporary.map((h) => h.status).join(', ')} to ${page.finalUrl}`, [page.finalUrl]);
  if (hops.some((h) => h.url.startsWith('https://') && h.location.startsWith('http://'))) {
    add('https-to-http-redirect', `Ends at ${page.finalUrl}`, [page.finalUrl]);
  }
  const first = hops[0];
  if (first && first.url.startsWith('http://') && page.finalUrl.startsWith('https://')) {
    if (stripWww(new URL(first.url).hostname) === stripWww(new URL(page.finalUrl).hostname)) add('http-to-https-redirect', `Redirects to ${page.finalUrl}`);
  }
  if (page.finalStatus !== null && page.finalStatus >= 400) {
    add('broken-redirect', `Ends at ${page.finalUrl} (HTTP ${page.finalStatus})`, [page.finalUrl]);
  }
}

export interface CrawlFacts {
  startUrl: string;
  /** No URLs were left unfetched, so absence of a link is meaningful. */
  complete: boolean;
  /** Sitemap discovery ran (it can be switched off). */
  sitemapChecked: boolean;
  sitemapFound: boolean;
  /** Sitemap discovery hit its document/URL limits, so the sitemap URL set is partial. */
  sitemapCapped?: boolean;
  /** Sitemaps skipped because they exceeded the size limit. */
  sitemapsTooLarge?: string[];
  /** Sitemaps named in robots.txt or a sitemap index that could not be read. */
  sitemapsFailed?: { url: string; status: number }[];
  /** Origins whose robots.txt answered 5xx/429, so crawling was treated as disallowed. */
  robotsUnavailable?: string[];
  /** Whether the start origin serves a robots.txt; undefined when not checked. */
  robotsTxtFound?: boolean;
  /** Whether the start origin serves an llms.txt; undefined when not checked. */
  llmsTxtFound?: boolean;
  httpProbe?: HttpProbe | null;
  aiDiscoverability?: AiDiscoverability | null;
  rateLimitStopped: boolean;
  externalLinks: ExternalLinkCheck[];
  resources?: ResourceResult[];
  thresholds: Thresholds;
}

const isOkHtml = (p: PageResult): boolean => p.fetchClass === 'ok' && p.isHtml;
const isErrorStatus = (p: PageResult): boolean => p.fetchClass === 'client_error' || p.fetchClass === 'server_error';

/** Recomputes click depth over the crawled link graph. Redirects cost no click. */
export function assignDepths(pages: PageResult[], startUrl: string): void {
  const byUrl = new Map(pages.map((p) => [p.url, p]));
  const depth = new Map<string, number>();
  let level: string[] = [startUrl];
  depth.set(startUrl, 0);
  for (let d = 0; level.length > 0; d++) {
    const next: string[] = [];
    for (let i = 0; i < level.length; i++) {
      const page = byUrl.get(level[i] ?? '');
      if (!page) continue;
      if (page.fetchClass === 'redirect' && byUrl.has(page.finalUrl) && (depth.get(page.finalUrl) ?? Infinity) > d) {
        depth.set(page.finalUrl, d);
        level.push(page.finalUrl);
      }
      for (const link of page.internalLinks) {
        if (!depth.has(link.url) && byUrl.has(link.url)) {
          depth.set(link.url, d + 1);
          next.push(link.url);
        }
      }
    }
    level = next;
  }
  for (const page of pages) page.depth = depth.get(page.url) ?? null;
}

function duplicateGroups(pages: PageResult[], key: (p: PageResult) => string | null): PageResult[][] {
  const groups = new Map<string, PageResult[]>();
  for (const page of pages) {
    const k = key(page);
    if (!k) continue;
    const group = groups.get(k);
    if (group) group.push(page);
    else groups.set(k, [page]);
  }
  return [...groups.values()].filter((g) => g.length > 1);
}

/** Issues that need the whole crawl. Also fills `depth`, `inlinks`, `inboundLinkCount` and `pageRank` on the pages. */
export function crossPageIssues(pages: PageResult[], facts: CrawlFacts): Issue[] {
  const issues: Issue[] = [];
  const byUrl = new Map(pages.map((p) => [p.url, p]));
  assignDepths(pages, facts.startUrl);
  computeLinkGraph(pages);

  // Links to broken pages and to redirects: one issue per linking page. Blocked, rate-limited and failed
  // targets are not "broken".
  for (const page of pages) {
    const broken: string[] = [];
    const redirecting: string[] = [];
    for (const link of page.internalLinks) {
      const target = byUrl.get(link.url);
      if (!target || target === page) continue;
      if (isErrorStatus(target)) broken.push(link.url);
      else if (target.fetchClass === 'redirect') redirecting.push(link.url);
    }
    if (broken.length > 0) {
      const codes = [...new Set(broken.map((url) => byUrl.get(url)?.status))].join(', ');
      issues.push(makeIssue('broken-internal-link', page.url, `${broken.length} links to broken pages (HTTP ${codes})`, broken));
    }
    if (redirecting.length > 0) {
      issues.push(makeIssue('internal-link-to-redirect', page.url, `${redirecting.length} links to redirecting URLs`, redirecting));
    }
  }

  // Duplicates among indexable, readable pages.
  const candidates = pages.filter((p) => isOkHtml(p) && p.indexable && !p.jsRenderingSuspected);
  const reportDuplicates = (
    type: IssueType | ((p: PageResult) => IssueType),
    label: string,
    key: (p: PageResult) => string | null,
  ): void => {
    for (const group of duplicateGroups(candidates, key)) {
      for (const page of group) {
        const others = group.filter((p) => p !== page).map((p) => p.url);
        issues.push(makeIssue(typeof type === 'function' ? type(page) : type, page.url, `${label} shared by ${group.length} pages`, others));
      }
    }
  };
  reportDuplicates('duplicate-title', 'Title', (p) => p.title);
  reportDuplicates('duplicate-meta-description', 'Meta description', (p) => p.metaDescription);
  reportDuplicates(
    (p) => (p.canonical === null && p.headerCanonical === null ? 'duplicate-without-canonical' : 'duplicate-content'),
    'Content',
    (p) => (p.wordCount > 0 && !p.truncated ? p.contentHash : null),
  );

  for (const page of pages) {
    if (page.fetchClass === 'redirect' && facts.complete && page.inlinks.href === 0 && page.discoveredFrom !== 'start') {
      issues.push(makeIssue('redirect-no-incoming-links', page.url, `Found through ${page.discoveredFrom}`, [page.finalUrl]));
    }
    if (!isOkHtml(page)) continue;

    if (page.depth !== null && page.depth >= facts.thresholds.deepPageDepth) {
      issues.push(makeIssue('deep-page', page.url, `${page.depth} clicks from the start URL`));
    }
    if (facts.complete && page.url !== facts.startUrl) {
      if (page.inlinks.canonical > 0 && page.inlinks.href === 0) {
        issues.push(makeIssue('canonical-no-incoming-links', page.url, `Canonical of ${page.inlinks.canonical} pages, linked from none`));
      }
      if (page.indexable && page.inlinks.dofollow === 1) {
        issues.push(makeIssue('single-dofollow-inlink', page.url, `${page.inlinks.dofollow} followed, ${page.inlinks.nofollow} nofollow`));
      }
    }

    const canonical = page.canonical ?? page.headerCanonical;
    const target = canonical && canonical !== page.url ? byUrl.get(canonical) : undefined;
    if (target && canonical) {
      if (isErrorStatus(target)) {
        issues.push(makeIssue('canonical-to-broken', page.url, `Canonical ${canonical} returns HTTP ${target.status}`, [canonical]));
      } else if (target.fetchClass === 'redirect') {
        issues.push(makeIssue('canonical-to-redirect', page.url, `Canonical ${canonical} redirects to ${target.finalUrl}`, [canonical]));
      } else if ((target.fetchClass === 'ok' || target.fetchClass === 'robots_blocked') && !target.indexable) {
        issues.push(makeIssue('canonical-to-non-indexable', page.url, `Canonical ${canonical} is ${target.indexabilityReason}`, [canonical]));
      }
    }

    const noReturn: string[] = [];
    const brokenAlternates: string[] = [];
    const nonCanonical: string[] = [];
    const noindexAlternates: string[] = [];
    for (const alt of page.hreflang) {
      if (alt.href === page.url) continue;
      const other = byUrl.get(alt.href);
      if (!other) continue;
      if (other.fetchClass === 'redirect' || isErrorStatus(other)) {
        brokenAlternates.push(alt.href);
        continue;
      }
      if (!isOkHtml(other)) continue;
      if (other.indexabilityReason === 'canonicalised') nonCanonical.push(alt.href);
      else if (NOINDEX_REASONS.has(other.indexabilityReason)) noindexAlternates.push(alt.href);
      if (!other.hreflang.some((h) => h.href === page.url)) noReturn.push(alt.href);
    }
    const unique = (urls: string[]): string[] => [...new Set(urls)];
    if (noReturn.length > 0) {
      issues.push(makeIssue('hreflang-missing-return-link', page.url, `${unique(noReturn).length} alternates do not link back`, unique(noReturn)));
    }
    if (brokenAlternates.length > 0) {
      issues.push(makeIssue('hreflang-broken-target', page.url, `${unique(brokenAlternates).length} alternates are not 200`, unique(brokenAlternates)));
    }
    if (nonCanonical.length > 0) {
      issues.push(makeIssue('hreflang-to-non-canonical', page.url, `${unique(nonCanonical).length} alternates are canonicalised elsewhere`, unique(nonCanonical)));
    }
    if (noindexAlternates.length > 0) {
      issues.push(makeIssue('hreflang-to-noindex', page.url, `${unique(noindexAlternates).length} alternates are noindex`, unique(noindexAlternates)));
    }
  }

  // Sitemap consistency. "Missing from sitemap" needs the full sitemap URL set.
  const tooLarge = facts.sitemapsTooLarge ?? [];
  const sitemapComplete = facts.sitemapFound && !facts.sitemapCapped && tooLarge.length === 0;
  for (const page of pages) {
    const definitive = ['ok', 'redirect', 'client_error', 'server_error', 'robots_blocked'].includes(page.fetchClass);
    if (page.inSitemap && definitive) {
      if (page.fetchClass === 'redirect') {
        issues.push(makeIssue('redirect-in-sitemap', page.url, `Redirects to ${page.finalUrl}`, [page.finalUrl, ...page.sitemaps]));
      } else if (isErrorStatus(page)) {
        issues.push(makeIssue('broken-in-sitemap', page.url, `HTTP ${page.status}`, page.sitemaps));
      } else if (NOINDEX_REASONS.has(page.indexabilityReason)) {
        issues.push(makeIssue('noindex-in-sitemap', page.url, `Reason: ${page.indexabilityReason}`, page.sitemaps));
      } else if (!page.indexable) {
        issues.push(makeIssue('non-indexable-in-sitemap', page.url, `Reason: ${page.indexabilityReason}`, page.sitemaps));
      }
    }
    if (page.sitemaps.length > 1) {
      issues.push(makeIssue('page-in-multiple-sitemaps', page.url, `Listed in ${page.sitemaps.length} sitemaps`, page.sitemaps));
    }
    if (!isOkHtml(page)) continue;
    if (sitemapComplete && page.indexable && !page.inSitemap) issues.push(makeIssue('page-not-in-sitemap', page.url));
    if (
      facts.complete &&
      page.indexable &&
      page.inSitemap &&
      page.url !== facts.startUrl &&
      page.inboundLinkCount === 0 &&
      page.inlinks.redirect === 0
    ) {
      issues.push(makeIssue('orphan-page', page.url, 'In the sitemap but not linked from any crawled page'));
    }
  }
  for (const sitemap of tooLarge) {
    issues.push(makeIssue('sitemap-too-large', facts.startUrl, `${sitemap} exceeds the size limit`, [sitemap]));
  }
  for (const failed of facts.sitemapsFailed ?? []) {
    const reason = failed.status > 0 ? `HTTP ${failed.status}` : 'no response';
    issues.push(makeIssue('sitemap-unreachable', facts.startUrl, `${failed.url} (${failed.status >= 200 && failed.status < 300 ? 'not a sitemap' : reason})`, [failed.url]));
  }
  if (facts.sitemapChecked && !facts.sitemapFound && tooLarge.length === 0 && pages.some(isOkHtml)) {
    issues.push(makeIssue('sitemap-missing', facts.startUrl));
  }
  for (const origin of facts.robotsUnavailable ?? []) {
    issues.push(makeIssue('robots-txt-unavailable', facts.startUrl, `${origin}/robots.txt returned a server error`, [`${origin}/robots.txt`]));
  }
  const reachable = pages.some(isOkHtml);
  if (facts.robotsTxtFound === false && (facts.robotsUnavailable ?? []).length === 0 && reachable) {
    issues.push(makeIssue('robots-txt-missing', facts.startUrl));
  }
  if (facts.llmsTxtFound === false && reachable) issues.push(makeIssue('llms-txt-missing', facts.startUrl));
  if (facts.rateLimitStopped) {
    issues.push(makeIssue('crawl-rate-limited', facts.startUrl, 'Crawl stopped after repeated 429 responses'));
  }

  const probe = facts.httpProbe;
  if (probe && probe.status >= 200 && probe.status < 300) {
    issues.push(makeIssue('http-not-redirected-to-https', facts.startUrl, `${probe.url} answers ${probe.status} without redirecting`, [probe.url]));
  }

  const ai = facts.aiDiscoverability;
  if (ai) {
    const describe = (bots: typeof ai.bots): string => bots.map((b) => (b.allowedPct === 0 ? b.token : `${b.token} (${100 - b.allowedPct}% of pages)`)).join(', ');
    const searchBlocked = ai.bots.filter((b) => b.purpose !== 'training' && b.allowedPct < 100);
    const trainingBlocked = ai.bots.filter((b) => b.purpose === 'training' && b.allowedPct < 100);
    if (searchBlocked.length > 0) issues.push(makeIssue('ai-search-bots-blocked', facts.startUrl, `Blocked: ${describe(searchBlocked)}`));
    if (trainingBlocked.length > 0) issues.push(makeIssue('ai-training-bots-blocked', facts.startUrl, `Blocked: ${describe(trainingBlocked)}`));
  }

  // Security headers and HTTPS: one sample page per origin.
  const sampled = new Set<string>();
  const ordered = [...pages].sort((a, b) => Number(b.url === facts.startUrl) - Number(a.url === facts.startUrl));
  for (const page of ordered) {
    if (!isOkHtml(page) || page.via === 'fallback') continue;
    const origin = new URL(page.url).origin;
    if (sampled.has(origin)) continue;
    sampled.add(origin);
    const h = page.securityHeaders;
    const detail = `Sampled on ${page.url}`;
    if (origin.startsWith('http://')) issues.push(makeIssue('insecure-http', page.url, detail));
    else if (!h.strictTransportSecurity) issues.push(makeIssue('missing-hsts', page.url, detail));
    if (!h.contentSecurityPolicy) issues.push(makeIssue('missing-content-security-policy', page.url, detail));
    if (!h.xContentTypeOptions) issues.push(makeIssue('missing-x-content-type-options', page.url, detail));
    if (!h.xFrameOptions && !/frame-ancestors/i.test(h.contentSecurityPolicy ?? '')) {
      issues.push(makeIssue('missing-x-frame-options', page.url, detail));
    }
    if (!h.referrerPolicy) issues.push(makeIssue('missing-referrer-policy', page.url, detail));
  }

  // Broken external links: one issue per linking page.
  const brokenExternal = new Map(facts.externalLinks.filter((c) => c.broken).map((c) => [c.url, c]));
  if (brokenExternal.size > 0) {
    for (const page of pages) {
      const broken = page.externalLinks.filter((l) => brokenExternal.has(l.url)).map((l) => l.url);
      if (broken.length === 0) continue;
      const reasons = [...new Set(broken.map((url) => {
        const check = brokenExternal.get(url);
        return check && check.status > 0 ? `HTTP ${check.status}` : (check?.errorKind ?? 'no response');
      }))].join(', ');
      issues.push(makeIssue('broken-external-link', page.url, `${broken.length} broken external links (${reasons})`, broken));
    }
  }

  // Images, scripts and stylesheets: attributed to every page that uses them.
  const resources = new Map((facts.resources ?? []).map((r) => [r.url, r]));
  if (resources.size > 0) {
    const large = facts.thresholds.largeImageBytes;
    for (const page of pages) {
      if (!isOkHtml(page)) continue;
      const brokenImages: string[] = [];
      const largeImages: string[] = [];
      for (const image of page.images) {
        const resource = image.url ? resources.get(image.url) : undefined;
        if (!resource) continue;
        if (resource.broken) brokenImages.push(resource.url);
        else if (resource.sizeBytes !== null && resource.sizeBytes > large) largeImages.push(resource.url);
      }
      const brokenOf = (urls: string[]): string[] => urls.filter((url) => resources.get(url)?.broken);
      const css = brokenOf(page.stylesheets);
      const js = brokenOf(page.scripts);
      const uniq = (urls: string[]): string[] => [...new Set(urls)];
      if (brokenImages.length > 0) issues.push(makeIssue('broken-image', page.url, `${uniq(brokenImages).length} broken images`, uniq(brokenImages)));
      if (largeImages.length > 0) {
        issues.push(makeIssue('image-too-large', page.url, `${uniq(largeImages).length} images over ${Math.round(large / 1024)} KB`, uniq(largeImages)));
      }
      if (css.length > 0) issues.push(makeIssue('broken-css', page.url, `${css.length} broken stylesheets`, css));
      if (js.length > 0) issues.push(makeIssue('broken-js', page.url, `${js.length} broken scripts`, js));
    }
  }
  return issues;
}

export const HEALTH_WEIGHTS: Record<Severity, number> = { critical: 25, warning: 8, info: 1 };

/** Rows the health score is computed over: every crawled row except robots.txt-blocked ones. */
const audited = (pages: PageResult[]): PageResult[] => pages.filter((p) => p.fetchClass !== 'robots_blocked');

/** URLs with at least one critical issue. */
function erroredUrls(issues: Issue[]): Set<string> {
  return new Set(issues.filter((i) => i.severity === 'critical').map((i) => i.url));
}

/**
 * healthScore = round(100 x audited URLs without a critical issue / audited URLs), the share of the
 * site that is free of errors. Audited URLs are all rows except robots.txt-blocked ones. The score is
 * 0 when no page returned a 2xx response.
 */
export function computeHealthScore(pages: PageResult[], issues: Issue[]): number {
  const rows = audited(pages);
  if (rows.length === 0 || !pages.some((p) => p.fetchClass === 'ok')) return 0;
  const errored = erroredUrls(issues);
  const clean = rows.filter((p) => !errored.has(p.url)).length;
  return Math.round((100 * clean) / rows.length);
}

export function statusClassOf(page: Pick<PageResult, 'status'>): StatusClass {
  const s = page.status;
  if (s >= 200 && s < 300) return '2xx';
  if (s >= 300 && s < 400) return '3xx';
  if (s >= 400 && s < 500) return '4xx';
  if (s >= 500 && s < 600) return '5xx';
  return 'none';
}

const emptyClasses = (): Record<StatusClass, number> => ({ '2xx': 0, '3xx': 0, '4xx': 0, '5xx': 0, none: 0 });

/** html, image, css, js, pdf or other, from a Content-Type header. */
export function contentKind(contentType: string | null): string {
  const t = (contentType ?? '').toLowerCase();
  if (/text\/html|xhtml/.test(t)) return 'html';
  if (t.startsWith('image/')) return 'image';
  if (t.includes('css')) return 'css';
  if (/javascript|ecmascript/.test(t)) return 'js';
  if (t.includes('pdf')) return 'pdf';
  return 'other';
}

export type SummaryMeta = Pick<
  CrawlSummary,
  | 'startUrl'
  | 'finalStartUrl'
  | 'startedAt'
  | 'finishedAt'
  | 'durationMs'
  | 'stoppedReason'
  | 'truncated'
  | 'urlsDiscovered'
  | 'urlsExcluded'
  | 'robotsTxtFound'
  | 'sitemaps'
  | 'sitemapUrls'
  | 'externalLinksChecked'
> &
  Partial<Pick<CrawlSummary, 'aiDiscoverability' | 'httpProbe' | 'llmsTxtFound'>> & { resources?: ResourceResult[] };

export function summarise(pages: PageResult[], issues: Issue[], meta: SummaryMeta): CrawlSummary {
  const { resources = [], ...rest } = meta;
  const count = (pred: (p: PageResult) => boolean): number => pages.filter(pred).length;
  const issuesBySeverity: Record<Severity, number> = { critical: 0, warning: 0, info: 0 };
  const issuesByType: Partial<Record<IssueType, number>> = {};
  for (const issue of issues) {
    issuesBySeverity[issue.severity]++;
    issuesByType[issue.type] = (issuesByType[issue.type] ?? 0) + 1;
  }
  const times = pages.map((p) => p.responseTimeMs).filter((t): t is number => t !== null);

  const ttfbBuckets = { fast: 0, medium: 0, slow: 0, tooSlow: 0 };
  for (const page of pages) {
    if (!isOkHtml(page) || page.responseTimeMs === null) continue;
    const t = page.responseTimeMs;
    if (t < 200) ttfbBuckets.fast++;
    else if (t < 300) ttfbBuckets.medium++;
    else if (t <= 500) ttfbBuckets.slow++;
    else ttfbBuckets.tooSlow++;
  }

  const rows = audited(pages);
  const statusClasses = emptyClasses();
  const statusByDepth: Record<string, Record<StatusClass, number>> = {};
  const contentTypes: Record<string, number> = {};
  for (const page of rows) {
    const cls = statusClassOf(page);
    statusClasses[cls]++;
    const depthKey = page.depth === null ? 'none' : page.depth > 9 ? '9+' : String(page.depth);
    (statusByDepth[depthKey] ??= emptyClasses())[cls]++;
    if (page.contentType && page.fetchClass !== 'redirect') {
      const kind = contentKind(page.contentType);
      contentTypes[kind] = (contentTypes[kind] ?? 0) + 1;
    }
  }
  for (const resource of resources) {
    if (!resource.contentType) continue;
    const kind = contentKind(resource.contentType);
    contentTypes[kind] = (contentTypes[kind] ?? 0) + 1;
  }

  const byUrl = new Map(pages.map((p) => [p.url, p]));
  const linkStatus = { crawled: 0, uncrawled: 0, robotsBlocked: 0 };
  for (const page of pages) {
    for (const link of page.internalLinks) {
      const target = byUrl.get(link.url);
      if (!target) linkStatus.uncrawled++;
      else if (target.fetchClass === 'robots_blocked') linkStatus.robotsBlocked++;
      else linkStatus.crawled++;
    }
  }

  const errored = erroredUrls(issues);
  const urlsWithErrors = rows.filter((p) => errored.has(p.url)).length;

  return {
    aiDiscoverability: null,
    httpProbe: null,
    llmsTxtFound: false,
    ...rest,
    pagesTotal: pages.length,
    pagesCrawled: count((p) => ['ok', 'redirect', 'client_error', 'server_error'].includes(p.fetchClass)),
    pagesBlocked: count((p) => p.fetchClass === 'blocked'),
    pagesRateLimited: count((p) => p.fetchClass === 'rate_limited'),
    pagesRobotsBlocked: count((p) => p.fetchClass === 'robots_blocked'),
    pagesFailed: count((p) => p.fetchClass === 'error'),
    htmlPages: count(isOkHtml),
    indexablePages: count((p) => isOkHtml(p) && p.indexable),
    avgResponseTimeMs: times.length > 0 ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : null,
    ttfbBuckets,
    statusClasses,
    statusByDepth,
    contentTypes,
    linkStatus,
    resourcesChecked: resources.length,
    urlsWithErrors,
    urlsWithoutErrors: rows.length - urlsWithErrors,
    issuesTotal: issues.length,
    issuesBySeverity,
    issuesByType,
    healthScore: computeHealthScore(pages, issues),
  };
}
