import { BarChart3, Bot, ClipboardCheck, FileSearch, Gauge, Globe, Grid3x3, Lightbulb, Link2, ListOrdered, Network, ScanSearch, Search, Sparkles, Swords, TrendingUp } from "lucide-react";

/** The standalone SEO tools, in the order the tools page and the sidebar show them. */
export const TOOLS = [
  { slug: "keyword-overview", title: "Keyword overview", blurb: "Volume, difficulty, CPC, intent and trend for one keyword, with related searches and who ranks.", icon: Search, group: "Keywords" },
  { slug: "keyword-ideas", title: "Keyword ideas", blurb: "Hundreds of ideas or related searches from a seed term, with filters for volume, difficulty and length.", icon: Lightbulb, group: "Keywords" },
  { slug: "keyword-difficulty-checker", title: "Keyword difficulty checker", blurb: "Difficulty of up to 1,000 keywords at once, sorted into easy, medium and hard.", icon: Gauge, group: "Keywords" },
  { slug: "serp-checker", title: "SERP checker", blurb: "The live top 20 Google results for a keyword, on desktop or mobile, with features and questions.", icon: ListOrdered, group: "Keywords" },
  { slug: "seo-audit", title: "SEO audit", blurb: "A full SEO audit of any website: traffic, keywords, backlinks, competitors and the opportunities to act on first.", icon: ClipboardCheck, group: "Domains" },
  { slug: "site-audit", title: "Site audit", blurb: "Crawl any website, up to 500 pages, for 100+ technical issues: status codes, redirects, broken links, canonicals and AI crawler access. Export the fixes for a coding agent.", icon: ScanSearch, group: "Domains" },
  { slug: "domain-overview", title: "Domain overview", blurb: "Estimated traffic, ranking spread, top keywords and top pages of any website.", icon: Globe, group: "Domains" },
  { slug: "website-traffic-checker", title: "Website traffic checker", blurb: "Estimated Google traffic of up to 100 websites side by side, organic and paid.", icon: TrendingUp, group: "Domains" },
  { slug: "website-authority-checker", title: "Website authority checker", blurb: "Domain Rating, backlinks and referring domains of up to 10 sites compared.", icon: Network, group: "Domains" },
  { slug: "page-analyser", title: "Page analyser", blurb: "One URL's authority, backlinks, traffic and on-page basics: title, description, headings and links.", icon: FileSearch, group: "Domains" },
  { slug: "backlink-checker", title: "Backlink checker", blurb: "Backlinks, referring domains, anchors and history of any domain or page, worldwide.", icon: Link2, group: "Domains" },
  { slug: "competitors", title: "Competitors", blurb: "Who competes with a site in Google, for its domain or for a list of keywords.", icon: Swords, group: "Domains" },
  { slug: "ai-overview-checker", title: "AI Overview checker", blurb: "Which of your keywords show a Google AI Overview, which sites it cites, and every SERP feature.", icon: Sparkles, group: "AI and local" },
  { slug: "ai-visibility-checker", title: "AI visibility checker", blurb: "Ask ChatGPT, Gemini, Claude and Perplexity one question and see which sites each cites, in order.", icon: Bot, group: "AI and local" },
  { slug: "local-rank-checker", title: "Local rank checker", blurb: "Google Maps rankings for a keyword across a grid around any city, for every business at once.", icon: Grid3x3, group: "AI and local" },
  { slug: "competitors?tab=gap", title: "Keyword gap", blurb: "Keywords a competitor ranks for that a site does not, with both positions.", icon: BarChart3, group: "Domains" },
  { slug: "backlink-checker?tab=intersect", title: "Backlink gap", blurb: "Sites that link to your competitors but not to you: a ready list of link prospects.", icon: Link2, group: "Domains" },
] as const;

