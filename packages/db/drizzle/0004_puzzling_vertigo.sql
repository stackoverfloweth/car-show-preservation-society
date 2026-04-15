CREATE TABLE IF NOT EXISTS "event_images" (
	"id" text PRIMARY KEY NOT NULL,
	"event_id" text NOT NULL,
	"source" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "events" (
	"id" text PRIMARY KEY NOT NULL,
	"club_id" text NOT NULL,
	"contact_user_id" text NOT NULL,
	"name" text NOT NULL,
	"location" jsonb,
	"start_date" timestamp with time zone,
	"end_date" timestamp with time zone,
	"voting_start" timestamp with time zone,
	"voting_end" timestamp with time zone,
	"ballot_count" integer DEFAULT 1 NOT NULL,
	"can_vote_for_self" boolean DEFAULT false NOT NULL,
	"driver_self_categorization" boolean DEFAULT false NOT NULL,
	"max_self_categorization" integer,
	"max_capacity" integer,
	"pre_registration" boolean DEFAULT true NOT NULL,
	"pre_registration_unpaid" boolean DEFAULT false NOT NULL,
	"stripe_price_id" text,
	"pre_registration_stripe_price_id" text,
	"stripe_cross_product_ids" text[] DEFAULT '{}'::text[] NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "event_images" ADD CONSTRAINT "event_images_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "events" ADD CONSTRAINT "events_club_id_clubs_id_fk" FOREIGN KEY ("club_id") REFERENCES "public"."clubs"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "events" ADD CONSTRAINT "events_contact_user_id_users_id_fk" FOREIGN KEY ("contact_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "event_images_event_id_idx" ON "event_images" ("event_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "events_club_id_idx" ON "events" ("club_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "events_start_date_idx" ON "events" ("start_date");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "events_club_id_start_date_idx" ON "events" ("club_id","start_date");