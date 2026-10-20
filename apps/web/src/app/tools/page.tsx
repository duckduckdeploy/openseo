import { ArrowRight } from 'lucide-react';
import { ButtonLink } from '@/components/button';
import { CtaBand } from '@/components/cta-band';
import { YepapiOffer } from '@/components/yepapi-offer';
import { ToolCards } from '@/components/tool-cards';
import { tools } from '@/content/tools';
import { pageMeta } from '@/lib/metadata';
import type { ResearchTool } from '@/content/tools';
import { SIGN_UP_URL } from '@/lib/site';

export const metadata = pageMeta({
  title: 'Open Source SEO Tools - 15+ Free SEO Tools & Features',
  description: 'Open-source SEO tools: keyword analysis and difficulty, SERP checker, website traffic and authority, backlink and keyword gap, and an AI Overview checker.',
  path: '/tools',
  absoluteTitle: true,
});

/** The tools in three groups, each under a keyword-led heading. */
const GROUPS: { id: string; title: string; lede: string; slugs: string[] }[] = [
  {
    id: 'keyword-tools',
    title: 'Keyword research tools',
    lede: 'Find keywords, check how hard they are, see who ranks and what your competitors rank for that you do not.',
    slugs: ['keyword-analysis-tool', 'keyword-generator', 'keyword-difficulty-checker', 'serp-checker', 'seo-competitor-analysis', 'keyword-gap'],
  },
  {
    id: 'website-tools',
    title: 'Website and backlink tools',
    lede: 'Size up any website: its traffic, authority and links, one page in depth, and the links your competitors have.',
    slugs: ['website-seo-analysis', 'website-traffic-checker', 'website-authority-checker', 'on-page-seo-audit', 'backlink-checker', 'backlink-gap'],
  },
  {
    id: 'ai-local-tools',
    title: 'AI search and local SEO tools',
    lede: 'See where Google’s AI Overviews and AI assistants cite you, and how you rank on Google Maps across a city.',
    slugs: ['ai-overview-checker', 'ai-visibility-checker', 'local-rank-checker'],
  },
];

const inGroup = (slugs: string[]) => slugs.map((slug) => tools.find((tool) => tool.slug === slug)).filter((tool): tool is ResearchTool => Boolean(tool));

export default function ToolsPage() {
  return (
    <>
      <section aria-labelledby="tools-title" className="relative overflow-hidden">
        <div className="bg-glow pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="container-page relative py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow">{tools.length} research tools</p>
            <h1 id="tools-title" className="text-display mt-5 text-balance">
              SEO tools
            </h1>
            <p className="mt-7 text-xl leading-relaxed text-pretty text-muted md:text-[1.375rem]">
              Type a keyword, a domain or a page, pick a country (and a city or state where it helps), press Enter. Everything
              the tool shows loads together.
            </p>
            <div className="mt-10 flex justify-center">
              <ButtonLink href={SIGN_UP_URL} size="lg">
                Get started
                <ArrowRight className="size-4" aria-hidden="true" />
              </ButtonLink>
            </div>
          </div>
          <div className="mt-16 space-y-20 md:mt-20 md:space-y-24">
            {GROUPS.map((group) => (
              <section key={group.id} aria-labelledby={group.id}>
                <div className="mx-auto mb-10 max-w-2xl text-center">
                  <h2 id={group.id} className="text-title text-balance">
                    {group.title}
                  </h2>
                  <p className="mt-4 text-lg leading-relaxed text-pretty text-muted">{group.lede}</p>
                </div>
                <ToolCards tools={inGroup(group.slugs)} />
              </section>
            ))}
          </div>
        </div>
      </section>
      <div className="mb-20 md:mb-28">
        <YepapiOffer />
      </div>
      <CtaBand />
    </>
  );
}
