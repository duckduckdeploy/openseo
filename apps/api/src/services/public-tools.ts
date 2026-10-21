import { and, eq, gte, sql } from "drizzle-orm";
import { z } from "zod";
import { db, schema } from "../db";
import { env } from "../env";
import { encrypt } from "../lib/crypto";
import { AppError, notFound, parse } from "../lib/errors";
import { unwrittenSpend } from "../lib/yep";
import type { Market } from "./lookups";
import { runLookup } from "./run-lookup";

/**
 * Free tools on the public website: a few cheap lookups anyone can run without an account.
 *
 * They run as a built-in account that holds the site's own YepAPI key, so they reuse everything a
 * user's lookup has: the price check, the shared cache (one visitor's result is free for the next),
 * the usage log and a monthly budget. On top of that, each visitor gets a few runs a day and the
 * whole feature stops for the day at a daily spend. Off unless PUBLIC_TOOLS_YEPAPI_KEY is set.
 */
export const PUBLIC_USER_ID = "public-tools";

const domainList = (max: number) =>
  z.array(z.string().trim().min(3).max(253)).min(1).max(max, `Up to ${max} at a time here; sign in for more.`);
const keywordList = (max: number) =>
  z.array(z.string().trim().min(1).max(200)).min(1).max(max, `Up to ${max} at a time here; sign in for more.`);
const country = z.string().trim().toLowerCase().length(2).default("us");

/** Countries the free tools offer, with their Google location codes. The app covers every country. */
export const PUBLIC_COUNTRIES: Record<string, number> = {
  us: 2840,
  gb: 2826,
  ca: 2124,
  au: 2036,
  in: 2356,
  de: 2276,
  fr: 2250,
  es: 2724,
  it: 2380,
  nl: 2528,
  br: 2076,
};

/** Each free tool: its input as the website sends it, and the lookup it runs. Inputs are capped well below the app's. */
const TOOLS = {
  "website-traffic": {
    input: z.object({ domains: domainList(5), country }),
    lookup: (i: { domains: string[]; country: string }) => ({ name: "domain_traffic", input: { domains: i.domains, country: i.country } }),
  },
  "website-authority": {
    input: z.object({ domains: domainList(3) }),
    lookup: (i: { domains: string[] }) => ({ name: "url_metrics", input: { urls: i.domains } }),
  },
  "keyword-ideas": {
    input: z.object({ keyword: z.string().trim().min(1).max(200), country }),
    lookup: (i: { keyword: string; country: string }) => ({ name: "keyword_ideas", input: { keyword: i.keyword, source: "ideas", limit: 50 } }),
    shape: (data: { keywords?: { keyword: string; volume?: number; difficulty?: number | null; cpc?: number; intent?: string }[] }) => ({
      keywords: (data.keywords ?? []).map((k) => ({ keyword: k.keyword, volume: k.volume ?? null, difficulty: k.difficulty ?? null, cpc: k.cpc ?? null, intent: k.intent ?? null })),
    }),
  },
  "keyword-difficulty": {
    input: z.object({ keywords: keywordList(20), country }),
    lookup: (i: { keywords: string[]; country: string }) => ({ name: "keyword_difficulty", input: { keywords: i.keywords, country: i.country } }),
  },
  serp: {
    input: z.object({ keyword: z.string().trim().min(1).max(200), country }),
    lookup: (i: { keyword: string; country: string }) => ({ name: "serp", input: { query: i.keyword, depth: 20 } }),
    // The page needs the organic list only, not the whole results page.
    shape: (data: { results?: { type: string; url?: string; title?: string; domain?: string }[] }) => ({
      results: (data.results ?? []).filter((r) => r.type === "organic" && r.url).map((r) => ({ type: r.type, url: r.url, title: r.title ?? null, domain: r.domain ?? null })),
    }),
  },
  "ai-overview": {
    input: z.object({ keywords: keywordList(3), domain: z.string().trim().min(3).max(253).optional(), country }),
    lookup: (i: { keywords: string[]; domain?: string; country: string }) => ({ name: "serp_features", input: { keywords: i.keywords, domain: i.domain } }),
  },
} as const;

export type PublicTool = keyof typeof TOOLS;
export const PUBLIC_TOOLS = Object.keys(TOOLS) as PublicTool[];

/** The most any single free run may cost. Every capped input above stays under it. */
const MAX_RUN_USD = 0.1;

export const publicToolsEnabled = () => Boolean(env.PUBLIC_TOOLS_YEPAPI_KEY);

/** Creates or refreshes the built-in account with the current key and monthly budget. Run at startup. */
export async function ensurePublicToolsAccount() {
  if (!env.PUBLIC_TOOLS_YEPAPI_KEY) return;
  await db
    .insert(schema.user)
    .values({ id: PUBLIC_USER_ID, name: "Free website tools", email: "public-tools@openseo.invalid", emailVerified: true })
    .onConflictDoNothing();
  const settings = {
    yepapiKeyEnc: encrypt(env.PUBLIC_TOOLS_YEPAPI_KEY),
    yepapiKeyHint: env.PUBLIC_TOOLS_YEPAPI_KEY.slice(-4),
    monthlyBudgetUsd: env.PUBLIC_TOOLS_MONTHLY_USD,
  };
  await db
    .insert(schema.userSettings)
    .values({ userId: PUBLIC_USER_ID, ...settings })
    .onConflictDoUpdate({ target: schema.userSettings.userId, set: settings });
}

// Runs per visitor per UTC day. In memory: a restart forgets them, which only ever errs towards the visitor.
const runsByVisitor = new Map<string, number>();
let countingDay = "";

function takeRun(visitor: string) {
  const today = new Date().toISOString().slice(0, 10);
  if (today !== countingDay) {
    runsByVisitor.clear();
    countingDay = today;
  }
  const used = runsByVisitor.get(visitor) ?? 0;
  if (used >= env.PUBLIC_TOOLS_PER_DAY) {
    throw new AppError(429, "daily_limit", `That's the ${env.PUBLIC_TOOLS_PER_DAY} free checks for today. Sign up for free to keep going: you only pay for the lookups you run.`);
  }
  runsByVisitor.set(visitor, used + 1);
  return env.PUBLIC_TOOLS_PER_DAY - used - 1;
}

async function spentToday() {
  const start = new Date();
  start.setUTCHours(0, 0, 0, 0);
  const [row] = await db
    .select({ total: sql<number>`coalesce(sum(${schema.usageLog.costUsd}), 0)::float8` })
    .from(schema.usageLog)
    .where(and(eq(schema.usageLog.userId, PUBLIC_USER_ID), gte(schema.usageLog.createdAt, start)));
  // Plus calls that returned but whose usage rows are still being written.
  return (row?.total ?? 0) + unwrittenSpend(PUBLIC_USER_ID);
}

// Worst-case cost of the runs in progress in this process. usage_log only sees a run's spend once
// its calls return, so a burst of runs started together would all pass the daily check without it.
let reservedUsd = 0;

export async function runPublicTool(tool: string, body: unknown, visitor: string) {
  if (!publicToolsEnabled()) throw notFound("Free tool");
  const spec = TOOLS[tool as PublicTool];
  if (!spec) throw notFound("Free tool");
  const input = parse(spec.input as z.ZodType, body ?? {}) as { country?: string };
  const locationCode = PUBLIC_COUNTRIES[input.country ?? "us"];
  if (!locationCode) throw new AppError(400, "bad_request", "That country isn't available in the free tool. Sign up to use any country.");
  // Checked and reserved with no await in between, so concurrent runs see each other.
  if ((await spentToday()) + reservedUsd >= env.PUBLIC_TOOLS_DAILY_USD) {
    throw new AppError(429, "resting", "The free tools have used today's budget. They're back tomorrow, or sign up to run this now.");
  }
  const remaining = takeRun(visitor);
  reservedUsd += MAX_RUN_USD;
  const market: Market = { id: null, locationCode, country: input.country ?? "us", language: "en" };
  const { name, input: lookupInput } = (spec.lookup as (i: unknown) => { name: string; input: unknown })(input);
  try {
    const result = await runLookup(PUBLIC_USER_ID, market, name, lookupInput, { maxCostUsd: MAX_RUN_USD });
    if ("dryRun" in result) throw new AppError(500, "internal_error", "Unexpected dry run");
    const shape = "shape" in spec ? (spec.shape as (data: unknown) => unknown) : (data: unknown) => data;
    return { data: shape(result.data), cached: result.cached, remaining };
  } catch (error) {
    // A failed run doesn't count against the visitor.
    runsByVisitor.set(visitor, Math.max(0, (runsByVisitor.get(visitor) ?? 1) - 1));
    throw error;
  } finally {
    // Settled: what the run actually spent is now in usage_log, or in unwrittenSpend until it is.
    reservedUsd = Math.max(0, reservedUsd - MAX_RUN_USD);
  }
}
