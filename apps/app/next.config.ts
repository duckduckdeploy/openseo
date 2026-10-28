import type { NextConfig } from "next";

const apiUrl = process.env.API_URL ?? "http://localhost:4100";
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";
const posthogAssets = posthogHost.replace("://us.i.", "://us-assets.i.").replace("://eu.i.", "://eu-assets.i.");

const config: NextConfig = {
  transpilePackages: ["@openseo/shared"],
  // PostHog's API paths end in a slash.
  skipTrailingSlashRedirect: true,
  // The browser only ever talks to this origin; /api is forwarded to the API server.
  // No framing: the consent page approves connections with one click.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      { source: "/api/:path*", destination: `${apiUrl}/api/:path*` },
      // PostHog, through this origin so blockers of third-party hosts do not drop it (src/lib/analytics.ts).
      { source: "/ingest/static/:path*", destination: `${posthogAssets}/static/:path*` },
      { source: "/ingest/:path*", destination: `${posthogHost}/:path*` },
    ];
  },
};

export default config;
