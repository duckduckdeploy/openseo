import { hatLabels, type GlossaryHat } from '@/content/glossary/types';

const tone: Record<GlossaryHat, string> = {
  white: 'border-line bg-surface text-ink',
  grey: 'border-edge bg-sunken text-ink',
  black: 'border-ink bg-ink text-bg',
};

/** "White hat", "Grey hat" or "Black hat" label for a technique. */
export function HatBadge({ hat, size = 'sm' }: { hat: GlossaryHat; size?: 'sm' | 'md' }) {
  return (
    <span
      title={hatLabels[hat].summary}
      className={`inline-flex items-center rounded-full border font-medium whitespace-nowrap ${tone[hat]} ${size === 'md' ? 'px-3 py-1 text-sm' : 'px-2 py-0.5 text-xs'}`}
    >
      {hatLabels[hat].name}
    </span>
  );
}
