import { AUDIT_CHECKS } from './features';
import type { Faq } from './pricing';

/**
 * Comparison pages. Competitor prices are list prices on monthly billing, from their public
 * pricing pages and pricing guides, checked in October 2026. Prices change: update `checked`
 * and the figures together, and never state a claim here that has not been checked.
 */
export interface Comparison {
  slug:
    | 'ahrefs-alternative'
    | 'semrush-alternative'
    | 'se-ranking-alternative'
    | 'mangools-alternative'
    | 'ubersuggest-alternative'
    | 'moz-alternative'
    | 'screaming-frog-alternative'
    | 'otterly-alternative';
  name: string;
  /** Title tag when the default ("X Alternative: OpenSEO vs X (Open Source)") passes 60 characters. */
  seoTitle?: string;
  checked: string;
  summary: string;
  /** The competitor's entry plan, as they describe it. */
  entry: { plan: string; price: string; notes: string[] };
  rows: { topic: string; them: string; us: string }[];
  /** Where they are the better choice. Said plainly. */
  chooseThem: string[];
  chooseUs: string[];
  faqs: Faq[];
}

const freeAlternative = (name: string): Faq => ({
  question: `Is OpenSEO a free ${name} alternative?`,
  answer: [
    `The software is: OpenSEO is open source under the MIT licence and free to self-host, with no seats and no plan. Search data, like keyword volumes, rankings and backlinks, is paid per lookup under a monthly limit you set, so a quiet month costs little. The crawler, the site audit and your Search Console data cost nothing.`,
  ],
});

const sharedFaqs: Faq[] = [
  {
    question: 'Is the data as good?',
    answer: [
      'OpenSEO’s search data comes from YepAPI, a provider of a large commercial SEO dataset. It covers keyword volume, rankings, backlinks and SERPs well, but the big suites run their own crawlers and keyword databases, which are larger. For most site owners the difference matters less than the price; for agencies doing link research all day it can matter more.',
    ],
  },
  {
    question: 'What does OpenSEO actually cost?',
    answer: [
      'The software is open source and free to self-host. Search data is paid per lookup: about $0.08 for a keyword search of 150 ideas, $0.02 to $0.10 for a rank check (top 20 to top 100). Tracking 100 keywords daily on desktop costs about $60 a month at the top 20.',
    ],
  },
];

export const comparisons: Comparison[] = [
  {
    slug: 'ahrefs-alternative',
    name: 'Ahrefs',
    checked: 'October 2026',
    summary: 'Ahrefs is a closed SEO suite on a monthly plan. OpenSEO is open source: you run it, own it, and pay only for the data you look up. Here is how they differ, and when Ahrefs is the better buy.',
    entry: {
      plan: 'Lite',
      price: '$129 a month',
      notes: ['1 user, 1,000 credits a month', 'Extra users $40 a month each', 'No free trial on paid plans'],
    },
    rows: [
      { topic: 'Source code', them: 'Closed', us: 'Open source (MIT), self-hostable' },
      { topic: 'Price model', them: 'Monthly plan from $129; usage counted in credits', us: 'Open-source software; data paid per lookup, from $0.01' },
      { topic: 'Users', them: 'Paid per seat beyond the first', us: 'No seats: self-host it for your whole team' },
      { topic: 'Keyword and backlink data', them: 'Own crawler and index, among the largest', us: 'A large commercial dataset, through a data provider' },
      { topic: 'Rank tracking', them: '750 tracked keywords on Lite', us: '$0.02 per keyword and device for the top 20, up to $0.10 for the top 100, on your schedule or on demand' },
      { topic: 'AI agents', them: 'Check their current plans', us: '76 MCP tools and a REST API on every install, spending capped per call' },
    ],
    chooseThem: [
      'Link building is your full-time job and you need the deepest backlink index.',
      'You want one vendor with support, training and every report built in.',
    ],
    chooseUs: [
      'You do SEO a few hours a month and a monthly plan sits idle most of it.',
      'You want an AI agent to do the research, with a hard spending cap per call.',
      'You want to own the software and your data.',
    ],
    faqs: [
      freeAlternative('Ahrefs'),
      ...sharedFaqs,
      {
        question: 'Can I move from Ahrefs?',
        answer: ['There is nothing to migrate for research: run the same searches in OpenSEO. For rank tracking, paste your keyword list into a new tracker; history starts from your first check.'],
      },
    ],
  },
  {
    slug: 'semrush-alternative',
    name: 'Semrush',
    checked: 'October 2026',
    summary: 'Semrush is a closed marketing suite on a monthly plan. OpenSEO is open source: you run it, own it, and pay only for the data you look up. Here is how they differ, and when Semrush is the better buy.',
    entry: {
      plan: 'Pro',
      price: '$139.95 a month',
      notes: ['1 user', 'Guru $249.95 and Business $499.95 a month', 'Some toolkits sold separately'],
    },
    rows: [
      { topic: 'Source code', them: 'Closed', us: 'Open source (MIT), self-hostable' },
      { topic: 'Price model', them: 'Monthly plan from $139.95', us: 'Open-source software; data paid per lookup, from $0.01' },
      { topic: 'Scope', them: 'SEO plus ads, content, social and more', us: 'SEO: keywords, ranks, backlinks, audits, AI visibility, local' },
      { topic: 'Keyword and backlink data', them: 'Own databases with long history', us: 'A large commercial dataset, through a data provider' },
      { topic: 'Rank tracking', them: '500 tracked keywords on Pro', us: '$0.02 per keyword and device for the top 20, up to $0.10 for the top 100, on your schedule or on demand' },
      { topic: 'AI agents', them: 'Check their current plans', us: '76 MCP tools and a REST API on every install, spending capped per call' },
    ],
    chooseThem: [
      'You run paid search, content and social from one place as well as SEO.',
      'You rely on years of historical data for trend analysis.',
    ],
    chooseUs: [
      'You want SEO only, without paying for the rest of a marketing suite.',
      'Your usage is uneven: some busy weeks, many quiet ones.',
      'You want an AI agent to work with your SEO data under a spending cap.',
    ],
    faqs: [freeAlternative('Semrush'), ...sharedFaqs],
  },
  {
    slug: 'se-ranking-alternative',
    name: 'SE Ranking',
    checked: 'October 2026',
    summary: 'SE Ranking is an all-in-one SEO and AI search platform on a monthly plan, with generous rank tracking. OpenSEO is open source and paid per lookup. Here is how they differ, and when SE Ranking is the better buy.',
    entry: {
      plan: 'Core',
      price: '$129 a month ($103.20 a month billed yearly)',
      notes: ['10 projects, 1 manager seat', '2,000 keywords tracked daily and 100 AI prompts', '14-day free trial, no card'],
    },
    rows: [
      { topic: 'Source code', them: 'Closed', us: 'Open source (MIT), self-hostable' },
      { topic: 'Price model', them: 'Monthly plan from $129, with add-ons for agencies and AI search', us: 'Open-source software; data paid per lookup, from $0.01' },
      { topic: 'Rank tracking', them: '2,000 keywords checked daily on Core', us: '$0.02 per keyword and device for the top 20, up to $0.10 for the top 100' },
      { topic: 'AI search', them: '100 prompts tracked daily on Core; more as an add-on', us: 'Pay per prompt run on 120+ models, priced before it runs' },
      { topic: 'Reports', them: 'Report builder; white label with the Agency Pack', us: 'CSV exports and shareable views; no white-label reports yet' },
      { topic: 'AI agents', them: 'API credits and MCP on every plan', us: '76 MCP tools and a REST API on every install, spending capped per call' },
    ],
    chooseThem: [
      'You track thousands of keywords every day: at that volume a flat plan is cheaper than paying per check.',
      'You run an agency and need white-label client reports.',
    ],
    chooseUs: [
      'You track tens or hundreds of keywords, not thousands, or check them weekly.',
      'You want the software open source and your data on your own server.',
      'Your research comes in bursts, and a monthly plan sits idle between them.',
    ],
    faqs: [freeAlternative('SE Ranking'), ...sharedFaqs],
  },
  {
    slug: 'mangools-alternative',
    name: 'Mangools',
    checked: 'October 2026',
    summary: 'Mangools (KWFinder, SERPWatcher and friends) is a low-cost, beginner-friendly SEO bundle. OpenSEO is open source and paid per lookup, with a site audit and Search Console built in. Here is how they differ.',
    entry: {
      plan: 'Basic',
      price: '$30.50 a month ($18.85 a month billed yearly)',
      notes: ['100 keyword lookups and 100 SERP lookups a day', '200 tracked keywords, updated weekly', 'Free account with 5 lookups a day; no trial of paid plans'],
    },
    rows: [
      { topic: 'Source code', them: 'Closed', us: 'Open source (MIT), self-hostable' },
      { topic: 'Price model', them: 'Monthly or yearly plan from $30.50', us: 'Open-source software; data paid per lookup, from $0.01' },
      { topic: 'Rank tracking', them: 'Weekly updates on Basic; daily only on Agency', us: 'Daily, weekly, monthly or on demand, to the top 20, 50 or 100' },
      { topic: 'Site audit', them: 'Not included', us: `Crawls up to 5,000 pages with ${AUDIT_CHECKS} checks, no data cost` },
      { topic: 'Search Console', them: 'Not built in', us: 'Search Console synced daily, with indexing in the app' },
      { topic: 'AI search', them: 'AI Search Watcher with 500 prompts on every plan', us: 'Pay per prompt run on 120+ models' },
    ],
    chooseThem: [
      'You want a fixed, low monthly price and use keyword research every day.',
      'You like KWFinder’s simple keyword-difficulty workflow and need nothing more.',
    ],
    chooseUs: [
      'You also need a site audit and your Search Console data in one place.',
      'You want daily rank tracking without moving to an agency plan.',
      'You want to self-host, or let an AI agent run the research.',
    ],
    faqs: [freeAlternative('Mangools'), ...sharedFaqs],
  },
  {
    slug: 'ubersuggest-alternative',
    name: 'Ubersuggest',
    checked: 'October 2026',
    summary: 'Ubersuggest is a low-cost, simple SEO tool sold monthly, yearly or as a lifetime licence. OpenSEO is open source and paid per lookup, with an API and MCP server. Here is how they differ.',
    entry: {
      plan: 'Individual',
      price: 'From $12 a month, as shown on its pricing page (prices may vary by region)',
      notes: ['1 website, 150 reports a day', '125 tracked keywords, updated weekly', 'Lifetime licence and a 7-day trial on monthly plans'],
    },
    rows: [
      { topic: 'Source code', them: 'Closed', us: 'Open source (MIT), self-hostable' },
      { topic: 'Price model', them: 'Monthly, yearly or lifetime licence', us: 'Open-source software; data paid per lookup, from $0.01' },
      { topic: 'Rank tracking', them: '125 keywords per project, weekly, on Individual', us: 'Daily, weekly, monthly or on demand, to the top 20, 50 or 100' },
      { topic: 'Site audit', them: '1,000 pages per project, weekly', us: `Up to 5,000 pages per audit with ${AUDIT_CHECKS} checks, no data cost` },
      { topic: 'API and agents', them: 'No API', us: '76 MCP tools and a REST API on every install' },
      { topic: 'Projects', them: 'One website on Individual; more cost extra', us: 'As many projects as you like' },
    ],
    chooseThem: [
      'You want the lowest fixed price, or a one-time lifetime licence, and only need the basics.',
      'You value the bundled training course and a very simple interface.',
    ],
    chooseUs: [
      'You manage more than one site, or want daily rank tracking.',
      'You want an API or an AI agent to work with your SEO data.',
      'You want the software open source and self-hosted.',
    ],
    faqs: [freeAlternative('Ubersuggest'), ...sharedFaqs],
  },
  {
    slug: 'moz-alternative',
    name: 'Moz Pro',
    checked: 'October 2026',
    summary: 'Moz Pro is an established SEO suite, known for Domain Authority, on a monthly plan. OpenSEO is open source and paid per lookup. Here is how they differ, and when Moz is the better buy.',
    entry: {
      plan: 'Standard',
      price: '$99 a month ($79 a month billed yearly); Starter from $49',
      notes: ['1 user, 3 campaigns, 300 tracked keywords', '150 keyword queries a month', '7-day free trial'],
    },
    rows: [
      { topic: 'Source code', them: 'Closed', us: 'Open source (MIT), self-hostable' },
      { topic: 'Price model', them: 'Monthly plan; extra seats $49 a month each', us: 'Open-source software; data paid per lookup, from $0.01' },
      { topic: 'Authority metric', them: 'Domain Authority (DA), widely quoted in link building', us: 'Domain Rating from the data provider' },
      { topic: 'Keyword research', them: '150 keyword queries a month on Standard', us: 'Pay per search: about $0.08 for 150 ideas' },
      { topic: 'Rank tracking', them: '300 tracked keywords on Standard', us: '$0.02 per keyword and device for the top 20, up to $0.10 for the top 100' },
      { topic: 'API', them: 'A separate product, from $20 a month', us: '76 MCP tools and a REST API on every install' },
    ],
    chooseThem: [
      'Your clients or partners ask for Domain Authority by name.',
      'You want long data history, Moz’s training material and 24/7 support.',
    ],
    chooseUs: [
      'You need more keyword lookups than a monthly quota allows, only some months.',
      'You want an API without buying a second product.',
      'You want the software open source and your data on your own server.',
    ],
    faqs: [freeAlternative('Moz'), ...sharedFaqs],
  },
  {
    slug: 'screaming-frog-alternative',
    name: 'Screaming Frog',
    seoTitle: 'Screaming Frog Alternative: Free Online Site Audit',
    checked: 'October 2026',
    summary: 'Screaming Frog SEO Spider is the standard desktop crawler for technical SEO. OpenSEO runs a hosted site audit with a health score and prioritised issues, next to keyword, rank and backlink tools. Here is how they differ.',
    entry: {
      plan: 'SEO Spider licence',
      price: '$279 (£199) per user per year; free up to 500 URLs',
      notes: ['A desktop app for Windows, macOS and Linux', 'Scheduling, JavaScript rendering and saved crawls need the paid licence', 'An MCP server since version 24 (May 2026)'],
    },
    rows: [
      { topic: 'Where it runs', them: 'On your computer', us: 'In your browser, hosted or on your own server' },
      { topic: 'Price', them: '$279 a year per user; free up to 500 URLs', us: 'The crawler costs nothing; Lighthouse runs $0.05 each' },
      { topic: 'Crawl size', them: 'Limited by your machine’s memory', us: 'Up to 5,000 pages per audit (500 when rendered)' },
      { topic: 'Depth and configuration', them: 'Very deep: custom extraction, JavaScript, crawl comparison', us: `${AUDIT_CHECKS} checks, a health score and the worst issues first` },
      { topic: 'Beyond audits', them: 'Technical crawling only', us: 'Keywords, rank tracking, backlinks, AI visibility and Search Console too' },
      { topic: 'AI agents', them: 'Local MCP server', us: '76 MCP tools and a REST API, hosted or self-hosted' },
    ],
    chooseThem: [
      'You audit large or complex sites and need custom extraction, JavaScript rendering at scale or crawl comparison.',
      'You prefer a desktop tool and want full control of crawl settings.',
    ],
    chooseUs: [
      'You want a health score and a fix list without installing anything.',
      'Your site has more than 500 URLs and you don’t want to buy a licence for an occasional audit.',
      'You want the audit next to your rankings, keywords and Search Console data.',
    ],
    faqs: [
      {
        question: 'Is OpenSEO a free Screaming Frog alternative?',
        answer: ['For audits, yes: the crawler and site audit cost nothing, on the hosted app or self-hosted, up to 5,000 pages per audit. Lighthouse runs cost $0.05 each. Keyword, rank and backlink data is paid per lookup.'],
      },
      {
        question: 'Can it replace Screaming Frog completely?',
        answer: ['Not for every job. Screaming Frog goes deeper on crawl configuration, custom extraction and very large sites. Many people use both: OpenSEO for regular health checks and everything else, Screaming Frog for the deep dives.'],
      },
    ],
  },
  {
    slug: 'otterly-alternative',
    name: 'Otterly.AI',
    checked: 'October 2026',
    summary: 'Otterly.AI is a dedicated AI search monitoring tool on a monthly plan. OpenSEO tracks AI visibility per prompt run, with no subscription, next to a full set of SEO tools. Here is how they differ.',
    entry: {
      plan: 'Lite',
      price: '$29 a month ($25 a month billed yearly) for 15 prompts',
      notes: ['ChatGPT, AI Overviews, Perplexity and Copilot; others are paid add-ons', 'Unlimited team members and brand reports', 'API and MCP from Standard ($189 a month)'],
    },
    rows: [
      { topic: 'Source code', them: 'Closed', us: 'Open source (MIT), self-hostable' },
      { topic: 'Price model', them: 'Monthly plan by number of prompts, from $29 for 15', us: 'Pay per prompt run, priced before it runs' },
      { topic: 'AI engines', them: '4 included; Gemini, AI Mode and Claude as add-ons', us: '120+ models to choose from' },
      { topic: 'Classic SEO', them: 'Not included', us: 'Keywords, rank tracking, backlinks, site audit and Search Console' },
      { topic: 'AI Overviews', them: 'Tracked as an AI engine', us: 'AI Overview checker for up to 100 keywords, $0.01 each' },
      { topic: 'API and agents', them: 'From the $189 Standard plan', us: '76 MCP tools and a REST API on every install' },
    ],
    chooseThem: [
      'AI visibility is all you need, tracked daily, with ready-made brand reports for a team.',
      'You want GEO audits and recommendations specific to AI search.',
    ],
    chooseUs: [
      'You want to test prompts and models first, without committing to a monthly plan.',
      'You want AI visibility next to your rankings, keywords and backlinks.',
      'You want API and MCP access without the higher plan.',
    ],
    faqs: [freeAlternative('Otterly.AI'), ...sharedFaqs],
  },
];

export const getComparison = (slug: string) => comparisons.find((c) => c.slug === slug);
