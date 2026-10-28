'use client';

import posthog from 'posthog-js';
import { useEffect } from 'react';
import { APP_URL } from '@/lib/site';

/**
 * PostHog page views and clicks, on only when NEXT_PUBLIC_POSTHOG_KEY was set at build time.
 * Events go through the app's /ingest proxy (apps/app/next.config.ts), which keeps them first-party
 * without changing this site's URL handling. The cookie is shared with the app's subdomain, so a
 * visit here and the sign-up that follows are one person.
 */
export function Analytics() {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key) return;
    posthog.init(key, {
      api_host: `${APP_URL}/ingest`,
      ui_host: process.env.NEXT_PUBLIC_POSTHOG_UI_HOST || 'https://us.posthog.com',
      defaults: '2026-08-30',
      person_profiles: 'identified_only',
      cross_subdomain_cookie: true,
      respect_dnt: true,
      disable_session_recording: true,
    });
    posthog.register({ app: 'website', environment: process.env.NODE_ENV });
  }, []);
  return null;
}
