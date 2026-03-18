CREATE TABLE "transaction" (
	"id" text PRIMARY KEY NOT NULL,
	"financial_profile_id" text NOT NULL,
	"cycle_id" text NOT NULL,
	"type" text NOT NULL,
	"category" text NOT NULL,
	"description" text NOT NULL,
	"amount_in_paisa" integer NOT NULL,
	"date" timestamp NOT NULL,
	"note" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_financial_profile_id_financial_profile_id_fk" FOREIGN KEY ("financial_profile_id") REFERENCES "public"."financial_profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_cycle_id_monthly_cycle_id_fk" FOREIGN KEY ("cycle_id") REFERENCES "public"."monthly_cycle"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "txn_financial_profile_idx" ON "transaction" USING btree ("financial_profile_id");--> statement-breakpoint
CREATE INDEX "txn_cycle_idx" ON "transaction" USING btree ("cycle_id");