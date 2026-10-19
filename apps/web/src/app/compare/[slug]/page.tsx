import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CtaBand } from '@/components/cta-band';
import { FaqList } from '@/components/faq';
import { JsonLd } from '@/components/json-ld';
import { SectionHeader } from '@/components/section';
import { comparisons, getComparison } from '@/content/compare';
import { pageMeta } from '@/lib/metadata';
import { breadcrumbList, faqPage } from '@/lib/schema';

interface ComparePageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return comparisons.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: ComparePageProps): Promise<Metadata> {
  const { slug } = await params;
  const c = getComparison(slug);
  if (!c) return {};
  return pageMeta({
    title: c.seoTitle ?? `${c.name} Alternative: OpenSEO vs ${c.name} (Open Source)`,
    description: `Looking for a free ${c.name} alternative? Compare OpenSEO vs ${c.name}: features, pricing and data. Open source, self-hostable, billed per lookup.`,
    path: `/compare/${c.slug}`,
    absoluteTitle: true,
  });
}

const th = 'border-b border-line bg-sunken px-5 py-3.5 text-left text-xs font-semibold tracking-wide text-faint uppercase';
const td = 'border-b border-line px-5 py-4 align-top leading-relaxed';

export default async function ComparePage({ params }: ComparePageProps) {
  const { slug } = await params;
  const c = getComparison(slug);
  if (!c) notFound();

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@graph': [faqPage(c.faqs), breadcrumbList([{ name: `OpenSEO vs ${c.name}`, path: `/compare/${c.slug}` }])],
        }}
      />
      <article>
        <header className="relative overflow-hidden border-b border-line">
          <div className="bg-glow pointer-events-none absolute inset-0" aria-hidden="true" />
          <div className="container-page relative py-20 text-center md:py-28">
            <p className="eyebrow">Comparison</p>
            <h1 className="text-display mx-auto mt-5 max-w-4xl text-balance">{c.name} alternative: OpenSEO vs {c.name}</h1>
            <p className="mx-auto mt-7 max-w-3xl text-xl leading-relaxed text-pretty text-muted">{c.summary}</p>
          </div>
        </header>

        <section aria-labelledby="entry-title" className="container-page py-20 md:py-28">
          <SectionHeader eyebrow="Starting price" id="entry-title" title={`${c.name} pricing vs OpenSEO`} lede={`${c.name} ${c.entry.plan}: ${c.entry.price}.`} />
          <ul className="mx-auto mt-8 max-w-2xl list-disc space-y-2 pl-5 text-lg text-muted marker:text-accent">
            {c.entry.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
          <p className="mx-auto mt-6 max-w-2xl text-center text-sm leading-relaxed text-faint">
            List prices, checked in {c.checked}. {c.name} sets its own prices and changes them; check its pricing page for current figures. OpenSEO&apos;s data costs are
            at the time of writing; see{' '}
            <Link href="/pricing" className="font-medium text-accent-text underline-offset-4 hover:underline">
              Pricing
            </Link>
            .
          </p>

          <h2 id="table-title" className="text-title mt-20 text-center text-balance">
            OpenSEO vs {c.name}: feature comparison
          </h2>
          <div className="mx-auto mt-10 max-w-5xl overflow-x-auto rounded-lg border border-line bg-surface shadow-hard-sm">
            <table className="stack-table w-full min-w-[40rem] border-collapse text-sm">
              <caption className="sr-only">
                OpenSEO compared with {c.name}
              </caption>
              <thead>
                <tr>
                  <th scope="col" className={th}>
                    &nbsp;
                  </th>
                  <th scope="col" className={th}>
                    {c.name}
                  </th>
                  <th scope="col" className={`${th} !text-accent-text`}>
                    OpenSEO
                  </th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child_td]:border-b-0 [&_tr:last-child_th]:border-b-0">
                {c.rows.map((row) => (
                  <tr key={row.topic}>
                    <th scope="row" className={`${td} text-left font-medium whitespace-nowrap`}>
                      {row.topic}
                    </th>
                    <td data-label={c.name} className={`${td} text-muted`}>
                      {row.them}
                    </td>
                    <td data-label="OpenSEO" data-highlight className={`${td} bg-accent-soft/40`}>
                      {row.us}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section aria-labelledby="choose-title" className="band-peach">
          <div className="container-page mx-auto grid max-w-5xl gap-6 py-20 md:grid-cols-2 md:py-28 lg:gap-8">
            <div className="card p-8">
              <h2 id="choose-title" className="text-heading">
                When to choose {c.name}
              </h2>
              <ul className="mt-5 list-disc space-y-2.5 pl-5 text-muted marker:text-accent">
                {c.chooseThem.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="card card-featured p-8">
              <h2 className="text-heading">When to choose OpenSEO</h2>
              <ul className="mt-5 list-disc space-y-2.5 pl-5 text-muted marker:text-accent">
                {c.chooseUs.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section aria-labelledby="faq-title" className="band-cream container-page py-20 md:py-28">
          <SectionHeader eyebrow="FAQ" id="faq-title" title={`OpenSEO vs ${c.name} FAQ`} />
          <div className="mx-auto mt-12 max-w-3xl">
            <FaqList faqs={c.faqs} />
          </div>
          <p className="mt-10 text-center text-sm text-faint">
            {c.name} is a trademark of its owner. OpenSEO is not affiliated with or endorsed by {c.name}.
          </p>
        </section>
      </article>
      <CtaBand />
    </>
  );
}
