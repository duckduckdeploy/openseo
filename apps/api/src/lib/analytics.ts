import { PostHog } from "posthog-node";

/**
 * Product analytics with PostHog, on only when POSTHOG_KEY is set. Server-side events are the
 * record of what happened (sign-ups, lookups, runs), since browsers can block the dashboard's.
 * The distinct id is the user id, the same one the dashboard identifies with.
 */
// Read straight from the environment (validated in env.ts), so importing this stays free of side effects.
const KEY = process.env.POSTHOG_KEY?.trim();
const client = KEY ? new PostHog(KEY, { host: process.env.POSTHOG_HOST || "https://us.i.posthog.com", flushAt: 20, flushInterval: 10_000 }) : null;
const ENVIRONMENT = process.env.NODE_ENV ?? "development";

export type Properties = Record<string, unknown>;

/** Records an event for a user. Never throws: analytics must not break a request or a job. */
export function track(userId: string | null | undefined, event: string, properties: Properties = {}) {
  if (!client) return;
  try {
    client.capture({
      distinctId: userId ?? "anonymous",
      event,
      // Anonymous events (the public tools) create no person profile.
      properties: { app: "api", environment: ENVIRONMENT, ...properties, ...(userId ? {} : { $process_person_profile: false }) },
    });
  } catch (error) {
    console.warn("Analytics capture failed:", error);
  }
}

/** Sets properties on the user's person profile. */
export function identify(userId: string, properties: Properties) {
  if (!client) return;
  try {
    client.identify({ distinctId: userId, properties });
  } catch (error) {
    console.warn("Analytics identify failed:", error);
  }
}

/** Sends what is queued. Called on shutdown. */
export async function flushAnalytics() {
  await client?.shutdown(5_000).catch(() => undefined);
}
