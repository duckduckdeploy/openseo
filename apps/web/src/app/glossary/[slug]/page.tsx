import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, TriangleAlert } from 'lucide-react';
import { CodeBlock } from '@/components/code-block';
import { CtaBand } from '@/components/cta-band';
import { FaqList } from '@/components/faq';
import { HatBadge } from '@/components/hat-badge';
import { JsonLd } from '@/components/json-ld';
import { RelatedTerms } from '@/components/related-terms';
import { plainText, RichText } from '@/components/rich-text';
import { categoryName, getTerm, glossary, glossaryCategories, hatLabels, nameInSentence, shortName, titleCaseName, whatIs, whyHeading } from '@/content/glossary';
import { pageMeta } from '@/lib/metadata';
import { breadcrumbList, faqPage } from '@/lib/schema';
import { SITE_URL } from '@/lib/site';

interface TermPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return glossary.map((term) => ({ slug: term.slug }));
}


export async function generateMetadata({ params }: TermPageProps): Promise<Metadata> {
  const { slug } = await params;
  const term = getTerm(slug);
  if (!term) return {};
  // "What Is a Backlink? Definition and Examples", kept to 50 characters before the " · OpenSEO" suffix.
  const question = whatIs(term, titleCaseName(term)).replace(/^What (is|are)/, (_, verb: string) => `What ${verb === 'is' ? 'Is' : 'Are'}`);
  const suffix = term.hat === 'black' ? ' Risks and Examples' : ' Definition and Examples';
  return pageMeta({
    title: question.length + suffix.length <= 50 ? `${question}${suffix}` : question,
    description: plainText(term.short),
    path: `/glossary/${term.slug}`,
  });
}

const textLink = 'inline-flex items-center gap-1.5 font-medium text-accent-text underline-offset-4 hover:underline';

export default async function GlossaryTermPage({ params }: TermPageProps) {
  const { slug } = await params;
  const term = getTerm(slug);
  if (!term) notFound();

  const name = shortName(term);
  const inSentence = nameInSentence(term);
  const category = glossaryCategories.find((c) => c.id === term.category);
  const index = glossary.indexOf(term);
  const previous = glossary[index - 1];
  const next = glossary[index + 1];

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'DefinedTerm',
              name: term.term,
              alternateName: term.aka,
              description: plainText(term.definition[0] ?? term.short),
              url: `${SITE_URL}/glossary/${term.slug}`,
              inDefinedTermSet: { '@type': 'DefinedTermSet', name: 'OpenSEO SEO glossary', url: `${SITE_URL}/glossary` },
            },
            ...(term.faqs?.length ? [faqPage(term.faqs)] : []),
            breadcrumbList([
              { name: 'SEO glossary', path: '/glossary' },
              { name: categoryName(term.category), path: `/glossary/topics/${term.category}` },
              { name: term.term, path: `/glossary/${term.slug}` },
            ]),
          ],
        }}
      />

      <article className="container-page py-16 md:py-24">
        <div className="mx-auto max-w-3xl">
          <nav aria-label="Breadcrumb" className="text-sm text-muted">
            <Link href="/glossary" className="hover:text-ink">
              SEO glossary
            </Link>
            <span className="mx-2 text-faint" aria-hidden="true">
              /
            </span>
            <Link href={`/glossary/topics/${term.category}`} className="font-medium text-accent-text hover:underline">
              {category?.name}
            </Link>
          </nav>

          <h1 className="text-title mt-6 text-balance">{term.term}</h1>
          {term.hat || term.aka?.length ? (
            <div className="mt-5 flex flex-wrap items-center gap-3 text-[0.9375rem] text-muted">
              {term.hat ? <HatBadge hat={term.hat} size="md" /> : null}
              {term.aka?.length ? <span>Also called {term.aka.join(', ')}</span> : null}
            </div>
          ) : null}

          {term.hat ? (
            <p className={`mt-8 flex items-start gap-3 rounded-md border px-4 py-3 text-[0.9375rem] ${term.hat === 'black' ? 'border-ink bg-sunken text-ink' : 'border-line bg-surface text-ink'}`}>
              {term.hat === 'black' ? <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" /> : null}
              <span>
                <strong className="font-semibold">{hatLabels[term.hat].name}.</strong> {hatLabels[term.hat].summary}{' '}
                {term.slug === 'white-vs-grey-vs-black-hat-seo' ? null : (
                  <Link href="/glossary/white-vs-grey-vs-black-hat-seo" className="font-medium text-accent-text underline underline-offset-4">
                    White, grey and black hat SEO compared
                  </Link>
                )}
              </span>
            </p>
          ) : null}

          <div className="prose-doc mt-10">
            <h2 id="definition">{whatIs(term)}</h2>
            {term.definition.map((paragraph) => (
              <p key={paragraph}>
                <RichText text={paragraph} />
              </p>
            ))}

            <h2 id="why">{whyHeading(term)}</h2>
            {term.why.map((paragraph) => (
              <p key={paragraph}>
                <RichText text={paragraph} />
              </p>
            ))}

            {term.risks?.length ? (
              <>
                <h2 id="risks">Risks of {inSentence}</h2>
                <ul>
                  {term.risks.map((risk) => (
                    <li key={risk}>
                      <RichText text={risk} />
                    </li>
                  ))}
                </ul>
              </>
            ) : null}

            {term.how ? (
              <>
                <h2 id="how">{term.how.heading}</h2>
                {term.how.body?.map((paragraph) => (
                  <p key={paragraph}>
                    <RichText text={paragraph} />
                  </p>
                ))}
                {term.how.steps?.length ? (
                  <ol>
                    {term.how.steps.map((step) => (
                      <li key={step}>
                        <RichText text={step} />
                      </li>
                    ))}
                  </ol>
                ) : null}
              </>
            ) : null}

            {term.example ? (
              <>
                <h2 id="example">{name} example</h2>
                {term.example.body
                  ? term.example.body.split('\n').map((line) => (
                      <p key={line}>
                        <RichText text={line} />
                      </p>
                    ))
                  : null}
                {term.example.code ? <CodeBlock label={term.example.label ?? 'Example'} code={term.example.code} /> : null}
              </>
            ) : null}
          </div>

          {term.openseo ? (
            <aside aria-labelledby="openseo-title" className="mt-14 rounded-lg border border-accent-line bg-accent-soft p-7">
              <h2 id="openseo-title" className="text-heading">
                {name} in OpenSEO
              </h2>
              <p className="mt-3 leading-relaxed text-muted">
                <RichText text={term.openseo.body} />
              </p>
              <p className="mt-5">
                <Link href={term.openseo.href} className={textLink}>
                  {term.openseo.label}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </p>
            </aside>
          ) : null}

          {term.faqs?.length ? (
            <section aria-labelledby="faq-title" className="mt-16">
              <h2 id="faq-title" className="text-title">
                {name} FAQ
              </h2>
              <div className="mt-8">
                <FaqList faqs={term.faqs} />
              </div>
            </section>
          ) : null}

          <div className="mt-16">
            <RelatedTerms slugs={term.related} align="left" />
          </div>

          <nav aria-label="More terms" className="mt-16 grid grid-cols-1 gap-4 border-t border-line pt-10 sm:grid-cols-2">
            {previous ? (
              <Link href={`/glossary/${previous.slug}`} className="group rounded-lg border border-line bg-surface p-5 transition-colors duration-150 hover:border-accent-line">
                <span className="inline-flex items-center gap-2 text-sm text-muted">
                  <ArrowLeft className="size-3.5" aria-hidden="true" />
                  Previous term
                </span>
                <span className="mt-1.5 block font-display text-lg font-semibold transition-colors group-hover:text-accent-text">{previous.term}</span>
              </Link>
            ) : (
              <span className="hidden sm:block" />
            )}
            {next ? (
              <Link href={`/glossary/${next.slug}`} className="group rounded-lg border border-line bg-surface p-5 transition-colors duration-150 hover:border-accent-line sm:text-right">
                <span className="inline-flex items-center gap-2 text-sm text-muted">
                  Next term
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </span>
                <span className="mt-1.5 block font-display text-lg font-semibold transition-colors group-hover:text-accent-text">{next.term}</span>
              </Link>
            ) : null}
          </nav>
          <p className="mt-8 text-center">
            <Link href="/glossary" className={textLink}>
              Back to the SEO glossary
            </Link>
          </p>
        </div>
      </article>
      <CtaBand title="Put the terms to work" body="Every term here is something OpenSEO measures. It is open source: start online in a minute, or run it on your own server." />
    </>
  );
}
