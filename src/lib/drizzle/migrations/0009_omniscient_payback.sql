ALTER TABLE "goal" ADD CONSTRAINT "unique_goal_name" UNIQUE("name");--> statement-breakpoint
DROP TYPE "public"."goal_status";