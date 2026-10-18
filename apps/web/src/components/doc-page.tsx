import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { docPages, getDoc } from '@/content/docs';
import { breadcrumbList } from '@/lib/schema';
import { SITE_NAME, SITE_URL } from '@/lib/site';
import { BrandRow, brandName, type Brand } from './brand-icon';
import { JsonLd } from './json-ld';

interface DocArticleProps {
  slug: string;
  children: ReactNode;
  /** Logos of the services or assistants the page is about, shown under the intro. */
  brands?: Brand[];
}

/** Shared shell for a docs page: section, title, intro, prose body and previous / next links. */
export function DocArticle({ slug, children, brands }: DocArticleProps) {
  const doc = getDoc(slug);
  const index = docPages.indexOf(doc);
  const previous = docPages[index - 1];
  const next = docPages[index + 1];

  return (
    <article className="min-w-0">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'TechArticle',
              headline: doc.h1,
              description: doc.description,
              url: `${SITE_URL}/docs/${doc.slug}`,
              author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
              publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
            },
            breadcrumbList([
              { name: 'Docs', path: '/docs' },
              { name: doc.title, path: `/docs/${doc.slug}` },
            ]),
          ],
        }}
      />
      <p className="text-sm text-muted">
        <Link href="/docs" className="hover:text-ink">
          Docs
        </Link>
        <span className="mx-2 text-faint" aria-hidden="true">
          /
        </span>
        <span className="rounded-full bg-peach px-2.5 py-0.5 text-xs font-semibold tracking-wide text-peach-text uppercase">{doc.section}</span>
      </p>
      <h1 className="text-title mt-5 max-w-3xl text-balance">{doc.h1}</h1>
      <p className="text-lede mt-5 max-w-2xl text-pretty">{doc.description}</p>
      {brands ? <BrandRow className="mt-6 justify-start" items={brands.map((brand) => ({ brand, name: brandName(brand) }))} /> : null}

      <div className="prose-doc mt-12 border-t border-line pt-10">{children}</div>

      <nav aria-label="More docs" className="mt-20 grid max-w-[44rem] grid-cols-1 gap-4 border-t border-line pt-10 sm:grid-cols-2">
        {previous ? (
          <Link href={`/docs/${previous.slug}`} className="card card-link group block p-5">
            <span className="inline-flex items-center gap-2 text-sm text-muted">
              <ArrowLeft className="size-3.5" aria-hidden="true" />
              Previous
            </span>
            <span className="mt-1.5 block font-display text-lg font-semibold transition-colors group-hover:text-accent-text">{previous.title}</span>
          </Link>
        ) : (
          <span className="hidden sm:block" />
        )}
        {next ? (
          <Link href={`/docs/${next.slug}`} className="card card-link group block p-5 sm:text-right">
            <span className="inline-flex items-center gap-2 text-sm text-muted">
              Next
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </span>
            <span className="mt-1.5 block font-display text-lg font-semibold transition-colors group-hover:text-accent-text">{next.title}</span>
          </Link>
        ) : null}
      </nav>
    </article>
  );
}
