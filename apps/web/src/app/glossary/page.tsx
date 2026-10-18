import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CtaBand } from '@/components/cta-band';
import { HatBadge } from '@/components/hat-badge';
import { JsonLd } from '@/components/json-ld';
import { plainText } from '@/components/rich-text';
import { categoryName, getTerm, shortName, glossary, glossaryCategories, hatLabels, letterOf, termsIn, type GlossaryHat } from '@/content/glossary';
import { pageMeta } from '@/lib/metadata';
import { breadcrumbList } from '@/lib/schema';
import { SITE_URL } from '@/lib/site';

/** The count in the title, rounded down to the ten: "300+". */
const COUNT = `${Math.floor(glossary.length / 10) * 10}+`;

export const metadata = pageMeta({
  title: `SEO Glossary: ${COUNT} SEO Terms and Definitions`,
  description: `${COUNT} SEO terms explained in plain English: keyword research, technical SEO, link building, local SEO, AI search, and white, grey and black hat SEO.`,
  path: '/glossary',
});

const START_HERE = ['seo', 'serp', 'search-intent', 'keyword-research', 'on-page-seo', 'technical-seo', 'link-building', 'eeat', 'black-hat-seo'];
const HATS: GlossaryHat[] = ['white', 'grey', 'black'];

const textLink = 'inline-flex items-center gap-1.5 font-medium text-accent-text underline-offset-4 hover:underline';

export default function GlossaryPage() {
  const letters = [...new Set(glossary.map(letterOf))];
  const startHere = START_HERE.map(getTerm).filter((term) => term !== undefined);

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'DefinedTermSet',
              name: 'OpenSEO SEO glossary',
              url: `${SITE_URL}/glossary`,
              hasDefinedTerm: glossary.map((term) => ({
                '@type': 'DefinedTerm',
                name: term.term,
                description: plainText(term.short),
                url: `${SITE_URL}/glossary/${term.slug}`,
              })),
            },
            breadcrumbList([{ name: 'SEO glossary', path: '/glossary' }]),
          ],
        }}
      />

      <section aria-labelledby="glossary-title" className="band-cream relative overflow-hidden">
        <div className="bg-glow pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="container-page relative py-20 text-center md:py-28">
          <p className="eyebrow">{glossary.length} terms</p>
          <h1 id="glossary-title" className="text-display mx-auto mt-5 max-w-3xl text-balance">
            SEO glossary
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-xl leading-relaxed text-pretty text-muted">
            Every SEO term you will meet, explained in plain English: what it means, why it matters for rankings and what to
            do about it. From the basics of crawling and indexing to AI search, with every technique labelled white, grey or
            black hat.
          </p>
          <ul className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-x-6 gap-y-3 text-[0.9375rem] text-muted">
            {HATS.map((hat) => (
              <li key={hat} className="inline-flex items-center gap-2">
                <HatBadge hat={hat} />
                {hatLabels[hat].summary}
              </li>
            ))}
          </ul>
          <p className="mt-6">
            <Link href="/glossary/white-vs-grey-vs-black-hat-seo" className={textLink}>
              White hat vs grey hat vs black hat SEO
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </p>
        </div>
      </section>

      {/* Start here */}
      <section aria-labelledby="start-title" className="container-page py-20 md:py-24">
        <h2 id="start-title" className="text-title text-center">
          SEO basics: start here
        </h2>
        <ul className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {startHere.map((term) => (
            <li key={term.slug} className="card card-link group flex flex-col p-6">
              <p className="text-xs font-semibold tracking-wide text-orange-text uppercase">{categoryName(term.category)}</p>
              <h3 className="card-title mt-2">
                <Link href={`/glossary/${term.slug}`} className="after:absolute after:inset-0 group-hover:text-accent-text focus-visible:outline-none">
                  {shortName(term)}
                </Link>
              </h3>
              <p className="mt-2.5 flex-1 text-[0.9375rem] leading-relaxed text-muted">{plainText(term.short)}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-text" aria-hidden="true">
                Read
                <ArrowRight className="size-4 transition-transform duration-150 group-hover:translate-x-0.5" />
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* By topic */}
      <section aria-labelledby="topics-title" className="band-peach">
        <div className="container-page py-20 md:py-24">
          <h2 id="topics-title" className="text-title text-center">
            SEO terms by topic
          </h2>
          <ul className="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {glossaryCategories.map((category) => (
              <li key={category.id} className="card card-link group block p-6">
                <h3 className="card-title">
                  <Link href={`/glossary/topics/${category.id}`} className="after:absolute after:inset-0 group-hover:text-accent-text focus-visible:outline-none">
                    {category.heading}
                  </Link>
                </h3>
                <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-muted">{category.summary}</p>
                <p className="mt-5 inline-flex rounded-full bg-peach px-3 py-1 text-sm font-semibold text-peach-text">{termsIn(category.id).length} terms</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* A to Z */}
      <section aria-labelledby="az-title" className="band-cream container-page py-20 md:py-24">
        <h2 id="az-title" className="text-title text-center">
          SEO terms A to Z
        </h2>
        <nav aria-label="Letters" className="sticky top-[4.25rem] z-10 mx-auto mt-10 max-w-4xl bg-bg/90 py-3 backdrop-blur">
          <ul className="flex flex-wrap justify-center gap-1.5">
            {letters.map((letter) => (
              <li key={letter}>
                <a href={`#letter-${letter === '#' ? 'num' : letter}`} className="inline-flex size-9 items-center justify-center rounded-md border border-line font-mono text-sm hover:border-accent-line hover:text-accent-text">
                  {letter}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mx-auto mt-10 max-w-4xl space-y-14">
          {letters.map((letter) => (
            <section key={letter} aria-labelledby={`letter-${letter === '#' ? 'num' : letter}`} className="scroll-mt-32">
              <h3 id={`letter-${letter === '#' ? 'num' : letter}`} className="border-b border-line pb-3 font-display text-3xl font-bold">
                {letter}
              </h3>
              <dl className="mt-2 divide-y divide-line">
                {glossary
                  .filter((term) => letterOf(term) === letter)
                  .map((term) => (
                    <div key={term.slug} className="grid gap-1 py-4 sm:grid-cols-[16rem_1fr] sm:gap-6">
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
            </section>
          ))}
        </div>
      </section>
      <CtaBand title="Put the terms to work" body="Every term here is something OpenSEO measures. It is open source: start online in a minute, or run it on your own server." />
    </>
  );
}
