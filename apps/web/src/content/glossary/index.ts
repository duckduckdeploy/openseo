import { terms as aiContent } from './ai-content';
import { terms as analyticsSerp } from './analytics-serp';
import { terms as basicsOnPage } from './basics-on-page';
import { terms as keywords } from './keywords';
import { terms as linksLocal } from './links-local';
import { terms as spam } from './spam';
import { terms as technicalCrawl } from './technical-crawl';
import { terms as technicalRender } from './technical-render';
import { glossaryCategories, type GlossaryCategory, type GlossaryTerm } from './types';

export * from './types';

/** Every glossary entry, A to Z. */
export const glossary: GlossaryTerm[] = [
  ...basicsOnPage,
  ...keywords,
  ...technicalCrawl,
  ...technicalRender,
  ...linksLocal,
  ...aiContent,
  ...analyticsSerp,
  ...spam,
].sort((a, b) => sortKey(a.term).localeCompare(sortKey(b.term), 'en'));

const bySlug = new Map(glossary.map((term) => [term.slug, term]));

export const getTerm = (slug: string) => bySlug.get(slug);

export const termsIn = (category: GlossaryCategory) => glossary.filter((term) => term.category === category);

export const categoryName = (category: GlossaryCategory) => glossaryCategories.find((c) => c.id === category)?.name ?? category;

/** Sort and A-Z letter key: ignores quotes and a leading "rel=". */
function sortKey(term: string) {
  return term.replace(/^rel="?/i, '').replace(/^["“]/, '').toLowerCase();
}

/** The A-Z letter a term is filed under: "#" for terms starting with a digit. */
export function letterOf(term: GlossaryTerm) {
  const first = sortKey(term.term).charAt(0).toUpperCase();
  return /[A-Z]/.test(first) ? first : '#';
}

/** The term without its expansion: "Cost per click (CPC)" becomes "Cost per click". Acronym-led names keep the acronym: "SEO (search engine optimization)" becomes "SEO". */
export function shortName(term: GlossaryTerm) {
  return NAME_OVERRIDES[term.slug] ?? term.term.replace(/\s*\([^)]*\)\s*$/, '');
}

/** Names too long to repeat in every heading. */
const NAME_OVERRIDES: Record<string, string> = {
  'white-vs-grey-vs-black-hat-seo': 'White, grey and black hat SEO',
};

/** Plural names take "are" and "matter": "What are Core Web Vitals?". */
export function isPlural(term: GlossaryTerm) {
  const last = shortName(term).split(/\s+/).pop() ?? '';
  return /[^su]s$/i.test(last) && !/^(Places|Insights|analysis|HTTPS)$/i.test(last);
}

/** Section heading on why the term matters. Names that already end in "SEO" skip the "for SEO". */
export function whyHeading(term: GlossaryTerm) {
  const name = nameInSentence(term);
  const endsInSeo = name.endsWith('SEO');
  return `Why ${name} ${isPlural(term) ? 'matter' : 'matters'}${endsInSeo ? '' : ' for SEO'}`;
}

const SMALL_WORDS = /^(a|an|and|or|of|to|in|on|for|by|vs|the|with)$/;

/** Title Case for title tags: "Geo-grid rank tracking" becomes "Geo-Grid Rank Tracking". Acronyms and code stay as they are. */
export function titleCaseName(term: GlossaryTerm) {
  const name = shortName(term);
  if (/^rel=/.test(name)) return name;
  return name
    .split(' ')
    .map((word, index) =>
      index > 0 && SMALL_WORDS.test(word) ? word : word.replace(/(^|-)([a-z])/g, (_, dash: string, letter: string) => `${dash}${letter.toUpperCase()}`),
    )
    .join(' ');
}

/** The name inside a sentence: lower-cases the first letter unless the word is an acronym or a proper name. */
export function nameInSentence(term: GlossaryTerm) {
  const name = shortName(term);
  return /^[A-Z][a-z]/.test(name) && !PROPER.test(name) ? name.charAt(0).toLowerCase() + name.slice(1) : name;
}

const PROPER = /^(Google|Googlebot|Bing|Apple|Lighthouse|PageSpeed|PageRank|Perplexity|ChatGPT|Core Web|Domain Rating|Domain Authority|URL Rating|Largest|Interaction|Cumulative|Time to First|Open Graph|Twitter|Search Quality|Search Console|Looker|Knowledge Graph|Model Context|SpamBrain|IndexNow|HARO|LocalBusiness|People Also Ask|Top stories|Shopping|Key events|Your Money)/;

/** "What is anchor text?" / "What is a backlink?" — countable singular terms take an article. */
export function whatIs(term: GlossaryTerm, name = nameInSentence(term)) {
  if (isPlural(term)) return `What are ${name}?`;
  const article = COUNTABLE.has(term.slug) ? (/^([aeiou]|SEO|HTML|XML|H1|LLM)/i.test(name) && !/^(URL|user|UGC)/i.test(name) ? 'an ' : 'a ') : '';
  return `What is ${article}${name}?`;
}

/** Terms whose question form takes "a" or "an". Uncountable and plural terms are left out. */
const COUNTABLE = new Set<string>([
  'search-engine', 'serp', 'search-algorithm', 'google-algorithm-update', 'core-update', 'web-crawler', 'seo-audit', 'seo-strategy',
  'keyword', 'seed-keyword', 'primary-keyword', 'keyword-gap', 'parent-topic', 'keyword-trend',
  'title-tag', 'meta-description', 'h1-tag', 'url-slug', 'seo-friendly-url', 'meta-robots-tag', 'meta-keywords', 'twitter-card', 'on-page-checklist',
  'xml-sitemap', 'html-sitemap', 'canonical-tag', 'orphan-page', '301-redirect', '302-redirect', 'redirect-chain', 'redirect-loop', '404-error', 'soft-404',
  'user-agent', 'cdn', 'site-health-score',
  'backlink', 'referring-domain', 'dofollow-link', 'nofollow-link', 'link-profile', 'disavow',
  'featured-snippet', 'knowledge-panel', 'image-pack', 'video-carousel',
  'local-pack', 'geo-grid', 'service-area-business',
  'llm', 'entity',
  'topic-cluster', 'pillar-page', 'content-gap', 'content-audit', 'content-brief', 'faq-page',
  'landing-page', 'seo-visibility',
  'manual-action', 'algorithmic-penalty', 'reconsideration-request', 'private-blog-network',
]);
