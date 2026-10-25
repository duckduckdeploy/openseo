import { failSync, syncSearchConsole } from "../services/gsc-sync";
import { defineJob } from "./queue";

defineJob("gsc.sync", 2, async ({ projectId }, log) => {
  try {
    const result = await syncSearchConsole(projectId);
    log.info({ projectId, ...result }, "search console sync done");
  } catch (error) {
    await failSync(projectId, error);
    log.warn({ projectId, reason: (error as Error).message }, "search console sync failed");
  }
});
