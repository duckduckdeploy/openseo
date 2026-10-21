import type { Faq } from './pricing';

/**
 * The /best-seo-mcp-servers roundup. Licences, prices, hosting and tool counts were checked on each
 * vendor's own docs, pricing page or repository. Write only what the vendor states, "not stated"
 * otherwise, and recheck `CHECKED` and every row together. Moz is left out until its MCP can be
 * verified on moz.com.
 */
export const CHECKED = 'October 2026';

export interface SeoMcpServer {
  id: string;
  name: string;
  url: string;
  urlLabel: string;
  maker: string;
  /** As the vendor states it. */
  licence: string;
  /** One line for the table: what data the agent gets. */
  covers: string;
  runs: string;
  /** The cheapest way to use it, as listed. */
  cost: string;
  tools: string;
  summary: string;
  goodFor: string[];
  keepInMind: string[];
  ours?: boolean;
}

export const seoMcpServers: SeoMcpServer[] = [
  {
    id: 'openseo',
    name: 'OpenSEO',
    url: '/features/seo-mcp-server',
    urlLabel: 'MCP server',
    maker: 'OpenSEO',
    licence: 'MIT',
    covers: 'Keywords, SERPs to the top 100, backlinks, competitors, rank tracking, site audit, AI visibility, local, Search Console and GA4',
    runs: 'Hosted (OAuth or API key), or self-hosted with Docker',
    cost: 'Free; data billed per lookup to your own YepAPI key, no plan',
    tools: '66',
    summary:
      'Ours. One open-source server that covers what usually takes three or four: keyword research, live SERPs, backlinks and link gap, competitors, rank tracking, site audits with Lighthouse, AI visibility across ChatGPT, Gemini, Claude and Perplexity, geo-grid local rankings, and seven free tools for your own Search Console and GA4 data. Every paid tool takes a dry run and a spending ceiling.',
    goodFor: ['One server for the whole SEO workflow', 'Agents with a hard spending cap per call', 'Your own Search Console data, free'],
    keepInMind: ['Search data comes through one provider (YepAPI), not its own index', 'A young project, in active development'],
    ours: true,
  },
  {
    id: 'dataforseo',
    name: 'DataForSEO MCP',
    url: 'https://github.com/dataforseo/mcp-server-typescript',
    urlLabel: 'GitHub',
    maker: 'DataForSEO',
    licence: 'Apache-2.0',
    covers: 'Raw access to the DataForSEO APIs: SERPs, keywords, backlinks, on-page, domain analytics',
    runs: 'Hosted, or local with npx or Docker',
    cost: '$1 trial credit, then pay as you go from a $50 top-up',
    tools: '4 (a generic API request tool that reads the docs)',
    summary:
      'The data provider behind many SEO tools, with an open-source MCP server. Version 3 gives the agent the API documentation and one generic request tool, so it can call almost any DataForSEO endpoint. Powerful and cheap per call, but the agent does the work of building each request.',
    goodFor: ['Developers who want raw data at API prices', 'Custom agents that need endpoints no tool wraps'],
    keepInMind: ['The agent has to compose raw API requests', 'No rank tracking, audits or dashboards around the data'],
  },
  {
    id: 'ahrefs',
    name: 'Ahrefs MCP',
    url: 'https://docs.ahrefs.com/mcp/docs/introduction',
    urlLabel: 'Docs',
    maker: 'Ahrefs',
    licence: 'Proprietary',
    covers: 'Ahrefs data: backlinks, keywords, Site Explorer, rankings',
    runs: 'Hosted, OAuth',
    cost: 'Ahrefs plan from Lite, $129 a month',
    tools: 'Not stated',
    summary:
      'Ahrefs’ hosted MCP server, for Ahrefs customers. It reads from Ahrefs’ own index, one of the largest backlink datasets, and draws on the API units in your plan.',
    goodFor: ['Teams already paying for Ahrefs', 'Deep backlink research from Ahrefs’ index'],
    keepInMind: ['Needs an Ahrefs subscription', 'Usage draws on monthly API units; Ahrefs’ terms forbid calling it from scripts or bridges'],
  },
  {
    id: 'semrush',
    name: 'Semrush MCP',
    url: 'https://developer.semrush.com/api/basics/semrush-mcp/',
    urlLabel: 'Docs',
    maker: 'Semrush',
    licence: 'Proprietary',
    covers: 'Semrush data: keywords, domains, backlinks, Projects (read-only)',
    runs: 'Hosted, OAuth or API key',
    cost: 'SEO Classic Pro, $139.95 a month (50K API units)',
    tools: 'Not stated',
    summary: 'Semrush’s hosted MCP server, for Semrush subscribers. It reads Semrush’s keyword, domain and backlink databases, and your Projects read-only, using the API units in your plan.',
    goodFor: ['Teams already on Semrush', 'Competitive and keyword data from Semrush’s databases'],
    keepInMind: ['Needs a Semrush subscription', 'Clients outside Semrush’s supported list need approval from Semrush Support'],
  },
  {
    id: 'se-ranking',
    name: 'SE Ranking MCP',
    url: 'https://seranking.com/api/mcp/',
    urlLabel: 'Docs',
    maker: 'SE Ranking',
    licence: 'Proprietary (its Claude skills are open)',
    covers: 'Keywords, backlinks, rank tracking, site audit, local, AI visibility',
    runs: 'Hosted',
    cost: '14-day trial with 100K credits, then $50 for 250K credits',
    tools: '180+',
    summary: 'A broad hosted server from SE Ranking with over 180 tools across its data and projects, including rank tracking, audits, local and AI visibility. Credits are bought in packs.',
    goodFor: ['A very wide tool set', 'SE Ranking customers'],
    keepInMind: ['Proprietary and hosted only', 'API keys can’t be made read-only yet'],
  },
  {
    id: 'nightwatch',
    name: 'Nightwatch SEO MCP',
    url: 'https://nightwatch.io/seo-mcp/',
    urlLabel: 'Product page',
    maker: 'Nightwatch',
    licence: 'Not stated',
    covers: 'Your Nightwatch rank tracking data and reports',
    runs: 'Hosted, Bearer API key',
    cost: 'Nightwatch plan from €79 a month (its pages differ on which plans include MCP)',
    tools: 'Not stated',
    summary: 'A hosted MCP server for the Nightwatch rank tracker, so an agent can read your tracked rankings and segments.',
    goodFor: ['Nightwatch customers', 'Asking an agent about rankings you already track'],
    keepInMind: ['Needs a Nightwatch plan', 'Its MCP page says Professional and above; its pricing page says every plan'],
  },
  {
    id: 'serpstat',
    name: 'Serpstat MCP',
    url: 'https://github.com/SerpstatGlobal/serpstat-mcp-server-js',
    urlLabel: 'GitHub',
    maker: 'Serpstat',
    licence: 'MIT',
    covers: 'Serpstat data: keywords, domains, backlinks, SERPs',
    runs: 'Local with npx',
    cost: 'Serpstat Team plan, $100 a month (Individual has no API)',
    tools: '65',
    summary: 'An open-source local server for Serpstat’s API with 65 tools over its keyword, domain and backlink data.',
    goodFor: ['Serpstat customers', 'A local, open-source client'],
    keepInMind: ['Needs a Team plan or above', 'Limited to 1 request a second on Team'],
  },
  {
    id: 'mangools',
    name: 'Mangools MCP (beta)',
    url: 'https://mangools.com/mcp',
    urlLabel: 'Product page',
    maker: 'Mangools',
    licence: 'Not stated',
    covers: 'KWFinder keywords, SERPs and related Mangools data',
    runs: 'Hosted, OAuth or token',
    cost: 'Free account: 100 keyword and 100 SERP lookups once; paid plans on Mangools’ site',
    tools: 'About 35',
    summary: 'A beta hosted server for Mangools’ keyword and SERP data, with a small free allowance to try it.',
    goodFor: ['Trying keyword research in an agent for free', 'Mangools customers'],
    keepInMind: ['In beta', 'The free allowance is one-time'],
  },
  {
    id: 'keywords-everywhere',
    name: 'Keywords Everywhere MCP',
    url: 'https://keywordseverywhere.com/mcp.html',
    urlLabel: 'Product page',
    maker: 'Keywords Everywhere',
    licence: 'Not stated',
    covers: 'Keyword volumes, related keywords and backlink data',
    runs: 'Hosted, API key or OAuth',
    cost: 'Bronze, $84 a year for 100K credits (annual only)',
    tools: '14, all read-only',
    summary: 'A light hosted server over Keywords Everywhere’s credits, for volumes, related keywords and backlinks. Cheap if you already use the extension.',
    goodFor: ['Low-cost keyword volumes', 'Keywords Everywhere users'],
    keepInMind: ['No rank tracking or audits', 'Annual billing only; up to 120 calls a minute'],
  },
  {
    id: 'mcp-gsc',
    name: 'mcp-gsc (Search Console)',
    url: 'https://github.com/AminForou/mcp-gsc',
    urlLabel: 'GitHub',
    maker: 'Amin Foroutan (community)',
    licence: 'MIT',
    covers: 'Your own Google Search Console data',
    runs: 'Local with uvx or Python',
    cost: 'Free',
    tools: 'About 19',
    summary: 'The most popular community Search Console server: performance data, URL inspection and sitemaps for properties you own. Google has no official Search Console MCP.',
    goodFor: ['Free Search Console analysis in an agent', 'Running locally with your own Google credentials'],
    keepInMind: ['Your own sites only: no keyword or competitor data', 'Doesn’t work in the claude.ai browser'],
  },
  {
    id: 'similarweb',
    name: 'Similarweb MCP',
    url: 'https://www.similarweb.com/corp/ai/mcp/',
    urlLabel: 'Product page',
    maker: 'Similarweb',
    licence: 'Not stated',
    covers: 'Website traffic and market data',
    runs: 'Hosted',
    cost: 'API access on Business or Enterprise; price not stated',
    tools: '26',
    summary: 'Similarweb’s hosted server for traffic and market intelligence on any website.',
    goodFor: ['Traffic and market research at enterprise level'],
    keepInMind: ['API plans only, priced on request'],
  },
];

/** Which server for which job: one line each. */
export const pickByJob: { job: string; pick: string }[] = [
  { job: 'One server for the whole SEO workflow, no plan', pick: 'OpenSEO' },
  { job: 'Your own Search Console data, free', pick: 'OpenSEO (7 free tools) or mcp-gsc' },
  { job: 'You already pay for Ahrefs or Semrush', pick: 'Their own MCP, on your plan' },
  { job: 'Raw API data for a custom agent', pick: 'DataForSEO MCP' },
  { job: 'The widest tool set on one vendor', pick: 'SE Ranking MCP' },
  { job: 'Cheap keyword volumes', pick: 'Keywords Everywhere or Mangools (free allowance)' },
];

export const seoMcpFaqs: Faq[] = [
  {
    question: 'What is an SEO MCP server?',
    answer: [
      'A server that gives an AI agent SEO tools through the [Model Context Protocol](/glossary/mcp). Once connected, Claude, ChatGPT, Cursor or another MCP client can look up keyword volumes, read live Google results, check backlinks or your Search Console data, and act on what it finds, from one instruction.',
    ],
  },
  {
    question: 'What is the best SEO MCP server?',
    answer: [
      'There is no single best one; it depends on what you already pay for. If you are on Ahrefs or Semrush, use their MCP with your plan. For raw data in a custom agent, DataForSEO. For one server that covers keywords, SERPs, backlinks, rank tracking, audits, AI visibility and Search Console with no subscription, OpenSEO.',
    ],
  },
  {
    question: 'Is there a free SEO MCP server?',
    answer: [
      'The software can be free: OpenSEO, DataForSEO’s server, Serpstat’s server and mcp-gsc are open source, and OpenSEO charges nothing for its hosted server either. Search Console data is free in OpenSEO and mcp-gsc because Google doesn’t charge for it. Keyword, SERP and backlink data always comes from a paid source: a provider billed per lookup or a vendor plan.',
    ],
  },
  {
    question: 'How do I connect an SEO MCP server to Claude?',
    answer: [
      'In Claude, add a custom connector with the server’s URL (for OpenSEO, its /mcp endpoint) and sign in when asked; in Claude Code, run claude mcp add with the URL. Local servers are added to the client’s config file instead. See [Connect your agent](/docs/tutorials/agents).',
    ],
  },
  {
    question: 'How do I stop an agent from overspending on SEO data?',
    answer: [
      'Use a server that quotes before it spends and enforces a ceiling. OpenSEO’s paid tools take dry_run (price only) and max_cost_usd (refused above it), and a monthly limit stops all spending. With vendor plans, the plan’s units or credits are the limit.',
    ],
  },
];
