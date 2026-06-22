import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "forms_blocks_date" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "name" varchar NOT NULL,
      "label" varchar,
      "width" numeric,
      "required" boolean,
      "default_value" timestamp(3) with time zone,
      "block_name" varchar
    );

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'forms_blocks_date_parent_id_fk'
      ) THEN
        ALTER TABLE "forms_blocks_date"
          ADD CONSTRAINT "forms_blocks_date_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id")
          ON DELETE cascade ON UPDATE no action;
      END IF;
    END
    $$;

    CREATE INDEX IF NOT EXISTS "forms_blocks_date_order_idx" ON "forms_blocks_date" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "forms_blocks_date_parent_id_idx" ON "forms_blocks_date" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "forms_blocks_date_path_idx" ON "forms_blocks_date" USING btree ("_path");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "forms_blocks_date" CASCADE;
  `)
}
