/** Median of a non-empty list. */
const median = (values: number[]): number => {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? (sorted[mid] ?? 0) : ((sorted[mid - 1] ?? 0) + (sorted[mid] ?? 0)) / 2;
};

/**
 * How many pages are fetched at once, adjusted to how the site copes: one more after every `window`
 * healthy responses while response times stay near the site's own baseline, half as many after a
 * 429, a 5xx, a timeout or a clear slowdown. A semaphore whose size changes while the crawl runs.
 */
export class Pace {
  limit: number;
  /** The most pages fetched at once during the crawl. */
  peak: number;
  /** Times the limit was cut because the site struggled. */
  slowdowns = 0;
  private active = 0;
  private waiting: (() => void)[] = [];
  private samples: number[] = [];
  private baseline: number | null = null;

  constructor(
    start: number,
    private max: number,
    private readonly window = 10,
  ) {
    this.max = Math.max(1, max);
    this.limit = Math.max(1, Math.min(start, this.max));
    this.peak = this.limit;
  }

  async acquire(): Promise<void> {
    while (this.active >= this.limit) await new Promise<void>((resolve) => this.waiting.push(resolve));
    this.active++;
  }

  release(): void {
    this.active = Math.max(0, this.active - 1);
    this.wake();
  }

  /** Never more than `max` at once from now on (a robots.txt Crawl-delay, for example). */
  cap(max: number): void {
    this.max = Math.max(1, Math.min(this.max, max));
    this.limit = Math.min(this.limit, this.max);
  }

  /** One page response: its time to first byte, and whether the site showed trouble (429, 5xx, timeout). */
  record(responseTimeMs: number | null, trouble: boolean): void {
    if (trouble) return this.slowDown();
    if (responseTimeMs === null) return;
    this.samples.push(responseTimeMs);
    if (this.samples.length < this.window) return;
    const current = median(this.samples);
    this.samples = [];
    if (this.baseline === null) {
      this.baseline = current;
      return;
    }
    if (current > Math.max(this.baseline * 2, this.baseline + 1000)) this.slowDown();
    else if (current <= Math.max(this.baseline * 1.5, this.baseline + 300) && this.limit < this.max) {
      this.limit++;
      this.peak = Math.max(this.peak, this.limit);
      this.wake();
    }
  }

  private slowDown(): void {
    const next = Math.max(1, Math.floor(this.limit / 2));
    if (next < this.limit) this.slowdowns++;
    this.limit = next;
    this.samples = [];
  }

  private wake(): void {
    const waiting = this.waiting;
    this.waiting = [];
    for (const resolve of waiting) resolve();
  }
}
