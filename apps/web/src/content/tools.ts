import type { FreeToolKind } from '@/components/free-tool';
import { BarChart3, Bot, FileSearch, Gauge, Globe, Grid3x3, Lightbulb, Link2, ListOrdered, Network, Search, Sparkles, Swords, TrendingUp, type LucideIcon } from 'lucide-react';
import { ASSISTANT_BRANDS, type Brand } from '@/components/brand-icon';
import type { ScreenName } from '@/components/screenshot';
import type { Faq } from './pricing';

/** One part of a tool's screen, shown as its own section on the tool's page. */
export interface ToolPart {
  shot: ScreenName;
  alt: string;
  title: string;
  body: string;
}

export interface ToolUse {
  title: string;
  body: string;
}

export interface ToolCost {
  /** What runs, e.g. "Keyword metrics". */
  action: string;
  price: string;
}

/** A research tool of the app, as its landing page on this site presents it. */
export interface ResearchTool {
  slug: string;
  /** A free version on the page itself, no account needed (components/free-tool.tsx). */
  freeTool?: FreeToolKind;
  name: string;
  icon: LucideIcon;
  /** Title tag, keyword first. The " · OpenSEO" suffix is added by the template. */
  seoTitle: string;
  /** Page H1: the exact head keyword, 2 to 5 words. */
  h1: string;
  /** Short line under the H1. */
  headline: string;
  /** One sentence for cards. */
  summary: string;
  /** Meta description, 120 to 155 characters. */
  description: string;
  /** Glossary slugs: the first is the tool's core concept, shown as "What is …?". */
  glossary: string[];
  /** The paragraph under the headline. */
  lede: string;
  /** Three short things it gives you, shown under the lede. */
  points: string[];
  /** The tool's address in the app. */
  appPath: string;
  hero: { shot: ScreenName; alt: string };
  /** Logos of the services or assistants it works with, shown under the headline. */
  worksWith?: Brand[];
  parts: ToolPart[];
  uses: ToolUse[];
  /** What one search runs and costs, and the total. */
  costs: ToolCost[];
  total: string;
  costNote: string;
  faqs: Faq[];
  /** Section of the screen-by-screen guide. */
  guide: string;
}

const shared: Faq[] = [
  {
    question: 'Do I need a project?',
    answer: ['No. The SEO tools work on their own, in any market you pick. Keywords you find can be saved to a project in one click when you want to track them.'],
  },
  {
    question: 'Can I share a result?',
    answer: [
      'Yes. The search, the market and the open tab are all in the page address, so a link or a bookmark opens the same view. Anyone opening it runs the search with their own key; a repeat of something already looked up is served from the cache for free.',
    ],
  },
];

export const tools: ResearchTool[] = [
  {
    slug: 'keyword-analysis-tool',
    seoTitle: 'Keyword Analysis Tool: Volume, Difficulty and SERP',
    h1: 'Keyword analysis tool',
    description: 'A keyword analysis tool: search volume, keyword difficulty, traffic potential, keyword ideas and the live top 10 for any keyword, in any country or city.',
    glossary: ['keyword-difficulty', 'search-volume', 'traffic-potential', 'search-intent', 'cost-per-click', 'keyword-research'],
    name: 'Keyword overview',
    icon: Search,
    headline: 'Everything about a keyword, from one search',
    summary: 'Difficulty, volume, traffic potential, volume by country, keyword ideas and the live top 10 for any keyword, in any country, state or city.',
    lede: 'Type a keyword, pick a country and press Enter. How hard it is to rank, how many people search, what the top result earns, where else people search for it, the keywords around it and who ranks today: all of it loads together.',
    points: ['Difficulty and the links you need', 'Volume in six countries', 'Live top 10 with DR, links and traffic'],
    appPath: '/tools/keyword-overview',
    hero: { shot: 'keyword-overview', alt: 'The Keyword overview for standing desk: difficulty 38, 135K searches a month, traffic potential, volume in six countries and keyword ideas' },
    parts: [
      {
        shot: 'search-bar',
        alt: 'The search row: keyword, country, city or state, language and the Analyse button, with the price of the search',
        title: 'Keyword metrics in one search',
        body: 'Keyword, country, city or state, and language sit side by side. The market you pick is remembered for every other tool.',
      },
      {
        shot: 'keyword-overview-cards',
        alt: 'Four cards: keyword difficulty 38, search volume 135K, traffic potential 37.8K and search volume across six countries',
        title: 'Keyword difficulty, volume and traffic potential',
        body: 'Difficulty from 0 to 100 with roughly how many linking sites the top 10 have. Monthly volume with its trend, the cost per click and how much advertisers compete. Traffic potential: what the top result earns from all its keywords. And volume in five other large markets, so you see where the demand is.',
      },
      {
        shot: 'keyword-overview-ideas',
        alt: 'Four columns of keyword ideas: terms that match, questions, keywords the top pages also rank for, and Google suggestions',
        title: 'Keyword ideas and questions',
        body: 'Terms that match the topic, the questions people ask, what the ranking pages also rank for, and Google’s own autocomplete. Click any of them to open its overview, or View all for the full list.',
      },
      {
        shot: 'keyword-overview-serp',
        alt: 'The top Google results with product, image and question blocks in place, and the words, DR, UR, backlinks, linking domains, traffic and value of each page',
        title: 'Top 10 SERP analysis',
        body: 'The results page as Google lays it out, features in their places, with how many visits this keyword sends each result, and each page’s Domain Rating, URL Rating, backlinks, linking domains, traffic and its value.',
      },
    ],
    uses: [
      { title: 'Decide what to write next', body: 'Weigh volume against difficulty and the links the top 10 have, before you commit a page to a keyword.' },
      { title: 'Check a keyword in another country', body: 'See where the demand is and switch market in one click: volume, ideas and results follow.' },
      { title: 'Plan for a city', body: 'Pick a city or state for local volume and the results people there see.' },
      { title: 'Size up the competition', body: 'See exactly who ranks, how strong each page is and which SERP features take the clicks.' },
    ],
    costs: [
      { action: 'Keyword metrics', price: '$0.03 – $0.04' },
      { action: 'Matching terms and related keywords (50 each)', price: '$0.06 – $0.10' },
      { action: 'Google suggestions', price: '$0.01' },
      { action: 'Live top 10', price: '$0.02' },
      { action: 'Volume in five other countries', price: '$0.15 – $0.20' },
      { action: 'Authority metrics of the top 10', price: '$0.20' },
      { action: 'Local volume for a city or state (optional)', price: '$0.15' },
    ],
    total: '$0.47 – $0.57 per keyword',
    costNote: 'A repeat within a day is free. Keyword data is cached for a week, the live results for an hour.',
    faqs: [
      {
        question: 'Where does traffic potential come from?',
        answer: [
          'It is the organic traffic the top-ranking page gets from all the keywords it ranks for, when that is known. Otherwise it is estimated from this keyword alone: its volume times a typical click-through rate for the first result.',
        ],
      },
      {
        question: 'Where does the volume come from for VPN or gambling keywords?',
        answer: ['Google Ads reports no volume for some topics, such as VPNs or gambling. For those, the overview and the SERP checker use a volume estimate from clickstream data instead.'],
      },
      ...shared,
    ],
    guide: '/docs/tutorials/seo-tools#keyword-overview',
  },
  {
    slug: 'keyword-generator',
    freeTool: 'keyword-ideas',
    seoTitle: 'Keyword Generator: Find Long-Tail Keyword Ideas',
    h1: 'Keyword generator',
    description: 'Generate up to 600 keyword ideas from one seed: long-tail keywords, related searches and questions, with search volume, keyword difficulty and intent.',
    glossary: ['long-tail-keywords', 'seed-keyword', 'question-keywords', 'keyword-clustering', 'search-intent', 'keyword-trend'],
    name: 'Keyword ideas',
    icon: Lightbulb,
    headline: 'Hundreds of keywords around any topic',
    summary: 'Matching terms, related searches, questions and Google suggestions from one seed keyword, with volume, difficulty, intent and trend.',
    lede: 'Start from one seed term. Matching terms, related searches, questions and Google’s suggestions come back as one list, with volume, difficulty, cost per click, intent and a 12-month trend for each.',
    points: ['Up to 600 ideas per search', 'Free filters on what is loaded', 'Save or export in one click'],
    appPath: '/tools/keyword-ideas',
    hero: { shot: 'keyword-ideas', alt: 'A list of keyword ideas for standing desk with tabs for each kind of idea, filters, and volume, difficulty, intent and trend' },
    parts: [
      {
        shot: 'keyword-ideas-questions',
        alt: 'The questions view of keyword ideas with tabs for all ideas, matching terms, related terms, questions and suggestions',
        title: 'Matching terms, related keywords and questions',
        body: 'All ideas, matching terms, related terms, questions and search suggestions each have a tab with their count. Words to include, intent, minimum volume, maximum difficulty and minimum words narrow the list for free.',
      },
    ],
    uses: [
      { title: 'Build a content plan', body: 'Find every keyword around a topic, then group them into pages by intent.' },
      { title: 'Find long-tail keywords', body: 'Set a minimum of three or four words and a low maximum difficulty to find easy wins.' },
      { title: 'Answer real questions', body: 'The questions tab lists what people ask, ready for an FAQ or a guide.' },
      { title: 'Go local', body: 'Pick a city or state and the top 100 ideas also get their local volume.' },
    ],
    costs: [
      { action: 'Matching terms (up to 300)', price: '$0.03 – $0.12' },
      { action: 'Related searches (up to 300)', price: '$0.03 – $0.12' },
      { action: 'Google suggestions', price: '$0.01' },
      { action: 'Local volume for the top 100 (with a city or state)', price: '$0.15' },
    ],
    total: '$0.07 – $0.25 per seed',
    costNote: 'You pay for the rows that come back. A repeat within a week is free, and the filters cost nothing.',
    faqs: [
      {
        question: 'What is the difference between matching and related terms?',
        answer: ['Matching terms contain the topic of your seed. Related terms are what people also search around it, which often brings up angles the seed does not contain.'],
      },
      ...shared,
    ],
    guide: '/docs/tutorials/seo-tools#keyword-ideas',
  },
  {
    slug: 'keyword-difficulty-checker',
    freeTool: 'keyword-difficulty',
    seoTitle: 'Keyword Difficulty Checker: Bulk KD for 1,000 Keywords',
    h1: 'Keyword difficulty checker',
    description: 'Check keyword difficulty for up to 1,000 keywords at once, sorted into easy, medium and hard, so you can see which ones you can rank for now.',
    glossary: ['keyword-difficulty', 'keyword-research', 'long-tail-keywords', 'search-volume', 'domain-rating', 'traffic-potential'],
    name: 'Keyword difficulty checker',
    icon: Gauge,
    headline: 'Keyword difficulty for your whole list at once',
    summary: 'Difficulty of up to 1,000 keywords at once, from 0 (easy) to 100 (hard), sorted into what you can win now and what needs more links first.',
    lede: 'Paste up to 1,000 keywords. Each gets a difficulty score from 0 to 100, from the links the pages in Google’s top 10 have, and the list is split into easy, medium and hard, with the average for the whole set. Save the winnable ones to a project in one click.',
    points: ['Up to 1,000 keywords per check', 'Easy, medium and hard at a glance', 'Save to a project or export'],
    appPath: '/tools/keyword-difficulty-checker',
    hero: { shot: 'keyword-difficulty-checker', alt: 'The keyword difficulty checker: 20 standing desk keywords with an average difficulty of 14, split into 15 easy and 5 medium' },
    parts: [
      {
        shot: 'keyword-overview-cards',
        alt: 'The keyword overview cards: keyword difficulty 38 with the links needed, search volume, traffic potential and volume by country',
        title: 'Open any keyword for the full picture',
        body: 'Click a keyword for its search volume and trend, traffic potential, the links the top 10 have and who ranks today, in the keyword analysis tool.',
      },
    ],
    uses: [
      { title: 'Sort a keyword list fast', body: 'Paste an export from any tool and see which keywords are easy, medium or hard.' },
      { title: 'Find quick wins', body: 'Filter to easy keywords and save them to a project to plan content.' },
      { title: 'Check a topic before you commit', body: 'The average difficulty of a topic’s keywords shows how much authority it takes.' },
      { title: 'Prioritise by authority', body: 'Match difficulty to your site’s Domain Rating: aim where you can rank.' },
    ],
    costs: [
      { action: 'Up to 100 keywords', price: '$0.03 – $0.06' },
      { action: '1,000 keywords', price: '$0.33' },
    ],
    total: '$0.03 + $0.03 per 100 keywords',
    costNote: 'A repeat within a week is free. Difficulty is country-level.',
    faqs: [
      {
        question: 'How is keyword difficulty calculated?',
        answer: ['From the backlink profiles of the pages ranking in Google’s top 10 for the keyword: the stronger their links, the higher the score. It estimates how hard the keyword is to rank for, from 0 (easy) to 100 (hard).'],
      },
      {
        question: 'Why do some keywords have no score?',
        answer: ['Keywords with too few searches have no difficulty data. They are usually long-tail terms that are easy to rank for.'],
      },
      ...shared,
    ],
    guide: '/docs/tutorials/seo-tools#keyword-difficulty-checker',
  },
  {
    slug: 'serp-checker',
    freeTool: 'serp',
    seoTitle: 'SERP Checker: Check Live Google Results Online',
    h1: 'SERP checker',
    description: 'Check the live Google results online for any keyword, from page 1 to page 10, on desktop or mobile, in any country, state or city, with each result’s authority, links and traffic.',
    glossary: ['serp', 'serp-features', 'featured-snippet', 'people-also-ask', 'ai-overviews', 'domain-rating'],
    name: 'SERP checker',
    icon: ListOrdered,
    headline: 'The live results page, measured',
    summary: 'The live top 10 to top 100 for any keyword on desktop or mobile, in any country, state or city, with every result’s authority, links and traffic.',
    lede: 'See the results page as searchers see it today: on desktop or mobile, in any country, state or city. Go from page 1 to page 10. Every result comes with the visits this keyword sends it, its Domain Rating, links and traffic.',
    points: ['Desktop or mobile', 'Down to a city', 'SERP features in place'],
    appPath: '/tools/serp-checker',
    hero: { shot: 'serp-checker', alt: 'The SERP checker for standing desk with the search row and the top results' },
    parts: [
      {
        shot: 'serp-checker-table',
        alt: 'The SERP checker table: volume, difficulty and intent, the SERP features, and each result with words, DR, UR, backlinks, linking domains, traffic, value and keywords',
        title: 'SERP analysis with authority and links',
        body: 'Volume, difficulty and intent sit above the results. AI overviews, People also ask, local packs and product blocks take their place in the numbering, so you see where the organic results really start.',
      },
      {
        shot: 'serp-checker-mobile',
        alt: 'The mobile results for standing desk',
        title: 'Mobile SERP checker',
        body: 'Switch the device to mobile and compare. Features and order often differ from desktop.',
      },
    ],
    uses: [
      { title: 'Check a ranking by hand', body: 'See where a page stands today, in the exact place and on the device that matter.' },
      { title: 'Judge if you can compete', body: 'Compare the Domain Rating and links of the top 10 with your own site.' },
      { title: 'Spot SERP features', body: 'See which features push organic results down before you target a keyword.' },
      { title: 'Open any result', body: 'Each result opens its domain overview, its page analysis or its backlinks.' },
    ],
    costs: [
      { action: 'Live results, top 10 to top 100', price: '$0.02 – $0.10' },
      { action: 'The keyword’s volume and difficulty', price: '$0.03 – $0.04' },
      { action: 'Authority metrics, per 10 results shown', price: '$0.20' },
    ],
    total: 'About $0.25 per check for the top 10, $2.14 for the top 100',
    costNote: 'Live results are cached for an hour. With a city or state, the keyword’s local volume costs $0.15 instead.',
    faqs: [
      {
        question: 'Why are some positions not organic results?',
        answer: ['Positions count everything on the page, as Google lays it out. A local pack or People also ask block takes a position, so the first organic result can be number three or four.'],
      },
      ...shared,
    ],
    guide: '/docs/tutorials/seo-tools#serp-checker',
  },
  {
    slug: 'website-seo-analysis',
    seoTitle: 'Website SEO Analysis: Domain Overview of Any Site',
    h1: 'Website SEO analysis',
    description: 'Run a website SEO analysis of any domain: organic traffic and its value, top keywords and pages, backlinks, authority and competitors, in any market.',
    glossary: ['organic-traffic', 'traffic-value', 'domain-rating', 'ranking-distribution', 'referring-domain', 'keyword-gap'],
    name: 'Domain overview',
    icon: Globe,
    headline: 'Any website’s search traffic at a glance',
    summary: 'Traffic and its value, keywords, links, authority, ranking spread, top keywords, top pages and competitors of any domain.',
    lede: 'Enter any domain: yours or a competitor’s. Its traffic and what that is worth in ads, its keywords, links and authority, how its rankings are spread and moving, its top keywords and pages, and who it competes with.',
    points: ['Top 100 keywords by traffic', 'Top 100 pages', 'Competitors one click away'],
    appPath: '/tools/domain-overview',
    hero: { shot: 'domain-overview', alt: 'Domain overview of zapier.com: Domain Rating 91, 6.9M organic traffic, 187K keywords, backlinks and referring domains' },
    parts: [
      {
        shot: 'domain-overview-positions',
        alt: 'A bar chart of how many keywords rank in each position range, with new, improved, declined and lost counts',
        title: 'Ranking distribution and keyword movement',
        body: 'How many keywords rank in each position range, with the top 10 in blue, and how many are new, improved, declined or lost since the last update.',
      },
      {
        shot: 'domain-overview-keywords',
        alt: 'A table of the keywords that bring the most traffic, with position, volume, traffic, share, CPC and ranking URL',
        title: 'Top organic keywords',
        body: 'The 100 keywords that bring the most traffic, with position, volume, share of traffic, cost per click and the ranking page. Filter by text or position, save to a project or export.',
      },
      {
        shot: 'domain-overview-pages',
        alt: 'The top pages of zapier.com by organic traffic with traffic value, keywords, top 3 and top 10 counts',
        title: 'Top pages by organic traffic',
        body: 'The 100 pages with the most organic traffic, what it is worth, and how many keywords each ranks for in the top 3 and top 10. Open any page in the page analyser.',
      },
      {
        shot: 'domain-overview-competitors',
        alt: 'Competitors of zapier.com with common keywords, average position, their keywords and traffic',
        title: 'Organic competitors',
        body: 'Sites that rank for the same keywords, with how many they share. One click opens the keyword gap.',
      },
    ],
    uses: [
      { title: 'Benchmark a competitor', body: 'See their traffic, keywords and links next to yours, in the market that matters.' },
      { title: 'Find what works for them', body: 'Their top keywords and pages show which topics and formats bring the traffic.' },
      { title: 'Watch your own site', body: 'Track how many keywords you gain and lose between updates.' },
      { title: 'Vet a site', body: 'Check a partner, an acquisition or a link prospect in seconds.' },
    ],
    costs: [
      { action: 'Totals, ranking spread and authority', price: '$0.14' },
      { action: 'Top 100 keywords', price: '$0.03 – $0.06' },
      { action: 'Top 100 pages', price: '$0.03 – $0.06' },
      { action: 'Top 20 competitors', price: '$0.03 – $0.04' },
    ],
    total: '$0.23 – $0.30 per domain',
    costNote: 'A repeat within a day is free. Domain data is for a whole country; backlinks are worldwide.',
    faqs: [
      {
        question: 'How is organic traffic estimated?',
        answer: ['From every keyword the domain ranks for: its volume, the position and a typical click-through rate for that position. It is an estimate for comparing sites, not an analytics figure.'],
      },
      ...shared,
    ],
    guide: '/docs/tutorials/seo-tools#domain-overview',
  },
  {
    slug: 'website-traffic-checker',
    freeTool: 'website-traffic',
    seoTitle: 'Website Traffic Checker: Compare Up to 100 Sites',
    h1: 'Website traffic checker',
    description: 'Check website traffic for up to 100 sites at once: estimated organic and paid Google visits and keywords, side by side, in any country. Export to CSV.',
    glossary: ['organic-traffic', 'organic-search', 'paid-results', 'traffic-value', 'search-volume', 'organic-ctr-curve'],
    name: 'Website traffic checker',
    icon: TrendingUp,
    headline: 'Check website traffic for a whole market at once',
    summary: 'Estimated Google traffic of up to 100 websites side by side: organic and paid visits and keywords, and each site’s share of the group.',
    lede: 'Paste your site and your competitors, one per line. Each one’s estimated monthly visits from Google’s organic results and from ads, how many keywords bring them, and its share of the group’s organic traffic, in the country you pick.',
    points: ['Up to 100 websites per check', 'Organic and paid traffic', 'Share of traffic in the group'],
    appPath: '/tools/website-traffic-checker',
    hero: { shot: 'website-traffic-checker', alt: 'The website traffic checker comparing zapier.com, make.com, ifttt.com, n8n.io, workato.com and pabbly.com: organic traffic, share, keywords and paid traffic' },
    parts: [
      {
        shot: 'domain-overview-metrics',
        alt: 'The domain overview of zapier.com: Domain Rating, organic traffic and its value, keywords, backlinks and referring domains',
        title: 'Go deeper on any site',
        body: 'One click opens any site in the domain overview: what its traffic is worth in ads, its top keywords and pages, how its rankings are spread and who it competes with.',
      },
    ],
    uses: [
      { title: 'Size up a market', body: 'Paste every player in a niche to see who gets the search traffic, and how much.' },
      { title: 'Benchmark against competitors', body: 'See your organic traffic and keywords next to the sites you compete with.' },
      { title: 'Spot who pays for traffic', body: 'Paid traffic and paid keywords show which competitors buy Google Ads.' },
      { title: 'Vet a list of sites', body: 'Check partners, link prospects or acquisition targets in one go.' },
    ],
    costs: [{ action: 'Up to 100 websites', price: '$0.03 – $0.06' }],
    total: '$0.03 – $0.06 per check',
    costNote: 'A repeat within a day is free. Traffic is estimated for one country at a time.',
    faqs: [
      {
        question: 'How is website traffic estimated?',
        answer: ['From every keyword a site ranks for in the chosen country: the keyword’s search volume, the site’s position and a typical click-through rate for that position. It is an estimate for comparing sites, not an analytics figure.'],
      },
      {
        question: 'Why does a site show zero traffic?',
        answer: ['It ranks for too few keywords in that country to estimate, or not at all yet. Try its main market, or check the spelling of the domain.'],
      },
      ...shared,
    ],
    guide: '/docs/tutorials/seo-tools#website-traffic-checker',
  },
  {
    slug: 'website-authority-checker',
    freeTool: 'website-authority',
    seoTitle: 'Website Authority Checker: Domain Rating in Bulk',
    h1: 'Website authority checker',
    description: 'Check website authority for up to 10 sites side by side: Domain Rating, referring domains and backlinks, for $0.02 a site. A bulk domain authority checker.',
    glossary: ['domain-rating', 'domain-authority', 'referring-domain', 'backlink', 'url-rating', 'link-building'],
    name: 'Website authority checker',
    icon: Network,
    headline: 'Compare the authority of up to 10 websites',
    summary: 'Domain Rating, referring domains and backlinks of up to 10 sites side by side, to see how strong a site is next to its competitors.',
    lede: 'Enter up to 10 domains. Each one’s Domain Rating from 0 to 100, the number of websites linking to it and its total backlinks, side by side, so you can see how far a site is from the competitors it needs to outrank.',
    points: ['Domain Rating 0 to 100', 'Referring domains and backlinks', 'Up to 10 sites per check'],
    appPath: '/tools/website-authority-checker',
    hero: { shot: 'website-authority-checker', alt: 'The website authority checker comparing six automation sites by Domain Rating, referring domains and backlinks' },
    parts: [
      {
        shot: 'backlinks-domains',
        alt: 'The referring domains of zapier.com with their Domain Rating, backlinks and first-seen date',
        title: 'See where the authority comes from',
        body: 'Open any site in the backlink checker for the websites linking to it, its anchors, its link history and the links its competitors have that it does not.',
      },
    ],
    uses: [
      { title: 'Measure the gap to the top', body: 'Compare your Domain Rating with the sites ranking above you before you chase a keyword.' },
      { title: 'Vet link prospects', body: 'Check a list of sites before outreach: strong, relevant sites are worth the effort.' },
      { title: 'Check a domain before buying it', body: 'See its authority and links in seconds.' },
      { title: 'Report on progress', body: 'Re-check every month to see your authority grow next to your competitors’.' },
    ],
    costs: [
      { action: 'Authority of one website', price: '$0.02' },
      { action: '10 websites', price: '$0.20' },
    ],
    total: '$0.02 per website',
    costNote: 'A repeat within a week is free. Authority and backlinks are worldwide, so there is no country to pick.',
    faqs: [
      {
        question: 'Is Domain Rating the same as Domain Authority?',
        answer: ['They measure the same idea, the strength of a site’s backlink profile on a 0 to 100 scale, but each company calculates its own, so a DA checker and a DR checker give different numbers. Google uses neither. Compare sites on the same scale rather than reading one number alone.'],
      },
      {
        question: 'What is a good website authority score?',
        answer: ['It depends on the competition. A site with a Domain Rating of 30 can rank well in a niche where the top results are 20 to 35; the useful question is how you compare with the sites ranking for your keywords.'],
      },
      ...shared,
    ],
    guide: '/docs/tutorials/seo-tools#website-authority-checker',
  },
  {
    slug: 'on-page-seo-audit',
    seoTitle: 'On-Page SEO Audit: Check Any Page’s SEO',
    h1: 'On-page SEO audit',
    description: 'Run an on-page SEO audit of any URL: title, meta description and headings checked, plus the page’s authority, backlinks, traffic and ranking keywords.',
    glossary: ['on-page-seo', 'title-tag', 'meta-description', 'header-tags', 'url-rating', 'backlink'],
    name: 'Page analyser',
    icon: FileSearch,
    headline: 'One page, inside and out',
    summary: 'Authority, links and traffic of any page, its title, description and headings checked, the keywords it ranks for and its strongest backlinks.',
    lede: 'Paste the address of any page. Its URL Rating and its site’s Domain Rating, the links pointing at it and the traffic it earns, its title, description and headings checked, the keywords it ranks for and its strongest backlinks.',
    points: ['On-page checks', 'Keywords the page ranks for', 'Strongest backlinks'],
    appPath: '/tools/page-analyser',
    hero: { shot: 'page-analyser', alt: 'Page analyser for a Zapier blog post: URL rating, Domain Rating, referring domains, backlinks, organic traffic and keywords' },
    parts: [
      {
        shot: 'page-analyser-onpage',
        alt: 'On-page checks: status, title and description with their length, H1 and word count',
        title: 'Title, meta description and headings check',
        body: 'Status, title and meta description with their length checked against what results show in full, the H1 headings and the size of the content.',
      },
      {
        shot: 'page-analyser-keywords',
        alt: 'A table of the keywords the page ranks for with position, volume, traffic and CPC',
        title: 'Keywords the page ranks for',
        body: 'The keywords this page ranks for in the top 20, with position, volume and the traffic each brings. Save the ones worth tracking.',
      },
      {
        shot: 'page-analyser-links',
        alt: 'The strongest backlinks to the page, one per linking site, with anchor, type and rank',
        title: 'Backlinks to the page',
        body: 'Its strongest backlinks, one from each linking site, with the anchor text and whether they pass authority.',
      },
    ],
    uses: [
      { title: 'Learn from a top result', body: 'See why a competitor’s page ranks: its links, its keywords and its basics.' },
      { title: 'Fix your own page', body: 'Catch a missing description, a title that gets cut off or a second H1.' },
      { title: 'Find more keywords for a page', body: 'See every keyword it already ranks for, and which are close to page one.' },
      { title: 'Check a link prospect', body: 'See whether a page has the authority and traffic to be worth a link.' },
    ],
    costs: [
      { action: 'Authority, links and traffic', price: '$0.02' },
      { action: 'On-page check', price: '$0.03' },
      { action: 'Keywords the page ranks for', price: '$0.03 – $0.06' },
      { action: 'Strongest backlinks', price: '$0.05 – $0.06' },
    ],
    total: '$0.13 – $0.17 per page',
    costNote: 'The on-page check is cached for an hour, the rest for a day or more.',
    faqs: [...shared],
    guide: '/docs/tutorials/seo-tools#page-analyser',
  },
  {
    slug: 'backlink-checker',
    seoTitle: 'Backlink Checker: Check Backlinks to Any Website',
    h1: 'Backlink checker',
    description: 'Check backlinks to any site or page: referring domains, anchor text, new and lost links by month, top linked pages and link intersect.',
    glossary: ['backlink', 'referring-domain', 'anchor-text', 'dofollow-link', 'lost-backlinks', 'link-intersect'],
    name: 'Backlink checker',
    icon: Link2,
    headline: 'Who links to a site, and how that is changing',
    summary: 'Totals, monthly history, strongest backlinks, referring domains, anchors, top linked pages and link intersect for any domain or page.',
    lede: 'Enter a domain, a subdomain or one exact page. Its link totals, the monthly history of links gained and lost, the strongest backlinks, the referring domains, the anchors and its most linked pages, all from one search.',
    points: ['Monthly history', 'Strongest links first', 'Link intersect with competitors'],
    appPath: '/tools/backlink-checker',
    hero: { shot: 'backlinks', alt: 'Backlink totals for zapier.com: backlinks, referring domains, dofollow share, broken backlinks, spam score and rank' },
    parts: [
      {
        shot: 'backlinks-history',
        alt: 'Charts of backlinks and referring domains over time, and new against lost links each month',
        title: 'Backlink history: new and lost links',
        body: 'Backlinks and referring domains over the years, and the links gained and lost every month, to spot a campaign, a penalty or a lost partner.',
      },
      {
        shot: 'backlinks-list',
        alt: 'A table of the strongest backlinks with linking page, anchor, target, type, authority and dates',
        title: 'Strongest backlinks first',
        body: 'The 100 strongest live links, one from each linking site, with the anchor, the page they point to, dofollow or nofollow, authority and when they were first seen.',
      },
      {
        shot: 'backlinks-domains',
        alt: 'Referring domains of zapier.com with rank, backlinks, dofollow links, linking pages and spam score',
        title: 'Referring domains',
        body: 'The referring domains with their authority, how many links each sends and their spam score.',
      },
      {
        shot: 'backlinks-anchors',
        alt: 'Anchor texts used in links to zapier.com with referring domains and backlinks',
        title: 'Anchor text distribution',
        body: 'Anchor texts and how many sites use each, to see how others describe the site.',
      },
      {
        shot: 'backlinks-intersect',
        alt: 'Link intersect: sites that link to make.com and zapier.com but not to activepieces.com',
        title: 'Link intersect with competitors',
        body: 'Link intersect takes competitors and lists the sites that link to them but not to you: the likeliest to link to you next.',
      },
    ],
    uses: [
      { title: 'Find link opportunities', body: 'Sites that link to several competitors are the warmest prospects.' },
      { title: 'Audit your profile', body: 'Spot broken links, spammy domains and over-optimised anchors.' },
      { title: 'Explain a ranking change', body: 'Match a drop or a rise to links gained or lost that month.' },
      { title: 'Check one page', body: 'Enter a full URL for the links to that page alone.' },
    ],
    costs: [
      { action: 'Totals', price: '$0.05' },
      { action: 'Monthly history', price: '$0.05' },
      { action: 'Strongest backlinks (100)', price: '$0.05 – $0.06' },
      { action: 'Referring domains (100)', price: '$0.05 – $0.06' },
      { action: 'Anchors (100)', price: '$0.05 – $0.06' },
      { action: 'Top linked pages (100, for a domain)', price: '$0.05 – $0.06' },
      { action: 'Link intersect (when you add competitors)', price: '$0.05 – $0.08' },
    ],
    total: '$0.30 – $0.34 per domain',
    costNote: 'For one exact page there are no top linked pages, so it costs $0.25 – $0.28. A repeat within a day is free.',
    faqs: [
      {
        question: 'Is there a country to pick?',
        answer: ['No. Backlinks are the same wherever you search from, so the backlink checker has no market.'],
      },
      ...shared,
    ],
    guide: '/docs/tutorials/seo-tools#backlinks',
  },
  {
    slug: 'seo-competitor-analysis',
    seoTitle: 'SEO Competitor Analysis: Find Your Organic Competitors',
    h1: 'SEO competitor analysis',
    description: 'SEO competitor analysis: find your organic competitors in Google, run a competitor keyword gap, and see which sites rank most for a list of keywords.',
    glossary: ['keyword-gap', 'content-gap', 'share-of-voice', 'organic-search', 'keyword-research', 'topical-authority'],
    name: 'Competitors',
    icon: Swords,
    headline: 'Find who you compete with, then what they have that you do not',
    summary: 'Organic competitors of any domain, the keyword gap with any of them, and the sites that rank most for a list of keywords.',
    lede: 'Enter your domain for the sites you compete with in Google. Pick one for the keyword gap: the keywords only they rank for and the ones you share, side by side. Or paste a list of keywords to see who ranks most for them.',
    points: ['Organic competitors', 'Keyword gap in one click', 'SERP competitors for any keyword list'],
    appPath: '/tools/competitors',
    hero: { shot: 'competitors', alt: 'Organic competitors of zapier.com with common keywords, average position, their keywords and traffic' },
    parts: [
      {
        shot: 'keyword-gap',
        alt: 'Keyword gap between todoist.com and ticktick.com listing keywords only the competitor ranks for',
        title: 'Keyword gap analysis',
        body: 'Keywords only they rank for, and keywords you both rank for, load together. Sort by volume or difficulty, select the opportunities and save them to a project.',
      },
      {
        shot: 'competitors-serp',
        alt: 'SERP competitors: the domains that rank most for five keywords, with average position, visibility and traffic',
        title: 'SERP competitors for your keywords',
        body: 'Paste up to 200 keywords to see which domains show up most for them, often a different list from the one you would write from memory.',
      },
    ],
    uses: [
      { title: 'Find your real competitors', body: 'The sites you compete with in Google, not just in business.' },
      { title: 'Fill content gaps', body: 'Keywords a competitor ranks for and you do not are new ground to cover.' },
      { title: 'Defend what you share', body: 'See every keyword you both rank for.' },
      { title: 'Map a niche', body: 'Paste the keywords of a topic to see who owns it.' },
    ],
    costs: [
      { action: 'Organic competitors (top 50)', price: '$0.03 – $0.05' },
      { action: 'Keyword gap: only they rank (up to 500)', price: '$0.03 – $0.18' },
      { action: 'Keyword gap: both rank (up to 500)', price: '$0.03 – $0.18' },
      { action: 'SERP competitors for a keyword list', price: '$0.03 – $0.05' },
    ],
    total: '$0.03 – $0.05 to find competitors',
    costNote: 'A keyword gap costs $0.06 – $0.36 depending on how many keywords come back. Competitor data is cached for a week.',
    faqs: [...shared],
    guide: '/docs/tutorials/seo-tools#competitors',
  },
  {
    slug: 'keyword-gap',
    seoTitle: 'Keyword Gap Analysis: Keywords Competitors Rank For',
    h1: 'Keyword gap analysis',
    description: 'Run a keyword gap analysis: the keywords a competitor ranks for and you do not, plus the ones you share, with volume, difficulty and both positions.',
    glossary: ['keyword-gap', 'content-gap', 'keyword-research', 'keyword-difficulty', 'search-intent', 'topical-authority'],
    name: 'Keyword gap',
    icon: BarChart3,
    headline: 'The keywords your competitors have and you do not',
    summary: 'Keywords a competitor ranks for that a site does not, and the keywords both share, with volume, difficulty and positions side by side.',
    lede: 'Enter your domain and a competitor’s. The keywords only they rank for, which is the gap, and the keywords you both rank for load together, up to 500 of each, with volume, difficulty, cost per click, intent and both positions. Select the opportunities and save them to a project.',
    points: ['Only they rank, and both rank', 'Up to 500 keywords each', 'Save the gaps to a project'],
    appPath: '/tools/competitors?tab=gap',
    hero: { shot: 'keyword-gap', alt: 'Keyword gap between todoist.com and ticktick.com listing the keywords only the competitor ranks for, with volume and difficulty' },
    parts: [
      {
        shot: 'competitors',
        alt: 'Organic competitors of zapier.com with common keywords, average position, their keywords and traffic',
        title: 'Find who to compare with',
        body: 'Not sure who your competitors are? The competitors tab lists the sites that rank for the same keywords as yours. Click one for the keyword gap.',
      },
    ],
    uses: [
      { title: 'Find content to write', body: 'Keywords a competitor ranks for and you do not are topics your audience searches that you have not covered.' },
      { title: 'Defend shared keywords', body: 'See every keyword you both rank for and where each of you sits.' },
      { title: 'Prioritise by difficulty', body: 'Sort the gap by volume and difficulty to find the keywords you can win first.' },
      { title: 'Build a content plan', body: 'Save the gaps to a project, then group them into pages.' },
    ],
    costs: [
      { action: 'Keywords only they rank for (up to 500)', price: '$0.03 – $0.18' },
      { action: 'Keywords both rank for (up to 500)', price: '$0.03 – $0.18' },
    ],
    total: '$0.06 – $0.36 per comparison',
    costNote: 'A repeat within a week is free. Keyword data is country-level.',
    faqs: [
      {
        question: 'What is a keyword gap analysis?',
        answer: ['Comparing the keywords two sites rank for to find the ones a competitor has and you do not. Those gaps are topics with proven search demand that your site does not cover yet.'],
      },
      {
        question: 'Can I compare more than one competitor?',
        answer: ['Run one comparison per competitor; each is cached for a week, so switching back and forth is free. In a project, the Competitors page keeps your domain filled in.'],
      },
      ...shared,
    ],
    guide: '/docs/tutorials/seo-tools#competitors',
  },
  {
    slug: 'backlink-gap',
    seoTitle: 'Backlink Gap Analysis: Find Your Competitors’ Links',
    h1: 'Backlink gap analysis',
    description: 'Run a backlink gap analysis: the websites linking to two or more of your competitors but not to you, ranked by authority. Your link building prospect list.',
    glossary: ['link-intersect', 'link-building', 'referring-domain', 'domain-rating', 'backlink', 'broken-link-building'],
    name: 'Backlink gap',
    icon: Link2,
    headline: 'Sites that link to your competitors, but not to you',
    summary: 'The websites linking to your competitors but not to you, most competitors first, with their authority: a ready list of link building prospects.',
    lede: 'Enter your domain, then your competitors. You get the websites that link to them but not to you, those linking to the most competitors first, with how many links each gives every site and its authority. A site that links to several competitors already covers your topic: it is the warmest prospect for a link to you.',
    points: ['Up to 19 competitors', 'Only sites not linking to you', 'Export your prospect list'],
    appPath: '/tools/backlink-checker?tab=intersect',
    hero: { shot: 'backlinks-intersect', alt: 'Backlink gap for activepieces.com against make.com and zapier.com: sites linking to both competitors but not to activepieces.com, with the links each gives every site, rank and spam score' },
    parts: [
      {
        shot: 'backlinks-domains',
        alt: 'The referring domains of zapier.com with Domain Rating, backlinks and first-seen date',
        title: 'Compare with your own links',
        body: 'The backlink checker shows the sites already linking to you, so you can see which prospects are new and how your profile compares.',
      },
    ],
    uses: [
      { title: 'Build a link prospect list', body: 'Sites linking to several competitors are relevant and open to linking in your niche.' },
      { title: 'Find resource pages and roundups', body: 'Pages that list your competitors are the easiest place to be added.' },
      { title: 'Prioritise outreach', body: 'Sort by authority to start with the links that matter most.' },
      { title: 'Track the gap', body: 'Run it again after a campaign to see which prospects now link to you.' },
    ],
    costs: [{ action: 'Sites linking to your competitors (up to 300)', price: '$0.05 – $0.08' }],
    total: '$0.05 – $0.08 per check',
    costNote: 'A repeat within a day is free. Backlink data is worldwide.',
    faqs: [
      {
        question: 'What is a backlink gap?',
        answer: ['The websites that link to your competitors but not to you. Also called a link intersect, it is one of the most reliable ways to find link building prospects, because those sites already link to pages like yours.'],
      },
      {
        question: 'Is this white hat link building?',
        answer: ['Yes, when you earn the links: by offering something worth linking to, such as a better resource, data or a fix for a broken link. Buying links is against Google’s spam policies.'],
      },
      ...shared,
    ],
    guide: '/docs/tutorials/seo-tools#backlinks',
  },
  {
    slug: 'ai-overview-checker',
    freeTool: 'ai-overview',
    seoTitle: 'AI Overview Checker and Tracker: See Who Google Cites',
    h1: 'AI Overview checker',
    description: 'Check up to 100 keywords for Google AI Overviews: which show one, the sites each cites, whether you are cited, and every other SERP feature on page one.',
    glossary: ['ai-overviews', 'serp-features', 'featured-snippet', 'people-also-ask', 'zero-click-searches', 'generative-engine-optimization'],
    name: 'AI Overview checker',
    icon: Sparkles,
    headline: 'Which of your keywords show an AI Overview, and who it cites',
    summary: 'Check up to 100 keywords at once for Google AI Overviews and every other SERP feature: which sites each AI Overview cites, and whether yours is one.',
    lede: 'Paste the keywords you care about and add your domain. For each one you see whether Google shows an AI Overview, every page it cites, whether your site is among them, and the other features on the first page: featured snippets, People Also Ask, videos, products and the local pack.',
    points: ['Up to 100 keywords per check', 'Every site each AI Overview cites', 'Tracked over time in a project'],
    appPath: '/tools/ai-overview-checker',
    hero: { shot: 'ai-overview-checker', alt: 'The AI Overview checker: 10 of 12 standing desk keywords show an AI Overview and 5 of them cite upliftdesk.com' },
    parts: [
      {
        shot: 'ai-overview-checker-table',
        alt: 'A table of keywords showing whether each has an AI Overview, whether it cites your site, how many sites it cites and the other SERP features',
        title: 'AI Overview citations per keyword',
        body: 'Every keyword with its AI Overview status: cites you, shown without you, or none. Next to it, how many pages the overview links to, the other SERP features on page one with the ones you appear in marked green, and your page-one rank. Export it all as CSV.',
      },
      {
        shot: 'ai-overview-checker-sources',
        alt: 'The sites AI Overviews cite most across the keywords, with upliftdesk.com marked, next to how often each SERP feature appears',
        title: 'The sites AI Overviews cite most',
        body: 'Across your keywords, the domains Google’s AI answers lean on, ranked by how many keywords cite them. Those are the pages to study, and the sites worth a mention. Beside it, how often each SERP feature appears and how often you are in it.',
      },
      {
        shot: 'rank-tracker-features',
        alt: 'The rank tracker’s AI Overviews and features tab: keywords with an AI Overview, how many cite the site, and each SERP feature’s share',
        title: 'AI Overview tracking in a project',
        body: 'In a project, the rank tracker records the SERP features of every tracked keyword on each check, AI Overview citations included, at no extra cost. Its AI Overviews tab shows how many keywords trigger one, how many cite you, and which do not yet.',
      },
    ],
    uses: [
      { title: 'Find where AI answers take the clicks', body: 'See which of your keywords show an AI Overview before you plan content for them.' },
      { title: 'Check if Google’s AI cites you', body: 'Add your domain to see every AI Overview that links to your site, and every one that does not.' },
      { title: 'Learn from the cited pages', body: 'The sites cited most across your keywords show what Google’s AI trusts for the topic.' },
      { title: 'Plan for SERP features', body: 'Spot featured snippets, People Also Ask and video results worth targeting.' },
    ],
    costs: [
      { action: 'Google’s first page, per keyword', price: '$0.01' },
      { action: '100 keywords', price: '$1.00' },
      { action: 'Tracked keywords in a project (from rank checks)', price: 'free' },
    ],
    total: '$0.01 per keyword',
    costNote: 'A repeat within 6 hours is free. In a project the rank tracker reads AI Overviews from checks it already runs, so tracking costs nothing extra.',
    faqs: [
      {
        question: 'What is an AI Overview?',
        answer: ['The AI-written answer Google shows above the results for many searches, with links to the pages it drew on. Being one of those links is the new featured snippet: visible even when nobody scrolls.'],
      },
      {
        question: 'How do you know if an AI Overview cites my site?',
        answer: ['Each AI Overview comes with its list of source pages. Your site counts as cited when any of them is on your domain or one of its subdomains.'],
      },
      {
        question: 'Why does a keyword show no AI Overview today?',
        answer: ['Google shows AI Overviews for some searches and not others, and it changes over time and by country. Checking on a schedule in a project shows the trend rather than one snapshot.'],
      },
      ...shared,
    ],
    guide: '/docs/tutorials/seo-tools#ai-overview-checker',
  },
  {
    slug: 'ai-visibility-checker',
    seoTitle: 'AI Visibility Checker: See What ChatGPT and Gemini Cite',
    h1: 'AI visibility checker',
    description: 'An AI visibility tool: ask ChatGPT, Gemini, Claude and Perplexity one question with web search on and compare the sites each cites. Is yours there?',
    glossary: ['ai-visibility', 'ai-citations', 'generative-engine-optimization', 'answer-engine-optimization', 'brand-mentions', 'chatgpt-search'],
    worksWith: ASSISTANT_BRANDS,
    name: 'AI visibility checker',
    icon: Bot,
    headline: 'See which sites AI assistants cite, and in what order',
    summary: 'Ask ChatGPT, Gemini, Claude and Perplexity the same question with web search on, and compare the sources each one cites, in order. Is your site among them?',
    lede: 'Ask the question your customers ask. ChatGPT, Gemini, Claude and Perplexity answer it with web search on, and you see every source each one cites, in order: which sites most assistants trust, where each sits in their lists, and whether your site or brand is cited or named.',
    points: ['Four assistants, one question', 'Citations in order, side by side', 'Your site cited and named, or not'],
    appPath: '/tools/ai-visibility-checker',
    hero: { shot: 'ai-visibility', alt: 'The AI visibility checker: one question asked to four assistants, how many sources they cited, and the most cited sites' },
    parts: [
      {
        shot: 'ai-visibility-sites',
        alt: 'The most cited sites, with the assistants that cite each one and their place in each list',
        title: 'Most cited sites in AI answers',
        body: 'Every site any assistant cited, ranked by how many assistants cite it and how high. Each one shows which assistants cite it and at which place in their list of sources.',
      },
      {
        shot: 'ai-visibility-order',
        alt: 'Four columns, one per assistant, listing the sources each cited in order',
        title: 'AI citations by assistant',
        body: 'One column per assistant with its sources numbered as it gave them. Hover a site to see where else it appears; your own site is highlighted. Each answer is underneath, with whether it names you.',
      },
    ],
    uses: [
      { title: 'Find out if AI recommends you', body: 'Ask what a customer would ask and see whether any assistant cites your site or names your brand.' },
      { title: 'Find the sources that matter', body: 'The sites most assistants cite are the ones worth a mention, a review or a guest article.' },
      { title: 'Compare assistants', body: 'Each one answers differently. See which cite many sources and which cite few.' },
      { title: 'Track it over time', body: 'Add the question to a project to ask it again on a schedule and follow the trend.' },
    ],
    costs: [
      { action: 'ChatGPT, with web search', price: 'about $0.17' },
      { action: 'Gemini, with web search', price: 'about $0.06' },
      { action: 'Claude, with web search', price: 'about $0.12' },
      { action: 'Perplexity', price: 'about $0.03' },
      { action: 'Grok, Meta AI or DeepSeek (optional)', price: 'varies, up to about $0.30' },
    ],
    total: 'About $0.38 per question',
    costNote: 'Answers are priced by the words read and written, so each varies a little. The same question within a day is free.',
    faqs: [
      {
        question: 'Is this AEO or GEO?',
        answer: [
          'Both names describe the same work: being the source AI assistants cite and the brand they name. Answer engine optimisation (AEO) and generative engine optimisation (GEO) start with knowing where you stand, which is what this check shows.',
        ],
      },
      {
        question: 'Why do the answers change?',
        answer: ['Assistants write a new answer every time and search the web as they go, so sources shift between runs. Asking on a schedule in a project shows the trend rather than one snapshot.'],
      },
      {
        question: 'What counts as named?',
        answer: ['Your domain or a brand name you enter appearing in the answer’s text. Links and citation markers do not count, so a source list alone does not make an answer name you.'],
      },
      ...shared,
    ],
    guide: '/docs/tutorials/seo-tools#ai-visibility',
  },
  {
    slug: 'local-rank-checker',
    seoTitle: 'Local Rank Checker: Google Maps Ranking Checker',
    h1: 'Local rank checker',
    description: 'Check Google Maps rankings for any keyword across a grid around a city: the top 20 businesses at every point and any business’s rank in each cell.',
    glossary: ['geo-grid', 'local-pack', 'google-maps-seo', 'local-ranking-factors', 'google-business-profile', 'near-me-searches'],
    name: 'Local rank checker',
    icon: Grid3x3,
    headline: 'Who ranks on Google Maps, block by block',
    summary: 'Google Maps rankings for any keyword across a grid around a city: the top 20 businesses at every point, and any business’s rank in each cell.',
    lede: 'Enter a keyword and a city. A grid of Maps searches runs across the area, each from its own spot, and every business that shows up is ranked: who owns the area, and how any business ranks in each part of town.',
    points: ['3 × 3 to 7 × 7 grids', 'Every business, not just yours', 'Pick any business to see its grid'],
    appPath: '/tools/local-rank-checker',
    hero: { shot: 'local-rank', alt: 'The local rank checker: a 5 × 5 grid of Google Maps ranks for dentist around Austin, Texas, and the businesses that rank across it' },
    parts: [
      {
        shot: 'local-rank-grid',
        alt: 'A grid of rank numbers coloured green to red, next to a table of businesses with top 3 coverage, average rank, rating and reviews',
        title: 'Google Maps rank grid',
        body: 'Each cell is a Maps search from that spot: green for the top 3, amber for 4 to 10, red for 11 to 20. Next to it, every business ranked by how many points it holds a top-3 place. Click one to see its grid; the data is already there, so it costs nothing.',
      },
    ],
    uses: [
      { title: 'See where you are visible', body: 'Find the parts of town where you show in the top 3, and where you drop off.' },
      { title: 'Know your local competitors', body: 'See who holds the top places across the area, with their ratings and reviews.' },
      { title: 'Plan a new location', body: 'Check how crowded the map is before you open or advertise somewhere.' },
      { title: 'Track it over time', body: 'Run geo-grids for a project business to see its local rankings move.' },
    ],
    costs: [
      { action: 'Find the city or area on the map', price: '$0.07' },
      { action: '3 × 3 grid (9 Maps searches)', price: '$0.63' },
      { action: '5 × 5 grid (25 Maps searches)', price: '$1.75' },
      { action: '7 × 7 grid (49 Maps searches)', price: '$3.43' },
    ],
    total: '$1.82 for a 5 × 5 grid',
    costNote: 'A 3 × 3 grid costs $0.70 and a 7 × 7 grid $3.50, everything included. The same grid within a day is free, and picking another business never costs anything.',
    faqs: [
      {
        question: 'How is a rank measured?',
        answer: [
          'Each point runs a Google Maps search biased to a circle around that spot, as if someone searched there, and the business’s place in the top 20 is its rank. It is a strong signal of local visibility, not a copy of what one phone shows.',
        ],
      },
      {
        question: 'How far apart are the points?',
        answer: ['You choose: 0.5, 1, 2 or 5 km. Use a tight grid for a dense city centre and a wide one for a whole metro area.'],
      },
      ...shared,
    ],
    guide: '/docs/tutorials/seo-tools#local-rank',
  },
];

export const getTool = (slug: string) => tools.find((tool) => tool.slug === slug);
