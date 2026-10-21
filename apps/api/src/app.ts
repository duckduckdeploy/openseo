import cors from "@fastify/cors";
import Fastify, { type FastifyInstance } from "fastify";
import { env } from "./env";
import { auth } from "./lib/auth";
import { toHeaders } from "./lib/context";
import { AppError, isInvalidInput } from "./lib/errors";
import { toAppError } from "./lib/yep";
import { registerMcp } from "./mcp/server";
import { accountRoutes } from "./routes/account";
import { aiRoutes } from "./routes/ai";
import { auditRoutes } from "./routes/audit";
import { googleRoutes } from "./routes/google";
import { oauthPublicRoutes, oauthSessionRoutes } from "./routes/oauth";
import { keywordRoutes } from "./routes/keywords";
import { localRoutes } from "./routes/local";
import { lookupRoutes } from "./routes/lookups";
import { projectRoutes } from "./routes/projects";
import { publicToolRoutes } from "./routes/public-tools";
import { rankRoutes } from "./routes/rank";

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: env.NODE_ENV === "test" ? false : { level: "info", redact: ["req.headers.authorization", "req.headers.cookie"] },
    bodyLimit: 1024 * 1024,
    // A hop count, not "trust everything": with true, any client could set X-Forwarded-For and
    // pick its own address, which would defeat per-address rate limits. See TRUST_PROXY_HOPS.
    trustProxy: (_address: string, hop: number) => hop < env.TRUST_PROXY_HOPS,
  });

  // Browsers reach the API through the app's /api proxy; CORS is for direct API and MCP clients.
  // The public OAuth endpoints carry no cookies, so browser-based MCP clients may call them from
  // any origin; everything else only from the dashboard, with credentials. /mcp too is open to
  // any origin without credentials: it authenticates by bearer token only, never the cookie.
  const isPublicOAuth = (url: string) => url.startsWith("/.well-known/") || url.startsWith("/oauth/");
  const isMcp = (url: string) => url === "/mcp" || url.startsWith("/mcp?") || url.startsWith("/mcp/");
  await app.register(cors, {
    delegator: (request, callback) => {
      if (isPublicOAuth(request.url ?? "")) callback(null, { origin: true, credentials: false });
      // Browser clients read www-authenticate on a 401 to find the OAuth metadata.
      else if (isMcp(request.url ?? "")) callback(null, { origin: true, credentials: false, exposedHeaders: ["www-authenticate"] });
      // The website's free tools: from the website only, never with cookies.
      else if ((request.url ?? "").startsWith("/public/")) callback(null, { origin: [env.WEB_URL], credentials: false });
      else callback(null, { origin: [env.APP_URL], credentials: true });
    },
  });

  app.setErrorHandler((error, request, reply) => {
    const appError = toAppError(error);
    if (appError) {
      return reply.status(appError.status).send({
        ok: false,
        error: { code: appError.code, message: appError.message, details: appError.details },
      });
    }
    // Fallback for a malformed ID that a route did not check: a client error, not a 500.
    if (isInvalidInput(error)) {
      return reply.status(400).send({ ok: false, error: { code: "bad_request", message: "Invalid identifier or value" } });
    }
    const status = (error as { statusCode?: number }).statusCode;
    if (status && status < 500) {
      const code = ({ 404: "not_found", 413: "payload_too_large", 415: "unsupported_media_type", 429: "rate_limited" } as Record<number, string>)[status] ?? "bad_request";
      return reply.status(status).send({ ok: false, error: { code, message: (error as Error).message } });
    }
    request.log.error(error);
    return reply.status(500).send({ ok: false, error: { code: "internal_error", message: "Something went wrong" } });
  });

  app.setNotFoundHandler((_request, reply) =>
    reply.status(404).send({ ok: false, error: { code: "not_found", message: "Route not found" } }),
  );

  app.get("/health", async () => ({ ok: true }));

  app.route({
    method: ["GET", "POST"],
    url: "/api/auth/*",
    async handler(request, reply) {
      const url = new URL(request.url, env.APP_URL);
      const response = await auth.handler(
        new Request(url, {
          method: request.method,
          headers: toHeaders(request),
          body: request.method === "POST" && request.body ? JSON.stringify(request.body) : undefined,
        }),
      );
      reply.status(response.status);
      response.headers.forEach((value, name) => {
        if (name.toLowerCase() !== "set-cookie") reply.header(name, value);
      });
      const cookies = response.headers.getSetCookie();
      if (cookies.length) reply.header("set-cookie", cookies);
      return reply.send(response.body ? await response.text() : null);
    },
  });

  await app.register(
    async (api) => {
      // Cookie-authenticated writes must come from the app itself. API-key requests carry no
      // ambient credentials, so they are exempt.
      api.addHook("onRequest", async (request) => {
        if (request.method === "GET" || request.method === "HEAD" || request.method === "OPTIONS") return;
        if (request.headers.authorization?.startsWith("Bearer ")) return;
        const origin = request.headers.origin;
        if (origin && origin !== env.APP_URL) throw new AppError(403, "forbidden_origin", "Requests from this origin are not allowed");
      });
      await api.register(accountRoutes);
      await api.register(projectRoutes);
      await api.register(keywordRoutes);
      await api.register(lookupRoutes);
      await api.register(rankRoutes);
      await api.register(aiRoutes);
      await api.register(auditRoutes);
      await api.register(localRoutes);
      await api.register(googleRoutes);
      await api.register(oauthSessionRoutes);
    },
    { prefix: "/api" },
  );

  // OAuth for MCP clients that cannot send an API key, such as ChatGPT (services/oauth.ts).
  await app.register(oauthPublicRoutes);

  await app.register(publicToolRoutes);


  await registerMcp(app);

  return app;
}

export { AppError };
