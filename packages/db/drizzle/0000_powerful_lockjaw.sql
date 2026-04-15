CREATE TABLE IF NOT EXISTS "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email_address" text,
	"phone_number" text,
	"first_name" text,
	"last_name" text,
	"location" jsonb,
	"profile_image" text,
	"stripe_customer_id" text,
	"hide_email" boolean DEFAULT false NOT NULL,
	"hide_phone" boolean DEFAULT false NOT NULL,
	"hide_location" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone
);
