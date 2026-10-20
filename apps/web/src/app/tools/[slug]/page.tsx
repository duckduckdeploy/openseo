import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, ArrowUpRight, Check } from 'lucide-react';
import { BrandRow, brandName } from '@/components/brand-icon';
import { ButtonLink } from '@/components/button';
import { CtaBand } from '@/components/cta-band';
import { FaqList } from '@/components/faq';
import { FreeTool } from '@/components/free-tool';
import { JsonLd } from '@/components/json-ld';
import { RelatedTerms } from '@/components/related-terms';
import { RichText } from '@/components/rich-text';
import { Screenshot } from '@/components/screenshot';
import { YepapiOffer } from '@/components/yepapi-offer';
import { ToolCards } from '@/components/tool-cards';
import { getTerm, whatIs } from '@/content/glossary';
import { getTool, tools } from '@/content/tools';
import { pageMeta } from '@/lib/metadata';
import { breadcrumbList, faqPage } from '@/lib/schema';
import { APP_URL, inSentence, PUBLIC_API_URL, SIGN_UP_URL, SITE_NAME, SITE_URL } from '@/lib/site';

interface ToolPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) return {};
  return pageMeta({ title: tool.seoTitle, description: tool.description, path: `/tools/${tool.slug}` });
}

const textLink = 'inline-flex items-center gap-1.5 font-medium text-accent-text underline-offset-4 hover:underline';

const steps = [
  { title: 'Search', body: 'A keyword, a domain or a page, with the country, city or state, and language next to it.' },
  { title: 'Read the results', body: 'Volume, difficulty, rankings and links side by side. A repeat search loads at once.' },
  { title: 'Get the whole picture', body: 'Everything loads together. The address holds the search, so you can share it.' },
];

/**
 * A research tool's own page: what it answers, each part of its screen as a section with the real
 * screenshot, what to use it for, what a search costs, questions, and the other tools.
 */
export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) notFound();
  const Icon = tool.icon;
  const others = tools.filter((other) => other.slug !== tool.slug);
  const open = `${APP_URL}${tool.appPath}`;
  const concept = getTerm(tool.glossary[0] ?? '');

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'SoftwareApplication',
              name: `${SITE_NAME} ${tool.name}`,
              url: `${SITE_URL}/tools/${tool.slug}`,
              description: tool.description,
              applicationCategory: 'BusinessApplication',
              operatingSystem: 'Web',
            },
            faqPage(tool.faqs),
            breadcrumbList([
              { name: 'SEO tools', path: '/tools' },
              { name: tool.h1, path: `/tools/${tool.slug}` },
            ]),
          ],
        }}
      />

      <article>
        {/* Header */}
        <header className="band-cream relative overflow-hidden">
          <div className="bg-glow pointer-events-none absolute inset-0" aria-hidden="true" />
          <div className="container-page relative pt-16 pb-20 md:pt-24 md:pb-24">
            <nav aria-label="Breadcrumb" className="text-center text-sm text-muted">
              <Link href="/tools" className="underline-offset-4 hover:text-ink hover:underline">
                SEO tools
              </Link>
              <span className="mx-2 text-faint" aria-hidden="true">
                /
              </span>
              <span aria-current="page" className="font-medium text-ink">
                {tool.h1}
              </span>
            </nav>
            <div className="mx-auto mt-10 max-w-3xl text-center">
              <span className="tile size-14 rounded-lg shadow-hard-sm">
                <Icon className="size-7" aria-hidden="true" strokeWidth={1.75} />
              </span>
              <h1 className="text-display mt-7 text-balance">{tool.h1}</h1>
              <p className="mt-6 font-display text-2xl font-semibold text-balance text-ink md:text-[1.75rem]">{tool.headline}</p>
              <p className="mt-5 text-xl leading-relaxed text-pretty text-muted md:text-[1.375rem]">{tool.lede}</p>
              {tool.worksWith ? (
                <BrandRow className="mt-8" items={tool.worksWith.map((brand) => ({ brand, name: brandName(brand) }))} />
              ) : null}
              <ul className="mt-8 flex flex-wrap justify-center gap-x-7 gap-y-3 text-[0.9375rem]">
                {tool.points.map((point) => (
                  <li key={point} className="inline-flex items-center gap-2">
                    <span className="inline-flex size-5 items-center justify-center rounded-full bg-accent text-accent-fg">
                      <Check className="size-3" aria-hidden="true" strokeWidth={3} />
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
              {tool.freeTool ? (
                <div className="mt-10">
                  <FreeTool kind={tool.freeTool} apiUrl={PUBLIC_API_URL} appHref={open} signUpHref={SIGN_UP_URL} />
                </div>
              ) : null}
              <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
                <ButtonLink href={open} size={tool.freeTool ? 'md' : 'lg'} variant={tool.freeTool ? 'secondary' : 'primary'}>
                  Open {inSentence(tool.name)}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </ButtonLink>
                <ButtonLink href={tool.guide} variant="secondary" size="lg">
                  Read the guide
                </ButtonLink>
              </div>
              <p className="mt-5 text-[0.9375rem] text-muted">
                {tool.total}, paid per lookup from your own key.{' '}
                <a href="#costs" className={textLink}>
                  What it costs
                </a>
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-6xl md:mt-20">
              <Screenshot name={tool.hero.shot} alt={tool.hero.alt} window glow label={`app.openseo.gg${tool.appPath}`} priority />
            </div>
          </div>
        </header>

        {/* Each part of the screen */}
        {tool.parts.map((part, index) => (
          <section key={part.shot} aria-labelledby={`part-${part.shot}`} className={index % 2 === 0 ? 'band-white border-y border-line' : 'band-cream'}>
            <div className="container-page py-20 md:py-28">
              <div className="mx-auto max-w-3xl text-center">
                <h2 id={`part-${part.shot}`} className="text-title">
                  {part.title}
                </h2>
                <p className="mt-6 text-xl leading-relaxed text-pretty text-muted">{part.body}</p>
              </div>
              <div className="mx-auto mt-12 max-w-6xl md:mt-14">
                <Screenshot name={part.shot} alt={part.alt} />
              </div>
            </div>
          </section>
        ))}

        {/* How a search works */}
        <section aria-labelledby="how-title" className="band-peach">
          <div className="container-page py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow">How it works</p>
            <h2 id="how-title" className="text-title mt-4">
              How to use the {inSentence(tool.name)}
            </h2>
          </div>
          <ol className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-5 md:grid-cols-3">
            {steps.map((step, index) => (
              <li key={step.title} className="card p-7">
                <span className="inline-flex size-10 items-center justify-center rounded-full bg-orange font-display text-lg font-bold text-night">{index + 1}</span>
                <h3 className="card-title mt-5">{step.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{step.body}</p>
              </li>
            ))}
          </ol>
          </div>
        </section>

        {/* What to use it for: the night band in the middle of the page */}
        <section aria-labelledby="uses-title" className="band-night">
          <div className="container-page py-20 md:py-28">
            <div className="mx-auto max-w-3xl text-center">
              <p className="eyebrow">Use it to</p>
              <h2 id="uses-title" className="text-title mt-4">
                {tool.h1} use cases
              </h2>
            </div>
            <ul className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-5 sm:grid-cols-2">
              {tool.uses.map((use) => (
                <li key={use.title} className="card flex gap-5 p-7">
                  <span className="tile tile-peach size-10 shrink-0">
                    <ArrowUpRight className="size-4" aria-hidden="true" strokeWidth={2.25} />
                  </span>
                  <div>
                    <h3 className="card-title">{use.title}</h3>
                    <p className="mt-2 leading-relaxed text-muted">{use.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* What a search costs */}
        <section id="costs" aria-labelledby="costs-title" className="band-cream container-page scroll-mt-20 py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow">What it costs</p>
            <h2 id="costs-title" className="text-title mt-4">
              {tool.h1} pricing
            </h2>
            <p className="mt-6 text-xl leading-relaxed text-pretty text-muted">
              <strong className="font-semibold text-ink">{tool.total}.</strong> You pay the data provider for the lookups a search runs, from your own key, under a monthly limit you set. {tool.costNote}
            </p>
          </div>
          <div className="mx-auto mt-12 max-w-3xl overflow-hidden rounded-lg border border-line bg-surface shadow-hard-sm">
            <table className="w-full border-collapse text-left">
              <caption className="sr-only">What one {inSentence(tool.name)} search runs and costs</caption>
              <thead>
                <tr>
                  <th scope="col" className="border-b border-line bg-sunken px-5 py-3 text-xs font-semibold tracking-wide text-faint uppercase">
                    Part of the search
                  </th>
                  <th scope="col" className="border-b border-line bg-sunken px-5 py-3 text-right text-xs font-semibold tracking-wide text-faint uppercase">
                    Price
                  </th>
                </tr>
              </thead>
              <tbody>
                {tool.costs.map((cost) => (
                  <tr key={cost.action} className="border-b border-line last:border-b-0">
                    <td className="px-5 py-3.5">{cost.action}</td>
                    <td className="px-5 py-3.5 text-right font-mono text-sm tabular-nums whitespace-nowrap">{cost.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-8 text-center">
            <Link href="/pricing" className={textLink}>
              How pricing works
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </p>
        </section>

        <YepapiOffer />

        {/* The concept behind the tool, from the glossary */}
        {concept ? (
          <section aria-labelledby="concept-title" className="band-peach">
            <div className="container-page py-20 md:py-28">
              <div className="mx-auto max-w-3xl text-center">
                <p className="eyebrow">SEO glossary</p>
                <h2 id="concept-title" className="text-title mt-4">
                  {whatIs(concept)}
                </h2>
                <p className="mt-6 text-xl leading-relaxed text-pretty text-muted">
                  <RichText text={concept.definition[0] ?? concept.short} />
                </p>
                <p className="mt-8">
                  <Link href={`/glossary/${concept.slug}`} className={textLink}>
                    {concept.term}, explained
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </p>
              </div>
              <div className="mt-16 md:mt-20">
                <RelatedTerms slugs={tool.glossary.slice(1)} />
              </div>
            </div>
          </section>
        ) : null}

        {/* Questions */}
        <section aria-labelledby="faq-title" className="band-white border-t border-line">
          <div className="container-page py-20 md:py-28">
            <div className="mx-auto max-w-3xl">
              <h2 id="faq-title" className="text-title text-center">
                {tool.h1} FAQ
              </h2>
              <div className="mt-12">
                <FaqList faqs={tool.faqs} />
              </div>
            </div>
          </div>
        </section>

        {/* The other tools */}
        <section aria-labelledby="more-title" className="band-cream container-page py-20 md:py-28">
          <h2 id="more-title" className="text-title text-center">
            More SEO tools
          </h2>
          <div className="mt-12">
            <ToolCards tools={others} />
          </div>
        </section>
      </article>
      <CtaBand />
    </>
  );
}
