import Link from 'next/link';
import type { ReactNode } from 'react';

/**
 * primary: the one blue action per view.
 * secondary: the alternative next to it; adapts to night and peach bands through the band tokens.
 * ghost: a quiet text action with no box, for "Learn more" next to a primary.
 * inverse: white on the blue CTA panel.
 * night: a solid dark button, for a strong second action on light bands.
 */
type Variant = 'primary' | 'secondary' | 'ghost' | 'inverse' | 'night';
type Size = 'sm' | 'md' | 'lg';

interface ButtonLinkProps {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
}

const base =
  'group/button inline-flex items-center justify-center gap-2 rounded-md border font-medium whitespace-nowrap select-none ' +
  'transition-[background-color,border-color,color,box-shadow,transform] duration-150 ease-out active:translate-y-px';

const variants: Record<Variant, string> = {
  primary:
    'border-accent bg-accent text-accent-fg shadow-[0_1px_0_rgb(255_255_255/0.18)_inset,0_1px_2px_rgb(23_19_15/0.12),0_6px_16px_-6px_color-mix(in_srgb,var(--color-accent)_60%,transparent)] ' +
    'hover:-translate-y-px hover:border-accent-hover hover:bg-accent-hover hover:shadow-[0_1px_0_rgb(255_255_255/0.18)_inset,0_2px_4px_rgb(23_19_15/0.12),0_12px_24px_-8px_color-mix(in_srgb,var(--color-accent)_70%,transparent)]',
  secondary: 'border-edge bg-surface text-ink shadow-hard-sm hover:-translate-y-px hover:border-ink/40 hover:shadow-hard',
  ghost: 'border-transparent bg-transparent px-1 text-accent-text underline-offset-4 hover:underline',
  inverse: 'border-white bg-white text-accent-hover shadow-hard-sm hover:-translate-y-px hover:bg-white/92 hover:shadow-hard',
  night: 'border-night bg-night text-[#f7f0e7] shadow-hard-sm hover:-translate-y-px hover:bg-night-surface hover:shadow-hard',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-sm',
  md: 'h-11 px-5 text-[0.9375rem]',
  lg: 'h-13 px-7 text-base',
};

/** Link styled as a button. Absolute URLs render a plain anchor, internal paths use next/link. */
export function ButtonLink({ href, children, variant = 'primary', size = 'md', className = '' }: ButtonLinkProps) {
  const classes = `${base} ${variants[variant]} ${variant === 'ghost' ? 'h-auto' : sizes[size]} ${className}`;

  if (/^https?:\/\//.test(href)) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
