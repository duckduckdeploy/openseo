import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CtaBand } from '@/components/cta-band';
import { HatBadge } from '@/components/hat-badge';
import { JsonLd } from '@/components/json-ld';
import { plainText } from '@/components/rich-text';
import { glossaryCategories, termsIn } from '@/content/glossary';
import { pageMeta } from '@/lib/metadata';
import { breadcrumbList } from '@/lib/schema';
import { SITE_URL } from '@/lib/site';

interface TopicPageProps {
  params: Promise<{ category: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return glossaryCategories.map((category) => ({ category: category.id }));
}

const getCategory = (id: string) => glossaryCategories.find((category) => category.id === id);

/** "Technical SEO terms" becomes "Technical SEO Terms" for the title tag. */
const titleCase = (text: string) => text.replace(/(^|\s)([a-z])/g, (_, space: string, letter: string) => `${space}${letter.toUpperCase()}`).replace(/\b(And|Of|To)\b/g, (word) => word.toLowerCase());

export async function generateMetadata({ params }: TopicPageProps): Promise<Metadata> {
  const { category: id } = await params;
  const category = getCategory(id);
  if (!category) return {};
  const count = termsIn(category.id).length;
  return pageMeta({
    title: `${titleCase(category.heading)}: ${count} Definitions`,
    description: `${category.heading}, explained in plain English: ${category.summary.charAt(0).toLowerCase()}${category.summary.slice(1)} ${count} terms in the OpenSEO glossary.`.slice(0, 160),
    path: `/glossary/topics/${category.id}`,
  });
}

export default async function GlossaryTopicPage({ params }: TopicPageProps) {
  const { category: id } = await params;
  const category = getCategory(id);
  if (!category) notFound();
  const ordered = termsIn(category.id);

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'CollectionPage',
              name: category.heading,
              url: `${SITE_URL}/glossary/topics/${category.id}`,
              hasPart: ordered.map((term) => ({ '@type': 'DefinedTerm', name: term.term, url: `${SITE_URL}/glossary/${term.slug}` })),
            },
            breadcrumbList([
              { name: 'SEO glossary', path: '/glossary' },
              { name: category.name, path: `/glossary/topics/${category.id}` },
            ]),
          ],
        }}
      />
      <section aria-labelledby="topic-title" className="container-page py-16 md:py-24">
        <div className="mx-auto max-w-4xl">
          <nav aria-label="Breadcrumb" className="text-sm text-muted">
            <Link href="/glossary" className="hover:text-ink">
              SEO glossary
            </Link>
          </nav>
          <h1 id="topic-title" className="text-title mt-6 text-balance">
            {category.heading}
          </h1>
          <p className="text-lede mt-5 max-w-2xl text-pretty">
            {category.summary} {ordered.length} terms, each with what it means, why it matters for SEO and what to do about it.
          </p>
          <dl className="mt-12 divide-y divide-line border-y border-line">
            {ordered.map((term) => (
              <div key={term.slug} className="grid gap-1 py-5 sm:grid-cols-[17rem_1fr] sm:gap-6">
                <dt className="flex flex-wrap items-center gap-2 font-semibold">
                  <Link href={`/glossary/${term.slug}`} className="hover:text-accent-text hover:underline">
                    {term.term}
                  </Link>
                  {term.hat ? <HatBadge hat={term.hat} /> : null}
                </dt>
                <dd className="text-[0.9375rem] leading-relaxed text-muted">{plainText(term.short)}</dd>
              </div>
            ))}
          </dl>
          <nav aria-label="Other topics" className="mt-14">
            <h2 className="text-heading">More SEO glossary topics</h2>
            <ul className="mt-5 flex flex-wrap gap-2">
              {glossaryCategories
                .filter((other) => other.id !== category.id)
                .map((other) => (
                  <li key={other.id}>
                    <Link href={`/glossary/topics/${other.id}`} className="inline-flex rounded-full border border-line px-3.5 py-1.5 text-sm text-muted hover:border-accent-line hover:text-accent-text">
                      {other.heading}
                    </Link>
                  </li>
                ))}
            </ul>
          </nav>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
