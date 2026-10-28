/**
 * Google Search Console.
 *
 * Connecting is a separate OAuth grant (the webmasters scope), apart from signing in to OpenSEO. Search Console asks for full access so OpenSEO can submit sitemaps; grants
 * made before that are read-only and still work for everything else. The flow:
 * - a single-use random state, stored for 10 minutes in the verification table with the user it
 *   was issued to
 * - PKCE, with the verifier derived from the state by HMAC, so it never needs storing
 * - tokens encrypted with ENCRYPTION_KEY; a refresh token Google leaves out of a later grant is kept
 * Google calls are free and never touch the YepAPI budget. Reports read Google live; the daily
 * sync (gsc-sync.ts) and URL inspections (indexing.ts) store what they read in the project database,
 * and disconnecting deletes it.
 */
import { createHash, createHmac, randomBytes, randomUUID } from "node:crypto";
import { and, eq, like, lt, sql } from "drizzle-orm";
import { dataDb, db, schema } from "../db";
import type { GoogleProvider } from "../db/schema";
import { env } from "../env";
import { decrypt, encrypt } from "../lib/crypto";
import { AppError, badRequest, notFound } from "../lib/errors";

type Project = typeof schema.projects.$inferSelect;
type Account = typeof schema.googleAccounts.$inferSelect;

export const PROVIDERS: GoogleProvider[] = ["gsc"];
export const PRODUCT: Record<GoogleProvider, string> = { gsc: "Google Search Console" };
const SCOPE: Record<GoogleProvider, string> = { gsc: "https://www.googleapis.com/auth/webmasters" };
const GSC_READONLY = "https://www.googleapis.com/auth/webmasters.readonly";

const HOSTS = {
  auth: "https://accounts.google.com",
  token: "https://oauth2.googleapis.com",
  webmasters: "https://www.googleapis.com",
  searchconsole: "https://searchconsole.googleapis.com",
} as const;

function googleUrl(host: keyof typeof HOSTS, path: string): string {
  return env.GOOGLE_API_BASE_URL ? `${env.GOOGLE_API_BASE_URL.replace(/\/+$/, "")}/${host}${path}` : `${HOSTS[host]}${path}`;
}

// ── Errors ──────────────────────────────────────────────────────────────────

export const googleNotConfigured = () =>
  new AppError(503, "google_not_configured", "Google is not set up on this server. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET (see the self-hosting docs).");
const notConnected = (provider: GoogleProvider) =>
  new AppError(409, "google_not_connected", `Connect ${PRODUCT[provider]} to this project first, under Search performance.`, { provider });
const reconnect = (provider: GoogleProvider) =>
  new AppError(409, "google_reconnect_required", `Google access for ${PRODUCT[provider]} has expired or was revoked. Reconnect the account.`, { provider });

export function googleConfigured(): boolean {
  return Boolean(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET);
}

function config() {
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) throw googleNotConfigured();
  return { clientId: env.GOOGLE_CLIENT_ID, clientSecret: env.GOOGLE_CLIENT_SECRET };
}

export const redirectUri = (provider: GoogleProvider) => `${env.APP_URL}/api/google/${provider}/callback`;

// ── OAuth ───────────────────────────────────────────────────────────────────

const STATE_TTL_MS = 10 * 60_000;
const stateId = (provider: GoogleProvider, state: string) => `google-link:${provider}:${state}`;

/** The PKCE verifier for a state: an HMAC keyed with the client secret, so nothing is stored. */
export function pkceVerifier(provider: GoogleProvider, state: string): string {
  return createHmac("sha256", `openseo:${provider}:pkce:${config().clientSecret}`).update(state).digest("base64url");
}

/** Only paths on the dashboard itself: "/p/…", never "//evil.com" or "/\evil.com". */
export function safeReturnTo(value: unknown): string {
  return typeof value === "string" && /^\/(?![/\\])[^\s]*$/.test(value) && value.length <= 500 ? value : "/projects";
}

/** Google's consent URL for one product. The state is single use and expires in 10 minutes. */
export async function startLink(userId: string, provider: GoogleProvider, returnTo: string): Promise<string> {
  const { clientId } = config();
  const state = randomBytes(32).toString("base64url");
  const now = new Date();
  await db.delete(schema.verification).where(and(like(schema.verification.identifier, "google-link:%"), lt(schema.verification.expiresAt, now)));
  await db.insert(schema.verification).values({
    id: randomUUID(),
    identifier: stateId(provider, state),
    value: JSON.stringify({ userId, returnTo: safeReturnTo(returnTo) }),
    expiresAt: new Date(now.getTime() + STATE_TTL_MS),
  });
  const challenge = createHash("sha256").update(pkceVerifier(provider, state)).digest("base64url");
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri(provider),
    response_type: "code",
    scope: `openid email ${SCOPE[provider]}`,
    access_type: "offline",
    prompt: "select_account consent",
    state,
    code_challenge: challenge,
    code_challenge_method: "S256",
  });
  return `${googleUrl("auth", "/o/oauth2/v2/auth")}?${params}`;
}

/** Thrown during the callback; the route turns it into ?google_error=<code> on the dashboard. */
export class LinkError extends Error {
  constructor(
    public code: "state_mismatch" | "access_denied" | "scope_denied" | "token_exchange_failed" | "invalid_id_token",
    public returnTo = "/projects",
  ) {
    super(code);
  }
}

/** Single use: the row is deleted as it is read, so a replayed callback finds nothing. */
async function consumeState(provider: GoogleProvider, state: string, userId: string): Promise<string> {
  const [row] = await db.delete(schema.verification).where(eq(schema.verification.identifier, stateId(provider, state))).returning();
  if (!row || row.expiresAt < new Date()) throw new LinkError("state_mismatch");
  let value: { userId?: string; returnTo?: string };
  try {
    value = JSON.parse(row.value);
  } catch {
    throw new LinkError("state_mismatch");
  }
  // A state issued to someone else: a login CSRF attempt, or a link opened in another session.
  if (value.userId !== userId) throw new LinkError("state_mismatch");
  return safeReturnTo(value.returnTo);
}

type TokenReply = { access_token?: string; expires_in?: number; refresh_token?: string; scope?: string; id_token?: string; error?: string };

async function tokenRequest(body: Record<string, string>): Promise<{ status: number; json: TokenReply }> {
  const res = await fetch(googleUrl("token", "/token"), {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(body).toString(),
    signal: AbortSignal.timeout(15_000),
  });
  return { status: res.status, json: (await res.json().catch(() => ({}))) as TokenReply };
}

/**
 * Reads the account ID and email from the ID token. It came straight from Google's token endpoint
 * over TLS, which OpenID Connect accepts in place of checking the signature; issuer, audience and
 * expiry are still checked.
 */
function readIdToken(idToken: string | undefined): { sub: string; email: string | null } {
  const payload = idToken?.split(".")[1];
  if (!payload) throw new LinkError("invalid_id_token");
  let claims: { sub?: unknown; email?: unknown; aud?: unknown; iss?: unknown; exp?: unknown };
  try {
    claims = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  } catch {
    throw new LinkError("invalid_id_token");
  }
  const issuerOk = claims.iss === "https://accounts.google.com" || claims.iss === "accounts.google.com";
  const audienceOk = claims.aud === config().clientId;
  const fresh = typeof claims.exp === "number" && claims.exp * 1000 > Date.now();
  if (typeof claims.sub !== "string" || !issuerOk || !audienceOk || !fresh) throw new LinkError("invalid_id_token");
  return { sub: claims.sub, email: typeof claims.email === "string" ? claims.email : null };
}

/** Completes a link: checks the state, swaps the code for tokens and stores the grant. */
export async function finishLink(provider: GoogleProvider, userId: string, query: { code?: string; state?: string; error?: string }): Promise<string> {
  const { clientId, clientSecret } = config();
  if (!query.state) throw new LinkError("state_mismatch");
  const returnTo = await consumeState(provider, query.state, userId);
  if (query.error || !query.code) throw new LinkError("access_denied", returnTo);

  const { status, json } = await tokenRequest({
    code: query.code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri(provider),
    grant_type: "authorization_code",
    code_verifier: pkceVerifier(provider, query.state),
  });
  if (status !== 200 || !json.access_token) throw new LinkError("token_exchange_failed", returnTo);
  // Google lets people untick scopes on the consent screen. Read-only Search Console still works for reports.
  const granted = (json.scope ?? "").split(" ");
  if (!granted.includes(SCOPE[provider]) && !(provider === "gsc" && granted.includes(GSC_READONLY))) throw new LinkError("scope_denied", returnTo);
  let identity: { sub: string; email: string | null };
  try {
    identity = readIdToken(json.id_token);
  } catch (error) {
    throw error instanceof LinkError ? new LinkError(error.code, returnTo) : error;
  }

  const expiresAt = new Date(Date.now() + (json.expires_in ?? 3600) * 1000);
  const refresh = json.refresh_token ? encrypt(json.refresh_token) : null;
  await db
    .insert(schema.googleAccounts)
    .values({ userId, provider, googleSub: identity.sub, email: identity.email, accessTokenEnc: encrypt(json.access_token), refreshTokenEnc: refresh, expiresAt, scope: json.scope ?? null })
    .onConflictDoUpdate({
      target: [schema.googleAccounts.userId, schema.googleAccounts.provider, schema.googleAccounts.googleSub],
      set: {
        email: identity.email,
        accessTokenEnc: encrypt(json.access_token),
        // Google often omits the refresh token on a repeat grant; keep the one we have.
        refreshTokenEnc: sql`coalesce(${refresh}, ${schema.googleAccounts.refreshTokenEnc})`,
        expiresAt,
        scope: json.scope ?? null,
      },
    });
  return returnTo;
}

/** A valid access token, refreshed when it is within 5 seconds of expiring. */
async function accessToken(account: Account): Promise<string> {
  if (account.expiresAt.getTime() - 5_000 > Date.now()) return decrypt(account.accessTokenEnc);
  if (!account.refreshTokenEnc) throw reconnect(account.provider);
  const { clientId, clientSecret } = config();
  const { status, json } = await tokenRequest({
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: decrypt(account.refreshTokenEnc),
    grant_type: "refresh_token",
  });
  if (status !== 200 || !json.access_token) throw reconnect(account.provider);
  const expiresAt = new Date(Date.now() + (json.expires_in ?? 3600) * 1000);
  await db
    .update(schema.googleAccounts)
    .set({ accessTokenEnc: encrypt(json.access_token), expiresAt, ...(json.refresh_token ? { refreshTokenEnc: encrypt(json.refresh_token) } : {}) })
    .where(eq(schema.googleAccounts.id, account.id));
  return json.access_token;
}

/** Whether a Search Console grant can write (submit sitemaps), not just read. */
export const canWriteGsc = (account: Pick<Account, "scope">) => (account.scope ?? "").split(" ").includes(SCOPE.gsc);

/** One Google API call with the account's token; errors become app errors with a next step. */
export async function googleCall<T>(account: Account, host: keyof typeof HOSTS, path: string, body?: unknown, method?: "GET" | "POST" | "PUT" | "DELETE"): Promise<T> {
  const token = await accessToken(account);
  const res = await fetch(googleUrl(host, path), {
    method: method ?? (body === undefined ? "GET" : "POST"),
    headers: { authorization: `Bearer ${token}`, ...(body === undefined ? {} : { "content-type": "application/json" }) },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(30_000),
  });
  const json = (await res.json().catch(() => ({}))) as { error?: { message?: string; status?: string } } & T;
  if (res.ok) return json;
  const message = json.error?.message ?? `HTTP ${res.status}`;
  if (res.status === 401) throw reconnect(account.provider);
  if (res.status === 403) throw new AppError(403, "google_permission", `Google refused access: ${message}`);
  if (res.status === 429) throw new AppError(429, "google_quota", `Google's API quota is used up for now. Try again later. (${message})`);
  if (res.status === 400) throw badRequest(`Google rejected the request: ${message}`);
  throw new AppError(502, "google_error", `Google returned an error: ${message}`);
}

// ── Accounts and connections ────────────────────────────────────────────────

export async function listAccounts(userId: string) {
  return db
    .select({ id: schema.googleAccounts.id, provider: schema.googleAccounts.provider, email: schema.googleAccounts.email, createdAt: schema.googleAccounts.createdAt })
    .from(schema.googleAccounts)
    .where(eq(schema.googleAccounts.userId, userId))
    .orderBy(schema.googleAccounts.createdAt);
}

async function ownAccount(userId: string, accountId: string, provider: GoogleProvider): Promise<Account> {
  const [account] = await db
    .select()
    .from(schema.googleAccounts)
    .where(and(eq(schema.googleAccounts.id, accountId), eq(schema.googleAccounts.userId, userId), eq(schema.googleAccounts.provider, provider)))
    .limit(1);
  if (!account) throw notFound("Google account");
  return account;
}

/**
 * Removes a grant and every project connection that used it. Returns how many projects lost one.
 * The connections (project database) go first, then the grant (core database): if the second step
 * failed, the grant would be left without connections, never connections without a grant.
 */
export async function removeAccount(userId: string, accountId: string): Promise<{ projects: number }> {
  const [account] = await db
    .select({ id: schema.googleAccounts.id })
    .from(schema.googleAccounts)
    .where(and(eq(schema.googleAccounts.id, accountId), eq(schema.googleAccounts.userId, userId)))
    .limit(1);
  if (!account) throw notFound("Google account");
  const lost = await dataDb.transaction(async (tx) => {
    const gsc = await tx.delete(schema.gscConnections).where(eq(schema.gscConnections.googleAccountId, account.id)).returning({ id: schema.gscConnections.projectId });
    for (const { id } of gsc) await deleteStoredGsc(tx, id);
    return gsc.length;
  });
  await db.delete(schema.googleAccounts).where(eq(schema.googleAccounts.id, account.id));
  return { projects: lost };
}

export type GscSite = { siteUrl: string; permissionLevel: string; verified: boolean };

export async function listSites(userId: string, accountId: string): Promise<GscSite[]> {
  const account = await ownAccount(userId, accountId, "gsc");
  const res = await googleCall<{ siteEntry?: { siteUrl: string; permissionLevel: string }[] }>(account, "webmasters", "/webmasters/v3/sites");
  return (res.siteEntry ?? [])
    .map((site) => ({ siteUrl: site.siteUrl, permissionLevel: site.permissionLevel, verified: site.permissionLevel !== "siteUnverifiedUser" }))
    .sort((a, b) => a.siteUrl.localeCompare(b.siteUrl));
}

export async function connectGsc(project: Project, userId: string, accountId: string, siteUrl: string) {
  const sites = await listSites(userId, accountId);
  const site = sites.find((s) => s.siteUrl === siteUrl);
  if (!site) throw badRequest("That property is not in this Google account's Search Console");
  // Unverified users can see a property in the list but read no data from it.
  if (!site.verified) throw badRequest("This Google account has no verified access to that property");
  const values = { projectId: project.id, googleAccountId: accountId, siteUrl };
  const [existing] = await dataDb.select({ siteUrl: schema.gscConnections.siteUrl }).from(schema.gscConnections).where(eq(schema.gscConnections.projectId, project.id)).limit(1);
  await dataDb.transaction(async (tx) => {
    // Another property's numbers would mix with this one's: start the stored history over.
    if (existing && existing.siteUrl !== siteUrl) await deleteStoredGsc(tx, project.id);
    const fresh = !existing || existing.siteUrl !== siteUrl ? { syncedFrom: null, syncedTo: null, backfillDone: false, syncError: null, nextSyncAt: new Date() } : {};
    await tx.insert(schema.gscConnections).values({ ...values, ...fresh }).onConflictDoUpdate({ target: schema.gscConnections.projectId, set: { ...values, ...fresh } });
  });
  return values;
}

type Tx = Parameters<Parameters<typeof dataDb.transaction>[0]>[0];

/** Removes a project's synced Search Console data and the Google results kept on its pages. */
async function deleteStoredGsc(tx: Tx, projectId: string) {
  await tx.delete(schema.gscDaily).where(eq(schema.gscDaily.projectId, projectId));
  await tx.delete(schema.gscDailyTotals).where(eq(schema.gscDailyTotals.projectId, projectId));
  await tx
    .update(schema.sitePages)
    .set({ googleVerdict: null, googleCoverage: null, googleCrawledAt: null, googleCanonical: null, googleInspectedAt: null, googleError: null })
    .where(eq(schema.sitePages.projectId, projectId));
}

export async function disconnect(project: Project) {
  await dataDb.transaction(async (tx) => {
    await tx.delete(schema.gscConnections).where(eq(schema.gscConnections.projectId, project.id));
    await deleteStoredGsc(tx, project.id);
  });
}

/** The Google account a connection reads through (core database), by id. */
async function accountById(id: string) {
  const [account] = await db.select().from(schema.googleAccounts).where(eq(schema.googleAccounts.id, id)).limit(1);
  return account ?? null;
}

/** The project's Search Console connection, with the email of the Google account it reads through. */
export async function connections(project: Project) {
  const [gscRow] = await dataDb.select().from(schema.gscConnections).where(eq(schema.gscConnections.projectId, project.id)).limit(1);
  const gscAccount = gscRow ? await accountById(gscRow.googleAccountId) : null;
  // A connection whose grant is gone counts as not connected, as the join used to.
  const gsc =
    gscRow && gscAccount
      ? {
          siteUrl: gscRow.siteUrl,
          accountId: gscRow.googleAccountId,
          email: gscAccount.email,
          canWrite: canWriteGsc(gscAccount),
          sync: { from: gscRow.syncedFrom, to: gscRow.syncedTo, backfillDone: gscRow.backfillDone, error: gscRow.syncError, lastSyncAt: gscRow.lastSyncAt },
          createdAt: gscRow.createdAt,
        }
      : null;
  return { gsc };
}

export async function gscFor(project: Pick<Project, "id">) {
  const [connection] = await dataDb.select().from(schema.gscConnections).where(eq(schema.gscConnections.projectId, project.id)).limit(1);
  const account = connection ? await accountById(connection.googleAccountId) : null;
  if (!connection || !account) throw notConnected("gsc");
  config();
  return { connection, account };
}


// ── Search Console reports ──────────────────────────────────────────────────

export const RANGES = { last_7_days: 7, last_28_days: 28, last_3_months: 90 } as const;
export type Range = keyof typeof RANGES;

export const DAY_MS = 86_400_000;
export const isoDate = (d: Date) => d.toISOString().slice(0, 10);

/**
 * The current and previous periods. Search Console data lags about three days, so periods end
 * three days ago; the previous period is the same length, immediately before. Google keeps 16
 * months, so nothing starts earlier than that.
 */
export function gscPeriods(range: Range, today = new Date()) {
  const days = RANGES[range];
  const midnight = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  const floor = new Date(midnight);
  floor.setUTCMonth(floor.getUTCMonth() - 16);
  const clamp = (t: number) => Math.max(t, floor.getTime());
  const end = midnight - 3 * DAY_MS;
  const start = end - (days - 1) * DAY_MS;
  const previousEnd = start - DAY_MS;
  const previousStart = previousEnd - (days - 1) * DAY_MS;
  return {
    current: { startDate: isoDate(new Date(clamp(start))), endDate: isoDate(new Date(end)) },
    previous: { startDate: isoDate(new Date(clamp(previousStart))), endDate: isoDate(new Date(clamp(previousEnd))) },
  };
}

export type GscFilters = {
  device?: "DESKTOP" | "MOBILE" | "TABLET";
  /** ISO 3166-1 alpha-3, as Search Console reports it, e.g. "usa". */
  country?: string;
  page?: { match: "contains" | "equals"; text: string };
  query?: { match: "contains" | "equals"; text: string };
};

function filterGroups(filters: GscFilters, skip: ("country" | "device")[] = []) {
  const list: { dimension: string; operator: string; expression: string }[] = [];
  if (filters.device && !skip.includes("device")) list.push({ dimension: "device", operator: "equals", expression: filters.device });
  if (filters.country && !skip.includes("country")) list.push({ dimension: "country", operator: "equals", expression: filters.country.toLowerCase() });
  if (filters.page?.text) list.push({ dimension: "page", operator: filters.page.match, expression: filters.page.text });
  if (filters.query?.text) list.push({ dimension: "query", operator: filters.query.match, expression: filters.query.text });
  return list.length ? [{ groupType: "and", filters: list }] : undefined;
}

export type GscRow = { keys?: string[]; clicks: number; impressions: number; ctr: number; position: number };

/** Rank-tracker bots search with a numeric job id in front of the keyword: "6689: yahoo serp tracker". */
const BOT_PREFIX = /^\d+:\s+/;
export const cleanQuery = (query: string) => query.replace(BOT_PREFIX, "");

/**
 * Strips bot job ids from the query key at `index` and merges rows that then share every key:
 * clicks and impressions summed, position weighted by impressions. Order is kept, first row wins.
 */
export function cleanQueryRows(rows: GscRow[], index: number): GscRow[] {
  if (index < 0 || !rows.some((r) => BOT_PREFIX.test(r.keys?.[index] ?? ""))) return rows;
  const merged = new Map<string, GscRow>();
  for (const r of rows) {
    const keys = r.keys?.map((key, i) => (i === index ? cleanQuery(key) : key));
    if (keys && !keys[index]) continue;
    const id = JSON.stringify(keys ?? []);
    const seen = merged.get(id);
    if (!seen) {
      merged.set(id, { ...r, keys });
      continue;
    }
    const impressions = seen.impressions + r.impressions;
    seen.position = impressions ? (seen.position * seen.impressions + r.position * r.impressions) / impressions : seen.position;
    seen.clicks += r.clicks;
    seen.impressions = impressions;
    seen.ctr = impressions ? seen.clicks / impressions : 0;
  }
  return [...merged.values()];
}

export async function searchAnalytics(
  account: Account,
  siteUrl: string,
  period: { startDate: string; endDate: string },
  options: { dimensions: string[]; filters?: GscFilters; skip?: ("country" | "device")[]; rowLimit: number; startRow?: number; dataState?: "all" | "final" },
): Promise<GscRow[]> {
  const res = await googleCall<{ rows?: GscRow[] }>(account, "webmasters", `/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`, {
    ...period,
    dimensions: options.dimensions,
    dimensionFilterGroups: filterGroups(options.filters ?? {}, options.skip),
    rowLimit: options.rowLimit,
    startRow: options.startRow ?? 0,
    type: "web",
    dataState: options.dataState ?? "all",
  });
  return res.rows ?? [];
}

/**
 * Clicks per page for a site audit: the last 28 days and the 28 before, up to 25,000 pages each.
 * Null when the project has no Search Console connected.
 */
export async function auditTraffic(projectId: string): Promise<{ siteUrl: string; period: { startDate: string; endDate: string }; pages: { url: string; clicks: number; previousClicks: number }[] } | null> {
  const [project] = await dataDb.select().from(schema.projects).where(eq(schema.projects.id, projectId)).limit(1);
  if (!project) return null;
  const [connected] = await dataDb.select({ id: schema.gscConnections.projectId }).from(schema.gscConnections).where(eq(schema.gscConnections.projectId, projectId)).limit(1);
  if (!connected) return null;
  const { connection, account } = await gscFor(project);
  const { current, previous } = gscPeriods("last_28_days");
  const options = { dimensions: ["page"], rowLimit: 25_000 };
  const [now, before] = await Promise.all([searchAnalytics(account, connection.siteUrl, current, options), searchAnalytics(account, connection.siteUrl, previous, options)]);
  const pages = new Map<string, { url: string; clicks: number; previousClicks: number }>();
  const row = (url: string) => pages.get(url) ?? pages.set(url, { url, clicks: 0, previousClicks: 0 }).get(url)!;
  for (const r of now) if (r.keys?.[0]) row(r.keys[0]).clicks += r.clicks;
  for (const r of before) if (r.keys?.[0]) row(r.keys[0]).previousClicks += r.clicks;
  return { siteUrl: connection.siteUrl, period: current, pages: [...pages.values()] };
}

const round = (value: number, digits: number) => Math.round(value * 10 ** digits) / 10 ** digits;

/** Clicks and impressions summed; CTR from the sums; position weighted by impressions. */
export function totalsOf(rows: GscRow[]) {
  const clicks = rows.reduce((sum, r) => sum + r.clicks, 0);
  const impressions = rows.reduce((sum, r) => sum + r.impressions, 0);
  const weighted = rows.reduce((sum, r) => sum + r.position * r.impressions, 0);
  return {
    clicks,
    impressions,
    ctr: impressions ? round((clicks / impressions) * 100, 2) : null,
    position: impressions ? round(weighted / impressions, 1) : null,
  };
}

export type StrikingRow = { query: string; page: string; clicks: number; impressions: number; position: number };

/**
 * Queries one push from page one: each query's best-ranking page, kept when that page sits at
 * positions 5 to 20, most impressions first, at most 100.
 */
export function strikingDistance(rows: GscRow[]): StrikingRow[] {
  const best = new Map<string, StrikingRow>();
  for (const row of rows) {
    const [query, page] = row.keys ?? [];
    if (!query || !page) continue;
    const current = best.get(query);
    if (!current || row.position < current.position) {
      best.set(query, { query, page, clicks: row.clicks, impressions: row.impressions, position: round(row.position, 1) });
    }
  }
  return [...best.values()]
    .filter((r) => r.position >= 5 && r.position <= 20)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 100);
}

/** Totals for this period and the one before, a daily series, striking-distance queries and the countries seen. */
export async function performanceReport(project: Project, range: Range, filters: GscFilters = {}) {
  const { connection, account } = await gscFor(project);
  const periods = gscPeriods(range);
  const [current, previous, pairs, countries] = await Promise.all([
    searchAnalytics(account, connection.siteUrl, periods.current, { dimensions: ["date"], filters, rowLimit: 200 }),
    searchAnalytics(account, connection.siteUrl, periods.previous, { dimensions: ["date"], filters, rowLimit: 200 }),
    searchAnalytics(account, connection.siteUrl, periods.current, { dimensions: ["query", "page"], filters, rowLimit: 1000 }),
    // Not filtered by country, so the country list stays complete while one is selected.
    searchAnalytics(account, connection.siteUrl, periods.current, { dimensions: ["country"], filters, skip: ["country"], rowLimit: 25 }),
  ]);
  return {
    siteUrl: connection.siteUrl,
    range,
    periods,
    totals: { current: totalsOf(current), previous: totalsOf(previous) },
    daily: current
      .map((r) => ({ date: r.keys?.[0] ?? "", clicks: r.clicks, impressions: r.impressions, position: round(r.position, 1) }))
      .sort((a, b) => a.date.localeCompare(b.date)),
    striking: strikingDistance(cleanQueryRows(pairs, 0)),
    countries: countries.map((r) => ({ country: r.keys?.[0] ?? "", clicks: r.clicks, impressions: r.impressions })),
  };
}

/** One page of the top queries or pages, by clicks. `hasMore` comes from asking for one extra row. */
export async function performanceTable(project: Project, options: { range: Range; dimension: "query" | "page"; filters?: GscFilters; page: number; size: number }) {
  const { connection, account } = await gscFor(project);
  const { current } = gscPeriods(options.range);
  const raw = await searchAnalytics(account, connection.siteUrl, current, {
    dimensions: [options.dimension],
    filters: options.filters,
    rowLimit: options.size + 1,
    startRow: (options.page - 1) * options.size,
  });
  // Merging bot-prefixed queries can leave a page a row or two short; `hasMore` still uses the raw count.
  const rows = options.dimension === "query" ? cleanQueryRows(raw, 0) : raw;
  return {
    period: current,
    page: options.page,
    size: options.size,
    hasMore: raw.length > options.size,
    rows: rows.slice(0, options.size).map((r) => ({ key: r.keys?.[0] ?? "", clicks: r.clicks, impressions: r.impressions, ctr: round(r.ctr * 100, 2), position: round(r.position, 1) })),
  };
}

/** Rows for agents: any dimensions, filtered by position and impressions over the top 1,000. */
export async function searchConsoleQuery(
  project: Project,
  options: { range: Range; dimensions: ("query" | "page" | "country" | "device" | "date")[]; filters?: GscFilters; minPosition?: number; maxPosition?: number; minImpressions?: number; limit: number },
) {
  const { connection, account } = await gscFor(project);
  const { current } = gscPeriods(options.range);
  const rows = cleanQueryRows(await searchAnalytics(account, connection.siteUrl, current, { dimensions: options.dimensions, filters: options.filters, rowLimit: 1000 }), options.dimensions.indexOf("query"));
  return {
    siteUrl: connection.siteUrl,
    period: current,
    rows: rows
      .filter((r) => (options.minPosition == null || r.position >= options.minPosition) && (options.maxPosition == null || r.position <= options.maxPosition))
      .filter((r) => options.minImpressions == null || r.impressions >= options.minImpressions)
      .slice(0, options.limit)
      .map((r) => ({
        ...Object.fromEntries(options.dimensions.map((d, i) => [d, r.keys?.[i] ?? ""])),
        clicks: r.clicks,
        impressions: r.impressions,
        ctr: round(r.ctr * 100, 2),
        position: round(r.position, 1),
      })),
  };
}

/** Google's index status for up to 10 URLs of the connected property. */
export async function inspectUrls(project: Project, urls: string[]) {
  const { connection, account } = await gscFor(project);
  const results = [];
  for (const url of urls) {
    try {
      const res = await googleCall<{ inspectionResult?: { indexStatusResult?: Record<string, unknown>; inspectionResultLink?: string } }>(
        account,
        "searchconsole",
        "/v1/urlInspection/index:inspect",
        { inspectionUrl: url, siteUrl: connection.siteUrl },
      );
      const status = res.inspectionResult?.indexStatusResult ?? {};
      results.push({
        url,
        verdict: status.verdict ?? null,
        coverageState: status.coverageState ?? null,
        indexingState: status.indexingState ?? null,
        robotsTxtState: status.robotsTxtState ?? null,
        pageFetchState: status.pageFetchState ?? null,
        lastCrawlTime: status.lastCrawlTime ?? null,
        googleCanonical: status.googleCanonical ?? null,
        userCanonical: status.userCanonical ?? null,
        link: res.inspectionResult?.inspectionResultLink ?? null,
        error: null as string | null,
      });
    } catch (error) {
      // Quota and permission problems apply to every URL; anything else is about this one.
      if (error instanceof AppError && error.code !== "bad_request") throw error;
      results.push({ url, verdict: null, coverageState: null, indexingState: null, robotsTxtState: null, pageFetchState: null, lastCrawlTime: null, googleCanonical: null, userCanonical: null, link: null, error: (error as Error).message });
    }
  }
  return { siteUrl: connection.siteUrl, results };
}

// ── Search opportunities ────────────────────────────────────────────────────

/** Share of the other values strictly below this one, 0 to 1. A single value ranks 1. */
export function percentileRanks(values: number[]): number[] {
  if (values.length <= 1) return values.map(() => 1);
  return values.map((v) => values.filter((other) => other < v).length / (values.length - 1));
}

/**
 * Pages ranking at positions 4 to 20, scored 0 to 100 on where a push is most worth it:
 * 0.7 × demand (impressions, on a log scale) + 0.3 × reachability (20 − position).
 * Each part is a percentile rank among the candidates.
 */
export async function searchOpportunities(project: Project, range: Range = "last_28_days") {
  const { connection, account } = await gscFor(project);
  const periods = gscPeriods(range);
  const gscRows = await searchAnalytics(account, connection.siteUrl, periods.current, { dimensions: ["page"], rowLimit: 1000, dataState: "final" });
  const candidates = gscRows
    .map((r) => ({ url: r.keys?.[0] ?? "", clicks: r.clicks, impressions: r.impressions, position: round(r.position, 1) }))
    .filter((r) => r.url && r.position >= 4 && r.position <= 20);

  const demand = percentileRanks(candidates.map((c) => Math.log1p(c.impressions)));
  const reach = percentileRanks(candidates.map((c) => 20 - c.position));
  const scored = candidates.map((c, i) => {
    const parts = { demand: round(demand[i] ?? 0, 2), reachability: round(reach[i] ?? 0, 2) };
    return { ...c, score: Math.round(100 * (0.7 * parts.demand + 0.3 * parts.reachability)), parts };
  });
  return {
    siteUrl: connection.siteUrl,
    period: periods.current,
    pages: scored.sort((a, b) => b.score - a.score || b.impressions - a.impressions).slice(0, 100),
  };
}
