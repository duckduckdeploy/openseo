import type { Faq } from './pricing';

/**
 * The /open-source-seo-tools roundup. Licences, activity and features were checked on each project's
 * own repository or site (GitHub API for licence and releases). Keep claims to what the project says
 * itself, and recheck `CHECKED` and every row together.
 */
export const CHECKED = 'October 2026';

export interface OpenSourceTool {
  id: string;
  name: string;
  url: string;
  urlLabel: string;
  /** SPDX identifier as the project states it. */
  licence: string;
  /** One line for the table. */
  what: string;
  runs: string;
  /** Where its data comes from, including any paid service it needs. */
  data: string;
  /** Latest release or commit, as checked. */
  activity: string;
  summary: string;
  goodFor: string[];
  keepInMind: string[];
  ours?: boolean;
}

export const openSourceTools: OpenSourceTool[] = [
  {
    id: 'openseo',
    name: 'OpenSEO',
    url: 'https://github.com/duckduckdeploy/openseo',
    urlLabel: 'GitHub',
    licence: 'MIT',
    what: 'Full suite: keywords, rank tracking, backlinks, site audit, AI visibility, local, Search Console',
    runs: 'Docker, or hosted at openseo.gg',
    data: 'Own crawler; your Search Console and GA4; search data per lookup through YepAPI',
    activity: 'Active, October 2026',
    summary:
      'Ours. An all-in-one SEO suite you can self-host with one Docker compose file: keyword research, rank tracking to the top 20, 50 or 100, backlinks and link gap, a site audit with Lighthouse, AI visibility across 120+ models, geo-grid local rankings and Search Console reports, with an MCP server and REST API for AI agents.',
    goodFor: ['One tool instead of five', 'AI agents, with a spending cap on every call', 'Free checks on openseo.gg with no account'],
    keepInMind: ['Search data is paid per lookup, shown before it runs', 'No backlink index of its own: links come from the data provider'],
    ours: true,
  },
  {
    id: 'serpbear',
    name: 'SerpBear',
    url: 'https://github.com/towfiqi/serpbear',
    urlLabel: 'GitHub',
    licence: 'MIT',
    what: 'Rank tracker with keyword ideas and Search Console data per keyword',
    runs: 'Docker (Next.js and SQLite)',
    data: 'A SERP scraping API you choose (mostly paid) or your own proxies; Google Ads test account for ideas',
    activity: 'v3.1.0, March 2026',
    summary: 'A focused, well-liked self-hosted rank tracker. It checks Google positions through the scraping service you connect, sends email alerts and shows Search Console clicks next to each keyword.',
    goodFor: ['Simple rank tracking on a small server', 'Email alerts when positions change'],
    keepInMind: ['Needs a SERP scraping service or proxies', 'No backlinks or site audit'],
  },
  {
    id: 'bisibility',
    name: 'bisibility',
    url: 'https://github.com/CorgiCorner/bisibility',
    urlLabel: 'GitHub',
    licence: 'AGPL-3.0',
    what: 'Rank tracking, keyword research, backlinks and AI answer tracking',
    runs: 'Self-hosted (Postgres, worker, Temporal) or hosted beta',
    data: 'DataForSEO and SerpAPI, with your own keys',
    activity: 'v0.37.0, October 2026',
    summary: 'A young, fast-moving self-hostable SEO platform with rank tracking, keyword research, backlinks and AI answer tracking, plus a REST API, CLI and webhooks.',
    goodFor: ['Teams already holding DataForSEO and SerpAPI keys', 'Workflows built on its API and webhooks'],
    keepInMind: ['AGPL licence', 'Several services to run (Postgres, a worker and Temporal)'],
  },
  {
    id: 'seo-panel',
    name: 'Seo Panel',
    url: 'https://github.com/seopanel/Seo-Panel',
    urlLabel: 'GitHub',
    licence: 'GPL-2.0',
    what: 'Long-running PHP control panel for SEO across many sites',
    runs: 'PHP and MySQL, or Docker',
    data: 'Moz API key for backlinks and authority; Google APIs for Search Console, Analytics and PageSpeed',
    activity: 'Tag 7.0.0, October 2026',
    summary: 'One of the oldest open-source SEO panels, still maintained: keyword positions, a site auditor and sitemap generator, backlink and authority checks through Moz, Search Console and Analytics, with a plugin system.',
    goodFor: ['Managing many websites from one PHP install', 'Classic hosting without containers'],
    keepInMind: ['Backlink data needs a Moz API key', 'An older interface'],
  },
  {
    id: 'seonaut',
    name: 'SEOnaut',
    url: 'https://github.com/StJudeWasHere/seonaut',
    urlLabel: 'GitHub',
    licence: 'MIT',
    what: 'Web-based site audit: crawls a site and reports issues by severity',
    runs: 'Docker (Go and MySQL), or a hosted version',
    data: 'Its own crawl',
    activity: 'Active, October 2026',
    summary: 'A clean self-hosted site audit tool. It crawls your site and lists broken links, redirect loops, missing and duplicate meta tags, heading problems and more, sorted by severity.',
    goodFor: ['A technical audit with no data costs', 'Teams who want results in a browser, not a desktop app'],
    keepInMind: ['Audit only: no keyword or ranking data'],
  },
  {
    id: 'librecrawl',
    name: 'LibreCrawl',
    url: 'https://github.com/PhialsBasement/LibreCrawl',
    urlLabel: 'GitHub',
    licence: 'MIT',
    what: 'Multi-user web crawler for SEO audits, with JavaScript rendering',
    runs: 'Docker or a start script (Python)',
    data: 'Its own crawl; optional PageSpeed Insights',
    activity: 'Active, September 2026',
    summary: 'A self-hosted crawler pitched as a Screaming Frog alternative: titles, meta, headings, links and issue detection, JavaScript rendering through Playwright, and exports to CSV, Excel, JSON and XML.',
    goodFor: ['Crawling JavaScript sites', 'Exporting crawl data for your own analysis'],
    keepInMind: ['Crawler only', 'A young project'],
  },
  {
    id: 'siteone-crawler',
    name: 'SiteOne Crawler',
    url: 'https://github.com/janreges/siteone-crawler',
    urlLabel: 'GitHub',
    licence: 'MIT',
    what: 'Fast crawler and audit report for SEO, security, accessibility and performance',
    runs: 'Command line or desktop binary (Rust)',
    data: 'Its own crawl',
    activity: 'v2.6.1, June 2026',
    summary: 'A cross-platform crawler that produces a full audit report of a website: SEO, security headers, accessibility and performance, from one command.',
    goodFor: ['Quick one-off audits from the command line', 'CI checks before a release'],
    keepInMind: ['No dashboard or history between runs'],
  },
  {
    id: 'unlighthouse',
    name: 'Unlighthouse',
    url: 'https://github.com/harlan-zw/unlighthouse',
    urlLabel: 'GitHub',
    licence: 'MIT',
    what: 'Runs Lighthouse on every page of a site, with a web UI',
    runs: 'Command line (npx) or CI',
    data: 'Its own crawl plus local Lighthouse runs',
    activity: 'v0.19.1, October 2026',
    summary: 'Lighthouse for a whole site instead of one page: it crawls, samples similar pages and shows performance, accessibility, best-practice and SEO scores side by side.',
    goodFor: ['Core Web Vitals across a whole site', 'Catching slow templates'],
    keepInMind: ['Lab data from your machine, not field data'],
  },
  {
    id: 'lighthouse',
    name: 'Google Lighthouse',
    url: 'https://github.com/GoogleChrome/lighthouse',
    urlLabel: 'GitHub',
    licence: 'Apache-2.0',
    what: 'Audits one page for performance, accessibility, best practices and SEO',
    runs: 'Chrome DevTools, command line or Node',
    data: 'Loads the page in Chrome (lab data)',
    activity: 'v13.5.0, September 2026',
    summary: 'The audit behind PageSpeed Insights and Chrome DevTools. Many SEO tools, OpenSEO included, run it under the hood.',
    goodFor: ['Checking one page in depth', 'Performance budgets in CI'],
    keepInMind: ['One page at a time', 'Basic SEO checks only'],
  },
  {
    id: 'openserp',
    name: 'OpenSERP',
    url: 'https://github.com/karust/openserp',
    urlLabel: 'GitHub',
    licence: 'MIT',
    what: 'Self-hosted SERP API for Google, Bing, DuckDuckGo and three more engines',
    runs: 'Docker or a Go binary',
    data: 'Scrapes the search engines live from your machine (proxies supported)',
    activity: 'v0.8.12, July 2026',
    summary: 'A building block rather than a tool: a local API that returns organic results, answer boxes, People Also Ask and AI summaries from six search engines, for your own rank tracker or agent.',
    goodFor: ['Developers building their own SEO tools', 'SERP data without a per-search fee'],
    keepInMind: ['Scraping search engines can be blocked, so expect to need proxies at volume'],
  },
  {
    id: 'plausible',
    name: 'Plausible Analytics',
    url: 'https://github.com/plausible/analytics',
    urlLabel: 'GitHub',
    licence: 'AGPL-3.0',
    what: 'Lightweight, cookie-free analytics with Search Console keywords',
    runs: 'Docker (Community Edition) or hosted',
    data: 'Its own tracking script; keywords from your Search Console',
    activity: 'v3.2.1, May 2026',
    summary: 'Privacy-friendly analytics that shows the Google search terms behind your traffic once Search Console is connected, without cookies or a consent banner.',
    goodFor: ['Organic traffic without Google Analytics', 'Sites that want no cookie banner'],
    keepInMind: ['Analytics, not research: no rankings or keyword volumes'],
  },
  {
    id: 'yoast',
    name: 'Yoast SEO',
    url: 'https://github.com/Yoast/wordpress-seo',
    urlLabel: 'GitHub',
    licence: 'GPL-3.0',
    what: 'WordPress plugin for titles, meta, schema, sitemaps and content checks',
    runs: 'WordPress plugin',
    data: 'Your own content',
    activity: '28.7, October 2026',
    summary: 'The best-known WordPress SEO plugin: titles and meta descriptions, schema, XML sitemaps and readability and keyphrase checks while you write.',
    goodFor: ['On-page SEO on WordPress sites'],
    keepInMind: ['On-page only', 'Premium features are a separate paid plugin'],
  },
  {
    id: 'rank-math',
    name: 'Rank Math',
    url: 'https://github.com/rankmath/seo-by-rank-math',
    urlLabel: 'GitHub',
    licence: 'GPL-3.0-or-later',
    what: 'WordPress plugin for on-page SEO, schema and Search Console data',
    runs: 'WordPress plugin',
    data: 'Your own content; your Search Console and Analytics',
    activity: '1.0.280, October 2026',
    summary: 'A popular Yoast alternative for WordPress with on-page checks, schema, redirects and Search Console data inside the dashboard.',
    goodFor: ['On-page SEO and schema on WordPress'],
    keepInMind: ['On-page only', 'Pro features are a separate paid plugin'],
  },
  {
    id: 'mcp-gsc',
    name: 'mcp-gsc',
    url: 'https://github.com/AminForou/mcp-gsc',
    urlLabel: 'GitHub',
    licence: 'MIT',
    what: 'MCP server that lets AI assistants query your Search Console',
    runs: 'Local MCP server (Python)',
    data: 'Google Search Console API, with your Google account',
    activity: 'Active, September 2026',
    summary: 'Gives Claude and other assistants your Search Console: search analytics, URL inspection, indexing checks and sitemaps, all from a chat.',
    goodFor: ['Asking an AI agent about your own search traffic'],
    keepInMind: ['Your own site only: no competitor or keyword volume data'],
  },
  {
    id: 'dataforseo-mcp',
    name: 'DataForSEO MCP Server',
    url: 'https://github.com/dataforseo/mcp-server-typescript',
    urlLabel: 'GitHub',
    licence: 'Apache-2.0',
    what: 'The data provider’s own MCP server for keyword, SERP and backlink APIs',
    runs: 'npx, or a hosted endpoint',
    data: 'DataForSEO, a paid API on your account',
    activity: 'v3.1.3, October 2026',
    summary: 'Connects an AI agent straight to DataForSEO’s APIs: keywords, SERPs, backlinks and on-page data, billed to your DataForSEO account.',
    goodFor: ['Developers who want raw SEO data inside an agent'],
    keepInMind: ['Raw API calls: no projects, history or spending caps of its own'],
  },
];

export const stack: { job: string; tools: string; cost: string }[] = [
  { job: 'Your own search traffic', tools: 'Search Console in OpenSEO, Plausible or mcp-gsc', cost: 'Free (Google)' },
  { job: 'Site audit', tools: 'OpenSEO, SEOnaut, LibreCrawl, SiteOne Crawler', cost: 'Free (your own crawl)' },
  { job: 'Page speed', tools: 'Lighthouse, Unlighthouse', cost: 'Free (runs locally)' },
  { job: 'On-page, WordPress', tools: 'Yoast SEO, Rank Math', cost: 'Free' },
  { job: 'Rank tracking', tools: 'OpenSEO, SerpBear, bisibility', cost: 'A SERP data provider or proxies, from about $0.02 a check' },
  { job: 'Keyword research', tools: 'OpenSEO, bisibility', cost: 'A keyword data provider, paid per lookup' },
  { job: 'Backlinks', tools: 'OpenSEO, bisibility, Seo Panel', cost: 'A paid link index: no open-source one is maintained' },
];

export const openSourceFaqs: Faq[] = [
  {
    question: 'Are open-source SEO tools really free?',
    answer: [
      'The software is. Data that has to be collected at internet scale, like keyword volumes, rankings for keywords you don’t own and backlinks, is not: every open-source tool that shows it gets it from a paid provider or by scraping search engines through proxies. What is free is everything about your own site: crawling it, auditing it, page speed and your Search Console data.',
    ],
  },
  {
    question: 'Is there an open-source alternative to Ahrefs or Semrush?',
    answer: [
      'Yes. OpenSEO and bisibility both cover keyword research, rank tracking and backlinks in one self-hostable app, and both buy their search data from providers. OpenSEO also includes a site audit, AI visibility, local rank tracking, Search Console reports and an MCP server. Neither has a backlink index as big as Ahrefs’ own.',
    ],
  },
  {
    question: 'Which open-source tool is best for rank tracking?',
    answer: [
      'For rank tracking on its own, SerpBear is simple and proven. For rank tracking next to keyword research, backlinks and audits, OpenSEO tracks the top 20, 50 or 100 on desktop and mobile, down to a city or exact coordinates, from $0.02 a check.',
    ],
  },
  {
    question: 'Can I self-host an SEO suite?',
    answer: [
      'Yes. OpenSEO runs with one Docker compose file on your own computer or a small cloud server, with your data in your own Postgres database. The self-hosting guide covers servers, HTTPS, updates and backups.',
    ],
  },
  {
    question: 'Is there a free open-source alternative to Screaming Frog?',
    answer: [
      'For most audits, yes: SEOnaut, LibreCrawl and SiteOne Crawler crawl your site and report issues, and OpenSEO’s site audit crawls up to 5,000 pages with a health score. Screaming Frog still goes deeper on custom extraction and very large sites.',
    ],
  },
];
