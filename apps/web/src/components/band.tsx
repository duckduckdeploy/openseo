import type { ReactNode } from 'react';

export type Tone = 'cream' | 'white' | 'peach' | 'night';

interface BandProps {
  tone?: Tone;
  /** Vertical rhythm: lg for the homepage and indexes, md for sub-pages, sm for strips. */
  space?: 'sm' | 'md' | 'lg';
  /** Accessible name: the id of the section's heading, or a label when it has none. */
  labelledBy?: string;
  label?: string;
  id?: string;
  className?: string;
  /** Skip the inner container, for full-bleed content. */
  bleed?: boolean;
  children: ReactNode;
}

const spacing = { sm: 'py-12 md:py-14', md: 'py-20 md:py-24', lg: 'py-20 md:py-28 xl:py-32' };

/**
 * One section of a page in one of four tones. The tone re-themes everything inside it
 * (see .band-* in globals.css), so neighbouring sections always read as separate.
 */
export function Band({ tone = 'cream', space = 'lg', labelledBy, label, id, className = '', bleed = false, children }: BandProps) {
  return (
    <section id={id} aria-labelledby={labelledBy} aria-label={labelledBy ? undefined : label} className={`band-${tone} relative ${className}`}>
      {bleed ? children : <div className={`container-page relative ${spacing[space]}`}>{children}</div>}
    </section>
  );
}
