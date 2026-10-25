import { CtaBand } from '@/components/cta-band';
import { YepapiOffer } from '@/components/yepapi-offer';
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
            OpenSEO is released and gets active updates, with new features added regularly.
          </StatusNote>
        </div>
        <div className="mt-14 md:mt-16">
          <FeatureGrid headingLevel="h2" />
        </div>
      </section>
      <div className="mb-20 md:mb-28">
        <YepapiOffer />
      </div>
      <CtaBand />
    </>
  );
}
