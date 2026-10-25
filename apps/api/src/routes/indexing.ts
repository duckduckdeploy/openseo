import { eq } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { dataDb, schema } from "../db";
import { enqueue } from "../jobs/queue";
import { requireProject, requireUser } from "../lib/context";
import { AppError, parse } from "../lib/errors";
import { gscHistory, gscKeywords, keywordSuggestions, positionsFor, promptIdeas } from "../services/gsc-sync";
import {
  addPages,
  googleSitemaps,
  indexingSettings,
  indexingSummary,
  inspectPages,
  listPages,
  submissionLog,
  submitGoogleSitemaps,
  submitIndexNow,
  updateIndexingSettings,
  verifyIndexNow,
  type PageFilter,
} from "../services/indexing";

type P = { Params: { projectId: string } };

const FILTERS = ["all", "suggested", "new", "changed", "reindex", "indexed", "not_indexed", "not_inspected", "excluded", "submitted"] as const satisfies readonly PageFilter[];

const queued = async (name: "indexing.sync" | "gsc.sync", projectId: string) => {
  try {
    await enqueue(name, { projectId });
  } catch {
    throw new AppError(503, "queue_unavailable", "The background queue is unavailable. Try again in a moment.");
  }
};

/** Indexing (page list, IndexNow, Google index status) and the stored Search Console data. All free. */
export async function indexingRoutes(app: FastifyInstance) {
  app.get<P>("/projects/:projectId/indexing", async (request) => {
    const user = await requireUser(request);
    const project = await requireProject(user.id, request.params.projectId);
    return { ok: true, data: await indexingSummary(project) };
  });

  app.patch<P>("/projects/:projectId/indexing", async (request) => {
    const user = await requireUser(request);
    const project = await requireProject(user.id, request.params.projectId);
    const input = parse(
      z.object({
        autoSubmit: z.boolean().optional(),
        autoSitemaps: z.boolean().optional(),
        inspectPerDay: z.number().int().min(0).max(2000).optional(),
        keyLocation: z.string().trim().max(500).nullable().optional(),
        newKey: z.boolean().optional(),
      }),
      request.body,
    );
    await updateIndexingSettings(project, input);
    return { ok: true, data: await indexingSummary(project) };
  });

  // The key file, ready to upload as <key>.txt.
  app.get<P>("/projects/:projectId/indexing/key-file", async (request, reply) => {
    const user = await requireUser(request);
    const project = await requireProject(user.id, request.params.projectId);
    const settings = await indexingSettings(project);
    return reply
      .header("content-type", "text/plain; charset=utf-8")
      .header("content-disposition", `attachment; filename="${settings.indexnowKey}.txt"`)
      .send(settings.indexnowKey);
  });

  app.post<P>("/projects/:projectId/indexing/verify", async (request) => {
    const user = await requireUser(request);
    const project = await requireProject(user.id, request.params.projectId);
    const check = await verifyIndexNow(project);
    // The first successful check starts the page list straight away.
    if (check.verified) {
      const settings = await indexingSettings(project);
      if (!settings.lastSyncAt) await queued("indexing.sync", project.id);
    }
    return { ok: true, data: check };
  });

  app.post<P>("/projects/:projectId/indexing/sync", async (request) => {
    const user = await requireUser(request);
    const project = await requireProject(user.id, request.params.projectId);
    if (!project.domain) throw new AppError(400, "bad_request", "Add the project's website first, in project settings");
    await indexingSettings(project);
    await dataDb.update(schema.indexingSettings).set({ nextSyncAt: new Date(Date.now() + 2 * 3_600_000) }).where(eq(schema.indexingSettings.projectId, project.id));
    await queued("indexing.sync", project.id);
    return { ok: true, data: { queued: true } };
  });

  app.get<P>("/projects/:projectId/indexing/pages", async (request) => {
    const user = await requireUser(request);
    const project = await requireProject(user.id, request.params.projectId);
    const q = parse(
      z.object({
        filter: z.enum(FILTERS).default("all"),
        search: z.string().trim().max(500).optional(),
        page: z.coerce.number().int().min(1).max(10_000).default(1),
        size: z.coerce.number().int().min(1).max(500).default(50),
      }),
      request.query,
    );
    const result = await listPages(project, { filter: q.filter, search: q.search, limit: q.size, offset: (q.page - 1) * q.size });
    return { ok: true, data: { ...result, page: q.page, size: q.size } };
  });

  app.post<P>("/projects/:projectId/indexing/pages", async (request) => {
    const user = await requireUser(request);
    const project = await requireProject(user.id, request.params.projectId);
    const { urls } = parse(z.object({ urls: z.array(z.string().url().max(2000)).min(1).max(1000) }), request.body);
    return { ok: true, data: await addPages(project, urls) };
  });

  app.post<P>("/projects/:projectId/indexing/indexnow", async (request) => {
    const user = await requireUser(request);
    const project = await requireProject(user.id, request.params.projectId);
    const input = parse(
      z.union([z.object({ suggested: z.literal(true) }), z.object({ urls: z.array(z.string().url().max(2000)).min(1).max(10_000) })]),
      request.body,
    );
    const trigger = user.via === "session" ? "manual" : "agent";
    return { ok: true, data: await submitIndexNow(project, input, trigger) };
  });

  app.get<P>("/projects/:projectId/indexing/submissions", async (request) => {
    const user = await requireUser(request);
    const project = await requireProject(user.id, request.params.projectId);
    return { ok: true, data: await submissionLog(project) };
  });

  app.post<P>("/projects/:projectId/indexing/inspect", async (request) => {
    const user = await requireUser(request);
    const project = await requireProject(user.id, request.params.projectId);
    const { urls } = parse(z.object({ urls: z.array(z.string().url().max(2000)).min(1).max(50) }), request.body);
    return { ok: true, data: await inspectPages(project, urls) };
  });

  app.get<P>("/projects/:projectId/indexing/google-sitemaps", async (request) => {
    const user = await requireUser(request);
    const project = await requireProject(user.id, request.params.projectId);
    return { ok: true, data: await googleSitemaps(project) };
  });

  app.post<P>("/projects/:projectId/indexing/google-sitemaps", async (request) => {
    const user = await requireUser(request);
    const project = await requireProject(user.id, request.params.projectId);
    const { paths } = parse(z.object({ paths: z.array(z.string().url().max(2000)).max(50).optional() }), request.body ?? {});
    return { ok: true, data: await submitGoogleSitemaps(project, paths) };
  });

  // ── Stored Search Console data ──

  app.post<P>("/projects/:projectId/search-console/sync", async (request) => {
    const user = await requireUser(request);
    const project = await requireProject(user.id, request.params.projectId);
    const updated = await dataDb
      .update(schema.gscConnections)
      .set({ nextSyncAt: new Date(Date.now() + 2 * 3_600_000) })
      .where(eq(schema.gscConnections.projectId, project.id))
      .returning({ id: schema.gscConnections.projectId });
    if (!updated.length) throw new AppError(409, "google_not_connected", "Connect Google Search Console to this project first, under Search performance.", { provider: "gsc" });
    await queued("gsc.sync", project.id);
    return { ok: true, data: { queued: true } };
  });

  app.get<P>("/projects/:projectId/search-console/keywords", async (request) => {
    const user = await requireUser(request);
    const project = await requireProject(user.id, request.params.projectId);
    const q = parse(
      z.object({
        days: z.coerce.number().int().refine((n) => [7, 28, 90, 180, 365, 480].includes(n), "days is 7, 28, 90, 180, 365 or 480").default(28),
        search: z.string().trim().max(200).optional(),
        minPosition: z.coerce.number().min(1).optional(),
        maxPosition: z.coerce.number().min(1).optional(),
        minImpressions: z.coerce.number().int().min(0).optional(),
        sort: z.enum(["impressions", "clicks", "position"]).default("impressions"),
        page: z.coerce.number().int().min(1).max(10_000).default(1),
        size: z.coerce.number().int().min(1).max(1000).default(50),
      }),
      request.query,
    );
    const result = await gscKeywords(project.id, { ...q, limit: q.size, offset: (q.page - 1) * q.size });
    return { ok: true, data: { ...result, page: q.page, size: q.size } };
  });

  app.get<P>("/projects/:projectId/search-console/keyword-suggestions", async (request) => {
    const user = await requireUser(request);
    const project = await requireProject(user.id, request.params.projectId);
    const q = parse(z.object({ limit: z.coerce.number().int().min(1).max(200).default(50) }), request.query);
    return { ok: true, data: await keywordSuggestions(project.id, q.limit) };
  });

  app.get<P>("/projects/:projectId/search-console/prompt-ideas", async (request) => {
    const user = await requireUser(request);
    const project = await requireProject(user.id, request.params.projectId);
    return { ok: true, data: await promptIdeas(project.id) };
  });

  app.get<P>("/projects/:projectId/search-console/history", async (request) => {
    const user = await requireUser(request);
    const project = await requireProject(user.id, request.params.projectId);
    const q = parse(z.object({ days: z.coerce.number().int().min(7).max(1000).default(480) }), request.query);
    return { ok: true, data: await gscHistory(project.id, q.days) };
  });

  // Search Console's own position for keywords, e.g. next to a rank tracker's results.
  app.post<P>("/projects/:projectId/search-console/positions", async (request) => {
    const user = await requireUser(request);
    const project = await requireProject(user.id, request.params.projectId);
    const { keywords } = parse(z.object({ keywords: z.array(z.string().trim().min(1).max(200)).min(1).max(1000) }), request.body);
    return { ok: true, data: Object.fromEntries(await positionsFor(project.id, keywords)) };
  });
}
