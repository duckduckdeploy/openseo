import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { ButtonLink } from '@/components/button';
import { CtaBand } from '@/components/cta-band';
import { FaqList } from '@/components/faq';
import { JsonLd } from '@/components/json-ld';
import { SectionHeader } from '@/components/section';
import { CHECKED, pickByJob, seoMcpFaqs, seoMcpServers } from '@/content/seo-mcp-servers';
import { pageMeta } from '@/lib/metadata';
import { breadcrumbList, faqPage } from '@/lib/schema';
import { SITE_URL } from '@/lib/site';

const path = '/best-seo-mcp-servers';

export const metadata = pageMeta({
  title: 'Best SEO MCP Servers (2026): 11 Compared',
  description: 'The best SEO MCP servers for Claude, ChatGPT and Cursor compared: what each covers, licence, hosting and the cheapest way to use it, checked on each vendor’s site.',
  path,
  absoluteTitle: true,
});

const th = 'border-b border-line bg-sunken px-4 py-3.5 text-left text-xs font-semibold tracking-wide text-faint uppercase';
const td = 'border-b border-line px-4 py-4 align-top leading-relaxed';
const textLink = 'inline-flex items-center gap-1 font-medium text-accent-text underline-offset-4 hover:underline';
const absolute = (url: string) => (url.startsWith('/') ? `${SITE_URL}${url}` : url);

/** A fair roundup of SEO MCP servers, OpenSEO included, for "best seo mcp servers" and the AI answers that cite such lists. */
export default function BestSeoMcpServersPage() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            faqPage(seoMcpFaqs),
            breadcrumbList([{ name: 'Best SEO MCP servers', path }]),
            {
              '@type': 'ItemList',
              name: 'Best SEO MCP servers',
              itemListElement: seoMcpServers.map((server, index) => ({ '@type': 'ListItem', position: index + 1, name: server.name, url: absolute(server.url) })),
            },
          ],
        }}
      />
      <article>
        <header className="relative overflow-hidden border-b border-line">
          <div className="bg-glow pointer-events-none absolute inset-0" aria-hidden="true" />
          <div className="container-page relative py-20 text-center md:py-28">
            <p className="eyebrow">Roundup · checked {CHECKED}</p>
            <h1 className="text-display mx-auto mt-5 max-w-4xl text-balance">Best SEO MCP servers</h1>
            <p className="mx-auto mt-7 max-w-3xl text-xl leading-relaxed text-pretty text-muted">
              The SEO MCP servers worth connecting to Claude, ChatGPT or Cursor: what data each gives your agent, its licence,
              how it runs and the cheapest way to use it, checked on each vendor&apos;s own site. OpenSEO is ours, and it is on
              the list; the others are right for different teams.
            </p>
          </div>
        </header>

        <section aria-labelledby="table-title" className="container-page py-20 md:py-28">
          <SectionHeader
            eyebrow="At a glance"
            id="table-title"
            title="SEO MCP servers compared"
            lede="Vendor servers use the data in your plan; open-source servers need a data source you pay per lookup. Your own Search Console data is the one thing that is always free."
          />
          <div className="mx-auto mt-12 max-w-6xl overflow-x-auto rounded-lg border border-line bg-surface shadow-hard-sm">
            <table className="stack-table w-full min-w-[60rem] border-collapse text-sm">
              <caption className="sr-only">SEO MCP servers compared</caption>
              <thead>
                <tr>
                  {['Server', 'What it covers', 'Licence', 'Runs as', 'Cheapest way to use it'].map((head) => (
                    <th key={head} scope="col" className={th}>
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="[&_tr:last-child_td]:border-b-0 [&_tr:last-child_th]:border-b-0">
                {seoMcpServers.map((server) => (
                  <tr key={server.id} className={server.ours ? 'bg-accent-soft/40' : undefined}>
                    <th scope="row" className={`${td} text-left font-medium whitespace-nowrap`}>
                      <a href={`#${server.id}`} className="underline-offset-4 hover:underline">
                        {server.name}
                      </a>
                    </th>
                    <td data-label="What it covers" className={`${td} text-muted`}>
                      {server.covers}
                    </td>
                    <td data-label="Licence" className={`${td} font-mono text-xs whitespace-nowrap`}>
                      {server.licence}
                    </td>
                    <td data-label="Runs as" className={`${td} text-muted`}>
                      {server.runs}
                    </td>
                    <td data-label="Cheapest way to use it" className={`${td} text-muted`}>
                      {server.cost}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section aria-labelledby="servers-title" className="band-cream">
          <div className="container-page py-20 md:py-28">
            <SectionHeader eyebrow="One by one" id="servers-title" title="The best SEO MCP servers" />
            <ol className="mx-auto mt-12 grid max-w-5xl gap-6">
              {seoMcpServers.map((server, index) => (
                <li key={server.id} id={server.id} className={`card scroll-mt-24 p-7 md:p-8 ${server.ours ? 'card-featured' : ''}`}>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                    <h3 className="text-heading">
                      {index + 1}. {server.name}
                    </h3>
                    {server.ours ? (
                      <Link href={server.url} className={textLink}>
                        {server.urlLabel}
                        <ArrowUpRight className="size-4" aria-hidden="true" />
                      </Link>
                    ) : (
                      <a href={server.url} className={textLink} rel="noopener nofollow">
                        {server.urlLabel}
                        <ArrowUpRight className="size-4" aria-hidden="true" />
                      </a>
                    )}
                  </div>
                  <p className="mt-1.5 font-mono text-xs text-faint">
                    {server.maker} · {server.licence} · {server.runs} · tools: {server.tools}
                  </p>
                  <p className="mt-4 leading-relaxed text-muted">{server.summary}</p>
                  <p className="mt-3 text-[0.9375rem] text-muted">
                    <span className="font-semibold text-ink">Cheapest way to use it:</span> {server.cost}
                  </p>
                  <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    <div>
                      <p className="text-sm font-semibold text-ink">Good for</p>
                      <ul className="mt-2 list-disc space-y-1.5 pl-5 text-[0.9375rem] text-muted marker:text-accent">
                        {server.goodFor.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-ink">Keep in mind</p>
                      <ul className="mt-2 list-disc space-y-1.5 pl-5 text-[0.9375rem] text-muted marker:text-faint">
                        {server.keepInMind.map((item) => (
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

        <section aria-labelledby="pick-title" className="container-page py-20 md:py-28">
          <SectionHeader eyebrow="Choosing" id="pick-title" title="Which SEO MCP server to use" lede="Most teams end up with one broad server plus their own Search Console data. Pick by what you already pay for." />
          <div className="mx-auto mt-12 max-w-4xl overflow-x-auto rounded-lg border border-line bg-surface shadow-hard-sm">
            <table className="stack-table w-full min-w-[36rem] border-collapse text-sm">
              <caption className="sr-only">Which SEO MCP server to use</caption>
              <thead>
                <tr>
                  {['If you want', 'Use'].map((head) => (
                    <th key={head} scope="col" className={th}>
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="[&_tr:last-child_td]:border-b-0 [&_tr:last-child_th]:border-b-0">
                {pickByJob.map((row) => (
                  <tr key={row.job}>
                    <th scope="row" className={`${td} text-left font-medium`}>
                      {row.job}
                    </th>
                    <td data-label="Use" className={`${td} text-muted`}>
                      {row.pick}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="/features/seo-mcp-server">OpenSEO MCP server</ButtonLink>
            <ButtonLink href="/docs/tutorials/agents" variant="secondary">
              Connect your agent
            </ButtonLink>
          </div>
        </section>

        <section aria-labelledby="faq-title" className="band-cream container-page py-20 md:py-28">
          <SectionHeader eyebrow="FAQ" id="faq-title" title="SEO MCP servers FAQ" />
          <div className="mx-auto mt-12 max-w-3xl">
            <FaqList faqs={seoMcpFaqs} />
          </div>
          <p className="mt-10 text-center text-sm text-faint">
            Licences, hosting, prices and tool counts checked on each vendor&apos;s own docs, pricing page or repository in{' '}
            {CHECKED}. Prices change; check the vendor before you buy. Names are trademarks of their owners. See also{' '}
            <Link href="/open-source-seo-tools" className="font-medium text-accent-text underline-offset-4 hover:underline">
              open-source SEO tools
            </Link>
            .
          </p>
        </section>
      </article>
      <CtaBand />
    </>
  );
}
