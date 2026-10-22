import { hasNoindex } from './analyse';
import type { InlinkCounts, PageResult } from './types';

const DAMPING = 0.85;
const MAX_ITERATIONS = 50;
const TOLERANCE = 1e-9;

export const emptyInlinks = (): InlinkCounts => ({ href: 0, dofollow: 0, nofollow: 0, redirect: 0, canonical: 0, hreflang: 0 });

/** True when a robots directive tells search engines to ignore every link on the page. */
export function hasNofollow(value: string | null): boolean {
  if (!value) return false;
  return value
    .toLowerCase()
    .split(',')
    .some((part) => {
      const directive = part.trim().replace(/^(googlebot|\*)\s*:\s*/, '');
      return directive === 'nofollow' || directive === 'none';
    });
}

/** A page whose robots meta tag or header says nofollow (or none). */
export const isNofollowPage = (page: PageResult): boolean => hasNofollow(page.metaRobots) || hasNofollow(page.xRobotsTag);

/** A page whose robots meta tag or header says noindex. */
export const isNoindexPage = (page: PageResult): boolean =>
  (page.metaRobots !== null && hasNoindex(page.metaRobots)) || (page.xRobotsTag !== null && hasNoindex(page.xRobotsTag));

/**
 * Fills `inlinks`, `inboundLinkCount` and `pageRank` on every page from the crawled link graph.
 * PageRank flows along followed internal links of readable HTML pages and through redirects; pages
 * without outgoing edges share their rank with every page. The result is scaled to 0-100 on a log
 * scale, so the strongest page is 100 and the spread below it stays readable.
 */
export function computeLinkGraph(pages: PageResult[]): void {
  const index = new Map<string, number>();
  pages.forEach((page, i) => index.set(page.url, i));
  const hrefFrom = pages.map(() => new Set<number>());
  const followedFrom = pages.map(() => new Set<number>());
  const counts = pages.map(emptyInlinks);
  const edges: number[][] = pages.map(() => []);

  pages.forEach((page, i) => {
    if (page.fetchClass === 'redirect') {
      const target = index.get(page.finalUrl);
      if (target !== undefined && target !== i) {
        counts[target]!.redirect++;
        edges[i]!.push(target);
      }
      return;
    }
    if (page.fetchClass !== 'ok' || !page.isHtml) return;
    const pageNofollow = isNofollowPage(page);
    const followedTargets = new Set<number>();
    for (const link of page.internalLinks) {
      const target = index.get(link.url);
      if (target === undefined || target === i) continue;
      hrefFrom[target]!.add(i);
      if (!link.nofollow && !pageNofollow) {
        followedFrom[target]!.add(i);
        followedTargets.add(target);
      }
    }
    edges[i]!.push(...followedTargets);
    const canonical = page.canonical ?? page.headerCanonical;
    if (canonical && canonical !== page.url) {
      const target = index.get(canonical);
      if (target !== undefined) counts[target]!.canonical++;
    }
    for (const alt of page.hreflang) {
      if (alt.href === page.url) continue;
      const target = index.get(alt.href);
      if (target !== undefined) counts[target]!.hreflang++;
    }
  });

  pages.forEach((page, i) => {
    const c = counts[i]!;
    c.href = hrefFrom[i]!.size;
    c.dofollow = followedFrom[i]!.size;
    c.nofollow = c.href - c.dofollow;
    page.inlinks = c;
    page.inboundLinkCount = c.href;
  });

  const n = pages.length;
  if (n === 0) return;
  let rank = new Float64Array(n).fill(1 / n);
  for (let iteration = 0; iteration < MAX_ITERATIONS; iteration++) {
    const next = new Float64Array(n);
    let dangling = 0;
    for (let i = 0; i < n; i++) {
      const out = edges[i]!;
      if (out.length === 0) {
        dangling += rank[i]!;
        continue;
      }
      const share = rank[i]! / out.length;
      for (const target of out) next[target]! += share;
    }
    const base = (1 - DAMPING) / n + (DAMPING * dangling) / n;
    let delta = 0;
    for (let i = 0; i < n; i++) {
      const value = base + DAMPING * next[i]!;
      delta += Math.abs(value - rank[i]!);
      next[i] = value;
    }
    rank = next;
    if (delta < TOLERANCE) break;
  }

  let max = 0;
  for (const value of rank) max = Math.max(max, value);
  const average = 1 / n;
  const top = Math.log1p(max / average);
  pages.forEach((page, i) => {
    page.pageRank = top > 0 ? Math.round((100 * Math.log1p(rank[i]! / average)) / top) : 0;
  });
}
