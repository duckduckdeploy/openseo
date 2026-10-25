import { DEFAULT_USER_AGENT } from './crawl';
import { createPinnedTransport, decodeBody, fetchUrl, HostThrottle } from './fetch';
import type { FetchContext } from './fetch';
import type { FetchLike } from './types';
import { DEFAULT_SITEMAP_LIMITS, discoverSitemapUrls, loadRobots } from './robots';
import type { SitemapDiscovery, SitemapLimits } from './robots';
import { createGuard } from './ssrf';
import type { GuardOptions } from './ssrf';

export interface SiteFetcherOptions extends GuardOptions {
  userAgent?: string;
  timeoutMs?: number;
  /** Replaces the network, for tests. */
  fetch?: FetchLike;
}

export interface SiteFile {
  /** Final status; 0 when no response came back. */
  status: number;
  finalUrl: string;
  /** The body as text, capped at 64 KB; null without a 2xx response. */
  text: string | null;
  error: string | null;
}

export interface SiteFetcher {
  /** One small file, such as an IndexNow key file or a homepage, with the crawler's SSRF protection. */
  file(url: string): Promise<SiteFile>;
  /** Every sitemap the site lists in robots.txt, plus /sitemap.xml and /sitemap_index.xml, followed through indexes. */
  sitemaps(origin: string, limits?: SitemapLimits): Promise<SitemapDiscovery & { robotsSitemaps: string[] }>;
  close(): void;
}

/**
 * Fetches single files and sitemaps from a site outside a crawl, with the same SSRF guard,
 * DNS pinning, size caps and redirect handling the crawler uses.
 */
export function createSiteFetcher(options: SiteFetcherOptions = {}): SiteFetcher {
  const guard = createGuard(options);
  const transport = options.fetch
    ? { fetch: options.fetch, close: () => {} }
    : createPinnedTransport({ allowPrivateNetwork: options.allowPrivateNetwork ?? false });
  const userAgent = options.userAgent ?? DEFAULT_USER_AGENT;
  const ctx: FetchContext = {
    fetch: transport.fetch,
    guard,
    throttle: new HostThrottle(0),
    userAgent,
    timeoutMs: options.timeoutMs ?? 15_000,
    maxBodyBytes: 64 * 1024,
    maxRedirects: 5,
  };
  return {
    async file(url) {
      const res = await fetchUrl(ctx, url, { accept: 'text/plain,text/html;q=0.9,*/*;q=0.5' });
      const ok = !res.error && res.status >= 200 && res.status < 300 && res.body !== null;
      return {
        status: res.error ? 0 : res.status,
        finalUrl: res.finalUrl,
        text: ok && res.body ? decodeBody(res.body, res.headers?.get('content-type') ?? null) : null,
        error: res.error?.message ?? null,
      };
    },
    async sitemaps(origin, limits = DEFAULT_SITEMAP_LIMITS) {
      const robots = await loadRobots(origin, ctx, userAgent);
      const seeds = [...new Set([...robots.sitemaps, `${origin}/sitemap.xml`, `${origin}/sitemap_index.xml`])];
      const found = await discoverSitemapUrls(seeds, { ...ctx, maxBodyBytes: limits.maxBytes }, limits);
      // The guesses are not failures when robots.txt named the real sitemaps.
      const guessed = new Set([`${origin}/sitemap.xml`, `${origin}/sitemap_index.xml`].filter((url) => !robots.sitemaps.includes(url)));
      return { ...found, failed: found.failed.filter((f) => !guessed.has(f.url)), robotsSitemaps: robots.sitemaps };
    },
    close: () => transport.close(),
  };
}
