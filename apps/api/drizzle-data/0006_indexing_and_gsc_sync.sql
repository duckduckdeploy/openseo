CREATE TABLE "gsc_daily" (
	"project_id" uuid NOT NULL,
	"date" date NOT NULL,
	"query" text NOT NULL,
	"page" text NOT NULL,
	"clicks" integer NOT NULL,
	"impressions" integer NOT NULL,
	"position" double precision NOT NULL,
	CONSTRAINT "gsc_daily_project_id_date_query_page_pk" PRIMARY KEY("project_id","date","query","page")
);
--> statement-breakpoint
CREATE TABLE "gsc_daily_totals" (
	"project_id" uuid NOT NULL,
	"date" date NOT NULL,
	"clicks" integer NOT NULL,
	"impressions" integer NOT NULL,
	"position" double precision,
	"final" boolean DEFAULT false NOT NULL,
	CONSTRAINT "gsc_daily_totals_project_id_date_pk" PRIMARY KEY("project_id","date")
);
--> statement-breakpoint
CREATE TABLE "indexing_settings" (
	"project_id" uuid PRIMARY KEY NOT NULL,
	"origin" text,
	"indexnow_key" text NOT NULL,
	"key_location" text,
	"indexnow_verified_at" timestamp with time zone,
	"indexnow_checked_at" timestamp with time zone,
	"indexnow_error" text,
	"auto_submit" boolean DEFAULT false NOT NULL,
	"auto_sitemaps" boolean DEFAULT false NOT NULL,
	"inspect_per_day" integer DEFAULT 200 NOT NULL,
	"inspected_day" date,
	"inspected_count" integer DEFAULT 0 NOT NULL,
	"sitemaps" text[] DEFAULT '{}'::text[] NOT NULL,
	"last_sync" jsonb,
	"last_sync_at" timestamp with time zone,
	"next_sync_at" timestamp with time zone DEFAULT now(),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "indexnow_submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"trigger" text NOT NULL,
	"url_count" integer NOT NULL,
	"urls" text[] NOT NULL,
	"status" integer,
	"error" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "site_pages" (
	"project_id" uuid NOT NULL,
	"url" text NOT NULL,
	"sources" text[] DEFAULT '{}'::text[] NOT NULL,
	"sitemap_lastmod" timestamp with time zone,
	"content_hash" text,
	"status" integer,
	"indexable" boolean,
	"canonical" text,
	"first_seen_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_seen_at" timestamp with time zone DEFAULT now() NOT NULL,
	"changed_at" timestamp with time zone,
	"gone_at" timestamp with time zone,
	"indexnow_submitted_at" timestamp with time zone,
	"indexnow_status" integer,
	"google_verdict" text,
	"google_coverage" text,
	"google_crawled_at" timestamp with time zone,
	"google_canonical" text,
	"google_inspected_at" timestamp with time zone,
	"google_error" text,
	CONSTRAINT "site_pages_project_id_url_pk" PRIMARY KEY("project_id","url")
);
--> statement-breakpoint
ALTER TABLE "gsc_connections" ADD COLUMN "synced_from" date;--> statement-breakpoint
ALTER TABLE "gsc_connections" ADD COLUMN "synced_to" date;--> statement-breakpoint
ALTER TABLE "gsc_connections" ADD COLUMN "backfill_done" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "gsc_connections" ADD COLUMN "sync_error" text;--> statement-breakpoint
ALTER TABLE "gsc_connections" ADD COLUMN "last_sync_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "gsc_connections" ADD COLUMN "next_sync_at" timestamp with time zone DEFAULT now();--> statement-breakpoint
ALTER TABLE "gsc_daily" ADD CONSTRAINT "gsc_daily_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gsc_daily_totals" ADD CONSTRAINT "gsc_daily_totals_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "indexing_settings" ADD CONSTRAINT "indexing_settings_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "indexnow_submissions" ADD CONSTRAINT "indexnow_submissions_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_pages" ADD CONSTRAINT "site_pages_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "gsc_daily_query_idx" ON "gsc_daily" USING btree ("project_id","query","date");--> statement-breakpoint
CREATE INDEX "indexnow_submissions_project_idx" ON "indexnow_submissions" USING btree ("project_id","created_at");--> statement-breakpoint
CREATE INDEX "site_pages_first_seen_idx" ON "site_pages" USING btree ("project_id","first_seen_at");