import { describe, expect, it } from 'vitest';
import { Pace } from './pace';

const feed = (pace: Pace, ms: number, n: number): void => {
  for (let i = 0; i < n; i++) pace.record(ms, false);
};

describe('Pace', () => {
  it('adds one at a time while responses stay near the baseline, up to the maximum', () => {
    const pace = new Pace(2, 4, 5);
    feed(pace, 400, 5); // baseline
    expect(pace.limit).toBe(2);
    feed(pace, 450, 5);
    expect(pace.limit).toBe(3);
    feed(pace, 500, 10);
    expect(pace.limit).toBe(4);
    feed(pace, 400, 20);
    expect(pace).toMatchObject({ limit: 4, peak: 4, slowdowns: 0 });
  });

  it('halves on trouble or a clear slowdown, never below one', () => {
    const pace = new Pace(4, 6, 5);
    feed(pace, 300, 5);
    pace.record(null, true);
    expect(pace.limit).toBe(2);
    feed(pace, 2000, 5); // well over twice the baseline
    expect(pace.limit).toBe(1);
    pace.record(null, true);
    expect(pace).toMatchObject({ limit: 1, slowdowns: 2 });
  });

  it('holds fetches beyond the limit until one finishes', async () => {
    const pace = new Pace(1, 1);
    await pace.acquire();
    let second = false;
    const waiting = pace.acquire().then(() => (second = true));
    await Promise.resolve();
    expect(second).toBe(false);
    pace.release();
    await waiting;
    expect(second).toBe(true);
  });

  it('can be capped while running', () => {
    const pace = new Pace(3, 6);
    pace.cap(1);
    feed(pace, 100, 40);
    expect(pace.limit).toBe(1);
  });
});
