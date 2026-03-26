CREATE TYPE "public"."goal_status" AS ENUM('active', 'completed', 'paused', 'cancelled');--> statement-breakpoint
CREATE TABLE "goal" (
	"id" text PRIMARY KEY NOT NULL,
	"financial_profile_id" text NOT NULL,
	"name" text NOT NULL,
	"target_amount_in_paisa" integer NOT NULL,
	"target_date" date,
	"status" "goal_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "goal_contribution" (
	"id" text PRIMARY KEY NOT NULL,
	"goal_id" text NOT NULL,
	"amount_in_paisa" integer NOT NULL,
	"note" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "goal" ADD CONSTRAINT "goal_financial_profile_id_financial_profile_id_fk" FOREIGN KEY ("financial_profile_id") REFERENCES "public"."financial_profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goal_contribution" ADD CONSTRAINT "goal_contribution_goal_id_goal_id_fk" FOREIGN KEY ("goal_id") REFERENCES "public"."goal"("id") ON DELETE cascade ON UPDATE no action;