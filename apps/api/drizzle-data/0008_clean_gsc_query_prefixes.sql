-- Rank-tracker bots search Google with a numeric job id in front of the keyword ("6689: yahoo serp tracker").
-- Strip the id from stored Search Console queries and merge each row into the clean query's row for that day and page.
WITH prefixed AS (
  DELETE FROM "gsc_daily" WHERE "query" ~ '^\d+:\s+' RETURNING *
), merged AS (
  SELECT "project_id", "date", regexp_replace("query", '^\d+:\s+', '') AS "query", "page",
    sum("clicks")::int AS "clicks", sum("impressions")::int AS "impressions",
    coalesce(sum("position" * "impressions") / nullif(sum("impressions"), 0), avg("position")) AS "position"
  FROM prefixed
  GROUP BY 1, 2, 3, 4
)
INSERT INTO "gsc_daily" ("project_id", "date", "query", "page", "clicks", "impressions", "position")
SELECT * FROM merged WHERE "query" <> ''
ON CONFLICT ("project_id", "date", "query", "page") DO UPDATE SET
  "clicks" = "gsc_daily"."clicks" + excluded."clicks",
  "impressions" = "gsc_daily"."impressions" + excluded."impressions",
  "position" = coalesce(
    ("gsc_daily"."position" * "gsc_daily"."impressions" + excluded."position" * excluded."impressions") / nullif("gsc_daily"."impressions" + excluded."impressions", 0),
    "gsc_daily"."position"
  );
