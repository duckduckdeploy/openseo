import { comparisons } from '@/content/compare';
import { docPages } from '@/content/docs';
import { features } from '@/content/features';
import { tools } from '@/content/tools';
import { GITHUB_URL, MCP_URL, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site';

// llms.txt (llmstxt.org): a plain Markdown map of the site for AI assistants, built from the same content as the pages.
export const dynamic = 'force-static';

const link = (title: string, path: string, note: string) => `- [${title}](${SITE_URL}${path}): ${note}`;

export function GET() {
  const body = [
    `# ${SITE_NAME}`,
    '',
    `> ${SITE_DESCRIPTION}`,
    '',
    'OpenSEO is an open-source (MIT) SEO suite: keyword research, rank tracking, backlinks, site audits, AI visibility, local rank tracking and Search Console reports. It runs online or self-hosted with Docker, and AI agents can use every feature through its MCP server and REST API.',
    '',
    `- Source code: ${GITHUB_URL}`,
    `- MCP server: ${MCP_URL}`,
    '',
    '## SEO tools',
    '',
    ...tools.map((tool) => link(tool.h1, `/tools/${tool.slug}`, tool.summary)),
    '',
    '## Features',
    '',
    ...features.map((feature) => link(feature.name, `/features/${feature.slug}`, feature.summary)),
    '',
    '## Docs',
    '',
    ...docPages.map((doc) => link(doc.h1, `/docs/${doc.slug}`, doc.description)),
    '',
    '## Optional',
    '',
    link('Pricing', '/pricing', 'What each action costs, paid per lookup with a monthly limit.'),
    ...comparisons.map((c) => link(`${c.name} alternative`, `/compare/${c.slug}`, c.summary)),
    link('Open-source SEO tools', '/open-source-seo-tools', 'The open-source SEO tools worth running: rank trackers, crawlers, site audits and full suites, compared.'),
    link('Best SEO MCP servers', '/best-seo-mcp-servers', 'SEO MCP servers for Claude, ChatGPT and Cursor compared: OpenSEO, DataForSEO, Ahrefs, Semrush, SE Ranking and more, with licence, hosting and price.'),
    link('SEO glossary', '/glossary', 'SEO terms explained in plain English.'),
    '',
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
