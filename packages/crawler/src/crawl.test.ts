import http from 'node:http';
import type { AddressInfo } from 'node:net';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { DEFAULT_THRESHOLDS, crossPageIssues, hasNoindex, makeIssue, markIndexability, trafficByPage, trafficIssues } from './analyse';
import { ISSUE_CATALOG } from './catalog';
import type { IssueType } from './catalog';
import { crawlSite } from './crawl';
import { extractPage } from './extract';
import { HostThrottle } from './fetch';
import type { FetchContext } from './fetch';
import { DEFAULT_SITEMAP_LIMITS, discoverSitemapUrls } from './robots';
import { createGuard } from './ssrf';
import type { CrawlOptions, CrawlResult, FetchLike, PageResult } from './types';

const WORDS = Array.from({ length: 40 }, (_, i) => `Sentence number ${i} talks about fixtures and crawling.`).join(' ');

interface PageSpec {
  title?: string;
  description?: string;
  head?: string;
  body: string;
  htmlAttrs?: string;
}

function html(spec: PageSpec): string {
  return `<!doctype html><html ${spec.htmlAttrs ?? 'lang="en"'}><head>
${spec.title === undefined ? '' : `<title>${spec.title}</title>`}
${spec.description === undefined ? '' : `<meta name="description" content="${spec.description}">`}
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta property="og:title" content="x"><meta property="og:image" content="/og.png"><meta property="og:type" content="website">
<meta name="twitter:card" content="summary">
${spec.head ?? ''}</head><body>${spec.body}</body></html>`;
}

const desc = (topic: string): string =>
  `A sufficiently long and unique meta description about ${topic} for the fixture site used in tests.`;

let server: http.Server;
let external: http.Server;
let base = '';
let externalBase = '';
const hits = new Map<string, number>();
const userAgents = new Set<string>();

function buildSite(): Record<string, (res: http.ServerResponse) => void> {
  const page = (spec: PageSpec, headers: Record<string, string> = {}) => (res: http.ServerResponse) => {
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8', ...headers });
    res.end(html(spec));
  };
  const redirect = (status: number, location: string) => (res: http.ServerResponse) => {
    res.writeHead(status, { location });
    res.end();
  };
  const xml = (body: string) => (res: http.ServerResponse) => {
    res.writeHead(200, { 'content-type': 'application/xml' });
    res.end(`<?xml version="1.0" encoding="UTF-8"?>${body}`);
  };
  const nav = [
    '/about?utm_source=nav#team',
    '/old',
    '/loop-a',
    '/missing',
    '/dup-a',
    '/dup-b',
    '/noindex',
    '/private/secret',
    '/no-h1',
    '/img',
    '/canon-broken',
    '/en',
    '/bad-jsonld',
    '/forbidden',
    '/file.pdf',
    '/shell',
    '/level1',
    '/server-error',
  ]
    .map((href) => `<a href="${href}">link to ${href}</a>`)
    .join(' ');

  return {
    '/robots.txt': (res) => {
      res.writeHead(200, { 'content-type': 'text/plain' });
      res.end(`User-agent: *\nDisallow: /private/\n\nUser-agent: OtherBot\nDisallow: /\n\nSitemap: ${base}/sitemap-index.xml\n`);
    },
    '/sitemap-index.xml': xml(
      `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>${base}/sitemap-pages.xml</loc></sitemap></sitemapindex>`,
    ),
    '/sitemap-pages.xml': xml(
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${['/', '/about', '/orphan', '/noindex', '/old', '/private/secret']
        .map((p) => `<url><loc>${base}${p}</loc></url>`)
        .join('')}</urlset>`,
    ),
    '/': page({
      title: 'Home page of the fixture site',
      description: desc('home'),
      body: `<h1>Home</h1><p>${WORDS}</p>${nav} <a href="${externalBase}/ok">ext ok</a> <a rel="nofollow noopener" href="${externalBase}/gone">ext gone</a>`,
    }),
    '/about': page({
      title: 'About the fixture site',
      description: desc('about'),
      body: `<h1>About</h1><h2>Team</h2><p>about ${WORDS}</p><a href="/">home</a>`,
    }),
    '/old': redirect(301, '/older'),
    '/older': redirect(302, '/about'),
    '/loop-a': redirect(302, '/loop-b'),
    '/loop-b': redirect(302, '/loop-a'),
    '/dup-a': page({ title: 'Duplicate title here', description: desc('duplicates'), body: `<h1>Dup</h1><p>dup ${WORDS}</p><a href="/">home</a>` }),
    '/dup-b': page({ title: 'Duplicate title here', description: desc('duplicates'), body: `<h1>Dup</h1><p>dup ${WORDS}</p><a href="/">home</a>` }),
    '/noindex': page({
      title: 'A page that is noindex',
      description: desc('noindex'),
      head: '<meta name="robots" content="noindex, follow">',
      body: `<h1>Noindex</h1><p>noindex ${WORDS}</p><a href="/">home</a>`,
    }),
    '/private/secret': page({ title: 'Secret', body: '<h1>Secret</h1>' }),
    '/no-h1': page({
      title: 'A page without a main heading',
      description: desc('missing h1'),
      body: `<h1> </h1><h2>Sub</h2><h4>Skipped</h4><p>noh1 ${WORDS}</p><a href="/">home</a>`,
    }),
    '/img': page({
      title: 'A page with images on it',
      description: desc('images'),
      body: `<h1>Images</h1><img src="/a.png"><img src="/b.png" alt=""><img src="/c.png" alt="described"><p>img ${WORDS}</p><a href="/">home</a>`,
    }),
    '/canon-broken': page({
      title: 'Canonical points to a 404',
      description: desc('canonical'),
      head: '<link rel="canonical" href="/canon-target-404">',
      body: `<h1>Canonical</h1><p>canon ${WORDS}</p><a href="/">home</a>`,
    }),
    '/en': page({
      title: 'English version of a page',
      description: desc('english'),
      head: '<link rel="alternate" hreflang="en" href="/en"><link rel="alternate" hreflang="fr" href="/fr"><link rel="alternate" hreflang="english-uk" href="/en">',
      body: `<h1>English</h1><p>en ${WORDS}</p><a href="/">home</a>`,
    }),
    '/fr': page({
      title: 'Version francaise de la page',
      description: desc('french'),
      htmlAttrs: 'lang="fr"',
      body: `<h1>Francais</h1><p>fr ${WORDS}</p><a href="/">home</a>`,
    }),
    '/bad-jsonld': page({
      title: 'Structured data problems page',
      description: desc('structured data'),
      head: `<script type="application/ld+json">{"@context": "https://schema.org", "@type": "Article", }</script>
<script type="application/ld+json">{"@context": "https://schema.org", "@type": "Product", "sku": "1"}</script>
<script type="application/ld+json">{"@context": "https://schema.org", "@type": "Organization", "name": "Fixture"}</script>`,
      body: `<h1>JSON-LD</h1><p>jsonld ${WORDS}</p><a href="/">home</a>`,
    }),
    '/forbidden': (res) => {
      res.writeHead(403, { 'content-type': 'text/html' });
      res.end('<html><head></head><body>Forbidden</body></html>');
    },
    '/server-error': (res) => {
      res.writeHead(500, { 'content-type': 'text/html' });
      res.end('<html><body>boom</body></html>');
    },
    '/file.pdf': (res) => {
      res.writeHead(200, { 'content-type': 'application/pdf' });
      res.end('%PDF-1.4 not really');
    },
    '/shell': (res) => {
      res.writeHead(200, { 'content-type': 'text/html' });
      res.end('<!doctype html><html><head><title>App</title></head><body><div id="root"></div><script src="/app.js"></script></body></html>');
    },
    '/orphan': page({
      title: 'An orphan page nobody links to',
      description: desc('orphans'),
      body: `<h1>Orphan</h1><p>orphan ${WORDS}</p><a href="/">home</a>`,
    }),
    ...Object.fromEntries(
      [1, 2, 3].map((n) => [
        `/level${n}`,
        page({
          title: `Level ${n} of the deep chain`,
          description: desc(`level ${n}`),
          body: `<h1>Level ${n}</h1><p>level${n} ${WORDS}</p>${n < 3 ? `<a href="/level${n + 1}">deeper</a>` : '<a href="/">home</a>'}`,
        }),
      ]),
    ),
    '/rate': (res) => {
      res.writeHead(429, { 'content-type': 'text/html', 'retry-after': '0' });
      res.end('slow down');
    },
    '/rate-again': (res) => {
      res.writeHead(429, { 'content-type': 'text/html', 'retry-after': '0' });
      res.end('slow down');
    },
    '/rate-home': page({
      title: 'Rate limit test start page',
      description: desc('rate limits'),
      body: `<h1>Rate</h1><p>${WORDS}</p><a href="/rate">a</a><a href="/rate-again">b</a><a href="/about">c</a>`,
    }),
    '/hang': () => {
      // never answers
    },
  };
}

beforeAll(async () => {
  external = http.createServer((req, res) => {
    res.writeHead(req.url === '/ok' ? 200 : 404, { 'content-type': 'text/plain' });
    res.end(req.method === 'HEAD' ? undefined : 'x');
  });
  await new Promise<void>((resolve) => external.listen(0, '127.0.0.1', resolve));
  externalBase = `http://127.0.0.1:${(external.address() as AddressInfo).port}`;

  let site: Record<string, (res: http.ServerResponse) => void> = {};
  server = http.createServer((req, res) => {
    const path = new URL(req.url ?? '/', 'http://x').pathname;
    hits.set(path, (hits.get(path) ?? 0) + 1);
    userAgents.add(req.headers['user-agent'] ?? '');
    const handler = site[path];
    if (handler) return handler(res);
    res.writeHead(404, { 'content-type': 'text/html' });
    res.end('<html><head><title>Not found</title></head><body>404</body></html>');
  });
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  site = buildSite();
});

afterAll(async () => {
  server.closeAllConnections();
  external.closeAllConnections();
  await new Promise((resolve) => server.close(resolve));
  await new Promise((resolve) => external.close(resolve));
});

function options(overrides: Partial<CrawlOptions> = {}): CrawlOptions {
  return {
    startUrl: `${base}/`,
    delayMs: 0,
    concurrency: 4,
    allowPrivateNetwork: true,
    allowedPorts: [Number(new URL(base).port), Number(new URL(externalBase).port)],
    timeoutMs: 5000,
    ...overrides,
  };
}

describe('crawlSite on the fixture site', () => {
  let result: CrawlResult;
  const seen: string[] = [];
  const page = (path: string): PageResult => {
    const found = result.pages.find((p) => p.url === `${base}${path}`);
    if (!found) throw new Error(`no page for ${path}`);
    return found;
  };
  const typesFor = (path: string): IssueType[] => result.issues.filter((i) => i.url === `${base}${path}`).map((i) => i.type);
  const issue = (type: IssueType, path: string) => result.issues.find((i) => i.type === type && i.url === `${base}${path}`);

  beforeAll(async () => {
    hits.clear();
    result = await crawlSite(options({ checkExternalLinks: true, thresholds: { deepPageDepth: 3 } }), {
      onPage: (p, progress) => {
        seen.push(p.url);
        expect(progress.maxPages).toBe(100);
      },
    });
  });

  it('reports every page through onPage and sends the configured user agent', () => {
    expect(seen.sort()).toEqual(result.pages.map((p) => p.url).sort());
    expect([...userAgents]).toEqual(['OpenSEOBot/0.1']);
    expect(new Set(seen).size).toBe(seen.length);
  });

  it('finishes with a consistent summary', () => {
    const s = result.summary;
    expect(s.stoppedReason).toBe('completed');
    expect(s.truncated).toBe(false);
    expect(s.robotsTxtFound).toBe(true);
    expect(s.sitemaps).toEqual([`${base}/sitemap-index.xml`, `${base}/sitemap-pages.xml`]);
    expect(s.sitemapUrls).toBe(6);
    expect(s.pagesTotal).toBe(result.pages.length);
    expect(s.pagesTotal).toBe(s.pagesCrawled + s.pagesBlocked + s.pagesRateLimited + s.pagesRobotsBlocked + s.pagesFailed);
    expect(s.pagesBlocked).toBe(1);
    expect(s.pagesRobotsBlocked).toBe(1);
    expect(s.pagesFailed).toBe(0);
    expect(s.issuesTotal).toBe(result.issues.length);
    expect(s.issuesBySeverity.critical + s.issuesBySeverity.warning + s.issuesBySeverity.info).toBe(result.issues.length);
    expect(s.healthScore).toBeGreaterThan(0);
    expect(s.healthScore).toBeLessThan(100);
    for (const i of result.issues) expect(i.severity).toBe(ISSUE_CATALOG[i.type].severity);
  });

  it('extracts page data', () => {
    const home = page('/');
    expect(home).toMatchObject({
      status: 200,
      fetchClass: 'ok',
      isHtml: true,
      depth: 0,
      inSitemap: true,
      indexable: true,
      indexabilityReason: 'ok',
      title: 'Home page of the fixture site',
      h1s: ['Home'],
      lang: 'en',
      viewport: 'width=device-width, initial-scale=1',
    });
    expect(home.wordCount).toBeGreaterThan(150);
    expect(home.openGraph['og:title']).toBe('x');
    expect(home.externalLinks.map((l) => l.url)).toEqual([`${externalBase}/ok`, `${externalBase}/gone`]);
    expect(home.externalLinks[1]).toMatchObject({ nofollow: true, anchor: 'ext gone' });
    expect(home.internalLinks.map((l) => l.url)).toContain(`${base}/about`);
    expect(home.responseTimeMs).not.toBeNull();
    expect(home.sizeBytes).toBeGreaterThan(1000);
    expect(page('/about')).toMatchObject({ depth: 1, inboundLinkCount: 1, headings: [{ level: 1, text: 'About' }, { level: 2, text: 'Team' }] });
    // Linked from the home page only (the /old redirect is not a link), and the fixture has no og:url.
    expect(page('/about').inlinks).toEqual({ href: 1, dofollow: 1, nofollow: 0, redirect: 1, canonical: 0, hreflang: 0 });
    expect(typesFor('/about').sort()).toEqual(['missing-open-graph', 'single-dofollow-inlink']);
    expect(issue('missing-open-graph', '/about')?.detail).toBe('Missing og:url');
    expect(home.loadTimeMs).toBeGreaterThanOrEqual(home.responseTimeMs ?? 0);
    expect(home.pageRank).toBe(100);
    expect(page('/level3').pageRank).toBeLessThan(home.pageRank);
    expect(home.sitemaps).toEqual([`${base}/sitemap-pages.xml`]);
  });

  it('strips tracking parameters and fragments so /about is fetched once', () => {
    expect(result.pages.filter((p) => p.url.includes('/about'))).toHaveLength(1);
    // one direct fetch plus the tail of the /old chain
    expect(hits.get('/about')).toBe(2);
  });

  it('records redirect chains and loops', () => {
    const old = page('/old');
    expect(old).toMatchObject({ status: 301, fetchClass: 'redirect', finalUrl: `${base}/about`, finalStatus: 200, redirectLoop: false });
    expect(old.redirectChain).toEqual([
      { url: `${base}/old`, status: 301, location: `${base}/older`, timeMs: expect.any(Number) },
      { url: `${base}/older`, status: 302, location: `${base}/about`, timeMs: expect.any(Number) },
    ]);
    expect(issue('redirect-chain', '/old')?.relatedUrls).toEqual([`${base}/old`, `${base}/older`, `${base}/about`]);
    expect(page('/loop-a')).toMatchObject({ fetchClass: 'redirect', redirectLoop: true, errorKind: 'redirect_loop' });
    expect(typesFor('/loop-a')).toEqual(['redirect-loop']);
    expect(issue('internal-link-to-redirect', '/')?.relatedUrls).toEqual([`${base}/old`, `${base}/loop-a`]);
    expect(issue('redirect-in-sitemap', '/old')?.detail).toBe(`Redirects to ${base}/about`);
    expect(issue('redirect-3xx', '/old')?.detail?.startsWith(`301 → 302 → ${base}/about (200)`)).toBe(true);
    expect(issue('temporary-redirect', '/old')?.detail).toBe(`302 to ${base}/about`);
    expect(issue('broken-redirect', '/old')).toBeUndefined();
  });

  it('reports broken pages and the links pointing at them', () => {
    expect(page('/missing')).toMatchObject({ status: 404, fetchClass: 'client_error' });
    expect(typesFor('/missing')).toEqual(['page-404', 'broken-page']);
    expect(typesFor('/server-error')).toEqual(['server-error']);
    // One issue per linking page, naming every broken target.
    const broken = result.issues.filter((i) => i.type === 'broken-internal-link');
    expect(broken.map((i) => i.url)).toEqual([`${base}/`]);
    expect(broken[0]?.relatedUrls).toEqual([`${base}/missing`, `${base}/server-error`]);
    expect(broken[0]?.detail).toBe('2 links to broken pages (HTTP 404, 500)');
    expect(broken[0]?.severity).toBe('critical');
  });

  it('never reports a blocked page as a content problem', () => {
    expect(page('/forbidden')).toMatchObject({ status: 403, fetchClass: 'blocked', indexabilityReason: 'blocked' });
    expect(typesFor('/forbidden')).toEqual(['blocked-page']);
    expect(result.issues.some((i) => i.type === 'broken-internal-link' && i.relatedUrls?.includes(`${base}/forbidden`))).toBe(false);
  });

  it('obeys robots.txt and records the blocked URL without fetching it', () => {
    expect(hits.get('/private/secret')).toBeUndefined();
    expect(page('/private/secret')).toMatchObject({ fetchClass: 'robots_blocked', status: 0, indexabilityReason: 'robots-blocked' });
    expect(typesFor('/private/secret').sort()).toEqual(['blocked-by-robots', 'non-indexable-in-sitemap']);
  });

  it('finds duplicate titles, descriptions and content', () => {
    // Neither copy has a canonical, so the content duplicate is the critical kind.
    for (const type of ['duplicate-title', 'duplicate-meta-description', 'duplicate-without-canonical'] as const) {
      expect(issue(type, '/dup-a')?.relatedUrls).toEqual([`${base}/dup-b`]);
      expect(issue(type, '/dup-b')?.relatedUrls).toEqual([`${base}/dup-a`]);
      expect(result.summary.issuesByType[type]).toBe(2);
    }
  });

  it('handles noindex, sitemap consistency and orphans', () => {
    expect(page('/noindex')).toMatchObject({ indexable: false, indexabilityReason: 'noindex-meta', metaRobots: 'noindex, follow' });
    expect(typesFor('/noindex')).toEqual(expect.arrayContaining(['noindex-page', 'noindex-follow-page', 'noindex-in-sitemap']));
    expect(typesFor('/noindex')).not.toContain('nofollow-page');
    expect(typesFor('/noindex')).not.toContain('thin-content');
    expect(page('/orphan')).toMatchObject({ inSitemap: true, depth: null, inboundLinkCount: 0, discoveredFrom: 'sitemap' });
    expect(result.issues.filter((i) => i.type === 'orphan-page').map((i) => i.url)).toEqual([`${base}/orphan`]);
    expect(issue('page-not-in-sitemap', '/dup-a')).toBeDefined();
    expect(issue('page-not-in-sitemap', '/about')).toBeUndefined();
    expect(result.summary.issuesByType['sitemap-missing']).toBeUndefined();
  });

  it('checks headings and images', () => {
    expect(typesFor('/no-h1')).toEqual(expect.arrayContaining(['missing-h1', 'heading-order-skip']));
    expect(page('/img')).toMatchObject({ imageCount: 3, imagesMissingAlt: 1 });
    expect(issue('images-missing-alt', '/img')?.detail).toBe('1 of 3 images');
    expect(typesFor('/img')).not.toContain('missing-h1');
  });

  it('checks canonical targets', () => {
    expect(page('/canon-broken')).toMatchObject({ canonical: `${base}/canon-target-404`, indexable: false, indexabilityReason: 'canonicalised' });
    expect(typesFor('/canon-broken')).toEqual(expect.arrayContaining(['canonicalized-page', 'canonical-to-broken']));
    expect(page('/canon-target-404')).toMatchObject({ status: 404, discoveredFrom: 'canonical' });
  });

  it('checks hreflang', () => {
    expect(page('/en').hreflang).toHaveLength(3);
    expect(issue('hreflang-missing-return-link', '/en')?.relatedUrls).toEqual([`${base}/fr`]);
    expect(issue('hreflang-invalid-code', '/en')?.detail).toContain('english-uk');
    expect(typesFor('/en')).not.toContain('hreflang-missing-self-reference');
    expect(typesFor('/fr').filter((t) => t.startsWith('hreflang'))).toEqual([]);
  });

  it('validates structured data', () => {
    const blocks = page('/bad-jsonld').structuredData;
    expect(blocks).toHaveLength(3);
    expect(blocks[0]?.error).toBeTruthy();
    expect(blocks[1]).toEqual({ types: ['Product'], problems: ['Product: missing "name"'] });
    expect(blocks[2]).toEqual({ types: ['Organization'], problems: [] });
    expect(typesFor('/bad-jsonld')).toEqual(expect.arrayContaining(['structured-data-parse-error', 'structured-data-invalid']));
  });

  it('does not parse non-HTML and flags app shells without content noise', () => {
    expect(page('/file.pdf')).toMatchObject({ fetchClass: 'ok', isHtml: false, contentType: 'application/pdf', title: null, sizeBytes: null });
    expect(typesFor('/file.pdf')).toEqual([]);
    expect(page('/shell').jsRenderingSuspected).toBe(true);
    const shell = typesFor('/shell');
    expect(shell).toContain('javascript-rendering-suspected');
    expect(shell).not.toContain('missing-h1');
    expect(shell).not.toContain('thin-content');
  });

  it('computes click depth and flags deep pages', () => {
    expect([1, 2, 3].map((n) => page(`/level${n}`).depth)).toEqual([1, 2, 3]);
    expect(result.issues.filter((i) => i.type === 'deep-page').map((i) => i.url)).toEqual([`${base}/level3`]);
  });

  it('reports security headers once per origin', () => {
    for (const type of ['insecure-http', 'missing-content-security-policy', 'missing-x-content-type-options'] as const) {
      expect(result.issues.filter((i) => i.type === type).map((i) => i.url)).toEqual([`${base}/`]);
    }
    expect(result.summary.issuesByType['missing-hsts']).toBeUndefined();
  });

  it('checks external links when asked', () => {
    expect(result.summary.externalLinksChecked).toBe(2);
    expect(result.externalLinks.find((l) => l.url.endsWith('/gone'))).toMatchObject({ status: 404, broken: true });
    expect(result.externalLinks.find((l) => l.url.endsWith('/ok'))).toMatchObject({ status: 200, broken: false });
    expect(issue('broken-external-link', '/')?.relatedUrls).toEqual([`${externalBase}/gone`]);
  });
});

describe('crawlSite options', () => {
  it('stops at maxPages and withholds orphan findings on a partial crawl', async () => {
    const result = await crawlSite(options({ maxPages: 3 }));
    expect(result.summary.stoppedReason).toBe('max_pages');
    expect(result.summary.truncated).toBe(true);
    expect(result.pages.filter((p) => p.fetchClass !== 'robots_blocked').length).toBeLessThanOrEqual(3);
    expect(result.summary.issuesByType['orphan-page']).toBeUndefined();
    expect(result.summary.externalLinksChecked).toBe(0);
  });

  it('applies include/exclude patterns and maxDepth', async () => {
    const excludedRun = await crawlSite(options({ exclude: ['/dup-*', /\/level\d/] }));
    expect(excludedRun.pages.some((p) => /dup-|level/.test(p.url))).toBe(false);
    expect(excludedRun.summary.urlsExcluded).toBe(3);

    const includedRun = await crawlSite(options({ include: ['/level*'], useSitemaps: false }));
    expect(includedRun.pages.map((p) => new URL(p.url).pathname).sort()).toEqual(['/', '/level1', '/level2', '/level3']);
    expect(includedRun.summary.issuesByType['sitemap-missing']).toBeUndefined();

    const shallow = await crawlSite(options({ maxDepth: 1, useSitemaps: false }));
    expect(shallow.pages.some((p) => p.url.endsWith('/level1'))).toBe(true);
    expect(shallow.pages.some((p) => p.url.endsWith('/level2'))).toBe(false);
  });

  it('can ignore robots.txt', async () => {
    const result = await crawlSite(options({ respectRobots: false, include: ['/private/*'] }));
    expect(result.pages.find((p) => p.url.endsWith('/private/secret'))).toMatchObject({ status: 200, fetchClass: 'ok' });
  });

  it('honours the robots.txt group for its own user agent token', async () => {
    hits.clear();
    const result = await crawlSite(options({ userAgent: 'OtherBot/2.0 (+https://example.com/bot)' }));
    expect(result.pages.length).toBeGreaterThan(0);
    expect(result.pages.every((p) => p.fetchClass === 'robots_blocked')).toBe(true);
    expect([...hits.keys()].sort()).toEqual(['/robots.txt', '/sitemap-index.xml', '/sitemap-pages.xml', '/sitemap.xml']);
    expect(result.summary.healthScore).toBe(0);
  });

  it('uses the render hook for HTML pages and falls back when it fails', async () => {
    const rendered: string[] = [];
    const result = await crawlSite(
      options({
        startUrl: `${base}/shell`,
        include: ['/about', '/fr'],
        useSitemaps: false,
        render: async (url) => {
          rendered.push(url);
          if (url.endsWith('/about')) throw new Error('renderer down');
          if (url.endsWith('/fr')) return null;
          return {
            html: html({ title: 'Rendered application shell', description: desc('rendered'), body: `<h1>Rendered</h1><p>${WORDS}</p><a href="/about">about</a><a href="/fr">fr</a><a href="/file.pdf">pdf</a>` }),
          };
        },
      }),
    );
    const shell = result.pages.find((p) => p.url.endsWith('/shell'));
    expect(shell).toMatchObject({ rendered: true, via: 'render', jsRenderingSuspected: false, needsJavaScript: true, title: 'Rendered application shell', h1s: ['Rendered'] });
    expect(result.pages.find((p) => p.url.endsWith('/about'))).toMatchObject({ rendered: false, via: 'direct', needsJavaScript: false, title: 'About the fixture site' });
    expect(result.pages.find((p) => p.url.endsWith('/fr'))).toMatchObject({ rendered: false, lang: 'fr' });
    expect(rendered.sort()).toEqual([`${base}/about`, `${base}/fr`, `${base}/shell`]);
    // The shell's content exists only after rendering, which AI crawlers and other non-rendering bots never do.
    expect(result.issues.filter((i) => i.type === 'javascript-rendering-suspected').map((i) => [i.url, i.detail])).toEqual([
      [`${base}/shell`, 'The content only appears after JavaScript runs'],
    ]);
  });

  it('renders only app shells when renderWhen is "suspected"', async () => {
    const rendered: string[] = [];
    await crawlSite(
      options({
        startUrl: `${base}/shell`,
        include: ['/about'],
        useSitemaps: false,
        renderWhen: 'suspected',
        render: async (url) => {
          rendered.push(url);
          return { html: html({ title: 'Rendered application shell', body: '<h1>Rendered</h1><a href="/about">about</a>' }) };
        },
      }),
    );
    expect(rendered).toEqual([`${base}/shell`]);
  });

  it('gets past a blocked page with the fallback and keeps the content', async () => {
    const tried: string[] = [];
    const result = await crawlSite(
      options({
        startUrl: `${base}/forbidden`,
        useSitemaps: false,
        fallback: async (url) => {
          tried.push(url);
          return { html: html({ title: 'Fetched through the fallback', description: desc('fallback'), body: `<h1>Unblocked</h1><p>${WORDS}</p>` }), status: 200 };
        },
      }),
    );
    expect(tried).toEqual([`${base}/forbidden`]);
    expect(result.pages[0]).toMatchObject({ fetchClass: 'ok', status: 200, via: 'fallback', title: 'Fetched through the fallback', h1s: ['Unblocked'] });
    expect(result.issues.map((i) => i.type)).not.toContain('blocked-page');
  });

  it('classifies a timeout honestly', async () => {
    const result = await crawlSite(options({ startUrl: `${base}/hang`, timeoutMs: 200, useSitemaps: false, respectRobots: false }));
    expect(result.pages).toHaveLength(1);
    expect(result.pages[0]).toMatchObject({ fetchClass: 'error', errorKind: 'timeout', status: 0 });
    expect(result.issues.filter((i) => i.url.endsWith('/hang')).map((i) => i.type)).toEqual(['fetch-failed']);
    expect(result.summary.pagesFailed).toBe(1);
    expect(result.summary.healthScore).toBe(0);
  });

  it('classifies a connection failure honestly', async () => {
    const dead = http.createServer();
    await new Promise<void>((resolve) => dead.listen(0, '127.0.0.1', resolve));
    const port = (dead.address() as AddressInfo).port;
    await new Promise((resolve) => dead.close(resolve));
    const result = await crawlSite({ startUrl: `http://127.0.0.1:${port}/`, allowPrivateNetwork: true, allowedPorts: [port], delayMs: 0 });
    expect(result.pages[0]).toMatchObject({ fetchClass: 'error', errorKind: 'connection' });
  });

  it('retries 429s with backoff, then gives up on the crawl', async () => {
    hits.clear();
    const logs: string[] = [];
    const result = await crawlSite(
      options({
        startUrl: `${base}/rate-home`,
        useSitemaps: false,
        concurrency: 1,
        rateLimitRetries: 1,
        rateLimitBackoffMs: 10,
        rateLimitGiveUpAfter: 2,
      }),
      { onLog: (_, message) => logs.push(message) },
    );
    expect(hits.get('/rate')).toBe(2);
    expect(hits.get('/rate-again')).toBe(2);
    const limited = result.pages.filter((p) => p.fetchClass === 'rate_limited');
    expect(limited).toHaveLength(2);
    expect(result.issues.filter((i) => i.type === 'rate-limited-page')).toHaveLength(2);
    expect(result.summary.stoppedReason).toBe('rate_limited');
    expect(result.summary.pagesRateLimited).toBe(2);
    expect(result.issues.find((i) => i.type === 'crawl-rate-limited')?.url).toBe(`${base}/rate-home`);
    expect(result.pages.some((p) => p.url.endsWith('/about'))).toBe(false);
    expect(result.issues.some((i) => i.type === 'broken-internal-link')).toBe(false);
    expect(logs.some((m) => m.includes('backing off'))).toBe(true);
  });

  it('returns a partial result when aborted', async () => {
    const controller = new AbortController();
    const result = await crawlSite(options({ signal: controller.signal, concurrency: 1 }), {
      onPage: () => {
        controller.abort();
      },
    });
    expect(result.summary.stoppedReason).toBe('aborted');
    expect(result.pages.length).toBeGreaterThanOrEqual(1);
    expect(result.pages.length).toBeLessThan(5);
  });
});

describe('crawl limits and edge cases', () => {
  /** Fake site on example.com / www.example.com. Handlers may be async to control timing. */
  const fakeSite = (routes: Record<string, () => Response | Promise<Response>>) => {
    const requested: string[] = [];
    const fetch: FetchLike = async (url) => {
      requested.push(url);
      const u = new URL(url);
      const handler = routes[`${u.host}${u.pathname}`] ?? routes[u.pathname];
      return handler ? handler() : new Response('not found', { status: 404, headers: { 'content-type': 'text/plain' } });
    };
    return { requested, fetch, resolveHost: async () => ['93.184.216.34'] };
  };
  const htmlPage = (body: string) => () =>
    new Response(html({ title: 'A page title for tests', description: desc('fake'), body: `<h1>Fake</h1><p>${WORDS}</p>${body}` }), {
      headers: { 'content-type': 'text/html' },
    });
  const fakeOptions = (site: ReturnType<typeof fakeSite>, overrides: Partial<CrawlOptions> = {}): CrawlOptions => ({
    startUrl: 'https://example.com/',
    fetch: site.fetch,
    resolveHost: site.resolveHost,
    delayMs: 0,
    useSitemaps: false,
    ...overrides,
  });

  it('keeps a running queued count that ends at zero on a complete crawl', async () => {
    const queued: number[] = [];
    const result = await crawlSite(options({ concurrency: 1 }), { onPage: (_, progress) => void queued.push(progress.queued) });
    expect(result.summary.stoppedReason).toBe('completed');
    expect(queued.at(-1)).toBe(0);
    expect(Math.max(...queued)).toBeGreaterThan(0);

    const partial: number[] = [];
    const capped = await crawlSite(options({ maxPages: 3, concurrency: 1 }), { onPage: (_, progress) => void partial.push(progress.queued) });
    expect(capped.summary.stoppedReason).toBe('max_pages');
    expect(partial.at(-1)).toBeGreaterThan(0);
  });

  it('stops scheduling pages when the time limit runs out', async () => {
    const result = await crawlSite(options({ maxDurationMs: 0 }));
    expect(result.summary.stoppedReason).toBe('time_limit');
    expect(result.summary.truncated).toBe(true);
    expect(result.pages.filter((p) => p.fetchClass !== 'robots_blocked')).toHaveLength(1);
  });

  it('does not let concurrent redirects overshoot maxPages while robots.txt loads', async () => {
    const slowRobots = (): Promise<Response> =>
      new Promise((resolve) => setTimeout(() => resolve(new Response('User-agent: *\nAllow: /\n', { headers: { 'content-type': 'text/plain' } })), 50));
    const site = fakeSite({
      'example.com/': htmlPage('<a href="/r1">1</a><a href="/r2">2</a><a href="/r3">3</a>'),
      'example.com/r1': () => new Response(null, { status: 301, headers: { location: 'https://www.example.com/t1' } }),
      'example.com/r2': () => new Response(null, { status: 301, headers: { location: 'https://www.example.com/t2' } }),
      'example.com/r3': () => new Response(null, { status: 301, headers: { location: 'https://www.example.com/t3' } }),
      'www.example.com/robots.txt': slowRobots,
      'www.example.com/t1': htmlPage(''),
      'www.example.com/t2': htmlPage(''),
      'www.example.com/t3': htmlPage(''),
    });
    const result = await crawlSite(fakeOptions(site, { concurrency: 3, maxPages: 5 }));
    expect(result.pages.filter((p) => p.fetchClass !== 'robots_blocked').length).toBeLessThanOrEqual(5);
    expect(result.pages.filter((p) => p.url.includes('/t'))).toHaveLength(1);
    expect(result.summary.stoppedReason).toBe('max_pages');
  });

  it('crawls parameter variants after clean URLs, so a page limit goes to distinct pages first', async () => {
    const site = fakeSite({
      '/': htmlPage('<a href="/shop?sort=price">a</a><a href="/shop?sort=name">b</a><a href="/shop">c</a><a href="/about">d</a>'),
      '/shop': htmlPage(''),
      '/about': htmlPage(''),
    });
    const result = await crawlSite(fakeOptions(site, { concurrency: 1, maxPages: 3 }));
    expect(result.pages.filter((p) => p.fetchClass !== 'robots_blocked').map((p) => p.url)).toEqual(['https://example.com/', 'https://example.com/shop', 'https://example.com/about']);
    expect(result.summary.stoppedReason).toBe('max_pages');
  });

  it('does not download a redirect destination that was crawled already', async () => {
    let served = 0;
    let read = 0;
    const body = html({ title: 'A page title for tests', description: desc('fake'), body: `<h1>Fake</h1><p>${WORDS}</p>` });
    const target = () => {
      served++;
      const stream = new ReadableStream<Uint8Array>(
        {
          pull(controller) {
            read++;
            controller.enqueue(new TextEncoder().encode(body));
            controller.close();
          },
        },
        { highWaterMark: 0 },
      );
      return new Response(stream, { headers: { 'content-type': 'text/html' } });
    };
    const site = fakeSite({
      '/': htmlPage('<a href="/target">a</a><a href="/old">b</a>'),
      '/target': target,
      '/old': () => new Response(null, { status: 301, headers: { location: 'https://example.com/target' } }),
    });
    const result = await crawlSite(fakeOptions(site, { concurrency: 1 }));
    expect(result.pages.find((p) => p.url === 'https://example.com/old')).toMatchObject({ fetchClass: 'redirect', finalStatus: 200 });
    expect(served).toBe(2);
    expect(read).toBe(1);
  });

  it('flags redirects to the home page, to another site and to a non-indexable page', async () => {
    const moved = (location: string) => () => new Response(null, { status: 301, headers: { location } });
    const site = fakeSite({
      '/': htmlPage('<a href="/old-product">a</a><a href="/index.html">b</a><a href="/en-us/">e</a><a href="/out">c</a><a href="/moved">d</a>'),
      '/old-product': moved('https://example.com/'),
      '/index.html': moved('https://example.com/'),
      '/en-us/': moved('https://example.com/'),
      '/out': moved('https://other.test/landing'),
      'other.test/landing': htmlPage(''),
      '/moved': moved('https://example.com/hidden'),
      '/hidden': () =>
        new Response(html({ title: 'A hidden page for tests', description: desc('hidden'), head: '<meta name="robots" content="noindex">', body: `<h1>Hidden</h1><p>${WORDS}</p>` }), {
          headers: { 'content-type': 'text/html' },
        }),
    });
    const result = await crawlSite(fakeOptions(site));
    const typesOf = (path: string) => result.issues.filter((i) => i.url === `https://example.com${path}`).map((i) => i.type);
    expect(typesOf('/old-product')).toContain('redirect-to-homepage');
    expect(typesOf('/index.html')).not.toContain('redirect-to-homepage');
    expect(typesOf('/en-us/')).not.toContain('redirect-to-homepage');
    expect(typesOf('/out')).toContain('redirect-to-external');
    expect(typesOf('/moved')).toContain('redirect-to-non-indexable');
    expect(result.issues.find((i) => i.type === 'redirect-to-non-indexable')?.detail).toBe('Ends at a page that is noindex (meta robots)');
  });

  it('reports how many pages it fetched at once', async () => {
    const site = fakeSite({ '/': htmlPage('') });
    const result = await crawlSite(fakeOptions(site, { concurrency: 2, maxConcurrency: 5 }));
    expect(result.summary.pace).toEqual({ start: 2, peak: 2, final: 2, slowdowns: 0 });
  });

  it('treats a 3xx without Location as a failed response, not a redirect', async () => {
    const site = fakeSite({
      '/': htmlPage('<a href="/bare">bare</a>'),
      '/bare': () => new Response('moved', { status: 302, headers: { 'content-type': 'text/html' } }),
    });
    const result = await crawlSite(fakeOptions(site));
    const bare = result.pages.find((p) => p.url === 'https://example.com/bare');
    expect(bare).toMatchObject({ fetchClass: 'error', redirectChain: [] });
    expect(bare?.errorMessage).toContain('without a Location header');
    expect(result.issues.filter((i) => i.url === 'https://example.com/bare').map((i) => i.type)).toEqual(['fetch-failed']);
  });

  it('treats a robots.txt 5xx as disallow-all and reports it', async () => {
    const site = fakeSite({
      '/robots.txt': () => new Response('down', { status: 503, headers: { 'content-type': 'text/plain' } }),
      '/': htmlPage(''),
    });
    const result = await crawlSite(fakeOptions(site));
    expect(site.requested).toEqual(['https://example.com/robots.txt']);
    expect(result.pages.every((p) => p.fetchClass === 'robots_blocked')).toBe(true);
    expect(result.issues.find((i) => i.type === 'robots-txt-unavailable')?.relatedUrls).toEqual(['https://example.com/robots.txt']);

    const ignored = await crawlSite(fakeOptions(site, { respectRobots: false }));
    expect(ignored.pages[0]?.fetchClass).toBe('ok');
    expect(ignored.summary.issuesByType['robots-txt-unavailable']).toBeUndefined();
  });

  it('fetches URLs with their original query order but dedupes on the sorted form', async () => {
    const site = fakeSite({
      '/': htmlPage('<a href="/q?b=2&a=1">one</a><a href="/q?a=1&b=2">same</a>'),
      '/q': htmlPage(''),
    });
    const result = await crawlSite(fakeOptions(site, { startUrl: 'https://example.com/?z=1&y=2' }));
    expect(site.requested).toContain('https://example.com/?z=1&y=2');
    expect(site.requested.filter((u) => u.includes('/q'))).toEqual(['https://example.com/q?b=2&a=1']);
    expect(result.pages.map((p) => p.url).sort()).toEqual(['https://example.com/?y=2&z=1', 'https://example.com/q?a=1&b=2']);
  });
});

describe('site-level, resource and graph checks', () => {
  const site = (routes: Record<string, (method: string) => Response>) => {
    const requested: string[] = [];
    const fetch: FetchLike = async (url, init) => {
      requested.push(`${init.method} ${url}`);
      const u = new URL(url);
      const handler = routes[`${u.protocol}//${u.host}${u.pathname}`] ?? routes[u.pathname];
      return handler ? handler(init.method) : new Response('not found', { status: 404, headers: { 'content-type': 'text/html' } });
    };
    return { requested, fetch, resolveHost: async () => ['93.184.216.34'] };
  };
  const htmlRoute = (spec: PageSpec, headers: Record<string, string> = {}) => () =>
    new Response(html(spec), { headers: { 'content-type': 'text/html', ...headers } });
  const text = (body: string, status = 200) => () => new Response(body, { status, headers: { 'content-type': 'text/plain' } });
  const xmlRoute = (body: string) => () => new Response(`<?xml version="1.0"?>${body}`, { headers: { 'content-type': 'application/xml' } });
  const urlset = (paths: string[]) =>
    xmlRoute(`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map((p) => `<url><loc>https://example.com${p}</loc></url>`).join('')}</urlset>`);
  const body = (inner: string) => `<h1>Heading</h1><p>${WORDS}</p>${inner}`;

  let result: CrawlResult;
  let requested: string[];
  const issue = (type: IssueType, path: string) => result.issues.find((i) => i.type === type && i.url === `https://example.com${path}`);
  const types = (path: string) => result.issues.filter((i) => i.url === `https://example.com${path}`).map((i) => i.type);

  beforeAll(async () => {
    const fake = site({
      // The plain-HTTP home page answers instead of redirecting.
      'http://example.com/': htmlRoute({ title: 'Plain HTTP copy of the site', body: body('') }),
      '/robots.txt': text(
        'User-agent: *\nAllow: /\n\nUser-agent: GPTBot\nDisallow: /\n\nUser-agent: PerplexityBot\nDisallow: /blog/\n\n' +
          'Sitemap: https://example.com/sitemap-a.xml\nSitemap: https://example.com/sitemap-b.xml\nSitemap: https://example.com/sitemap-gone.xml\n',
      ),
      '/sitemap-a.xml': urlset(['/', '/blog/post', '/moved', '/gone-redirect']),
      '/sitemap-b.xml': urlset(['/blog/post', '/canonical-only']),
      '/': htmlRoute({
        title: 'Home page of the example site',
        description: desc('home'),
        head: '<meta property="og:url" content="https://example.com/">',
        body: body(
          '<a href="/blog/post">post</a><a href="/refresh">refresh</a><a href="/twice">twice</a><a href="/variant">variant</a>' +
            '<a href="/Upper-Case" rel="nofollow">upper</a><a href="/secure-downgrade">downgrade</a><a href="/blog/post" rel="nofollow">again</a>' +
            '<a href="/moved"><img src="/icon.svg"></a><img src="/logo.png" alt="Logo"><img src="/missing.png" alt="x"><img src="/huge.jpg" alt="big">' +
            '<script src="/app.js"></script><link rel="stylesheet" href="/gone.css">',
        ),
      }),
      '/blog/post': htmlRoute({ title: 'A blog post on the example site', description: desc('post'), head: '<meta property="og:url" content="https://example.com/elsewhere">', body: body('<a href="/">home</a>') }),
      '/refresh': htmlRoute({ title: 'Page that refreshes elsewhere', description: desc('refresh'), head: '<meta http-equiv="refresh" content="0; url=/blog/post">', body: body('<a href="/">home</a>') }),
      '/twice': () =>
        new Response(
          `<!doctype html><html lang="en"><head><title>First title of this page</title><title>Second title</title><meta name="description" content="${desc('a')}"><meta name="description" content="${desc('b')}"><meta name="robots" content="index, nofollow"></head><body>${body('<a href="/">home</a>')}</body></html>`,
          { headers: { 'content-type': 'text/html' } },
        ),
      '/variant': htmlRoute({ title: 'A variant that names a canonical', description: desc('variant'), head: '<link rel="canonical" href="/canonical-only">', body: body('<a href="/">home</a>') }),
      '/canonical-only': htmlRoute({ title: 'The canonical nobody links to', description: desc('canonical'), body: body('<a href="/">home</a>') }),
      '/Upper-Case': htmlRoute({ title: 'A page with uppercase letters', description: desc('upper'), body: body('<a href="/">home</a>') }),
      '/secure-downgrade': () => new Response(null, { status: 301, headers: { location: 'http://example.com/plain' } }),
      'http://example.com/plain': htmlRoute({ title: 'Plain page served over HTTP', description: desc('plain'), body: body('') }),
      '/moved': () => new Response(null, { status: 308, headers: { location: '/blog/post' } }),
      '/gone-redirect': () => new Response(null, { status: 301, headers: { location: '/really-gone' } }),
      '/really-gone': () => new Response('gone', { status: 410, headers: { 'content-type': 'text/html' } }),
      '/logo.png': () => new Response(null, { headers: { 'content-type': 'image/png', 'content-length': '2048' } }),
      '/icon.svg': () => new Response(null, { headers: { 'content-type': 'image/svg+xml', 'content-length': '300' } }),
      '/huge.jpg': () => new Response(null, { headers: { 'content-type': 'image/jpeg', 'content-length': String(400 * 1024) } }),
      '/app.js': () => new Response(null, { headers: { 'content-type': 'text/javascript' } }),
      // Refuses HEAD, so the check has to fall back to GET.
      '/missing.png': (method) => new Response(null, { status: method === 'HEAD' ? 405 : 404 }),
    });
    requested = fake.requested;
    result = await crawlSite({ startUrl: 'https://example.com/', fetch: fake.fetch, resolveHost: fake.resolveHost, delayMs: 0, concurrency: 2 });
  });

  it('probes the plain-HTTP site and reads llms.txt', () => {
    expect(result.summary.httpProbe).toEqual({ url: 'http://example.com/', status: 200, finalUrl: 'http://example.com/', redirectsToHttps: false });
    expect(issue('http-not-redirected-to-https', '/')?.severity).toBe('critical');
    expect(result.summary.llmsTxtFound).toBe(false);
    expect(issue('llms-txt-missing', '/')).toBeDefined();
    expect(issue('robots-txt-missing', '/')).toBeUndefined();
  });

  it('reports AI crawler access from robots.txt', () => {
    const ai = result.summary.aiDiscoverability;
    expect(ai).not.toBeNull();
    const bot = (token: string) => ai?.bots.find((b) => b.token === token);
    expect(bot('GPTBot')).toMatchObject({ purpose: 'training', allowed: false, allowedPct: 0 });
    expect(bot('PerplexityBot')).toMatchObject({ purpose: 'search', allowed: true });
    expect(bot('PerplexityBot')?.allowedPct).toBeLessThan(100);
    expect(bot('OAI-SearchBot')).toMatchObject({ allowed: true, allowedPct: 100 });
    expect(issue('ai-search-bots-blocked', '/')?.detail).toContain('PerplexityBot');
    expect(issue('ai-training-bots-blocked', '/')?.detail).toContain('GPTBot');
    expect(ai?.score).toBeGreaterThan(0);
    expect(ai?.score).toBeLessThan(100);
  });

  it('checks images, scripts and stylesheets once each', () => {
    const resource = (path: string) => result.resources.find((r) => r.url === `https://example.com${path}`);
    expect(resource('/logo.png')).toMatchObject({ type: 'image', status: 200, sizeBytes: 2048, broken: false });
    expect(resource('/missing.png')).toMatchObject({ status: 404, broken: true });
    expect(resource('/gone.css')).toMatchObject({ type: 'stylesheet', broken: true });
    expect(resource('/app.js')).toMatchObject({ type: 'script', broken: false });
    expect(requested.filter((r) => r.endsWith('/logo.png'))).toEqual(['HEAD https://example.com/logo.png']);
    expect(requested.filter((r) => r.endsWith('/missing.png'))).toEqual(['HEAD https://example.com/missing.png', 'GET https://example.com/missing.png']);
    expect(issue('broken-image', '/')?.relatedUrls).toEqual(['https://example.com/missing.png']);
    expect(issue('image-too-large', '/')?.relatedUrls).toEqual(['https://example.com/huge.jpg']);
    expect(issue('broken-css', '/')?.relatedUrls).toEqual(['https://example.com/gone.css']);
    expect(issue('broken-js', '/')).toBeUndefined();
    expect(result.summary.resourcesChecked).toBe(result.resources.length);
  });

  it('classifies redirects', () => {
    expect(types('/secure-downgrade')).toEqual(expect.arrayContaining(['redirect-3xx', 'https-to-http-redirect']));
    expect(issue('broken-redirect', '/gone-redirect')?.detail).toBe('Ends at https://example.com/really-gone (HTTP 410)');
    expect(types('/moved')).toEqual(expect.arrayContaining(['redirect-3xx', 'redirect-in-sitemap']));
    expect(types('/moved')).not.toContain('temporary-redirect');
    expect(issue('redirect-no-incoming-links', '/gone-redirect')).toBeDefined();
    expect(issue('redirect-no-incoming-links', '/moved')).toBeUndefined();
  });

  it('checks head tags, URLs and links', () => {
    expect(issue('meta-refresh-redirect', '/refresh')?.relatedUrls).toEqual(['https://example.com/blog/post']);
    expect(types('/twice')).toEqual(expect.arrayContaining(['multiple-titles', 'multiple-meta-descriptions', 'nofollow-page']));
    expect(issue('open-graph-url-mismatch', '/blog/post')?.detail).toContain('https://example.com/elsewhere');
    expect(issue('open-graph-url-mismatch', '/')).toBeUndefined();
    expect(types('/Upper-Case')).toContain('url-uppercase');
    // /blog/post is also linked normally, so only /Upper-Case counts as a nofollow link.
    expect(issue('nofollow-internal-links', '/')?.relatedUrls).toEqual(['https://example.com/Upper-Case']);
    const upper = result.pages.find((p) => p.url === 'https://example.com/Upper-Case');
    expect(upper?.inlinks).toMatchObject({ href: 1, dofollow: 0, nofollow: 1 });
    // The icon link wraps an image without alt, so it has no anchor text at all.
    expect(issue('links-without-anchor', '/')?.relatedUrls).toEqual(['https://example.com/moved']);
    expect(issue('canonical-no-incoming-links', '/canonical-only')?.severity).toBe('critical');
  });

  it('tracks which sitemaps list each URL', () => {
    const post = result.pages.find((p) => p.url === 'https://example.com/blog/post');
    expect(post?.sitemaps).toEqual(['https://example.com/sitemap-a.xml', 'https://example.com/sitemap-b.xml']);
    expect(issue('page-in-multiple-sitemaps', '/blog/post')).toBeDefined();
    expect(issue('sitemap-unreachable', '/')?.relatedUrls).toEqual(['https://example.com/sitemap-gone.xml']);
    // The /sitemap.xml guess does not exist, but nothing names it, so it is not reported.
    expect(result.issues.filter((i) => i.type === 'sitemap-unreachable')).toHaveLength(1);
  });

  it('summarises the crawl for the overview charts', () => {
    const s = result.summary;
    expect(s.statusClasses['3xx']).toBe(3);
    expect(s.statusClasses['4xx']).toBe(1);
    expect(s.ttfbBuckets.fast + s.ttfbBuckets.medium + s.ttfbBuckets.slow + s.ttfbBuckets.tooSlow).toBe(s.htmlPages);
    expect(Object.values(s.statusByDepth).reduce((sum, row) => sum + Object.values(row).reduce((a, b) => a + b, 0), 0)).toBe(s.pagesTotal - s.pagesRobotsBlocked);
    // Error pages served as HTML count as HTML too, including the missing stylesheet's 404 page.
    const htmlRows = result.pages.filter((p) => p.fetchClass !== 'redirect' && p.contentType === 'text/html').length;
    expect(s.contentTypes.html).toBe(htmlRows + result.resources.filter((r) => r.contentType === 'text/html').length);
    expect(s.contentTypes.image).toBeGreaterThan(0);
    expect(s.linkStatus.crawled).toBeGreaterThan(0);
    expect(s.urlsWithErrors + s.urlsWithoutErrors).toBe(s.pagesTotal - s.pagesRobotsBlocked);
    // Health is the share of URLs without a critical issue.
    expect(s.healthScore).toBe(Math.round((100 * s.urlsWithoutErrors) / (s.urlsWithErrors + s.urlsWithoutErrors)));
  });
});

describe('markIndexability', () => {
  it('splits Links and Content issues by the page and lowers them on non-indexable pages', () => {
    const pages = [
      { url: 'https://a.test/', indexable: true },
      { url: 'https://a.test/hidden', indexable: false },
    ];
    const issues = markIndexability(
      [
        makeIssue('broken-internal-link', 'https://a.test/'),
        makeIssue('broken-internal-link', 'https://a.test/hidden'),
        makeIssue('meta-description-too-short', 'https://a.test/hidden'),
        makeIssue('noindex-page', 'https://a.test/hidden'),
        makeIssue('broken-internal-link', 'https://a.test/not-crawled'),
      ],
      pages,
    );
    expect(issues.map((i) => [i.severity, i.indexable])).toEqual([
      ['critical', true],
      ['warning', false],
      ['info', false],
      ['warning', undefined],
      ['critical', undefined],
    ]);
  });
});

describe('trafficIssues', () => {
  it('flags pages Google sends visitors to that redirect, fail, are noindex or non-canonical, and traffic drops', () => {
    const page = (url: string, extra: Partial<PageResult>) => ({ url, status: 200, fetchClass: 'ok', indexabilityReason: 'ok', finalUrl: url, canonical: null, headerCanonical: null, ...extra }) as PageResult;
    const pages = [
      page('https://a.test/old', { status: 301, fetchClass: 'redirect', finalUrl: 'https://a.test/new' }),
      page('https://a.test/gone', { status: 404, fetchClass: 'client_error' }),
      page('https://a.test/hidden', { indexabilityReason: 'noindex-meta' }),
      page('https://a.test/copy', { indexabilityReason: 'canonicalised', canonical: 'https://a.test/' }),
      page('https://a.test/', {}),
    ];
    const traffic = trafficByPage([
      { url: 'https://a.test/old?utm_source=x', clicks: 4, previousClicks: 0 },
      { url: 'https://a.test/gone', clicks: 2, previousClicks: 1 },
      { url: 'https://a.test/hidden', clicks: 1, previousClicks: 0 },
      { url: 'https://a.test/copy', clicks: 3, previousClicks: 0 },
      { url: 'https://a.test/', clicks: 40, previousClicks: 100 },
    ]);
    expect(trafficIssues(pages, traffic).map((i) => [i.type, i.url])).toEqual([
      ['redirect-receives-traffic', 'https://a.test/old'],
      ['broken-page-receives-traffic', 'https://a.test/gone'],
      ['noindex-page-receives-traffic', 'https://a.test/hidden'],
      ['non-canonical-receives-traffic', 'https://a.test/copy'],
      ['organic-traffic-dropped', 'https://a.test/'],
    ]);
  });
});

describe('robots directives', () => {
  it('matches whole noindex/none directives only', () => {
    expect(hasNoindex('noindex, follow')).toBe(true);
    expect(hasNoindex('NONE')).toBe(true);
    expect(hasNoindex('index, follow, max-image-preview:none')).toBe(false);
    expect(hasNoindex('max-image-preview: none, max-snippet:-1')).toBe(false);
    expect(hasNoindex('nofollow, noimageindex')).toBe(false);
    expect(hasNoindex('unavailable_after: 2030-01-01, noindex')).toBe(true);
  });

  it('applies user-agent scoped X-Robots-Tag entries only to us', () => {
    expect(hasNoindex('bingbot: noindex')).toBe(false);
    expect(hasNoindex('bingbot: noindex, nofollow')).toBe(false);
    expect(hasNoindex('googlebot: noindex')).toBe(true);
    expect(hasNoindex('*: noindex')).toBe(true);
    expect(hasNoindex('OpenSEOBot: none', ['OpenSEOBot'])).toBe(true);
    expect(hasNoindex('otherbot: noindex, googlebot: nofollow')).toBe(false);
    expect(hasNoindex('otherbot: noindex, googlebot: noindex')).toBe(true);
  });
});

describe('sitemap discovery limits', () => {
  const ctx = (): FetchContext => ({
    fetch: globalThis.fetch as FetchLike,
    guard: createGuard({ allowPrivateNetwork: true, allowedPorts: [Number(new URL(base).port)] }),
    throttle: new HostThrottle(0),
    userAgent: 'test',
    timeoutMs: 5000,
    maxBodyBytes: 1024 * 1024,
    maxRedirects: 5,
  });

  it('records when the document limit leaves sitemaps unread', async () => {
    const found = await discoverSitemapUrls([`${base}/sitemap-index.xml`], ctx(), { ...DEFAULT_SITEMAP_LIMITS, maxDocuments: 1 });
    expect(found).toMatchObject({ urls: [], sitemaps: [`${base}/sitemap-index.xml`], capped: true, tooLarge: [] });
    const full = await discoverSitemapUrls([`${base}/sitemap-index.xml`], ctx());
    expect(full.capped).toBe(false);
    expect(full.urls).toHaveLength(6);
  });

  it('records a sitemap over the size limit instead of dropping it silently', async () => {
    const found = await discoverSitemapUrls([`${base}/sitemap-pages.xml`], ctx(), { ...DEFAULT_SITEMAP_LIMITS, maxBytes: 100 });
    expect(found).toMatchObject({ urls: [], sitemaps: [], tooLarge: [`${base}/sitemap-pages.xml`] });
  });

  it('skips "missing from sitemap" when discovery was partial and reports oversized sitemaps', () => {
    const data = extractPage('<html></html>', { url: 'https://example.com/a', isInternal: () => true });
    const row = {
      ...data,
      url: 'https://example.com/a',
      finalUrl: 'https://example.com/a',
      fetchClass: 'ok',
      isHtml: true,
      indexable: true,
      inSitemap: false,
      sitemaps: [],
      depth: 0,
      redirectChain: [],
      securityHeaders: { strictTransportSecurity: 'x', contentSecurityPolicy: 'x', xContentTypeOptions: 'x', xFrameOptions: 'x', referrerPolicy: 'x', permissionsPolicy: null },
    } as unknown as PageResult;
    const facts = { startUrl: row.url, complete: true, sitemapChecked: true, sitemapFound: true, rateLimitStopped: false, externalLinks: [], thresholds: DEFAULT_THRESHOLDS };
    const types = (extra: object): IssueType[] => crossPageIssues([{ ...row }], { ...facts, ...extra }).map((i) => i.type);
    expect(types({})).toContain('page-not-in-sitemap');
    expect(types({ sitemapCapped: true })).not.toContain('page-not-in-sitemap');
    const oversized = types({ sitemapFound: false, sitemapsTooLarge: ['https://example.com/big.xml'] });
    expect(oversized).toContain('sitemap-too-large');
    expect(oversized).not.toContain('sitemap-missing');
  });
});

describe('extractPage', () => {
  it('detects mixed content, canonical, base href and link attributes', () => {
    const data = extractPage(
      `<html lang="de"><head><base href="https://example.com/dir/"><title> Mixed   content </title>
<link rel="canonical" href="/canonical"><link rel="canonical" href="/other">
<meta name="twitter:card" content="summary"><meta property="og:image" content="https://example.com/i.png">
<script src="http://cdn.example.com/a.js"></script><link rel="stylesheet" href="http://cdn.example.com/a.css">
<script type="application/ld+json">{"@context":"https://schema.org","@graph":[{"@type":"WebSite","url":"https://example.com"},{"name":"untyped"}]}</script>
</head><body><p>One two three.</p><p>Four</p><img src="http://img.example.com/x.png" alt="x">
<a href="page?utm_campaign=z">Rel</a><a href="https://other.example.org/" rel="sponsored nofollow">Out</a>
<a href="mailto:a@b.c">mail</a><a href="#top">top</a><a href="tel:123">tel</a><div itemscope></div>
<script>var ignored = "words that must not count";</script></body></html>`,
      { url: 'https://example.com/start', isInternal: (u) => new URL(u).hostname === 'example.com', normalize: { stripTrackingParams: true } },
    );
    expect(data.title).toBe('Mixed content');
    expect(data.lang).toBe('de');
    expect(data.canonical).toBe('https://example.com/canonical');
    expect(data.canonicalCount).toBe(2);
    expect(data.wordCount).toBe(9);
    expect(data.mixedContent).toEqual(['http://cdn.example.com/a.js', 'http://img.example.com/x.png', 'http://cdn.example.com/a.css']);
    expect(data.internalLinks).toEqual([{ url: 'https://example.com/dir/page', anchor: 'Rel', rel: '', nofollow: false }]);
    expect(data.externalLinks).toEqual([{ url: 'https://other.example.org/', anchor: 'Out', rel: 'sponsored nofollow', nofollow: true }]);
    expect(data.twitter).toEqual({ 'twitter:card': 'summary' });
    expect(data.openGraph).toEqual({ 'og:image': 'https://example.com/i.png' });
    expect(data.structuredData).toEqual([{ types: ['WebSite'], problems: ['Item without "@type"'] }]);
    expect(data.hasMicrodata).toBe(true);
    expect(data.metaDescription).toBeNull();
  });
});
