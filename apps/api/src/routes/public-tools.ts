import type { FastifyInstance, FastifyRequest } from "fastify";
import { env } from "../env";
import { runPublicTool } from "../services/public-tools";

/** The visitor's address: the edge proxy's header when one is set (CLIENT_IP_HEADER), else the socket. */
export function visitorOf(request: FastifyRequest) {
  const header = env.CLIENT_IP_HEADER ? request.headers[env.CLIENT_IP_HEADER.toLowerCase()] : undefined;
  return (Array.isArray(header) ? header[0] : header) || request.ip;
}

/** Free tools for the public website (services/public-tools.ts). No account, no cookies. */
export async function publicToolRoutes(app: FastifyInstance) {
  app.post<{ Params: { tool: string } }>("/public/tools/:tool", async (request) => {
    const result = await runPublicTool(request.params.tool, request.body, visitorOf(request));
    return { ok: true, data: result.data, cached: result.cached, remaining: result.remaining };
  });
}
