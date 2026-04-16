CREATE TABLE IF NOT EXISTS "voting_categories" (
	"id" text PRIMARY KEY NOT NULL,
	"event_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"max_capacity" integer,
	"drivers_only" boolean DEFAULT false NOT NULL,
	"members_only" boolean DEFAULT false NOT NULL,
	"automatic_entry" boolean DEFAULT false NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"stripe_price_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "voting_category_registrations" (
	"id" text PRIMARY KEY NOT NULL,
	"voting_category_id" text NOT NULL,
	"registration_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "voting_categories" ADD CONSTRAINT "voting_categories_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "voting_category_registrations" ADD CONSTRAINT "voting_category_registrations_voting_category_id_voting_categories_id_fk" FOREIGN KEY ("voting_category_id") REFERENCES "public"."voting_categories"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "voting_categories_event_id_idx" ON "voting_categories" ("event_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "voting_categories_event_id_name_idx" ON "voting_categories" ("event_id","name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "vcr_voting_category_id_idx" ON "voting_category_registrations" ("voting_category_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "vcr_registration_id_idx" ON "voting_category_registrations" ("registration_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "vcr_category_registration_unique_idx" ON "voting_category_registrations" ("voting_category_id","registration_id");