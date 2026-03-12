CREATE TYPE "public"."cycle_status" AS ENUM('active', 'closed');--> statement-breakpoint
CREATE TABLE "monthly_cycle" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"cycle_month" text NOT NULL,
	"cycle_start_date" date NOT NULL,
	"cycle_end_date" date NOT NULL,
	"base_surplus_in_paisa" bigint NOT NULL,
	"carryover_deficit_in_paisa" bigint DEFAULT 0 NOT NULL,
	"available_surplus_in_paisa" bigint NOT NULL,
	"goal_allocation_in_paisa" bigint NOT NULL,
	"spending_budget_in_paisa" bigint NOT NULL,
	"variable_spending_in_paisa" bigint DEFAULT 0 NOT NULL,
	"month_surplus_in_paisa" bigint DEFAULT 0 NOT NULL,
	"month_deficit_in_paisa" bigint DEFAULT 0 NOT NULL,
	"reserve_used_in_paisa" bigint DEFAULT 0 NOT NULL,
	"deficit_carry_forward_in_paisa" bigint DEFAULT 0 NOT NULL,
	"status" "cycle_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "monthly_cycle" ADD CONSTRAINT "monthly_cycle_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "monthly_cycle_user_month_idx" ON "monthly_cycle" USING btree ("user_id","cycle_month");