CREATE TABLE "audit_links" (
	"audit_id" uuid NOT NULL,
	"source" text NOT NULL,
	"target" text NOT NULL,
	"kind" text NOT NULL,
	"anchor" text,
	"nofollow" boolean DEFAULT false NOT NULL,
	"internal" boolean NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_resources" (
	"audit_id" uuid NOT NULL,
	"url" text NOT NULL,
	"type" text NOT NULL,
	"status" integer NOT NULL,
	"content_type" text,
	"size_bytes" integer,
	"broken" boolean NOT NULL,
	"redirected" boolean DEFAULT false NOT NULL,
	"source_count" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_settings" (
	"project_id" uuid PRIMARY KEY NOT NULL,
	"start_url" text,
	"max_pages" integer DEFAULT 500 NOT NULL,
	"render_mode" text DEFAULT 'auto' NOT NULL,
	"use_fallback" boolean DEFAULT true NOT NULL,
	"max_cost_usd" double precision DEFAULT 1,
	"exclude" text[] DEFAULT '{}'::text[] NOT NULL,
	"include" text[] DEFAULT '{}'::text[] NOT NULL,
	"check_external_links" boolean DEFAULT true NOT NULL,
	"schedule" text DEFAULT 'weekly' NOT NULL,
	"next_run_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP INDEX "audit_pages_audit_idx";--> statement-breakpoint
ALTER TABLE "audits" ALTER COLUMN "project_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "audit_issues" ADD COLUMN "change" text;--> statement-breakpoint
ALTER TABLE "audit_pages" ADD COLUMN "load_ms" integer;--> statement-breakpoint
ALTER TABLE "audit_pages" ADD COLUMN "content_type" text;--> statement-breakpoint
ALTER TABLE "audit_pages" ADD COLUMN "page_rank" integer;--> statement-breakpoint
ALTER TABLE "audit_pages" ADD COLUMN "inlinks" integer;--> statement-breakpoint
ALTER TABLE "audit_pages" ADD COLUMN "in_sitemap" boolean;--> statement-breakpoint
ALTER TABLE "audits" ADD COLUMN "user_id" text;--> statement-breakpoint
UPDATE "audits" SET "user_id" = "projects"."user_id" FROM "projects" WHERE "projects"."id" = "audits"."project_id";--> statement-breakpoint
ALTER TABLE "audits" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "audits" ADD COLUMN "trigger" text DEFAULT 'manual' NOT NULL;--> statement-breakpoint
ALTER TABLE "audits" ADD COLUMN "render_mode" text DEFAULT 'off' NOT NULL;--> statement-breakpoint
ALTER TABLE "audits" ADD COLUMN "use_fallback" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "audits" ADD COLUMN "max_cost_usd" double precision;--> statement-breakpoint
ALTER TABLE "audits" ADD COLUMN "options" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "audits" ADD COLUMN "ai_score" integer;--> statement-breakpoint
ALTER TABLE "audits" ADD COLUMN "previous_audit_id" uuid;--> statement-breakpoint
ALTER TABLE "audit_links" ADD CONSTRAINT "audit_links_audit_id_audits_id_fk" FOREIGN KEY ("audit_id") REFERENCES "public"."audits"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_resources" ADD CONSTRAINT "audit_resources_audit_id_audits_id_fk" FOREIGN KEY ("audit_id") REFERENCES "public"."audits"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_settings" ADD CONSTRAINT "audit_settings_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "audit_links_target_idx" ON "audit_links" USING btree ("audit_id","target");--> statement-breakpoint
CREATE INDEX "audit_links_source_idx" ON "audit_links" USING btree ("audit_id","source","target");--> statement-breakpoint
CREATE INDEX "audit_resources_audit_idx" ON "audit_resources" USING btree ("audit_id","type");--> statement-breakpoint
CREATE INDEX "audits_user_idx" ON "audits" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "audit_pages_audit_idx" ON "audit_pages" USING btree ("audit_id","url");