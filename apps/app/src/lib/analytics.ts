"use client";

import posthog from "posthog-js";

/**
 * Product analytics with PostHog, on only when NEXT_PUBLIC_POSTHOG_KEY was set at build time.
 * Self-hosted installs without it send nothing. Events go through /ingest on this origin (see
 * next.config.ts), so they are not lost to blockers that drop third-party hosts.
 */
const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
export const analyticsEnabled = Boolean(KEY);

let started = false;

export function initAnalytics() {
  if (!KEY || started || typeof window === "undefined") return;
  started = true;
  posthog.init(KEY, {
    api_host: "/ingest",
    ui_host: process.env.NEXT_PUBLIC_POSTHOG_UI_HOST || "https://us.posthog.com",
    // Page views on every client-side navigation, page leaves, and the current recommended defaults.
    defaults: "2026-08-30",
    person_profiles: "identified_only",
    // Shared with openseo.gg, so a visit to the site and the sign-up after it are one person.
    cross_subdomain_cookie: true,
    respect_dnt: true,
    // Never send what is on screen: pages show Google Search Console data, which may not go to third
    // parties (Google API Services User Data Policy). No session recordings, and clicks carry no text.
    disable_session_recording: true,
    mask_all_text: true,
    mask_all_element_attributes: true,
  });
  // On every event, so the dashboard, the site and the API can be told apart (and dev from production).
  posthog.register({ app: "dashboard", environment: process.env.NODE_ENV });
}

type Properties = Record<string, string | number | boolean | null | undefined | string[]>;

export function track(event: string, properties?: Properties) {
  if (!started) return;
  posthog.capture(event, properties);
}

/** Ties this browser's events to the signed-in user (the same id the API sends events with). */
export function identify(user: { id: string; email: string; name?: string | null; createdAt?: string }, extra?: Properties) {
  if (!started) return;
  if (posthog.get_distinct_id() === user.id) {
    if (extra) posthog.setPersonProperties(extra);
    return;
  }
  posthog.identify(user.id, { email: user.email, name: user.name ?? undefined, signed_up_at: user.createdAt, ...extra });
}

export function resetAnalytics() {
  if (!started) return;
  posthog.reset();
}
