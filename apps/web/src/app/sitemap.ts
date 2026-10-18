import type { MetadataRoute } from 'next';
import { docPages } from '@/content/docs';
import { comparisons } from '@/content/compare';
import { features } from '@/content/features';
import { glossary, glossaryCategories } from '@/content/glossary';
import { tools } from '@/content/tools';
import { SITE_URL } from '@/lib/site';

// Privacy and terms are unreviewed drafts and are marked noindex, so they are left out.
export default function sitemap(): MetadataRoute.Sitemap {
  const paths: { path: string; priority: number }[] = [
    { path: '/', priority: 1 },
    { path: '/tools', priority: 0.9 },
    ...tools.map((tool) => ({ path: `/tools/${tool.slug}`, priority: 0.9 })),
    { path: '/features', priority: 0.9 },
    { path: '/pricing', priority: 0.9 },
    { path: '/docs', priority: 0.7 },
    ...features.map((feature) => ({ path: `/features/${feature.slug}`, priority: 0.8 })),
    ...docPages.map((doc) => ({ path: `/docs/${doc.slug}`, priority: 0.6 })),
    ...comparisons.map((c) => ({ path: `/compare/${c.slug}`, priority: 0.6 })),
    { path: '/glossary', priority: 0.8 },
    ...glossaryCategories.map((category) => ({ path: `/glossary/topics/${category.id}`, priority: 0.6 })),
    ...glossary.map((term) => ({ path: `/glossary/${term.slug}`, priority: 0.6 })),
  ];

  return paths.map(({ path, priority }) => {
    const url = `${SITE_URL}${path === '/' ? '' : path}`;
    return { url, changeFrequency: 'weekly', priority, alternates: { languages: { en: url, 'x-default': url } } };
  });
}
