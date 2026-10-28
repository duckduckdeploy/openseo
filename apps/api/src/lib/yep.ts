import { createHash } from "node:crypto";
import { createYepApi, estimateCost, isYepApiError, pricing, type YepApi, type YepAppInfo, type YepEndpoint } from "@openseo/yepapi";
import { and, eq, gt, gte, sql } from "drizzle-orm";
import { dataDb, db, schema } from "../db";
import { env } from "../env";
import { decrypt } from "./crypto";
import { AppError } from "./errors";

/** `freeOnly`: the caller only makes free calls (balance, model list), so a reached budget is no reason to refuse. */
export type CallContext = { userId: string; projectId?: string | null; feature: string; freeOnly?: boolean };

export function monthStart(now = new Date()): Date {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
}

export async function monthSpend(userId: string): Promise<number> {
  const [row] = await db
    .select({ total: sql<number>`coalesce(sum(${schema.usageLog.costUsd}), 0)::float8` })
    .from(schema.usageLog)
    .where(and(eq(schema.usageLog.userId, userId), gte(schema.usageLog.createdAt, monthStart())));
  return row?.total ?? 0;
}

/**
 * This process's view of a user's month spend, so a paid call does not run a SUM over usage_log
 * each time. The API runs as one process, so its own calls are all seen here:
 * - logged: the last SUM, re-read every few seconds, plus rows written since
 * - unwritten: calls that returned but whose usage_log row is not written yet
 * - reserved: the documented worst-case price of paid calls in flight, so calls made together
 *   see each other before any of them has a price
 */
type Spend = {
  month: number;
  logged: number;
  readAt: number;
  reading: Promise<void> | null;
  writtenWhileReading: number;
  unwritten: number;
  reserved: number;
};

const SPEND_TTL_MS = 5_000;
const spendByUser = new Map<string, Spend>();

function spendOf(userId: string): Spend {
  const month = monthStart().getTime();
  let spend = spendByUser.get(userId);
  if (!spend || spend.month !== month) {
    // A new month starts from a fresh SUM; calls still in flight stay counted.
    spend = { month, logged: 0, readAt: 0, reading: null, writtenWhileReading: 0, unwritten: spend?.unwritten ?? 0, reserved: spend?.reserved ?? 0 };
    spendByUser.set(userId, spend);
  }
  return spend;
}

async function freshSpend(userId: string): Promise<Spend> {
  const spend = spendOf(userId);
  if (Date.now() - spend.readAt > SPEND_TTL_MS) {
    spend.reading ??= (async () => {
      spend.writtenWhileReading = 0;
      try {
        // A row written while the SUM ran may or may not be in it; it is counted either way, so
        // spend is never under-read (at worst over-read until the next refresh).
        spend.logged = (await monthSpend(userId)) + spend.writtenWhileReading;
        spend.readAt = Date.now();
      } finally {
        spend.reading = null;
      }
    })();
    await spend.reading;
  }
  return spend;
}

const spendTotal = (spend: Spend) => spend.logged + spend.unwritten + spend.reserved;

/** Cost of the user's calls in this process that returned but are not in usage_log yet. */
export function unwrittenSpend(userId: string): number {
  return spendByUser.get(userId)?.unwritten ?? 0;
}

// Client method path ("serp.google") to its endpoint, found once by calling each method of a
// client whose fetch only records the URL (the client calls fetch before its first await).
let methodEndpoints: Map<string, YepEndpoint> | null = null;

function endpointOf(path: string): YepEndpoint | undefined {
  if (!methodEndpoints) {
    const found = new Map<string, YepEndpoint>();
    let seen: string | undefined;
    const probe = createYepApi({
      apiKey: "probe",
      baseUrl: "http://probe.invalid",
      maxRetries: 0,
      fetch: (url) => {
        seen = new URL(url).pathname;
        return Promise.reject(new Error("probe"));
      },
    });
    const walk = (object: object, prefix: string) => {
      for (const [key, value] of Object.entries(object)) {
        if (typeof value === "function" && key !== "call") {
          seen = undefined;
          void (value as (params: unknown) => Promise<unknown>)({}).catch(() => {});
          if (seen) found.set(`${prefix}${key}`, seen as YepEndpoint);
        } else if (value !== null && typeof value === "object") walk(value, `${prefix}${key}.`);
      }
    };
    walk(probe, "");
    methodEndpoints = found;
  }
  return methodEndpoints.get(path);
}

/** Worst-case price of a call before it is made: the documented maximum, or the minimum when there is none (token-priced). */
function reservationFor(path: string, args: unknown[]): number {
  const endpoint = path === "call" ? (args[0] as YepEndpoint) : endpointOf(path);
  if (!endpoint || !pricing[endpoint]) return 0;
  try {
    const estimate = estimateCost(endpoint, (path === "call" ? args[1] : args[0]) as never);
    return estimate.max ?? estimate.min;
  } catch {
    return 0;
  }
}

const budgetReached = (budget: number, spent: number) =>
  new AppError(
    402,
    "budget_reached",
    `Your monthly spending limit of $${budget.toFixed(2)} is reached ($${spent.toFixed(2)} spent). Raise it in Settings to continue.`,
  );

// Free methods of the client; they stay usable when the budget is reached.
const FREE_METHODS = new Set(["account.balance", "ai.models"]);

const isFreeCall = (path: string, args: unknown[]) =>
  FREE_METHODS.has(path) || (path === "call" && pricing[args[0] as YepEndpoint]?.kind === "free");

/**
 * Wraps every paid method of the client (nested groups included) so `before` is awaited ahead of
 * each call. It returns a release function, called once the call has finished either way.
 */
function guarded<T extends object>(target: T, before: (path: string, args: unknown[]) => Promise<() => void>, prefix = ""): T {
  return new Proxy(target, {
    get(object, property, receiver) {
      const value: unknown = Reflect.get(object, property, receiver);
      const path = `${prefix}${String(property)}`;
      if (typeof value === "function") {
        const call = (args: unknown[]) => (value as (...a: unknown[]) => Promise<unknown>).apply(object, args);
        return (...args: unknown[]) =>
          isFreeCall(path, args) ? call(args) : before(path, args).then((release) => call(args).finally(release));
      }
      return value !== null && typeof value === "object" ? guarded(value, before, `${path}.`) : value;
    },
  });
}

/**
 * A YepAPI client bound to the user's own key. Every billed or failed call is written to
 * usage_log, which is what the monthly budget is measured against.
 *
 * With a budget set, every paid call is first checked against the month's spend (see Spend:
 * usage_log, calls whose rows are still being written, and the worst-case price of calls in
 * flight, which each call reserves before it is made), so overlapping runs and parallel
 * requests see each other's spend and a long background run stops at the budget instead of
 * only being checked when it starts. A call is allowed while that total is under the limit, so
 * the month can end above it by about one call's price.
 */
/** Sent with every YepAPI request as X-App-* headers, so calls show up as OpenSEO in YepAPI's usage logs. */
export const YEPAPI_APP: YepAppInfo = {
  name: "OpenSEO",
  website: env.WEB_URL,
  description: "Open-source SEO suite: keyword research, rank tracking, site audits, backlinks and AI visibility.",
};

export async function getYep(context: CallContext): Promise<YepApi> {
  const [settings] = await db
    .select()
    .from(schema.userSettings)
    .where(eq(schema.userSettings.userId, context.userId))
    .limit(1);
  if (!settings?.yepapiKeyEnc) {
    throw new AppError(400, "yepapi_key_missing", "Add your YepAPI key in Settings before running this.");
  }
  const budget = settings.monthlyBudgetUsd;
  // This client's calls whose usage_log row could not be written; they stay counted for it.
  let lost = 0;
  if (budget != null && !context.freeOnly) {
    const spent = spendTotal(await freshSpend(context.userId)) + lost;
    if (spent >= budget) throw budgetReached(budget, spent);
  }
  const client = createYepApi({
    apiKey: decrypt(settings.yepapiKeyEnc),
    baseUrl: env.YEPAPI_BASE_URL,
    app: YEPAPI_APP,
    onCall: (call) => {
      // Free and unbilled calls are not worth a row, except failures, which help debugging.
      if (call.ok && call.costUsd === 0) return;
      const spend = spendOf(context.userId);
      spend.unwritten += call.costUsd;
      void db
        .insert(schema.usageLog)
        .values({
          userId: context.userId,
          projectId: context.projectId ?? null,
          endpoint: call.endpoint,
          feature: context.feature,
          ok: call.ok,
          status: call.status ?? null,
          costUsd: call.costUsd,
          ms: Math.round(call.ms),
        })
        .then(
          () => {
            spend.unwritten -= call.costUsd;
            spend.logged += call.costUsd;
            if (spend.reading) spend.writtenWhileReading += call.costUsd;
          },
          // A row that could not be written stays counted here, so this client still respects the budget.
          () => {
            spend.unwritten -= call.costUsd;
            lost += call.costUsd;
          },
        );
    },
  });
  if (budget == null) return client;
  return guarded(client, async (path, args) => {
    const spend = await freshSpend(context.userId);
    // Read, checked and reserved with no await in between, so calls made together see each other.
    const spent = spendTotal(spend) + lost;
    if (spent >= budget) throw budgetReached(budget, spent);
    const amount = reservationFor(path, args);
    spend.reserved += amount;
    // By the time the call settles it has reported its actual cost (as unwritten).
    return () => {
      spend.reserved -= amount;
    };
  });
}

/**
 * Errors that will fail every following call the same way (bad key, no credits, frozen
 * account, budget reached). Background runs stop on these instead of repeating them.
 */
export function isFatalForRun(error: unknown): boolean {
  if (error instanceof AppError) return error.code === "budget_reached";
  if (!isYepApiError(error)) return false;
  return error.isInvalidKey || error.isAccountFrozen || error.isInsufficientBalance;
}

/**
 * Checks a key without spending anything, by listing the chat models: a free call that answers
 * only to a valid key. 401 means a bad key and 403 a frozen account.
 */
export async function verifyYepKey(apiKey: string): Promise<{ ok: true; warning?: string } | { ok: false; message: string }> {
  const yep = createYepApi({ apiKey, baseUrl: env.YEPAPI_BASE_URL, app: YEPAPI_APP, maxRetries: 1, timeoutMs: 15_000 });
  try {
    await yep.ai.models();
    return { ok: true };
  } catch (error) {
    if (!isYepApiError(error)) {
      console.warn("YepAPI key check failed:", error);
      return { ok: false, message: "Could not verify the key. Try again in a moment." };
    }
    if (error.isInvalidKey) return { ok: false, message: "YepAPI rejected this key. Check that you copied the whole key." };
    if (error.isAccountFrozen) return { ok: false, message: "YepAPI reports this account as frozen. Contact YepAPI support." };
    if (error.isInsufficientBalance) return { ok: true, warning: "The key is valid but the account has no credits yet." };
    // Anything else is YepAPI or the network, not the key. Log what came back, so it can be traced.
    console.warn(`YepAPI key check: HTTP ${error.status} ${error.code}${error.requestId ? ` (request ${error.requestId})` : ""}: ${error.message}`);
    const why = error.isTimeout ? "did not answer in time" : error.isNetworkError ? "could not be reached" : `answered with an error (${error.status || error.code})`;
    return { ok: false, message: `YepAPI ${why} while checking the key. Try again in a moment.` };
  }
}

// Maps provider failures to errors the user can act on. Returns null for unknown errors.
export function toAppError(error: unknown): AppError | null {
  if (error instanceof AppError) return error;
  if (!isYepApiError(error)) return null;
  if (error.isInvalidKey) return new AppError(400, "yepapi_key_invalid", "YepAPI rejected your API key. Update it in Settings.");
  if (error.isAccountFrozen) return new AppError(402, "yepapi_account_frozen", "YepAPI reports your account as frozen. Contact YepAPI support.");
  if (error.isInsufficientBalance) {
    return new AppError(402, "yepapi_no_credits", "Your YepAPI account is out of credits. Top up at yepapi.com, then try again.");
  }
  if (error.isValidation) return new AppError(400, "yepapi_validation", `YepAPI rejected the request: ${error.message}`);
  if (error.isRateLimited) return new AppError(429, "yepapi_rate_limited", "YepAPI is rate limiting requests. Try again shortly.");
  if (error.isTimeout) return new AppError(504, "yepapi_timeout", "YepAPI took too long to respond. You were not charged if the call failed.");
  if (error.code === "UPSTREAM_TIMEOUT") return new AppError(504, "yepapi_upstream_timeout", "The model took too long to answer, even after retrying. You were not charged; it is asked again on the next run.");
  // e.g. backlinks/summary for a site with no known links: "Backlinks summary failed: Empty backlinks summary".
  if (/\bempty\b/i.test(error.message)) return new AppError(404, "yepapi_no_data", "YepAPI has no data for this target yet. New or small sites often have none.");
  return new AppError(502, "yepapi_error", `YepAPI returned an error: ${error.message}`);
}

/**
 * YepAPI answers UPSTREAM_TIMEOUT when a model provider (often Gemini with web search) is slow.
 * It is YepAPI's own error and never billed, so asking again cannot charge twice. Up to two retries.
 */
export async function withUpstreamRetry<T>(call: () => Promise<T>, retries = 2): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    try {
      return await call();
    } catch (error) {
      if (!isYepApiError(error) || error.code !== "UPSTREAM_TIMEOUT" || attempt >= retries) throw error;
      await new Promise((resolve) => setTimeout(resolve, 2000 * (attempt + 1)));
    }
  }
}

export const errorMessage = (error: unknown): string => toAppError(error)?.message ?? (error instanceof Error ? error.message : "Unknown error");

export type Cached<T> = { data: T; costUsd: number; cached: boolean; fetchedAt: Date };

// Paid fetches in progress, by user and cache key, so identical lookups made together pay once.
const inFlight = new Map<string, Promise<Cached<unknown>>>();

/**
 * Per-user response cache. Repeating a lookup inside its TTL costs nothing.
 * Keys are per user because the data was bought with that user's credits.
 */
export async function cached<T>(
  userId: string,
  name: string,
  params: unknown,
  ttlSeconds: number,
  refresh: boolean,
  run: () => Promise<{ data: T; costUsd: number; partial?: boolean }>,
): Promise<Cached<T>> {
  const key = `${name}:${createHash("sha256").update(JSON.stringify(params)).digest("hex").slice(0, 32)}`;
  if (!refresh && ttlSeconds > 0) {
    const [hit] = await dataDb
      .select()
      .from(schema.apiCache)
      .where(and(eq(schema.apiCache.userId, userId), eq(schema.apiCache.key, key), gt(schema.apiCache.expiresAt, new Date())))
      .limit(1);
    if (hit) return { data: hit.payload as T, costUsd: 0, cached: true, fetchedAt: hit.createdAt };
  }
  if (ttlSeconds <= 0) return fetchAndStore(userId, key, ttlSeconds, run);
  const flightKey = `${userId}:${key}`;
  const pending = inFlight.get(flightKey) as Promise<Cached<T>> | undefined;
  // Joining a fetch another request is already paying for costs this one nothing.
  if (pending) return pending.then((shared) => ({ ...shared, costUsd: 0, cached: true }));
  const fetching = fetchAndStore(userId, key, ttlSeconds, run).finally(() => inFlight.delete(flightKey));
  inFlight.set(flightKey, fetching);
  return fetching;
}

async function fetchAndStore<T>(
  userId: string,
  key: string,
  ttlSeconds: number,
  run: () => Promise<{ data: T; costUsd: number; partial?: boolean }>,
): Promise<Cached<T>> {
  const result = await run();
  const now = new Date();
  // A partial result (some paid parts failed) is returned once but not reused.
  if (ttlSeconds > 0 && !result.partial) {
    const values = {
      payload: result.data as object,
      costUsd: result.costUsd,
      createdAt: now,
      expiresAt: new Date(now.getTime() + ttlSeconds * 1000),
    };
    await dataDb
      .insert(schema.apiCache)
      .values({ userId, key, ...values })
      .onConflictDoUpdate({ target: [schema.apiCache.userId, schema.apiCache.key], set: values });
  }
  return { data: result.data, costUsd: result.costUsd, cached: false, fetchedAt: now };
}
