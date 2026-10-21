import { gunzipSync } from 'node:zlib';
import { XMLParser } from 'fast-xml-parser';
import robotsParser from 'robots-parser';
import { decodeBody, fetchUrl } from './fetch';
import type { FetchContext } from './fetch';

export interface RobotsRules {
  /** A robots.txt was served with a 2xx status. */
  found: boolean;
  /** HTTP status of the robots.txt request; 0 when it failed. */
  status: number;
  isAllowed(url: string): boolean;
  sitemaps: string[];
  crawlDelayMs: number | null;
}

const ROBOTS_MAX_BYTES = 512 * 1024;

const ALLOW_ALL = (status: number): RobotsRules => ({
  found: false,
  status,
  isAllowed: () => true,
  sitemaps: [],
  crawlDelayMs: null,
});

const DISALLOW_ALL = (status: number): RobotsRules => ({ ...ALLOW_ALL(status), isAllowed: () => false });

/** robots.txt answered 5xx or 429, which Google treats as "disallow everything". */
export const robotsUnavailable = (rules: RobotsRules): boolean => rules.status === 429 || rules.status >= 500;

export function parseRobots(robotsUrl: string, text: string, userAgent: string): RobotsRules {
  const robots = robotsParser(robotsUrl, text);
  const delay = robots.getCrawlDelay(userAgent);
  return {
    found: true,
    status: 200,
    isAllowed: (url) => robots.isAllowed(url, userAgent) !== false,
    sitemaps: robots.getSitemaps(),
    crawlDelayMs: typeof delay === 'number' && Number.isFinite(delay) && delay > 0 ? delay * 1000 : null,
  };
}

/** Fetches and parses robots.txt for an origin. Missing or unreadable files allow everything; 5xx and 429 disallow everything. */
export async function loadRobots(origin: string, ctx: FetchContext, userAgent: string): Promise<RobotsRules> {
  const robotsUrl = `${origin}/robots.txt`;
  const res = await fetchUrl(ctx, robotsUrl, { accept: 'text/plain,*/*;q=0.5', maxBodyBytes: ROBOTS_MAX_BYTES });
  if (!res.error && (res.status === 429 || res.status >= 500)) return DISALLOW_ALL(res.status);
  if (res.error || !res.body || res.status < 200 || res.status >= 300) return ALLOW_ALL(res.status);
  const contentType = res.headers?.get('content-type') ?? '';
  // A soft-404 HTML page is not a robots.txt.
  if (contentType.includes('text/html')) return ALLOW_ALL(res.status);
  return parseRobots(robotsUrl, decodeBody(res.body, contentType), userAgent);
}

export interface ParsedSitemap {
  kind: 'urlset' | 'index' | 'unknown';
  locs: string[];
}

const xml = new XMLParser({ ignoreAttributes: true, removeNSPrefix: true, parseTagValue: false });

function toArray(value: unknown): unknown[] {
  if (value === undefined || value === null) return [];
  return Array.isArray(value) ? value : [value];
}

function locsOf(entries: unknown): string[] {
  const out: string[] = [];
  for (const entry of toArray(entries)) {
    if (typeof entry !== 'object' || entry === null) continue;
    for (const loc of toArray((entry as { loc?: unknown }).loc)) {
      const text = typeof loc === 'string' ? loc.trim() : typeof loc === 'number' ? String(loc) : '';
      if (text) out.push(text);
    }
  }
  return out;
}

export function parseSitemapXml(text: string): ParsedSitemap {
  let doc: unknown;
  try {
    doc = xml.parse(text);
  } catch {
    return { kind: 'unknown', locs: [] };
  }
  const root = doc as { urlset?: { url?: unknown }; sitemapindex?: { sitemap?: unknown } };
  if (root.sitemapindex) return { kind: 'index', locs: locsOf(root.sitemapindex.sitemap) };
  if (root.urlset) return { kind: 'urlset', locs: locsOf(root.urlset.url) };
  return { kind: 'unknown', locs: [] };
}

export interface SitemapLimits {
  maxDocuments: number;
  maxDepth: number;
  maxUrls: number;
  maxBytes: number;
}

export const DEFAULT_SITEMAP_LIMITS: SitemapLimits = {
  maxDocuments: 50,
  maxDepth: 3,
  maxUrls: 50_000,
  // Google's per-sitemap limit (uncompressed).
  maxBytes: 50 * 1024 * 1024,
};

export interface SitemapDiscovery {
  /** Raw `<loc>` values from urlsets. */
  urls: string[];
  /** Sitemap documents that parsed as a urlset or index. */
  sitemaps: string[];
  /** Sitemaps skipped because they exceeded `maxBytes`. */
  tooLarge: string[];
  /** A document, URL or depth limit left sitemap entries unread. */
  capped: boolean;
}

/** Reads the given sitemaps, following sitemap indexes breadth-first within the limits. */
export async function discoverSitemapUrls(
  seeds: string[],
  ctx: FetchContext,
  limits: SitemapLimits = DEFAULT_SITEMAP_LIMITS,
): Promise<SitemapDiscovery> {
  const urls: string[] = [];
  const sitemaps: string[] = [];
  const tooLarge: string[] = [];
  let capped = false;
  const seen = new Set<string>();
  let queue = seeds.map((url) => ({ url, depth: 0 }));
  let fetched = 0;

  while (queue.length > 0 && fetched < limits.maxDocuments && urls.length < limits.maxUrls) {
    const next: { url: string; depth: number }[] = [];
    for (const item of queue) {
      if (seen.has(item.url)) continue;
      if (fetched >= limits.maxDocuments || urls.length >= limits.maxUrls) {
        capped = true;
        continue;
      }
      if (ctx.signal?.aborted) return { urls, sitemaps, tooLarge, capped };
      seen.add(item.url);
      fetched++;
      const res = await fetchUrl(ctx, item.url, {
        accept: 'application/xml,text/xml,*/*;q=0.5',
        maxBodyBytes: limits.maxBytes,
      });
      if (res.error || !res.body || res.status < 200 || res.status >= 300) continue;
      if (res.truncated) {
        tooLarge.push(item.url);
        continue;
      }
      let bytes = res.body;
      if (bytes[0] === 0x1f && bytes[1] === 0x8b) {
        try {
          bytes = gunzipSync(bytes, { maxOutputLength: limits.maxBytes });
        } catch (err) {
          if ((err as { code?: unknown }).code === 'ERR_BUFFER_TOO_LARGE') tooLarge.push(item.url);
          continue;
        }
      }
      const parsed = parseSitemapXml(decodeBody(bytes, res.headers?.get('content-type') ?? null));
      if (parsed.kind === 'unknown') continue;
      sitemaps.push(item.url);
      if (parsed.kind === 'urlset') {
        for (const loc of parsed.locs) {
          if (urls.length >= limits.maxUrls) {
            capped = true;
            break;
          }
          urls.push(loc);
        }
      } else if (item.depth >= limits.maxDepth) {
        if (parsed.locs.length > 0) capped = true;
      } else {
        for (const loc of parsed.locs) {
          try {
            next.push({ url: new URL(loc, item.url).href, depth: item.depth + 1 });
          } catch {
            // unparsable child sitemap location
          }
        }
      }
    }
    queue = next;
  }
  if (queue.some((item) => !seen.has(item.url))) capped = true;
  return { urls, sitemaps, tooLarge, capped };
}
