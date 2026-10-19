/** The OpenSEO mark and wordmark, the same as the website's (apps/web/src/components/logo.tsx). */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 32 32" className="size-6 shrink-0" aria-hidden="true" focusable="false">
        <rect width="32" height="32" rx="8" fill="var(--color-accent)" />
        <circle cx="14" cy="14" r="6.5" fill="none" stroke="var(--color-accent-fg)" strokeWidth="4" />
        <path d="M19.5 19.5 25 25" stroke="var(--color-accent-fg)" strokeWidth="4" strokeLinecap="round" />
      </svg>
      <span className="font-display font-bold tracking-tight text-ink">OpenSEO</span>
    </span>
  );
}
