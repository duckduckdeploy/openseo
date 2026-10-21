// Isometric card illustrations of the SEO tools, made with media/tool-images.mjs (outside the repo).
// Keyed by tool slug. Each alt text describes the picture and names the tool's idea once.

export interface ToolImage {
  src: string;
  width: number;
  height: number;
  alt: string;
}

const image = (slug: string, alt: string): ToolImage => ({ src: `/images/tools/${slug}.webp`, width: 1600, height: 1000, alt });

export const toolImages: Record<string, ToolImage> = {
  'keyword-analysis-tool': image('keyword-analysis-tool', 'A magnifying glass over a keyword card, ringed by a difficulty gauge, a volume bar chart and a globe: keyword analysis.'),
  'keyword-generator': image('keyword-generator', 'A seed card growing into a tree whose branches end in dozens of keyword cards, like a keyword generator.'),
  'keyword-difficulty-checker': image('keyword-difficulty-checker', 'Keyword cards on a conveyor belt sorted into bins of rising height beside a gauge, for checking keyword difficulty.'),
  'serp-checker': image('serp-checker', 'A tall stack of search result slabs behind a desktop monitor and a phone, under a magnifying glass: a SERP checker.'),
  'seo-audit': image('seo-audit', 'A website block with a clipboard of check marks, beside tiles for a rising chart, a chain link and a target: a full SEO audit.'),
  'website-seo-analysis': image('website-seo-analysis', 'A website window surrounded by floating trend, donut and bar chart tiles and a globe, for website SEO analysis.'),
  'website-traffic-checker': image('website-traffic-checker', 'Website towers of different heights with streams of visitors flowing into them, comparing website traffic.'),
  'website-authority-checker': image('website-authority-checker', 'Cylinders rising from short to tall, wrapped in glowing link lines and small cubes: website authority growing.'),
  'on-page-seo-audit': image('on-page-seo-audit', 'A web page under a scanning light while a small robot checks items on a clipboard: an on-page SEO audit.'),
  'backlink-checker': image('backlink-checker', 'A central website block linked by glowing cables and bridges to a ring of smaller sites, like a backlink map.'),
  'seo-competitor-analysis': image('seo-competitor-analysis', 'Two website panels facing each other across a chessboard with binoculars and flags: SEO competitor analysis.'),
  'keyword-gap': image('keyword-gap', 'Two overlapping round platforms of keyword cards, with the cards only one side holds glowing: a keyword gap.'),
  'backlink-gap': image('backlink-gap', 'Server blocks cabled to a shared cluster of sites while one block gets its first orange cable: a backlink gap.'),
  'ai-overview-checker': image('ai-overview-checker', 'A search bar under a glowing AI answer panel linked to source cards, one card highlighted: an AI Overview check.'),
  'ai-visibility-checker': image('ai-visibility-checker', 'Four chat bubbles drawing lines down to stacks of source cards, one shared source lit up: AI visibility.'),
  'local-rank-checker': image('local-rank-checker', 'A city map divided into a grid with map pins of different heights in each square: local rank checking.'),
};
