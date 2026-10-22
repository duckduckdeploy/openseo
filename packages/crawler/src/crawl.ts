import { computeAiDiscoverability } from './ai';
import { DEFAULT_THRESHOLDS, computeIndexability, crossPageIssues, markIndexability, pageIssues, summarise } from './analyse';
import { canonicalFromLinkHeader, extractPage, extractSecurityHeaders } from './extract';
import type { ExtractedPage } from './extract';
import { emptyInlinks } from './graph';
import { Pace } from './pace';
import {
  HostThrottle,
  classifyResponse,
  createPinnedTransport,
  decodeBody,
  fetchUrl,
  looksLikeChallenge,
  parseRetryAfter,
} from './fetch';
import type { FetchContext, FetchOutcome, Transport } from './fetch';
import { discoverSitemapUrls, loadRobots, robotsUnavailable } from './robots';
import type { RobotsRules } from './robots';
import { SsrfError, createGuard } from './ssrf';
import type {
  CrawlHooks,
  CrawlPhase,
  CrawlOptions,
  CrawlResult,
  DiscoverySource,
  ExternalLinkCheck,
  FetchVia,
  HttpProbe,
  PageResult,
  RenderResult,
  ResourceResult,
  ResourceType,
  StopReason,
} from './types';
import { effectivePort, matchesAny, normalizeUrl, stripWww, withScheme } from './url';
import type { NormalizeOptions } from './url';

export const DEFAULT_USER_AGENT = 'OpenSEOBot/0.1';

const MAX_ROBOTS_BLOCKED_ROWS = 1000;
const MAX_FRONTIER = 200_000;
/** Links to other sites checked at once; each site still has its own throttle. */
const EXTERNAL_CONCURRENCY = 8;
const MAX_CRAWL_DELAY_MS = 10_000;
const HTML_TYPE = /text\/html|application\/xhtml\+xml/i;
const LLMS_TXT_MAX_BYTES = 64 * 1024;

interface FrontierEntry {
  /** Normalised URL with sorted query parameters: the dedupe key and the row's `url`. */
  url: string;
  /** What is requested: the same, but with the query parameters in the order they were found. */
  fetchUrl: string;
  depth: number | null;
  source: DiscoverySource;
  state: 'pending' | 'taken';
}

function blankPage(url: string, depth: number | null, source: DiscoverySource): PageResult {
  return {
    url,
    finalUrl: url,
    status: 0,
    finalStatus: null,
    fetchClass: 'error',
    errorKind: null,
    errorMessage: null,
    redirectChain: [],
    redirectLoop: false,
    contentType: null,
    isHtml: false,
    rendered: false,
    via: 'direct',
    responseTimeMs: null,
    loadTimeMs: null,
    sizeBytes: null,
    truncated: false,
    depth,
    inSitemap: false,
    sitemaps: [],
    discoveredFrom: source,
    indexable: false,
    indexabilityReason: 'fetch-error',
    inboundLinkCount: 0,
    inlinks: emptyInlinks(),
    pageRank: 0,
    title: null,
    titleCount: 0,
    metaDescription: null,
    metaDescriptionCount: 0,
    metaRobots: null,
    metaRefresh: null,
    xRobotsTag: null,
    canonical: null,
    canonicalCount: 0,
    headerCanonical: null,
    h1s: [],
    headings: [],
    wordCount: 0,
    contentHash: null,
    lang: null,
    hreflang: [],
    internalLinks: [],
    externalLinks: [],
    images: [],
    imageCount: 0,
    imagesMissingAlt: 0,
    scripts: [],
    stylesheets: [],
    openGraph: {},
    twitter: {},
    structuredData: [],
    hasMicrodata: false,
    viewport: null,
    mixedContent: [],
    securityHeaders: extractSecurityHeaders(null),
    jsRenderingSuspected: false,
    needsJavaScript: false,
  };
}

/** Rendering revealed content the fetched HTML lacked: an empty shell, or under half the words and 100+ missing. */
function contentNeedsJavaScript(fetched: ExtractedPage, rendered: ExtractedPage): boolean {
  if (rendered.jsRenderingSuspected) return false;
  if (fetched.jsRenderingSuspected) return true;
  return rendered.wordCount - fetched.wordCount >= 100 && fetched.wordCount < rendered.wordCount / 2;
}

async function runPool<T>(items: T[], size: number, fn: (item: T) => Promise<void>): Promise<void> {
  let index = 0;
  const worker = async (): Promise<void> => {
    for (;;) {
      const item = items[index++];
      if (item === undefined) return;
      await fn(item);
    }
  };
  await Promise.all(Array.from({ length: Math.max(1, Math.min(size, items.length)) }, worker));
}

/**
 * Crawls one site and audits it. Rejects only when the start URL is invalid or refused by the SSRF guard;
 * every later failure is recorded on the affected page. An aborted signal returns the partial result.
 */
export async function crawlSite(options: CrawlOptions, hooks: CrawlHooks = {}): Promise<CrawlResult> {
  const startedAt = Date.now();
  const maxPages = Math.max(1, options.maxPages ?? 100);
  const maxDurationMs = Math.max(0, options.maxDurationMs ?? 30 * 60_000);
  const concurrency = Math.max(1, options.concurrency ?? 2);
  const userAgent = options.userAgent ?? DEFAULT_USER_AGENT;
  const robotsAgent = options.robotsUserAgent ?? (/^[^\s/]+/.exec(userAgent)?.[0] ?? '*');
  const respectRobots = options.respectRobots ?? true;
  const thresholds = { ...DEFAULT_THRESHOLDS, ...options.thresholds };
  const rateLimitRetries = options.rateLimitRetries ?? 2;
  const rateLimitBackoffMs = options.rateLimitBackoffMs ?? 5000;
  const rateLimitMaxBackoffMs = options.rateLimitMaxBackoffMs ?? 60_000;
  const rateLimitGiveUpAfter = Math.max(1, options.rateLimitGiveUpAfter ?? 3);
  const signal = options.signal;
  const norm: NormalizeOptions = {
    stripTrackingParams: options.stripTrackingParams ?? true,
    trailingSlash: options.trailingSlash ?? 'preserve',
  };
  // URLs are fetched with their query order intact; `norm` (sorted) only builds the dedupe key.
  const fetchNorm: NormalizeOptions = { ...norm, sortQuery: false };
  const fetchForms = new Map<string, string>();
  const toKey = (url: string): string => {
    const key = normalizeUrl(url, undefined, norm) ?? url;
    if (key !== url && !fetchForms.has(key)) fetchForms.set(key, url);
    return key;
  };
  const phase = async (name: CrawlPhase): Promise<void> => {
    try {
      await hooks.onPhase?.(name);
    } catch (err) {
      log('warn', `onPhase hook threw: ${err instanceof Error ? err.message : String(err)}`);
    }
  };
  const log = (level: 'debug' | 'info' | 'warn', message: string): void => {
    try {
      hooks.onLog?.(level, message);
    } catch {
      // logging must not break the crawl
    }
  };

  const startFetchUrl = normalizeUrl(withScheme(options.startUrl), undefined, fetchNorm);
  if (!startFetchUrl) throw new SsrfError('invalid-url', options.startUrl, `Invalid start URL: ${options.startUrl}`);
  const startUrl = toKey(startFetchUrl);

  const guardOptions = {
    allowPrivateNetwork: options.allowPrivateNetwork ?? false,
    allowedPorts: options.allowedPorts,
    resolveHost: options.resolveHost,
  };
  const guard = createGuard(guardOptions);
  try {
    await guard.assert(startFetchUrl);
  } catch (err) {
    // A start URL that does not resolve is a crawl result, not a caller error.
    if (err instanceof SsrfError) throw err;
  }

  const transport: Transport = options.fetch
    ? { fetch: options.fetch, close: () => {} }
    : createPinnedTransport({ allowPrivateNetwork: guardOptions.allowPrivateNetwork });
  const throttle = new HostThrottle(Math.max(0, options.delayMs ?? 500));
  const ctx: FetchContext = {
    fetch: transport.fetch,
    guard,
    throttle,
    userAgent,
    timeoutMs: options.timeoutMs ?? 15_000,
    maxBodyBytes: options.maxBodyBytes ?? 2 * 1024 * 1024,
    maxRedirects: options.maxRedirects ?? 10,
    signal,
  };

  // Scope: hosts (www-insensitive) and ports that count as "this site".
  const scopeHosts = new Set<string>();
  const scopePorts = new Set<number>();
  const addScope = (url: string): void => {
    const u = new URL(url);
    scopeHosts.add(stripWww(u.hostname));
    const port = effectivePort(u);
    scopePorts.add(port);
    if (port === 80 || port === 443) {
      scopePorts.add(80);
      scopePorts.add(443);
    }
  };
  const isInternal = (url: string): boolean => {
    let u: URL;
    try {
      u = new URL(url);
    } catch {
      return false;
    }
    if (!scopePorts.has(effectivePort(u))) return false;
    const host = stripWww(u.hostname);
    if (scopeHosts.has(host)) return true;
    return options.includeSubdomains === true && [...scopeHosts].some((h) => host.endsWith(`.${h}`));
  };
  addScope(startUrl);

  const pages: PageResult[] = [];
  const entries = new Map<string, FrontierEntry>();
  // Breadth-first: linked URLs without a query string, then linked URLs with one (usually filters,
  // sorts and tracking variants of pages already in the first queue), then sitemap-only URLs.
  const linkQueue: string[] = [];
  const paramQueue: string[] = [];
  const lowQueue: string[] = [];
  let linkHead = 0;
  let paramHead = 0;
  let lowHead = 0;
  const queueFor = (url: string): string[] => (url.includes('?') ? paramQueue : linkQueue);
  const maxConcurrency = Math.max(concurrency, options.maxConcurrency ?? concurrency);
  const pace = new Pace(concurrency, maxConcurrency);
  const excluded = new Set<string>();
  const sitemapSet = new Set<string>();
  /** Sitemap documents listing each URL. */
  const sitemapSources = new Map<string, Set<string>>();
  const sitemapDocs: string[] = [];
  const sitemapOrigins = new Set<string>();
  const sitemapsTooLarge: string[] = [];
  const sitemapsFailed: { url: string; status: number }[] = [];
  let sitemapCapped = false;
  const robotsUnavailableOrigins: string[] = [];
  const robotsCache = new Map<string, Promise<RobotsRules>>();
  let robotsTxtFound = false;
  let robotsBlockedRows = 0;
  let attempted = 0;
  let pending = 0;
  let active = 0;
  let timeLimitHit = false;
  let consecutiveRateLimited = 0;
  let rateLimitStopped = false;
  let waiters: (() => void)[] = [];

  const notify = (): void => {
    const current = waiters;
    waiters = [];
    for (const wake of current) wake();
  };
  const timeUp = (): boolean => {
    if (!timeLimitHit && Date.now() - startedAt >= maxDurationMs) {
      timeLimitHit = true;
      log('warn', `Time limit of ${maxDurationMs} ms reached; finishing the pages in flight`);
    }
    return timeLimitHit;
  };
  const stopped = (): boolean => rateLimitStopped || signal?.aborted === true || timeUp();
  /** Stores an entry, keeping the running count of pending entries in step. */
  const setEntry = (entry: FrontierEntry): void => {
    if (entries.get(entry.url)?.state === 'pending') pending--;
    if (entry.state === 'pending') pending++;
    entries.set(entry.url, entry);
  };

  const enqueue = (url: string, depth: number | null, source: DiscoverySource): void => {
    const existing = entries.get(url);
    if (existing) {
      // A sitemap-only URL that turns out to be linked moves to the breadth-first queue.
      if (existing.state === 'pending' && existing.depth === null && depth !== null) {
        if (options.maxDepth !== undefined && depth > options.maxDepth) return;
        existing.depth = depth;
        existing.source = source;
        queueFor(url).push(url);
        notify();
      } else if (existing.state === 'pending' && existing.depth !== null && depth !== null && depth < existing.depth) {
        // Found closer to the start than first thought (the parameter queue is crawled later).
        existing.depth = depth;
      }
      return;
    }
    if (!isInternal(url)) return;
    if (source !== 'start') {
      if (matchesAny(url, options.exclude) || (options.include !== undefined && !matchesAny(url, options.include))) {
        excluded.add(url);
        return;
      }
    }
    if (depth !== null && options.maxDepth !== undefined && depth > options.maxDepth) return;
    if (entries.size >= MAX_FRONTIER) return;
    setEntry({ url, fetchUrl: fetchForms.get(url) ?? url, depth, source, state: 'pending' });
    (depth === null ? lowQueue : queueFor(url)).push(url);
    notify();
  };

  const take = (): FrontierEntry | null => {
    while (linkHead < linkQueue.length) {
      const entry = entries.get(linkQueue[linkHead++] ?? '');
      if (entry && entry.state === 'pending') {
        entry.state = 'taken';
        pending--;
        return entry;
      }
    }
    while (paramHead < paramQueue.length) {
      const entry = entries.get(paramQueue[paramHead++] ?? '');
      if (entry && entry.state === 'pending') {
        entry.state = 'taken';
        pending--;
        return entry;
      }
    }
    while (lowHead < lowQueue.length) {
      const entry = entries.get(lowQueue[lowHead++] ?? '');
      if (entry && entry.state === 'pending') {
        entry.state = 'taken';
        pending--;
        return entry;
      }
    }
    return null;
  };

  const getRobots = (origin: string): Promise<RobotsRules> => {
    let cached = robotsCache.get(origin);
    if (!cached) {
      cached = loadRobots(origin, ctx, robotsAgent).then((rules) => {
        if (rules.found) robotsTxtFound = true;
        if (respectRobots && robotsUnavailable(rules)) {
          robotsUnavailableOrigins.push(origin);
          log('warn', `robots.txt ${origin} returned ${rules.status}; treating the site as disallowed`);
        }
        if (respectRobots && rules.crawlDelayMs !== null) {
          throttle.setMinDelay(new URL(origin).host, Math.min(rules.crawlDelayMs, MAX_CRAWL_DELAY_MS));
        }
        log('debug', `robots.txt ${origin}: ${rules.found ? 'loaded' : `not available (status ${rules.status})`}`);
        return rules;
      });
      robotsCache.set(origin, cached);
    }
    return cached;
  };
  const robotsAllows = async (url: string): Promise<boolean> => {
    if (!respectRobots) return true;
    return (await getRobots(new URL(url).origin)).isAllowed(url);
  };

  const discoverSitemaps = async (origin: string): Promise<void> => {
    if (options.useSitemaps === false || sitemapOrigins.has(origin)) return;
    sitemapOrigins.add(origin);
    const robots = await getRobots(origin);
    const seeds = [...new Set([...robots.sitemaps, `${origin}/sitemap.xml`])];
    const found = await discoverSitemapUrls(seeds, ctx);
    for (const doc of found.sitemaps) if (!sitemapDocs.includes(doc)) sitemapDocs.push(doc);
    for (const doc of found.tooLarge) if (!sitemapsTooLarge.includes(doc)) sitemapsTooLarge.push(doc);
    // The /sitemap.xml guess may simply not exist; a sitemap that robots.txt or an index names should.
    for (const failure of found.failed) {
      if (failure.fromIndex || robots.sitemaps.includes(failure.url)) sitemapsFailed.push({ url: failure.url, status: failure.status });
    }
    if (found.capped) sitemapCapped = true;
    found.urls.forEach((loc, i) => {
      const raw = normalizeUrl(loc, origin, fetchNorm);
      if (!raw || !isInternal(raw)) return;
      const url = toKey(raw);
      sitemapSet.add(url);
      let docs = sitemapSources.get(url);
      if (!docs) sitemapSources.set(url, (docs = new Set()));
      docs.add(found.sources[i] ?? '');
      enqueue(url, null, 'sitemap');
    });
    log('info', `Sitemaps on ${origin}: ${found.sitemaps.length} documents, ${found.urls.length} URLs`);
  };

  const record = async (page: PageResult): Promise<void> => {
    page.inSitemap = sitemapSet.has(page.url);
    page.sitemaps = [...(sitemapSources.get(page.url) ?? [])];
    const verdict = computeIndexability(page, robotsAgent);
    page.indexable = verdict.indexable;
    page.indexabilityReason = verdict.reason;
    pages.push(page);
    if (hooks.onPage) {
      try {
        await hooks.onPage(page, { pagesProcessed: attempted, maxPages, queued: pending, discovered: entries.size });
      } catch (err) {
        log('warn', `onPage hook threw: ${err instanceof Error ? err.message : String(err)}`);
      }
    }
    if (page.fetchClass !== 'ok') return;
    for (const link of page.internalLinks) enqueue(link.url, page.depth === null ? null : page.depth + 1, 'link');
    const canonical = page.canonical ?? page.headerCanonical;
    if (canonical && canonical !== page.url) enqueue(canonical, null, 'canonical');
    for (const alt of page.hreflang) if (alt.href !== page.url) enqueue(alt.href, null, 'hreflang');
  };

  const recordRobotsBlocked = async (url: string, depth: number | null, source: DiscoverySource): Promise<void> => {
    if (robotsBlockedRows >= MAX_ROBOTS_BLOCKED_ROWS) return;
    robotsBlockedRows++;
    const page = blankPage(url, depth, source);
    page.fetchClass = 'robots_blocked';
    await record(page);
  };

  /** A redirect's destination is only read when it will become a row: not when it is crawled already or off-site. */
  const readDestination = (finalUrl: string): boolean => {
    const key = toKey(normalizeUrl(finalUrl, undefined, fetchNorm) ?? finalUrl);
    return isInternal(key) && entries.get(key)?.state !== 'taken';
  };

  const fetchPage = async (url: string): Promise<FetchOutcome> => {
    for (let attempt = 0; ; attempt++) {
      const out = await fetchUrl(ctx, url, { wantBody: (contentType, finalUrl) => HTML_TYPE.test(contentType) && (finalUrl === url || readDestination(finalUrl)) });
      const status = out.error ? 0 : out.status;
      pace.record(out.responseTimeMs, status === 429 || status >= 500 || out.error?.kind === 'timeout' || out.error?.kind === 'connection');
      if (out.error) return out;
      if (out.status !== 429) {
        consecutiveRateLimited = 0;
        return out;
      }
      if (attempt >= rateLimitRetries || stopped()) {
        consecutiveRateLimited++;
        if (consecutiveRateLimited >= rateLimitGiveUpAfter) {
          rateLimitStopped = true;
          log('warn', `Giving up: ${consecutiveRateLimited} consecutive URLs were rate-limited`);
        }
        return out;
      }
      const wait = Math.min(
        rateLimitMaxBackoffMs,
        parseRetryAfter(out.headers?.get('retry-after') ?? null) ?? rateLimitBackoffMs * 2 ** attempt,
      );
      log('warn', `429 from ${out.finalUrl}; backing off ${wait} ms`);
      throttle.pause(new URL(out.finalUrl).host, wait);
    }
  };

  const buildPage = async (url: string, depth: number | null, source: DiscoverySource, out: FetchOutcome): Promise<PageResult> => {
    const page = blankPage(url, depth, source);
    page.responseTimeMs = out.responseTimeMs;
    page.loadTimeMs = out.loadTimeMs;
    if (out.error) {
      page.errorKind = out.error.kind;
      page.errorMessage = out.error.message;
      return page;
    }
    const contentType = out.headers?.get('content-type') ?? null;
    page.status = out.status;
    page.contentType = contentType;
    page.isHtml = contentType !== null && HTML_TYPE.test(contentType);
    page.xRobotsTag = out.headers?.get('x-robots-tag') ?? null;
    const headerCanonical = canonicalFromLinkHeader(out.headers?.get('link') ?? null, url, fetchNorm);
    page.headerCanonical = headerCanonical === null ? null : toKey(headerCanonical);
    page.securityHeaders = extractSecurityHeaders(out.headers);
    page.truncated = out.truncated;
    let html = page.isHtml && out.body ? decodeBody(out.body, contentType) : null;
    if (html !== null) page.sizeBytes = out.body?.byteLength ?? 0;

    let cls = classifyResponse(out.status, out.headers, html);
    const extract = (source: string): ExtractedPage => extractPage(source, { url, isInternal, normalize: fetchNorm });

    /** Replaces the fetched HTML with HTML obtained another way. False when that gave nothing usable. */
    const useAlternate = async (via: Exclude<FetchVia, 'direct'>, get: (u: string) => Promise<RenderResult | null>): Promise<boolean> => {
      try {
        const alt = await get(url);
        if (!alt || typeof alt.html !== 'string' || alt.html.trim() === '' || looksLikeChallenge(alt.html)) return false;
        const altStatus = alt.status ?? 200;
        if (cls !== 'ok' && !(altStatus >= 200 && altStatus < 300)) return false;
        // A page fetched directly keeps its real status; the alternate only supplies the content.
        if (cls !== 'ok') page.status = altStatus;
        cls = 'ok';
        // Alternate HTML gets the same size cap as fetched HTML.
        const bytes = Buffer.from(alt.html);
        page.via = via;
        page.rendered = via === 'render';
        page.truncated = bytes.byteLength > ctx.maxBodyBytes;
        html = page.truncated ? bytes.subarray(0, ctx.maxBodyBytes).toString('utf8') : alt.html;
        page.sizeBytes = Math.min(bytes.byteLength, ctx.maxBodyBytes);
        return true;
      } catch (err) {
        log('warn', `${via} failed for ${url}, using fetched HTML: ${err instanceof Error ? err.message : String(err)}`);
        return false;
      }
    };

    // Blocked by a firewall or bot challenge: the fallback (a proxy service) is tried first, then rendering.
    const readableBlock = cls === 'blocked' && out.status !== 401;
    if (readableBlock && options.fallback && (await useAlternate('fallback', options.fallback))) page.isHtml = true;

    let fetched: ExtractedPage | null = cls === 'ok' && page.via === 'direct' && page.isHtml && html !== null ? extract(html) : null;
    if (options.render && page.isHtml && (cls === 'ok' || readableBlock)) {
      // Still blocked: rendering is the last way in. Fetched through the fallback: already have the content.
      // Fetched directly: render every page, or only app shells.
      const wanted =
        cls !== 'ok' ||
        (page.via === 'direct' && ((options.renderWhen ?? 'always') === 'always' || fetched?.jsRenderingSuspected === true));
      if (wanted && (await useAlternate('render', options.render))) {
        const rendered = extract(html ?? '');
        if (fetched) page.needsJavaScript = contentNeedsJavaScript(fetched, rendered);
        fetched = rendered;
      }
    }
    page.fetchClass = out.status >= 300 && out.status < 400 ? 'redirect' : cls;
    if (page.fetchClass === 'ok' && html !== null) {
      const data = fetched ?? extract(html);
      for (const link of [...data.internalLinks, ...data.externalLinks]) link.url = toKey(link.url);
      for (const alt of data.hreflang) alt.href = toKey(alt.href);
      if (data.canonical !== null) data.canonical = toKey(data.canonical);
      for (const image of data.images) if (image.url !== null) image.url = toKey(image.url);
      data.scripts = data.scripts.map(toKey);
      data.stylesheets = data.stylesheets.map(toKey);
      Object.assign(page, data);
    }
    return page;
  };

  const processEntry = async (entry: FrontierEntry): Promise<void> => {
    if (!(await robotsAllows(entry.url))) {
      attempted--;
      await recordRobotsBlocked(entry.url, entry.depth, entry.source);
      return;
    }
    const out = await fetchPage(entry.fetchUrl);
    if (out.error?.kind === 'aborted') {
      attempted--;
      return;
    }

    if (out.redirectChain.length === 0) {
      await record(await buildPage(entry.url, entry.depth, entry.source, out));
      return;
    }

    // Redirect row for the requested URL; the destination becomes its own row.
    const first = out.redirectChain[0];
    const finalUrl = toKey(normalizeUrl(out.finalUrl, undefined, fetchNorm) ?? out.finalUrl);
    const row = blankPage(entry.url, entry.depth, entry.source);
    row.finalUrl = finalUrl;
    row.redirectChain = out.redirectChain;
    row.redirectLoop = out.loop;
    row.status = first?.status ?? 0;
    row.responseTimeMs = out.responseTimeMs;
    row.loadTimeMs = out.loadTimeMs;
    const chainProblem = out.error?.kind === 'redirect_loop' || out.error?.kind === 'too_many_redirects';
    if (out.error) {
      row.errorKind = out.error.kind;
      row.errorMessage = out.error.message;
    } else {
      row.finalStatus = out.status;
    }
    // A redirect whose destination gave no response is still a redirect: a broken one (see redirectIssues).
    row.fetchClass = out.error && !chainProblem && out.redirectChain.length === 0 ? 'error' : 'redirect';
    await record(row);
    if (out.error) return;

    if (entry.source === 'start') addScope(finalUrl);
    if (!isInternal(finalUrl)) return;
    const existing = entries.get(finalUrl);
    if (existing?.state === 'taken') return;
    if (matchesAny(finalUrl, options.exclude) || (options.include !== undefined && entry.source !== 'start' && !matchesAny(finalUrl, options.include))) {
      excluded.add(finalUrl);
      return;
    }
    if (attempted >= maxPages) {
      // Leave it for the frontier so the crawl is reported as truncated.
      if (!existing) enqueue(finalUrl, entry.depth, 'redirect');
      return;
    }
    const depth = existing && existing.depth !== null ? existing.depth : entry.depth;
    const source: DiscoverySource = entry.source === 'start' ? 'start' : (existing?.source ?? 'redirect');
    setEntry({ url: finalUrl, fetchUrl: out.finalUrl, depth, source, state: 'taken' });
    // Count it before the await so concurrent workers cannot all pass the maxPages check.
    attempted++;
    if (!(await robotsAllows(finalUrl))) {
      attempted--;
      await recordRobotsBlocked(finalUrl, depth, source);
      return;
    }
    // Reuse the response already in hand instead of fetching the destination again.
    await record(await buildPage(finalUrl, depth, source, { ...out, url: finalUrl, redirectChain: [], loop: false }));
  };

  const worker = async (): Promise<void> => {
    for (;;) {
      if (stopped()) return;
      await pace.acquire();
      const entry = attempted < maxPages && !stopped() ? take() : null;
      if (!entry) {
        pace.release();
        if (active === 0) return;
        await new Promise<void>((resolve) => waiters.push(resolve));
        continue;
      }
      attempted++;
      active++;
      try {
        await processEntry(entry);
      } catch (err) {
        log('warn', `Unexpected error on ${entry.url}: ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        active--;
        pace.release();
        notify();
      }
    }
  };

  const externalLinks: ExternalLinkCheck[] = [];
  const resources: ResourceResult[] = [];
  let httpProbe: HttpProbe | null = null;
  let llmsTxtFound: boolean | undefined;
  let startRobotsFound: boolean | undefined;
  let startRowUrl = startUrl;
  try {
    const startOrigin = new URL(startUrl).origin;
    await discoverSitemaps(startOrigin);

    const startEntry: FrontierEntry = { url: startUrl, fetchUrl: startFetchUrl, depth: 0, source: 'start', state: 'taken' };
    setEntry(startEntry);
    attempted++;
    active++;
    try {
      await processEntry(startEntry);
    } finally {
      active--;
    }
    const startRow = pages.find((p) => p.url === startUrl);
    if (startRow && startRow.fetchClass === 'redirect' && !startRow.errorKind) {
      startRowUrl = startRow.finalUrl;
      const finalOrigin = new URL(startRow.finalUrl).origin;
      if (finalOrigin !== startOrigin && isInternal(startRow.finalUrl)) await discoverSitemaps(finalOrigin);
    }

    await Promise.all(Array.from({ length: maxConcurrency }, worker));
    await phase('site-files');

    // Site-level files and the plain-HTTP version, on the origin the start URL settled on.
    // Both are skipped when robots.txt keeps us off the site.
    const siteOrigin = new URL(startRowUrl).origin;
    if (!signal?.aborted) startRobotsFound = (await getRobots(siteOrigin)).found;
    if (!signal?.aborted && (await robotsAllows(`${siteOrigin}/llms.txt`))) {
      const llms = await fetchUrl(ctx, `${siteOrigin}/llms.txt`, { accept: 'text/plain,text/markdown,*/*;q=0.5', maxBodyBytes: LLMS_TXT_MAX_BYTES });
      if (llms.error?.kind !== 'aborted') {
        const type = llms.headers?.get('content-type') ?? '';
        llmsTxtFound = !llms.error && llms.status >= 200 && llms.status < 300 && !HTML_TYPE.test(type);
      }
    }
    if ((options.probeHttp ?? true) && siteOrigin.startsWith('https://') && !signal?.aborted && (await robotsAllows(`${siteOrigin}/`))) {
      const probeUrl = `http://${new URL(siteOrigin).host}/`;
      const out = await fetchUrl(ctx, probeUrl, { wantBody: () => false });
      const first = out.redirectChain[0];
      const status = first?.status ?? (out.error ? 0 : out.status);
      if (out.error?.kind !== 'aborted' && status > 0) {
        httpProbe = { url: probeUrl, status, finalUrl: out.finalUrl, redirectsToHttps: first !== undefined && out.finalUrl.startsWith('https://') };
      }
    }

    // Images, scripts and stylesheets on this site, most used first.
    if ((options.checkResources ?? true) && !stopped()) {
      await phase('resources');
      const found = new Map<string, { type: ResourceType; sources: string[]; count: number }>();
      const note = (url: string | null, type: ResourceType, source: string): void => {
        if (!url || !isInternal(url)) return;
        const entry = found.get(url);
        if (!entry) return void found.set(url, { type, sources: [source], count: 1 });
        entry.count++;
        if (entry.sources.length < 20) entry.sources.push(source);
      };
      for (const page of pages) {
        if (page.fetchClass !== 'ok' || !page.isHtml) continue;
        for (const url of new Set(page.images.map((i) => i.url))) note(url, 'image', page.url);
        for (const url of page.scripts) note(url, 'script', page.url);
        for (const url of page.stylesheets) note(url, 'stylesheet', page.url);
      }
      const targets = [...found.entries()].sort((a, b) => b[1].count - a[1].count).slice(0, Math.max(0, options.maxResources ?? 500));
      await runPool(targets, pace.limit, async ([url, entry]) => {
        if (stopped() || !(await robotsAllows(url))) return;
        const requestUrl = fetchForms.get(url) ?? url;
        let out = await fetchUrl(ctx, requestUrl, { method: 'HEAD', accept: '*/*' });
        // Some servers refuse HEAD; ask again with GET and leave the body unread.
        if (!out.error && out.status >= 400 && out.status !== 429) out = await fetchUrl(ctx, requestUrl, { accept: '*/*', wantBody: () => false });
        if (out.error?.kind === 'aborted') return;
        const status = out.error ? 0 : out.status;
        const length = Number(out.headers?.get('content-length'));
        resources.push({
          url,
          type: entry.type,
          status,
          finalUrl: out.finalUrl,
          redirected: out.redirectChain.length > 0,
          contentType: out.headers?.get('content-type') ?? null,
          sizeBytes: Number.isFinite(length) && length > 0 ? length : null,
          broken: status >= 400 && ![401, 403, 407, 429].includes(status),
          errorKind: out.error?.kind ?? null,
          sources: entry.sources,
          sourceCount: entry.count,
        });
      });
    }

    if (options.checkExternalLinks && !stopped()) {
      await phase('external-links');
      const sources = new Map<string, string[]>();
      for (const page of pages) {
        for (const link of page.externalLinks) {
          const list = sources.get(link.url);
          if (!list) sources.set(link.url, [page.url]);
          else if (list.length < 20) list.push(page.url);
        }
      }
      const targets = [...sources.keys()].slice(0, Math.max(0, options.maxExternalLinks ?? 100));
      // Other sites, each with its own throttle, so more of them can be checked at once.
      await runPool(targets, Math.max(concurrency, EXTERNAL_CONCURRENCY), async (url) => {
        if (stopped()) return;
        const requestUrl = fetchForms.get(url) ?? url;
        let out = await fetchUrl(ctx, requestUrl, { method: 'HEAD', accept: '*/*' });
        const headInconclusive = out.error
          ? !['ssrf', 'dns', 'aborted'].includes(out.error.kind)
          : out.status >= 400 && out.status !== 429;
        if (headInconclusive) out = await fetchUrl(ctx, requestUrl, { accept: '*/*', wantBody: () => false });
        if (out.error?.kind === 'aborted') return;
        const status = out.error ? 0 : out.status;
        const broken = out.error
          ? out.error.kind === 'dns'
          : status >= 400 && status < 500 && ![401, 403, 407, 429].includes(status);
        externalLinks.push({ url, status, broken, errorKind: out.error?.kind ?? null, sources: sources.get(url) ?? [] });
      });
    }
  } finally {
    transport.close();
  }

  const stoppedReason: StopReason = signal?.aborted
    ? 'aborted'
    : rateLimitStopped
      ? 'rate_limited'
      : pending > 0
        ? timeLimitHit
          ? 'time_limit'
          : 'max_pages'
        : 'completed';
  const truncated = pending > 0 || stoppedReason === 'aborted';

  for (const page of pages) {
    page.inSitemap = sitemapSet.has(page.url);
    page.sitemaps = [...(sitemapSources.get(page.url) ?? [])];
  }

  // AI crawler access, answered from each origin's robots.txt (already loaded during the crawl).
  const rulesByOrigin = new Map<string, RobotsRules>();
  for (const [origin, rules] of robotsCache) rulesByOrigin.set(origin, await rules);
  const allowedFor = (url: string, token: string): boolean => rulesByOrigin.get(new URL(url).origin)?.isAllowedFor(url, token) ?? true;
  const aiDiscoverability = computeAiDiscoverability(pages, startRowUrl, allowedFor, llmsTxtFound === true, thresholds);

  await phase('analysis');
  const issues = markIndexability([
    ...pages.flatMap((page) => pageIssues(page, thresholds)),
    ...crossPageIssues(pages, {
      startUrl,
      complete: !truncated,
      sitemapChecked: options.useSitemaps !== false,
      sitemapFound: sitemapDocs.length > 0,
      sitemapCapped,
      sitemapsTooLarge,
      sitemapsFailed,
      robotsUnavailable: robotsUnavailableOrigins,
      robotsTxtFound: startRobotsFound,
      llmsTxtFound,
      httpProbe,
      aiDiscoverability,
      rateLimitStopped,
      externalLinks,
      resources,
      thresholds,
    }),
  ], pages);

  const finishedAt = Date.now();
  const summary = summarise(pages, issues, {
    startUrl,
    finalStartUrl: startRowUrl,
    startedAt: new Date(startedAt).toISOString(),
    finishedAt: new Date(finishedAt).toISOString(),
    durationMs: finishedAt - startedAt,
    stoppedReason,
    truncated,
    urlsDiscovered: entries.size,
    urlsExcluded: excluded.size,
    robotsTxtFound,
    sitemaps: sitemapDocs,
    sitemapUrls: sitemapSet.size,
    externalLinksChecked: externalLinks.length,
    aiDiscoverability,
    httpProbe,
    llmsTxtFound: llmsTxtFound === true,
    resources,
    pace: { start: concurrency, peak: pace.peak, final: pace.limit, slowdowns: pace.slowdowns },
  });
  log('info', `Crawl ${stoppedReason}: ${pages.length} pages, ${issues.length} issues, health ${summary.healthScore}`);
  return { pages, issues, externalLinks, resources, summary };
}
