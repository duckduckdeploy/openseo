// Run tasks with a fixed concurrency; results keep input order.
export async function mapLimit<T, R>(items: T[], limit: number, fn: (item: T, index: number) => Promise<R>): Promise<R[]> {
  const results = new Array<R>(items.length);
  let next = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (true) {
      const index = next++;
      if (index >= items.length) return;
      results[index] = await fn(items[index] as T, index);
    }
  });
  await Promise.all(workers);
  return results;
}

type Schedule = "manual" | "daily" | "weekly" | "monthly";

const lastDayOfMonth = (date: Date) => new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)).getUTCDate();

/**
 * One period after `from`. Monthly keeps the day of the month, or the month's last day when it
 * is shorter. `dayOfMonth` is the day the schedule was set for: when `from` sits on a short
 * month's last day before it (31 January became 28 February), the next month returns to it
 * instead of staying on the 28th.
 */
function addPeriod(schedule: Exclude<Schedule, "manual">, from: Date, dayOfMonth?: number): Date {
  const next = new Date(from);
  if (schedule === "daily") next.setUTCDate(next.getUTCDate() + 1);
  else if (schedule === "weekly") next.setUTCDate(next.getUTCDate() + 7);
  else {
    const clamped = dayOfMonth != null && dayOfMonth > from.getUTCDate() && from.getUTCDate() === lastDayOfMonth(from);
    const day = clamped ? dayOfMonth : next.getUTCDate();
    next.setUTCDate(1);
    next.setUTCMonth(next.getUTCMonth() + 1);
    next.setUTCDate(Math.min(day, lastDayOfMonth(next)));
  }
  return next;
}

/**
 * The first run of a new schedule: one period from now, at a random time between 04:00 and
 * 09:59 UTC, so schedules spread out instead of all firing at the minute they were saved.
 */
export function firstRunAt(schedule: Schedule, now = new Date(), random: () => number = Math.random): Date | null {
  if (schedule === "manual") return null;
  const next = addPeriod(schedule, now);
  next.setUTCHours(4, 0, 0, 0);
  return new Date(next.getTime() + Math.floor(random() * 6 * 60) * 60_000);
}

/**
 * The run after `anchor`, the time the schedule was due. Steps from the anchor in whole periods,
 * never from the time the run actually started, so a late tick does not push every later run back.
 * `dayOfMonth`: the monthly schedule's own day, when known (see addPeriod).
 */
export function nextRunAfter(schedule: Schedule, anchor: Date, now = new Date(), dayOfMonth?: number): Date | null {
  if (schedule === "manual") return null;
  let next = addPeriod(schedule, anchor, dayOfMonth);
  while (next <= now) next = addPeriod(schedule, next, dayOfMonth);
  return next;
}
