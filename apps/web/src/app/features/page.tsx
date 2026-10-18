import { CtaBand } from '@/components/cta-band';
import { FeatureGrid } from '@/components/feature-grid';
import { SectionHeader, StatusNote } from '@/components/section';
import { features } from '@/content/features';
import { pageMeta } from '@/lib/metadata';

export const metadata = pageMeta({
  title: 'SEO Software Features: Rank Tracking to AI Visibility',
  description:
    'OpenSEO features: rank tracking, Search Console reports, technical site audits, AI visibility tracking, local geo-grids and an SEO MCP server.',
  path: '/features',
});

export default function FeaturesPage() {
  return (
    <>
      <section aria-labelledby="features-title" className="container-page py-20 md:py-28 xl:py-32">
        <SectionHeader
          as="h1"
          eyebrow={`${features.length} features`}
          id="features-title"
          title="OpenSEO features"
          lede="Each feature has its own page: what it does, what you can do with it, and what each action costs."
        />
        <div className="mx-auto mt-10 max-w-2xl">
          <StatusNote>
            OpenSEO is an early project in active development. The features below are being built, and some may not be
            available yet.
          </StatusNote>
        </div>
        <div className="mt-14 md:mt-16">
          <FeatureGrid headingLevel="h2" />
        </div>
      </section>
      <CtaBand />
    </>
  );
}
