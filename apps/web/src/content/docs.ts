export type DocSection = 'Start here' | 'Tutorials' | 'Run it yourself' | 'Reference';

export interface DocPage {
  /** Path under /docs, e.g. "tutorials/rank-tracking". */
  slug: string;
  /** Short label for navigation, cards and previous/next links. */
  title: string;
  /** Page H1: keyword-led, "How to …" on tutorials. */
  h1: string;
  /** Title tag, keyword first. The " · OpenSEO" suffix is added by the template. */
  seoTitle: string;
  /** Meta description and the intro under the H1. */
  description: string;
  section: DocSection;
}

export const docSections: DocSection[] = ['Start here', 'Tutorials', 'Run it yourself', 'Reference'];

/** Every docs page, in reading order. Navigation, previous/next links and the sitemap come from this list. */
export const docPages: DocPage[] = [
  {
    slug: 'getting-started',
    title: 'Getting started',
    h1: 'Getting started with OpenSEO',
    seoTitle: 'Getting Started with OpenSEO',
    description: 'Get started with OpenSEO: create a YepAPI account, paste your key, run your first keyword research and set a monthly spending limit.',
    section: 'Start here',
  },
  {
    slug: 'how-it-works',
    title: 'How OpenSEO works',
    h1: 'How OpenSEO works',
    seoTitle: 'How OpenSEO Works: Projects, Data and Background Runs',
    description: 'How OpenSEO works: projects and markets, where the SEO data comes from, what runs in the background, what is stored and how it is secured.',
    section: 'Start here',
  },
  {
    slug: 'costs-and-limits',
    title: 'Costs, caching and limits',
    h1: 'Costs, caching and spending limits',
    seoTitle: 'SEO Data Costs, Caching and Spending Limits',
    description: 'How prices are worked out, when results are free, where to see what you spent, and the controls that stop spending.',
    section: 'Start here',
  },
  {
    slug: 'tutorials/seo-tools',
    title: 'The SEO tools, screen by screen',
    h1: 'SEO tools guide, screen by screen',
    seoTitle: 'SEO Tools Guide: Every Screen Explained',
    description: 'A guide to every OpenSEO tool: keyword overview, keyword ideas, SERP checker, backlinks, competitors, AI visibility and local rank grids, screen by screen.',
    section: 'Tutorials',
  },
  {
    slug: 'tutorials/keyword-research',
    title: 'Build a keyword list',
    h1: 'How to do keyword research for SEO',
    seoTitle: 'How to Do Keyword Research for SEO (Step by Step)',
    description: 'How to do keyword research: find keywords from a seed term, filter by volume and difficulty, save the ones worth targeting and keep them fresh.',
    section: 'Tutorials',
  },
  {
    slug: 'tutorials/rank-tracking',
    title: 'Track your rankings',
    h1: 'How to check and track keyword rankings',
    seoTitle: 'How to Check and Track Keyword Rankings on Google',
    description: 'How to track keyword rankings on Google: set up a rank tracker for a country, city or exact point, price a check, run it and read the changes.',
    section: 'Tutorials',
  },
  {
    slug: 'tutorials/competitor-research',
    title: 'Size up a competitor',
    h1: 'How to do SEO competitor analysis',
    seoTitle: 'How to Do SEO Competitor Analysis (Step by Step)',
    description: 'How to do SEO competitor analysis: find your organic competitors, size them up, run a keyword gap and see the backlinks behind their rankings.',
    section: 'Tutorials',
  },
  {
    slug: 'tutorials/site-audit',
    title: 'Audit a site',
    h1: 'How to do a technical SEO audit',
    seoTitle: 'How to Do an SEO Audit: Technical SEO Checklist',
    description: 'How to run a technical SEO audit: crawl your site for free, fix issues by severity, track them audit to audit and export the fixes for a coding agent.',
    section: 'Tutorials',
  },
  {
    slug: 'tutorials/ai-visibility',
    title: 'Measure AI visibility',
    h1: 'How to track AI visibility in ChatGPT and Gemini',
    seoTitle: 'AI Visibility: How to Track Your Brand in ChatGPT',
    description: 'How to track AI visibility: see whether ChatGPT, Claude, Gemini and Perplexity mention and cite your brand for the questions buyers ask.',
    section: 'Tutorials',
  },
  {
    slug: 'tutorials/search-console',
    title: 'Use your Search Console and Analytics data',
    h1: 'How to use Google Search Console for SEO',
    seoTitle: 'Google Search Console for SEO: How to Use It',
    description: 'How to use Google Search Console and GA4 for SEO: connect read-only, find striking-distance queries and rank pages by where a push pays off.',
    section: 'Tutorials',
  },
  {
    slug: 'tutorials/local-seo',
    title: 'Map local rankings',
    h1: 'Local rank tracking with a geo-grid',
    seoTitle: 'Local Rank Tracking: Map Rankings with a Geo-Grid',
    description: 'How to track local rankings: find your Google Business Profile, check its reviews and run a geo-grid to map your Google Maps rank.',
    section: 'Tutorials',
  },
  {
    slug: 'tutorials/agents',
    title: 'Work with an AI agent',
    h1: 'How to do SEO with Claude and other AI agents',
    seoTitle: 'Claude SEO: How to Do SEO with an AI Agent',
    description: 'How to do SEO with an AI agent: hand keyword research and rank tracking to Claude, Cursor or Codex over MCP, with a spending cap on every call.',
    section: 'Tutorials',
  },
  {
    slug: 'self-hosting',
    title: 'Self-hosting',
    h1: 'Self-host OpenSEO with Docker',
    seoTitle: 'How to Self-Host OpenSEO with Docker',
    description: 'How to self-host OpenSEO with Docker: run the open-source SEO suite on your own computer or a cloud server, with HTTPS for your own domain.',
    section: 'Run it yourself',
  },
  {
    slug: 'google-setup',
    title: 'Set up Google sign-in',
    h1: 'Set up Google sign-in for Search Console',
    seoTitle: 'Set Up Google OAuth for Search Console and GA4',
    description: 'Create the Google OAuth client that lets users connect Search Console and Analytics to your install.',
    section: 'Run it yourself',
  },
  {
    slug: 'mcp',
    title: 'Connect your agent',
    h1: 'Connect your AI agent to OpenSEO',
    seoTitle: 'Connect Claude, ChatGPT or Cursor to the SEO MCP Server',
    description: 'Connect Claude, ChatGPT, Cursor, Codex or Gemini to the OpenSEO MCP server: sign-in, a setup prompt, SEO skills and the Claude Code plugin.',
    section: 'Reference',
  },
  {
    slug: 'mcp-tools',
    title: 'MCP tools',
    h1: 'SEO MCP tools reference',
    seoTitle: 'SEO MCP Tools: All 67 Tools Explained',
    description: 'All 69 tools of the OpenSEO SEO MCP server: keyword research, rank tracking, site audits, AI visibility and Search Console, and which ones spend.',
    section: 'Reference',
  },
  {
    slug: 'rest-api',
    title: 'REST API',
    h1: 'SEO REST API reference',
    seoTitle: 'SEO REST API Reference',
    description: 'The OpenSEO SEO REST API: authentication, the response envelope, every route for keywords, rankings and audits, and how dry runs and ceilings work.',
    section: 'Reference',
  },
  {
    slug: 'audit-checks',
    title: 'Site audit checks',
    h1: 'Site audit checks',
    seoTitle: 'Technical SEO Audit Checks, Explained',
    description: 'Every issue the crawler reports, its severity, what it means and how to fix it, and how the health score is worked out.',
    section: 'Reference',
  },
  {
    slug: 'errors',
    title: 'Errors and troubleshooting',
    h1: 'Errors and troubleshooting',
    seoTitle: 'Errors and Troubleshooting',
    description: 'OpenSEO errors and troubleshooting: what each error code means, from missing keys and spending limits to Google connection and site audit problems.',
    section: 'Reference',
  },
];

export const docsIn = (section: DocSection) => docPages.filter((doc) => doc.section === section);

export function getDoc(slug: string): DocPage {
  const doc = docPages.find((page) => page.slug === slug);
  if (!doc) throw new Error(`Unknown doc page: ${slug}`);
  return doc;
}
