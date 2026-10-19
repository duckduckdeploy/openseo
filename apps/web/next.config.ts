import type { NextConfig } from 'next';

/**
 * Pages that moved, old path to new, each a permanent (301) redirect. Destinations are always the
 * current address, so no redirect chains: when a page moves again, update its old entries too.
 */
const MOVED: Record<string, string> = {
  // Feature pages that became tool pages.
  '/features/keyword-research': '/tools/keyword-analysis-tool',
  '/features/domain-overview': '/tools/website-seo-analysis',
  '/features/backlinks': '/tools/backlink-checker',
  '/features/competitor-research': '/tools/seo-competitor-analysis',
  // Slugs renamed to their head keywords on 2026-10-19 (SEO.md: slug = head keyword).
  '/tools/keyword-overview': '/tools/keyword-analysis-tool',
  '/tools/keyword-ideas': '/tools/keyword-generator',
  '/tools/domain-overview': '/tools/website-seo-analysis',
  '/tools/page-analyser': '/tools/on-page-seo-audit',
  '/tools/competitors': '/tools/seo-competitor-analysis',
  '/features/rank-tracking': '/features/keyword-rank-tracker',
  '/features/search-performance': '/features/search-console-dashboard',
  '/features/ai-visibility': '/features/ai-visibility-tracker',
  '/features/mcp-and-api': '/features/seo-mcp-server',
  '/compare/ahrefs': '/compare/ahrefs-alternative',
  '/compare/semrush': '/compare/semrush-alternative',
};

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // The docs read the audit check list straight from the crawler package (@openseo/crawler/catalog).
  transpilePackages: ['@openseo/crawler', '@openseo/shared'],
  async redirects() {
    return Object.entries(MOVED).map(([source, destination]) => ({ source, destination, permanent: true }));
  },
};

export default nextConfig;
