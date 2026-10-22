import { and, eq, isNotNull, lt, lte, ne, or, sql } from "drizzle-orm";
import { dataDb, db, schema } from "../db";
import { nextRunAfter } from "../lib/pool";
import { AppError, isRunInProgress } from "../lib/errors";
import { failAiRun, startAiRun } from "../services/ai";
import { cleanupOAuth } from "../services/oauth";
import { buildAuditRequest, failAudit, startAudit } from "../services/audit";
import { failRankRun, startRankRun } from "../services/rank";
import { dispatch } from "./dispatch";
import { defineJob } from "./queue";

// How soon a schedule is retried when its tracker or project already has a run going, or the
// queue could not take the run.
const RETRY_MS = 15 * 60_000;

const retrySoon = (error: unknown) => isRunInProgress(error) || (error instanceof AppError && error.code === "queue_unavailable");

// Runs every five minutes. Claims due schedules by moving next_run_at forward in the same
// statement that selects them, so two workers never start the same run. next_run_at advances
// from its own previous value in whole periods, so a late tick does not shift the schedule.
// Manual runs leave the schedule alone.
defineJob("scheduler.tick", 1, async (_data, log) => {
  const now = new Date();

  const dueTrackers = await dataDb
    .select()
    .from(schema.rankTrackers)
    .where(and(isNotNull(schema.rankTrackers.nextRunAt), lte(schema.rankTrackers.nextRunAt, now), ne(schema.rankTrackers.schedule, "manual")))
    .limit(200);
  for (const tracker of dueTrackers) {
    const claimed = await dataDb
      .update(schema.rankTrackers)
      // A monthly schedule's day is the day it was set up: its first run is one month after that.
      .set({ nextRunAt: nextRunAfter(tracker.schedule, tracker.nextRunAt ?? now, now, tracker.createdAt.getUTCDate()) })
      .where(and(eq(schema.rankTrackers.id, tracker.id), lte(schema.rankTrackers.nextRunAt, now)))
      .returning({ id: schema.rankTrackers.id });
    if (!claimed.length) continue;
    try {
      const run = await startRankRun(tracker.id, "schedule");
      await dispatch("rank.run", { runId: run.id }, (message) => failRankRun(run.id, message));
    } catch (error) {
      // A run already in progress (often a manual one) or a queue outage: try again shortly
      // rather than skipping a whole period. No keywords: wait for the next period.
      if (retrySoon(error)) {
        await dataDb.update(schema.rankTrackers).set({ nextRunAt: new Date(now.getTime() + RETRY_MS) }).where(eq(schema.rankTrackers.id, tracker.id));
      }
      log.info({ trackerId: tracker.id, reason: (error as Error).message }, "scheduled rank run not started");
    }
  }

  const dueAi = await dataDb
    .select({ settings: schema.aiSettings, project: schema.projects })
    .from(schema.aiSettings)
    .innerJoin(schema.projects, eq(schema.projects.id, schema.aiSettings.projectId))
    .where(and(isNotNull(schema.aiSettings.nextRunAt), lte(schema.aiSettings.nextRunAt, now), ne(schema.aiSettings.schedule, "manual")))
    .limit(200);
  for (const { settings, project } of dueAi) {
    const claimed = await dataDb
      .update(schema.aiSettings)
      .set({ nextRunAt: nextRunAfter(settings.schedule, settings.nextRunAt ?? now, now, project.createdAt.getUTCDate()) })
      .where(and(eq(schema.aiSettings.projectId, project.id), lte(schema.aiSettings.nextRunAt, now)))
      .returning({ id: schema.aiSettings.projectId });
    if (!claimed.length) continue;
    try {
      const run = await startAiRun(project, "schedule");
      await dispatch("ai.run", { runId: run.id }, (message) => failAiRun(run.id, message));
    } catch (error) {
      if (retrySoon(error)) {
        await dataDb.update(schema.aiSettings).set({ nextRunAt: new Date(now.getTime() + RETRY_MS) }).where(eq(schema.aiSettings.projectId, project.id));
      }
      log.info({ projectId: project.id, reason: (error as Error).message }, "scheduled AI run not started");
    }
  }

  const dueAudits = await dataDb
    .select({ settings: schema.auditSettings, project: schema.projects })
    .from(schema.auditSettings)
    .innerJoin(schema.projects, eq(schema.projects.id, schema.auditSettings.projectId))
    .where(and(isNotNull(schema.auditSettings.nextRunAt), lte(schema.auditSettings.nextRunAt, now), ne(schema.auditSettings.schedule, "manual")))
    .limit(200);
  for (const { settings, project } of dueAudits) {
    const claimed = await dataDb
      .update(schema.auditSettings)
      .set({ nextRunAt: nextRunAfter(settings.schedule, settings.nextRunAt ?? now, now, settings.createdAt.getUTCDate()) })
      .where(and(eq(schema.auditSettings.projectId, project.id), lte(schema.auditSettings.nextRunAt, now)))
      .returning({ id: schema.auditSettings.projectId });
    if (!claimed.length) continue;
    // No start URL and no website: wait for the next period, the settings page says why.
    const request = buildAuditRequest(project, settings, {}, "schedule");
    if (!request) continue;
    try {
      const audit = await startAudit(project.userId, project.id, request);
      await dispatch("audit.run", { auditId: audit.id }, (message) => failAudit(audit.id, message));
    } catch (error) {
      if (retrySoon(error)) {
        await dataDb.update(schema.auditSettings).set({ nextRunAt: new Date(now.getTime() + RETRY_MS) }).where(eq(schema.auditSettings.projectId, project.id));
      }
      log.info({ projectId: project.id, reason: (error as Error).message }, "scheduled audit not started");
    }
  }
});

/**
 * Every 15 minutes: drop expired cache rows and fail runs a crashed worker abandoned, so they
 * stop blocking their tracker or project. A running run is abandoned when its heartbeat (touched
 * on every check, answer, point or 10 crawled pages) has been quiet for 30 minutes; a queued
 * one when no worker has picked it up in 6 hours. Long but live runs are left alone.
 */
defineJob("maintenance.cleanup", 1, async () => {
  await dataDb.delete(schema.apiCache).where(lt(schema.apiCache.expiresAt, new Date()));
  await cleanupOAuth();
  const abandoned = { status: "failed" as const, error: "Interrupted before it finished", finishedAt: new Date() };
  const tables = [schema.rankRuns, schema.aiRuns, schema.audits, schema.geoGrids] as const;
  for (const table of tables) {
    await dataDb
      .update(table)
      .set(abandoned)
      .where(
        or(
          and(eq(table.status, "queued"), lt(table.createdAt, sql`now() - interval '6 hours'`)),
          and(eq(table.status, "running"), lt(sql`coalesce(${table.heartbeatAt}, ${table.createdAt})`, sql`now() - interval '30 minutes'`)),
        ),
      );
  }
});
