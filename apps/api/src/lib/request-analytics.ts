import type { FastifyInstance } from "fastify";
import { track } from "./analytics";
import { requestUser } from "./context";

/** Named events for the actions worth charting; every other write is recorded as api_action. */
const EVENTS: Record<string, string> = {
  "PUT /api/settings/yepapi-key": "yepapi_key_connected",
  "DELETE /api/settings/yepapi-key": "yepapi_key_removed",
  "PUT /api/settings/budget": "budget_updated",
  "POST /api/onboarding/complete": "onboarding_completed",
  "POST /api/api-keys": "api_key_created",
  "DELETE /api/api-keys/:id": "api_key_revoked",
  "POST /api/projects": "project_created",
  "PATCH /api/projects/:projectId": "project_updated",
  "DELETE /api/projects/:projectId": "project_deleted",
  "POST /api/projects/:projectId/trackers": "rank_tracker_created",
  "DELETE /api/trackers/:trackerId": "rank_tracker_deleted",
  "POST /api/trackers/:trackerId/keywords": "rank_keywords_added",
  "POST /api/trackers/:trackerId/runs": "rank_check_started",
  "POST /api/projects/:projectId/audits": "site_audit_started",
  "POST /api/tools/site-audits": "site_audit_started",
  "POST /api/projects/:projectId/ai/prompts": "ai_prompts_added",
  "PUT /api/projects/:projectId/ai/settings": "ai_visibility_setup_saved",
  "POST /api/projects/:projectId/ai/suggest-prompts": "ai_prompts_suggested",
  "POST /api/projects/:projectId/ai/runs": "ai_visibility_run_started",
  "POST /api/projects/:projectId/geo-grids": "geo_grid_started",
  "PUT /api/projects/:projectId/google/gsc": "search_console_connected",
  "DELETE /api/projects/:projectId/google/:provider": "search_console_disconnected",
  "DELETE /api/google/accounts/:accountId": "google_account_removed",
  "POST /api/projects/:projectId/saved-keywords": "keywords_saved",
  "POST /api/projects/:projectId/indexing/indexnow": "indexnow_submitted",
  "POST /api/projects/:projectId/indexing/google-sitemaps": "sitemaps_submitted",
  "POST /api/projects/:projectId/indexing/verify": "indexnow_verified",
  "DELETE /api/oauth/grants/:clientId": "connected_app_removed",
};

/**
 * Records every write a signed-in user makes (and every MCP tool call, reads included) once the
 * response is sent: route pattern, status, how the user authenticated and from where. Never the
 * request body. Lookups are recorded separately, with their price (services/run-lookup.ts).
 */
export function registerRequestAnalytics(api: FastifyInstance) {
  api.addHook("onResponse", async (request, reply) => {
    const user = requestUser(request);
    if (!user) return;
    const mcpTool = request.headers["x-openseo-mcp-tool"];
    const tool = typeof mcpTool === "string" ? mcpTool : null;
    if (request.method === "GET" && !tool) return;
    const route = request.routeOptions.url ?? request.url.split("?")[0];
    const ok = reply.statusCode < 400;
    const named = EVENTS[`${request.method} ${route}`];
    const params = (request.params ?? {}) as Record<string, string | undefined>;
    track(user.id, ok && named ? named : "api_action", {
      method: request.method,
      route,
      status: reply.statusCode,
      ok,
      via: user.via,
      client: tool ? "mcp" : user.via === "session" ? "dashboard" : user.via === "oauth" ? "connected_app" : "rest_api",
      mcp_tool: tool,
      project_id: params.projectId,
      duration_ms: Math.round(reply.elapsedTime),
    });
  });
}
