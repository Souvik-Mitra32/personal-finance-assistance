ALTER TABLE "monthly_cycle" RENAME COLUMN "user_id" TO "financial_profile_id";--> statement-breakpoint
ALTER TABLE "monthly_cycle" DROP CONSTRAINT "monthly_cycle_user_id_user_id_fk";
--> statement-breakpoint
DROP INDEX "monthly_cycle_user_month_idx";--> statement-breakpoint
ALTER TABLE "monthly_cycle" ADD CONSTRAINT "monthly_cycle_financial_profile_id_financial_profile_id_fk" FOREIGN KEY ("financial_profile_id") REFERENCES "public"."financial_profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "monthly_cycle_financial_profile_idx" ON "monthly_cycle" USING btree ("financial_profile_id");