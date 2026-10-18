import Link from 'next/link';
import { getTerm } from '@/content/glossary';
import { HatBadge } from './hat-badge';

interface RelatedTermsProps {
  slugs: string[];
  title?: string;
  id?: string;
  align?: 'left' | 'center';
}

/** Links into the SEO glossary. Slugs without an entry are skipped. */
export function RelatedTerms({ slugs, title = 'Related SEO terms', id = 'terms-title', align = 'center' }: RelatedTermsProps) {
  const terms = slugs.map(getTerm).filter((term) => term !== undefined);
  if (terms.length === 0) return null;
  const centered = align === 'center';

  return (
    <section aria-labelledby={id} className={centered ? 'mx-auto max-w-5xl' : undefined}>
      <h2 id={id} className={`text-title ${centered ? 'text-center' : ''}`}>
        {title}
      </h2>
      <ul className={`mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 ${centered ? 'lg:grid-cols-3' : ''}`}>
        {terms.map((term) => (
          <li key={term.slug} className="group relative rounded-lg border border-line bg-bg p-5 transition-colors duration-150 hover:border-accent-line">
            <p className="flex flex-wrap items-center gap-2 font-semibold">
              <Link href={`/glossary/${term.slug}`} className="after:absolute after:inset-0 group-hover:text-accent-text focus-visible:outline-none">
                {term.term}
              </Link>
              {term.hat ? <HatBadge hat={term.hat} /> : null}
            </p>
            <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{term.short}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
