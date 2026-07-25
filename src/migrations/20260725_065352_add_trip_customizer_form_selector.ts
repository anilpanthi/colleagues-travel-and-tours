import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" ADD COLUMN "trip_customizer_form_id" integer;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_trip_customizer_form_id_forms_id_fk" FOREIGN KEY ("trip_customizer_form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "site_settings_trip_customizer_form_idx" ON "site_settings" USING btree ("trip_customizer_form_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" DROP CONSTRAINT "site_settings_trip_customizer_form_id_forms_id_fk";
  
  DROP INDEX "site_settings_trip_customizer_form_idx";
  ALTER TABLE "site_settings" DROP COLUMN "trip_customizer_form_id";`)
}
