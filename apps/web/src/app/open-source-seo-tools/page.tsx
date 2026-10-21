import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { ButtonLink } from '@/components/button';
import { CtaBand } from '@/components/cta-band';
import { FaqList } from '@/components/faq';
import { JsonLd } from '@/components/json-ld';
import { SectionHeader } from '@/components/section';
import { CHECKED, openSourceFaqs, openSourceTools, stack } from '@/content/open-source-tools';
import { pageMeta } from '@/lib/metadata';
import { breadcrumbList, faqPage } from '@/lib/schema';
import { GITHUB_URL } from '@/lib/site';

const path = '/open-source-seo-tools';

export const metadata = pageMeta({
  title: 'Open Source SEO Tools: Self-Hosted and Free (2026)',
  description: 'The open-source SEO tools worth running in 2026: rank trackers, crawlers, site audits and full suites, with licence, data source and how each one runs.',
  path,
  absoluteTitle: true,
});

const th = 'border-b border-line bg-sunken px-4 py-3.5 text-left text-xs font-semibold tracking-wide text-faint uppercase';
const td = 'border-b border-line px-4 py-4 align-top leading-relaxed';
const textLink = 'inline-flex items-center gap-1 font-medium text-accent-text underline-offset-4 hover:underline';

/** A fair roundup of open-source SEO tools, OpenSEO included, for "open source seo tools". */
export default function OpenSourceSeoToolsPage() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            faqPage(openSourceFaqs),
            breadcrumbList([{ name: 'Open-source SEO tools', path }]),
            {
              '@type': 'ItemList',
              name: 'Open-source SEO tools',
              itemListElement: openSourceTools.map((tool, index) => ({ '@type': 'ListItem', position: index + 1, name: tool.name, url: tool.url })),
            },
          ],
        }}
      />
      <article>
        <header className="relative overflow-hidden border-b border-line">
          <div className="bg-glow pointer-events-none absolute inset-0" aria-hidden="true" />
          <div className="container-page relative py-20 text-center md:py-28">
            <p className="eyebrow">Roundup · checked {CHECKED}</p>
            <h1 className="text-display mx-auto mt-5 max-w-4xl text-balance">Open-source SEO tools</h1>
            <p className="mx-auto mt-7 max-w-3xl text-xl leading-relaxed text-pretty text-muted">
              The open-source SEO tools worth running today: what each does, its licence, where its data comes from and
              how you run it. OpenSEO is ours, and it is on the list; the others are good at things it does not do.
            </p>
          </div>
        </header>

        <section aria-labelledby="table-title" className="container-page py-20 md:py-28">
          <SectionHeader
            eyebrow="At a glance"
            id="table-title"
            title="Open-source SEO tools compared"
            lede="Licence, what each one does and where its data comes from. Data that has to be bought, like keyword volumes and backlinks, never comes free with open-source software."
          />
          <div className="mx-auto mt-12 max-w-6xl overflow-x-auto rounded-lg border border-line bg-surface shadow-hard-sm">
            <table className="stack-table w-full min-w-[56rem] border-collapse text-sm">
              <caption className="sr-only">Open-source SEO tools compared</caption>
              <thead>
                <tr>
                  {['Tool', 'What it does', 'Licence', 'Runs as', 'Data from'].map((head) => (
                    <th key={head} scope="col" className={th}>
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="[&_tr:last-child_td]:border-b-0 [&_tr:last-child_th]:border-b-0">
                {openSourceTools.map((tool) => (
                  <tr key={tool.name} className={tool.ours ? 'bg-accent-soft/40' : undefined}>
                    <th scope="row" className={`${td} text-left font-medium whitespace-nowrap`}>
                      <a href={`#${tool.id}`} className="underline-offset-4 hover:underline">
                        {tool.name}
                      </a>
                    </th>
                    <td data-label="What it does" className={`${td} text-muted`}>{tool.what}</td>
                    <td data-label="Licence" className={`${td} font-mono text-xs whitespace-nowrap`}>{tool.licence}</td>
                    <td data-label="Runs as" className={`${td} text-muted`}>{tool.runs}</td>
                    <td data-label="Data from" className={`${td} text-muted`}>{tool.data}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section aria-labelledby="tools-title" className="band-cream">
          <div className="container-page py-20 md:py-28">
            <SectionHeader eyebrow="One by one" id="tools-title" title="The best open-source SEO tools" />
            <ol className="mx-auto mt-12 grid max-w-5xl gap-6">
              {openSourceTools.map((tool, index) => (
                <li key={tool.name} id={tool.id} className={`card scroll-mt-24 p-7 md:p-8 ${tool.ours ? 'card-featured' : ''}`}>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                    <h3 className="text-heading">
                      {index + 1}. {tool.name}
                    </h3>
                    <a href={tool.url} className={textLink} rel={tool.ours ? undefined : 'noopener nofollow'}>
                      {tool.urlLabel}
                      <ArrowUpRight className="size-4" aria-hidden="true" />
                    </a>
                  </div>
                  <p className="mt-1.5 font-mono text-xs text-faint">
                    {tool.licence} · {tool.runs} · {tool.activity}
                  </p>
                  <p className="mt-4 leading-relaxed text-muted">{tool.summary}</p>
                  <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    <div>
                      <p className="text-sm font-semibold text-ink">Good for</p>
                      <ul className="mt-2 list-disc space-y-1.5 pl-5 text-[0.9375rem] text-muted marker:text-accent">
                        {tool.goodFor.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-ink">Keep in mind</p>
                      <ul className="mt-2 list-disc space-y-1.5 pl-5 text-[0.9375rem] text-muted marker:text-faint">
                        {tool.keepInMind.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section aria-labelledby="stack-title" className="container-page py-20 md:py-28">
          <SectionHeader
            eyebrow="Putting it together"
            id="stack-title"
            title="A self-hosted SEO stack"
            lede="Open-source tools cover the software. Search data is another matter: Google's own data is free for your site, everything else comes from a paid provider."
          />
          <div className="mx-auto mt-12 max-w-4xl overflow-x-auto rounded-lg border border-line bg-surface shadow-hard-sm">
            <table className="stack-table w-full min-w-[36rem] border-collapse text-sm">
              <caption className="sr-only">A self-hosted SEO stack</caption>
              <thead>
                <tr>
                  {['Job', 'Open-source option', 'Data cost'].map((head) => (
                    <th key={head} scope="col" className={th}>
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="[&_tr:last-child_td]:border-b-0">
                {stack.map((row) => (
                  <tr key={row.job}>
                    <th scope="row" className={`${td} text-left font-medium`}>
                      {row.job}
                    </th>
                    <td data-label="Open-source option" className={`${td} text-muted`}>{row.tools}</td>
                    <td data-label="Data cost" className={`${td} text-muted`}>{row.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="/docs/self-hosting">Self-host OpenSEO with Docker</ButtonLink>
            <ButtonLink href={GITHUB_URL} variant="secondary">
              Source on GitHub
            </ButtonLink>
          </div>
        </section>

        <section aria-labelledby="faq-title" className="band-cream container-page py-20 md:py-28">
          <SectionHeader eyebrow="FAQ" id="faq-title" title="Open-source SEO tools FAQ" />
          <div className="mx-auto mt-12 max-w-3xl">
            <FaqList faqs={openSourceFaqs} />
          </div>
          <p className="mt-10 text-center text-sm text-faint">
            Licences, activity and features checked on each project&apos;s own repository or site in {CHECKED}. Names are
            trademarks of their owners. See also{' '}
            <Link href="/tools" className="font-medium text-accent-text underline-offset-4 hover:underline">
              free SEO tools
            </Link>
            .
          </p>
        </section>
      </article>
      <CtaBand />
    </>
  );
}
