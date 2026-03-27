ALTER TABLE "goal" DROP CONSTRAINT "unique_goal_name";--> statement-breakpoint
ALTER TABLE "goal" ADD COLUMN "slug" text NOT NULL;--> statement-breakpoint
ALTER TABLE "goal" ADD CONSTRAINT "unique_goal_slug" UNIQUE("slug");