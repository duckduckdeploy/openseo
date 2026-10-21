import {
  BarChart3,
  Bot,
  ChartLine,
  ClipboardCheck,
  MapPin,
  Terminal,
  type LucideIcon,
} from 'lucide-react';
import { ISSUE_TYPES } from '@openseo/crawler/catalog';
import { ASSISTANT_BRANDS, type Brand } from '@/components/brand-icon';
import type { Faq } from './pricing';

/** Number of checks the site audit crawler runs, read from its catalog so the copy cannot drift. */
export const AUDIT_CHECKS = ISSUE_TYPES.length;

export interface FeatureCapability {
  title: string;
  body: string;
}

export interface FeatureCost {
  action: string;
  /** What one call returns or covers. */
  unit: string;
  /** The data provider's price at the time of writing. `null` means it is not listed on this site. */
  price: string | null;
}

export interface FeatureFact {
  value: string;
  label: string;
}

export interface Feature {
  slug: string;
  /** Short name used in navigation, cards and tables. */
  name: string;
  /** Title tag, keyword first. The " · OpenSEO" suffix is added by the template. */
  seoTitle: string;
  /** Use seoTitle as the whole title tag, without the suffix (when the suffix would pass 60 characters). */
  absoluteTitle?: boolean;
  /** Page H1: the exact head keyword, 2 to 5 words. */
  h1: string;
  /** Short line under the H1. */
  headline: string;
  /** One sentence, used on cards and under the headline. */
  summary: string;
  /** Meta description, 120 to 155 characters. */
  description: string;
  /** H2 of the "what it does" section, keyword-led. */
  whatTitle: string;
  /** Glossary slugs shown as "Related SEO terms". */
  glossary: string[];
  icon: LucideIcon;
  /** "What it does": one or two short paragraphs. */
  what: string[];
  /** "What you can do". */
  capabilities: FeatureCapability[];
  /** Optional row of figures shown under the headline. */
  facts?: FeatureFact[];
  /** "What each action costs". */
  costs: FeatureCost[];
  costNote?: string;
  /** Logos of the services or assistants it works with, shown under the headline. */
  worksWith?: Brand[];
  /** Questions answered on the page, also published as FAQPage structured data. */
  faqs?: Faq[];
}

export const UNLISTED_PRICE_LABEL = 'Listed in Settings and usage';

export const features: Feature[] = [
  {
    slug: 'keyword-rank-tracker',
    seoTitle: 'Open Source Rank Tracker - Self Host & 100% Free',
    h1: 'Open Source Rank Tracker',
    description: 'Track Google rankings on desktop and mobile by country, city or exact coordinates, from $0.02 a check, to the top 20, 50 or 100, on your schedule.',
    whatTitle: 'How keyword rank tracking works',
    glossary: ['rank-tracking', 'keyword-ranking', 'serp-features', 'serp-volatility', 'average-position', 'share-of-voice'],
    name: 'Rank tracking',
    headline: 'Rank tracking that stops paying when it finds you',
    summary:
      'Track Google positions on desktop and mobile by country, city or exact coordinates, on a daily, weekly or monthly schedule.',
    icon: ChartLine,
    what: [
      'Track where your site ranks on Google for the keywords you care about, on desktop and mobile, from a country, a city or an exact pair of coordinates.',
      'Each tracker reads the top 20, 50 or 100 results per check. Top 20 covers the first two pages from $0.02 a keyword; top 100 shows your position wherever it is, and every competitor around you. Checks run in the background on the schedule you pick, or right away when you click.',
    ],
    capabilities: [
      {
        title: 'Desktop and mobile',
        body: 'Track Google results for either device, or both.',
      },
      {
        title: 'Precise locations',
        body: 'Check from a country, a city or exact coordinates.',
      },
      {
        title: 'Schedules you choose, or now',
        body: 'Checks run daily, weekly or monthly in the background, and any time you click Check rankings now.',
      },
      {
        title: 'Competitor positions',
        body: 'Competitor positions are captured from the same results as your own check.',
      },
      {
        title: 'SERP feature detection',
        body: 'See which SERP features appear on the results page for each keyword.',
      },
      {
        title: 'Top 20, 50 or 100',
        body: 'Pick the depth per tracker: two pages for daily tracking on a budget, or ten so a keyword on page four is tracked as closely as one on page one.',
      },
      {
        title: 'History that stays',
        body: 'Remove a keyword and its history is kept. Add it back and every earlier position returns with it.',
      },
    ],
    facts: [
      { value: '$0.02', label: 'per check, top 20' },
      { value: '2', label: 'devices' },
      { value: '3', label: 'schedules' },
    ],
    costs: [
      { action: 'Rank check, top 20', unit: 'One keyword and device', price: '$0.02' },
      { action: 'Rank check, top 50', unit: 'One keyword and device', price: '$0.05' },
      { action: 'Rank check, top 100', unit: 'One keyword and device', price: '$0.10' },
    ],
    costNote:
      '100 keywords on desktop checked daily cost about $60 a month at the top 20, or $300 at the top 100. Checked weekly: about $9 or $43.',
  },
  {
    slug: 'search-console-dashboard',
    seoTitle: 'Google Search Console Dashboard with GA4 Data',
    h1: 'Google Search Console dashboard',
    description: 'Connect Google Search Console and GA4 read-only. Find striking-distance queries at positions 5 to 20 and the pages most worth improving. Free.',
    whatTitle: 'How the Search Console dashboard works',
    glossary: ['google-search-console', 'google-analytics-4', 'striking-distance-keywords', 'impressions', 'click-through-rate', 'average-position'],
    worksWith: ['googlesearchconsole', 'googleanalytics'],
    name: 'Search performance',
    headline: 'Your own Google data, turned into a to-do list',
    summary:
      'Connect Google Search Console and Analytics read-only to find queries one push from page one and pages worth improving first. Free.',
    icon: BarChart3,
    what: [
      'Rankings data says where you could be. Search Console says where you are: the queries people actually typed, how often you showed up and how often they clicked. Connect it read-only, along with Google Analytics if you use it.',
      'OpenSEO turns that into work to do: queries sitting at positions 5 to 20, and pages scored by where a push is most worth it, weighing demand, the value of their visits and how close they are to the top.',
    ],
    capabilities: [
      {
        title: 'Striking-distance queries',
        body: 'Each query’s best page at positions 5 to 20, by impressions. Save them as keywords in one click.',
      },
      {
        title: 'Opportunity scores',
        body: 'Pages at positions 4 to 20 scored 0 to 100 on demand, the value of their visits from GA4, and reachability.',
      },
      {
        title: 'Period comparisons',
        body: 'Clicks, impressions, CTR and average position against the period before.',
      },
      {
        title: 'Organic traffic from GA4',
        body: 'Sessions, engagement, key events and revenue from search, and the pages visitors land on.',
      },
      {
        title: 'Read-only and separate',
        body: 'Search Console and Analytics are separate, read-only permissions. Nothing Google returns is stored.',
      },
    ],
    facts: [
      { value: '$0', label: 'Google data is free' },
      { value: '16', label: 'months of history' },
    ],
    costs: [{ action: 'Search Console and Analytics reports', unit: 'Any view, any period', price: 'Free' }],
    costNote: 'Google’s data is free, and nothing here is billed.',
  },
  {
    slug: 'site-audit',
    seoTitle: 'Site Audit - Open Source & 100% Free SEO Audit',
    h1: 'Open Source Technical site audit',
    description: `Crawl your site for free with ${AUDIT_CHECKS} technical SEO checks and a health score: redirects, canonicals, indexability, sitemaps, hreflang. Plus Lighthouse.`,
    whatTitle: 'How the site audit works',
    glossary: ['seo-audit', 'technical-seo', 'crawling', 'canonical-tag', 'redirect-chain', 'core-web-vitals'],
    name: 'Site audit',
    headline: 'Technical audits from our own crawler, plus Lighthouse',
    summary:
      `A free crawler with ${AUDIT_CHECKS} technical checks and a health score, and Lighthouse on mobile or desktop with the failed audits listed.`,
    icon: ClipboardCheck,
    what: [
      `OpenSEO has its own crawler. It runs ${AUDIT_CHECKS} technical checks across your site and rolls the result into a health score.`,
      'For page performance, run Lighthouse on mobile or desktop. The report lists the audits that failed, so you know what to fix.',
    ],
    capabilities: [
      {
        title: `${AUDIT_CHECKS} technical checks`,
        body: `The crawler checks your pages for ${AUDIT_CHECKS} kinds of technical issue: access, redirects, indexability, canonicals, content, duplicates, links, sitemaps, hreflang, structured data and security headers.`,
      },
      {
        title: 'Health score',
        body: 'One score that sums up the technical state of the site.',
      },
      {
        title: 'Lighthouse, mobile or desktop',
        body: 'Run Lighthouse for either device.',
      },
      {
        title: 'Failed audits, most serious first',
        body: 'Each Lighthouse run rates every failed audit critical, warning or notice by the time it would save, so you fix what matters first.',
      },
    ],
    facts: [
      { value: String(AUDIT_CHECKS), label: 'technical checks' },
      { value: '$0.05', label: 'per Lighthouse run' },
    ],
    costs: [
      { action: 'Lighthouse', unit: 'One run, mobile or desktop', price: '$0.05' },
      { action: 'Site crawl', unit: 'Per crawl, plain HTML', price: 'Free' },
      { action: 'JavaScript rendering', unit: 'Per page rendered, optional', price: '$0.02' },
    ],
  },
  {
    slug: 'ai-visibility-tracker',
    seoTitle: 'AI Visibility Tracker: Open Source AI Citations Tracking',
    absoluteTitle: true,
    h1: 'Open Source AI Visibility Tracker',
    description: 'Track whether ChatGPT, Gemini, Claude, Perplexity and 120+ AI models mention your brand and cite your site, prompt by prompt, over time.',
    whatTitle: 'How AI visibility tracking works',
    glossary: ['ai-visibility', 'generative-engine-optimization', 'ai-citations', 'prompt-tracking', 'brand-mentions', 'share-of-voice'],
    worksWith: ASSISTANT_BRANDS,
    name: 'AI visibility',
    headline: 'AI visibility tracking without a subscription',
    summary:
      'Track prompts across 120+ AI models with web search on. See whether your brand is mentioned, whether your site is cited, and where.',
    icon: Bot,
    what: [
      'People ask AI models the questions they used to type into a search box. OpenSEO lets you track prompts across more than 120 models from OpenAI, Anthropic, Google, xAI, Perplexity and more, with web search turned on.',
      'For each answer you see whether your brand is mentioned, whether your site is cited and at what position. Put models side by side to see how the answers differ.',
      'There is no plan priced by number of prompts. You pay for the runs you make, at the price shown before they start, so you can test a handful of prompts on a few models before tracking more.',
    ],
    capabilities: [
      {
        title: 'No subscription',
        body: 'Pay per prompt run, priced before it runs. Track 5 prompts or 200, on a schedule or on demand.',
      },
      {
        title: 'Prompt tracking',
        body: 'Save the prompts that matter to you and track the answers.',
      },
      {
        title: '120+ models',
        body: 'Models from OpenAI, Anthropic, Google, xAI, Perplexity and more, run with web search on.',
      },
      {
        title: 'Brand mentions',
        body: 'See whether an answer mentions your brand.',
      },
      {
        title: 'Citations and position',
        body: 'See whether your site is cited, and its position.',
      },
      {
        title: 'Side-by-side comparison',
        body: 'Compare how different models answer the same prompt.',
      },
      {
        title: 'Numbers you can trust',
        body: 'Prompts that name your brand and failed answers are left out of the rates, and a change is only shown between runs that asked the same things.',
      },
    ],
    facts: [{ value: '120+', label: 'AI models' }],
    costs: [{ action: 'Prompt run', unit: 'One prompt on one model', price: null }],
  },
  {
    slug: 'local-rank-tracker',
    seoTitle: 'Local Rank Tracker - Open Source Geo-Grid Rank Tracking',
    absoluteTitle: true,
    h1: 'Open Source Local Rank Tracker',
    description: 'Map your Google Maps rankings street by street with geo-grids, look up Google Business profiles and pull reviews with owner reply rates.',
    whatTitle: 'How the local rank tracker works',
    glossary: ['geo-grid', 'local-pack', 'google-business-profile', 'local-ranking-factors', 'online-reviews', 'nap'],
    name: 'Local rank tracker',
    headline: 'Local rankings, mapped street by street',
    summary: 'Google Business profile lookups, reviews and geo-grid rank maps.',
    icon: MapPin,
    what: [
      'Local results change from one block to the next. A geo-grid runs the same Maps search from a grid of points and shows your rank at each one, so you can see where you are visible and where you are not.',
      'Look up Google Business profiles and pull recent reviews, with owner replies, from the same workspace.',
    ],
    capabilities: [
      {
        title: 'Google Business profile lookups',
        body: 'Load the live listing: address, phone, website, hours, categories, rating, photos and amenities, checked against what a complete profile needs.',
      },
      {
        title: 'Reviews on demand',
        body: 'Pull up to 150 recent Google reviews at a time, with the rating mix and the owner reply rate.',
      },
      {
        title: 'Geo-grid rank maps',
        body: 'Map local rankings across a grid of points. A 5×5 grid is 25 Maps searches.',
      },
    ],
    facts: [
      { value: '$0.07', label: 'per Maps search' },
      { value: '$1.75', label: '5×5 geo-grid' },
    ],
    costs: [
      { action: 'Maps search', unit: 'One search', price: '$0.07' },
      { action: 'Geo-grid', unit: '5×5 grid, 25 Maps searches', price: '$1.75' },
      { action: 'Business profile lookup', unit: 'Per lookup', price: '$0.05' },
    ],
  },
  {
    slug: 'seo-mcp-server',
    seoTitle: 'SEO MCP Server: 20+ Free SEO Tools - Fresh Data',
    h1: 'SEO MCP server and API',
    description: 'An SEO MCP server with 66 tools and a REST API. Claude, ChatGPT, Cursor and Codex can research keywords and track rankings under a spending cap.',
    whatTitle: 'How the MCP server works',
    glossary: ['mcp', 'ai-seo-agent', 'llm', 'keyword-research', 'rank-tracking'],
    worksWith: ['mcp', 'claude', 'chatgpt', 'claudecode', 'cursor', 'codex', 'geminicli'],
    name: 'MCP server and REST API',
    headline: 'SEO your AI agent can do, with a spending cap',
    summary:
      'An open-source SEO MCP server with 66 tools: keyword research, live SERPs, backlinks, rank tracking, site audits, AI visibility and your own Search Console data, for Claude, ChatGPT, Cursor and any MCP client.',
    icon: Terminal,
    what: [
      'OpenSEO is an open-source SEO MCP server and REST API. Connect Claude, ChatGPT, Cursor, Codex, Gemini CLI or any MCP client, and your agent can research keywords, check live Google results, analyse backlinks and competitors, track rankings, audit a site, check AI visibility and read your Google Search Console and Analytics data. One server covers what usually takes three or four separate MCP servers.',
      'It is free: OpenSEO charges nothing for the software, the hosted app or the MCP server. Search data is billed per lookup by the data provider to your own YepAPI key, with no subscription. Agents spend real money, so every paid tool can price itself first with a dry run and takes a ceiling: a call that could cost more is refused before anything is spent. Connecting takes a couple of minutes.',
    ],
    facts: [
      { value: '66', label: 'MCP tools' },
      { value: '7', label: 'free Search Console and Analytics tools' },
      { value: '$0', label: 'OpenSEO fee, bring your own key' },
    ],
    capabilities: [
      {
        title: '29 research tools',
        body: 'Keyword overview, ideas and difficulty, live Google SERPs to the top 100, domain overview, backlinks and link gap, competitors, page analysis, AI Overviews and Google Maps rankings, in any country or city.',
      },
      {
        title: 'Search Console MCP, free',
        body: 'Seven free tools read your own Google Search Console and GA4 data: clicks and impressions, queries and pages, URL inspection, landing pages and the pages most worth a push.',
      },
      {
        title: 'Rank tracking and audits',
        body: `Create rank trackers, run checks to the top 20, 50 or 100, start site audits with ${AUDIT_CHECKS} technical checks and Lighthouse, and read the issues back.`,
      },
      {
        title: 'AI visibility',
        body: 'Ask ChatGPT, Gemini, Claude, Perplexity and more the questions your customers ask, and see whether your brand is mentioned and cited.',
      },
      {
        title: 'Spending ceilings and dry runs',
        body: 'Every paid tool takes max_cost_usd and dry_run, so an agent can quote the price first and cannot spend more than you agreed.',
      },
      {
        title: 'Open source, self-hostable',
        body: 'MIT licensed. Use the hosted server at {API_URL}/mcp or run the whole stack on your own machine with Docker.',
      },
      {
        title: 'OAuth or API keys',
        body: 'Clients that support MCP sign-in connect with OAuth; others use an API key from the app settings (oseo_…) as a Bearer token.',
      },
      {
        title: 'Agent skills',
        body: 'Ready-made skills for Claude Code and other agents: SEO coach, site audit, keyword research, competitor analysis, Search Console review and local SEO.',
      },
    ],
    costs: [
      { action: 'MCP server and REST API access', unit: 'OpenSEO fee', price: '$0.00' },
      { action: 'Search Console and Analytics tools', unit: 'Per call', price: '$0.00' },
      { action: 'Research, rank and audit tools', unit: 'Per action', price: 'Same as in the app' },
    ],
    costNote:
      'API and MCP access cost nothing. An agent pays the data provider the same for a lookup as you do in the app, from your own key, and never more than the ceiling you give it.',
    faqs: [
      {
        question: 'What is the best SEO MCP server?',
        answer: [
          'It depends on what your agent needs. If you want one server that covers keyword research, live SERPs, backlinks, rank tracking, site audits, AI visibility and your Search Console data, OpenSEO does all of it with 66 tools, is open source, and charges no subscription: you pay the data provider per lookup from your own key.',
          'If you already pay for Ahrefs or Semrush, their own MCP servers use the data in your plan. Raw data APIs such as DataForSEO suit developers who want to build their own tools. See [the best SEO MCP servers compared](/best-seo-mcp-servers).',
        ],
      },
      {
        question: 'Is there a free Google Search Console MCP server?',
        answer: [
          'Yes. OpenSEO’s MCP server has seven free Search Console and Analytics tools: search performance against the previous period, rows by query, page, country and device, URL inspection, GA4 overview and landing pages, and the pages at positions 4 to 20 most worth improving. You connect Google once in the app; the tools never spend anything. See [Use your Search Console and Analytics data](/docs/tutorials/search-console).',
        ],
      },
      {
        question: 'How do I do SEO with Claude?',
        answer: [
          'Connect OpenSEO to Claude (Claude.ai, Claude Desktop or Claude Code) as an MCP server, then ask in plain words: "find low-difficulty keywords for emergency plumbing in Austin under $0.20", "why did my traffic drop last month?", or "audit my site and give me the three fixes that matter". Claude calls the tools, quotes paid calls first and stays under your limit. See [Connect your agent](/docs/tutorials/agents).',
        ],
      },
      {
        question: 'Is OpenSEO an alternative to the Ahrefs or Semrush MCP?',
        answer: [
          'Yes, for most SEO work an agent does: keyword research, SERPs, backlinks, competitors, rank tracking and audits. Ahrefs and Semrush offer MCP servers for their own customers on their plans; OpenSEO is open source, has no plan, and adds rank tracking, site audits, AI visibility and your own Search Console data in the same server. See [OpenSEO vs Ahrefs](/compare/ahrefs-alternative) and [OpenSEO vs Semrush](/compare/semrush-alternative).',
        ],
      },
      {
        question: 'Which AI clients work with it?',
        answer: [
          'Any client that connects to a remote MCP server over HTTP: Claude, Claude Code, ChatGPT, Cursor, VS Code, Codex, Gemini CLI, Windsurf and OpenCode, among others. Clients with MCP sign-in use OAuth; the rest use an API key.',
        ],
      },
      {
        question: 'Can an AI agent overspend?',
        answer: [
          'No. Every paid tool accepts dry_run, which returns the price without running anything, and max_cost_usd, a ceiling: a call that could cost more is refused before anything is spent. A monthly limit in Settings stops all spending once it is reached, by you or by any agent.',
        ],
      },
    ],
  },
];

export function getFeature(slug: string): Feature | undefined {
  return features.find((feature) => feature.slug === slug);
}
