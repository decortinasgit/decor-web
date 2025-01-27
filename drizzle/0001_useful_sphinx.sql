DO $$ BEGIN
 CREATE TYPE "public"."order_status" AS ENUM('pending');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "roles" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "costs" (
	"id" text PRIMARY KEY NOT NULL,
	"dolar_price" numeric(10, 2) NOT NULL,
	"making" numeric(10, 2) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT current_timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "curtains" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"color" text,
	"group" text,
	"price" numeric(10, 2) NOT NULL,
	"unity" text,
	"accessories" json,
	"chains" json,
	"category" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT current_timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "order_items" (
	"id" text PRIMARY KEY NOT NULL,
	"accessory" text,
	"category" text NOT NULL,
	"order_id" text NOT NULL,
	"qty" integer NOT NULL,
	"name" text NOT NULL,
	"type" text,
	"color" text,
	"height" integer,
	"width" integer,
	"support" text,
	"fall" text,
	"chain" text,
	"chain_side" text,
	"opening" text,
	"pinches" text,
	"panels" text,
	"price" text,
	"comment" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT current_timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "orders" (
	"id" text PRIMARY KEY NOT NULL,
	"company" text NOT NULL,
	"client" text NOT NULL,
	"email" text NOT NULL,
	"status" "order_status" DEFAULT 'pending' NOT NULL,
	"comment" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT current_timestamp
);
DO $$ BEGIN
 ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
