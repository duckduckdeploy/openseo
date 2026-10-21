export interface PriceRow {
  action: string;
  /** What one call returns or covers. */
  unit: string;
  /** YepAPI's price at the time of writing. */
  price: string;
  /** The tool or feature page this action belongs to. */
  href: string;
}

/** Example prices for common actions, at the time of writing. */
export const priceRows: PriceRow[] = [
  { action: 'Keyword overview', unit: 'One keyword: metrics, ideas, suggestions, top 10 with authority, six countries', price: '$0.47 – $0.57', href: '/tools/keyword-analysis-tool' },
  { action: 'Keyword ideas', unit: 'Up to 600 ideas and suggestions', price: '$0.07 – $0.25', href: '/tools/keyword-generator' },
  { action: 'Keyword difficulty checker', unit: 'Difficulty of 1,000 keywords', price: '$0.33', href: '/tools/keyword-difficulty-checker' },
  { action: 'AI Overview checker', unit: 'Google’s first page and its AI Overview, per keyword', price: '$0.01', href: '/tools/ai-overview-checker' },
  { action: 'SERP checker', unit: 'Live top 10 with each result’s authority, and the keyword’s volume', price: '$0.25 – $0.26', href: '/tools/serp-checker' },
  { action: 'Domain overview', unit: 'Totals, rankings, top 100 keywords and pages, competitors', price: '$0.23 – $0.30', href: '/tools/website-seo-analysis' },
  { action: 'Website traffic checker', unit: 'Organic and paid traffic of up to 100 websites', price: '$0.03 – $0.06', href: '/tools/website-traffic-checker' },
  { action: 'Website authority checker', unit: 'Domain Rating and links, per website', price: '$0.02', href: '/tools/website-authority-checker' },
  { action: 'Backlink checker', unit: 'Totals, history and four lists of 100', price: '$0.30 – $0.34', href: '/tools/backlink-checker' },
  { action: 'Rank check', unit: 'One keyword and device, the top 20 to the top 100', price: '$0.02 – $0.10', href: '/features/keyword-rank-tracker' },
  { action: 'Lighthouse', unit: 'One run, mobile or desktop', price: '$0.05', href: '/features/site-audit' },
  { action: 'Geo-grid', unit: '5×5 grid, 25 Maps searches', price: '$1.75', href: '/features/local-rank-tracker' },
];

export interface CreditExample {
  amount: string;
  what: string;
  detail: string;
}

/** What the $5 in free credits on a new YepAPI account covers. Each line is an alternative, not a bundle. */
export const creditExamples: CreditExample[] = [
  { amount: 'about 250', what: 'rank checks of the top 20', detail: 'at $0.02 each' },
  { amount: 'about 60', what: 'keyword research runs', detail: '150 results each, about $0.08' },
  { amount: 'about 80', what: 'backlink lookups', detail: '100 rows each, $0.06' },
];

export interface Faq {
  question: string;
  answer: string[];
}

export const pricingFaqs: Faq[] = [
  {
    question: 'Is OpenSEO free?',
    answer: [
      'Yes. The hosted app at openseo.gg costs nothing and every feature is unlimited today. The self-hosted version is free for good: open source under the MIT licence, with every feature unlocked.',
      'What costs money is search data, such as keyword volumes, rankings and backlinks. You pay per lookup at YepAPI’s price, every call is listed with its cost in Settings and usage, and a monthly limit caps what you spend. A quiet month costs very little.',
    ],
  },
  {
    question: 'Will the hosted app always be unlimited?',
    answer: [
      'We can’t promise that, and we would rather say so now. Running openseo.gg for everyone costs servers and storage. Depending on how OpenSEO is funded, the hosted app may get usage limits later. It may never happen. If it does, we will announce it well in advance and nothing you have saved is lost.',
      'The self-hosted version is not affected: it stays complete, unlimited and free to run.',
    ],
  },
  {
    question: 'Is the self-hosted version limited in any way?',
    answer: [
      'No. Every feature of the hosted app is in the open-source code, with no feature gates, licence keys or usage caps. Run it on your own server for as long as you like.',
    ],
  },
  {
    question: 'Who do I pay for data?',
    answer: [
      'The data provider, YepAPI, directly. You add your own key during account setup, and each lookup is billed to it at their pay-per-call price. OpenSEO never handles that payment.',
    ],
  },
  {
    question: 'Can I self-host?',
    answer: [
      'Yes. OpenSEO is open source under the MIT licence. You can run the app, the API and the MCP server on your own machine or server with Postgres. The self-hosting guide in the docs has the steps.',
      'A self-hosted install uses your data key in the same way, so lookups cost the same.',
    ],
  },
  {
    question: 'What happens when my credits run out?',
    answer: [
      'Lookups that need search data stop until you add credit with the data provider. Everything else, including the crawler, audits and your saved work, keeps working.',
      'For a limited time, new YepAPI accounts start with $5 in free credit. After that you add credit whenever you want to keep going.',
    ],
  },
  {
    question: 'How do I know what an action will cost?',
    answer: [
      'Settings and usage lists every call with its cost, and a monthly limit caps spending. The table on this page gives examples at the time of writing; the data provider sets those prices and can change them.',
    ],
  },
  {
    question: 'Can I stop an AI agent from overspending?',
    answer: [
      'Yes, in two ways. Every paid tool an agent calls takes a spending ceiling: if the call could cost more, it is refused before anything is spent. And a monthly limit in Settings stops all spending, from you or any agent, once it is reached.',
    ],
  },
  {
    question: 'Do Search Console and Analytics cost anything?',
    answer: [
      'No. Google\'s data is free, and reading it never touches your data balance. The site audit crawl is free too; only JavaScript rendering is billed.',
    ],
  },
];
