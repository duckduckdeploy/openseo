import type { ReactNode } from 'react';

interface LegalPageProps {
  title: string;
  /** When the text last changed, as an ISO date. */
  updated: string;
  children: ReactNode;
}

/** Shell for the privacy policy and terms. */
export function LegalPage({ title, updated, children }: LegalPageProps) {
  const date = new Date(`${updated}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
  return (
    <article className="container-page py-20 md:py-28">
      <p className="eyebrow">Legal</p>
      <h1 className="text-display mt-5">{title}</h1>
      <p className="mt-5 text-[0.9375rem] text-muted">
        Last updated <time dateTime={updated}>{date}</time>
      </p>

      <div className="prose-doc mt-12">{children}</div>
    </article>
  );
}
