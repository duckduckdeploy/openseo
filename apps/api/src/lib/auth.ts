import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db, schema } from "../db";
import { env } from "../env";
import { identify, track } from "./analytics";

// The app proxies /api/* to this server, so auth cookies are first-party to APP_URL.
export const auth = betterAuth({
  baseURL: env.APP_URL,
  basePath: "/api/auth",
  secret: env.AUTH_SECRET,
  trustedOrigins: [env.APP_URL],
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  emailAndPassword: { enabled: true, minPasswordLength: 8 },
  session: { expiresIn: 60 * 60 * 24 * 30, updateAge: 60 * 60 * 24 },
  // Sign-ups and sign-ins for product analytics (lib/analytics.ts); nothing is sent without POSTHOG_KEY.
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          identify(user.id, { email: user.email, name: user.name, signed_up_at: user.createdAt.toISOString() });
          track(user.id, "user_signed_up", { method: "email" });
        },
      },
    },
    session: {
      create: {
        after: async (session) => track(session.userId, "user_signed_in"),
      },
    },
  },
  // Sign-in rate limits key on the visitor's address. Behind an edge proxy that is the header it
  // sets (CLIENT_IP_HEADER); without one, every visitor would share a single bucket.
  ...(env.CLIENT_IP_HEADER ? { advanced: { ipAddress: { ipAddressHeaders: [env.CLIENT_IP_HEADER.toLowerCase()] } } } : {}),
});
