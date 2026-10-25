import { failPageSync, syncPages } from "../services/indexing";
import { defineJob } from "./queue";

defineJob("indexing.sync", 2, async ({ projectId }, log) => {
  try {
    const summary = await syncPages(projectId);
    log.info({ projectId, pages: summary.pages, newPages: summary.newPages, changed: summary.changedPages, submitted: summary.submitted, inspected: summary.inspected }, "indexing sync done");
  } catch (error) {
    await failPageSync(projectId, error);
    log.warn({ projectId, reason: (error as Error).message }, "indexing sync failed");
  }
});
