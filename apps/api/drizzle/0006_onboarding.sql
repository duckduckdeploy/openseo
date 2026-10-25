ALTER TABLE "user_settings" ADD COLUMN "onboarded_at" timestamp with time zone;--> statement-breakpoint
-- People who already saved a YepAPI key have been using the app: skip the welcome for them.
UPDATE "user_settings" SET "onboarded_at" = now() WHERE "yepapi_key_enc" IS NOT NULL;
