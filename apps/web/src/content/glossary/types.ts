import type { Faq } from '../pricing';

export type GlossaryCategory =
  | 'basics'
  | 'keywords'
  | 'on-page'
  | 'technical'
  | 'links'
  | 'serp'
  | 'local'
  | 'ai-search'
  | 'content'
  | 'analytics'
  | 'spam';

/** Where a technique sits against Google's spam policies. Only techniques carry one; plain concepts do not. */
export type GlossaryHat = 'white' | 'grey' | 'black';

export const hatLabels: Record<GlossaryHat, { name: string; summary: string }> = {
  white: { name: 'White hat', summary: 'Within Google’s guidelines. Safe to use.' },
  grey: { name: 'Grey hat', summary: 'Not banned outright, but easy to tip into spam. Use with care.' },
  black: { name: 'Black hat', summary: 'Against Google’s spam policies. Risks a manual action or a ranking drop.' },
};

/** `heading` is the H1 of the category page and its H2 on the hub. */
export const glossaryCategories: { id: GlossaryCategory; name: string; heading: string; summary: string }[] = [
  { id: 'basics', name: 'SEO basics', heading: 'Basic SEO terms', summary: 'How search engines crawl, index and rank pages, and the kinds of SEO.' },
  { id: 'keywords', name: 'Keyword research', heading: 'Keyword research terms', summary: 'Search volume, keyword difficulty, search intent and how to pick keywords.' },
  { id: 'on-page', name: 'On-page SEO', heading: 'On-page SEO terms', summary: 'Title tags, meta descriptions, headings, URLs and images.' },
  { id: 'technical', name: 'Technical SEO', heading: 'Technical SEO terms', summary: 'Crawling, indexing, redirects, canonicals, sitemaps, structured data and page speed.' },
  { id: 'links', name: 'Link building', heading: 'Link building terms', summary: 'Backlinks, referring domains, anchor text, link authority and link attributes.' },
  { id: 'serp', name: 'SERP features', heading: 'SERP features explained', summary: 'Featured snippets, People Also Ask, AI Overviews and the rest of the results page.' },
  { id: 'local', name: 'Local SEO', heading: 'Local SEO terms', summary: 'Google Business Profile, the map pack, citations, reviews and geo-grids.' },
  { id: 'ai-search', name: 'AI search', heading: 'AI search and GEO terms', summary: 'AI visibility, GEO, AEO, LLM citations and how AI assistants choose sources.' },
  { id: 'content', name: 'Content SEO', heading: 'Content SEO terms', summary: 'Topic clusters, pillar pages, content gaps, audits and refreshes.' },
  { id: 'analytics', name: 'SEO analytics', heading: 'SEO analytics terms', summary: 'Search Console, GA4, impressions, CTR, rank tracking and reporting.' },
  { id: 'spam', name: 'Black hat and search spam', heading: 'Black hat SEO techniques and penalties', summary: 'White, grey and black hat SEO, spam techniques, penalties and recovery.' },
];

/** Where the term is put to work in OpenSEO. `href` is a path on this site. */
export interface GlossaryInOpenSeo {
  body: string;
  href: string;
  /** Link text, e.g. "Open the backlink checker". */
  label: string;
}

export interface GlossaryTerm {
  /** URL slug under /glossary, e.g. "anchor-text". */
  slug: string;
  /** The term as people search for it, e.g. "Anchor text". Used in the H1 ("What is anchor text?") and title. */
  term: string;
  /** Other names and abbreviations, e.g. ["link text"]. */
  aka?: string[];
  category: GlossaryCategory;
  /** Set on techniques only: shown as a label on the page and the A-Z card. */
  hat?: GlossaryHat;
  /** Black and grey hat techniques: what can happen to a site that uses it (manual action, demotion...). */
  risks?: string[];
  /** One-sentence definition, at most 155 characters. The meta description and the A-Z card. */
  short: string;
  /** "What is X?": the first paragraph is a 40-60 word definition that starts with the term. */
  definition: string[];
  /** "Why X matters for SEO". */
  why: string[];
  /** A practical section with its own keyword-led heading, e.g. "How to choose anchor text". */
  how?: { heading: string; steps?: string[]; body?: string[] };
  /** A short example: prose, or code when `code` is set. */
  example?: { body?: string; code?: string; label?: string };
  openseo?: GlossaryInOpenSeo;
  /** Slugs of related terms. Every one must exist in the glossary. */
  related: string[];
  faqs?: Faq[];
}
