import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings_contact_numbers" ADD COLUMN "has_whats_app" boolean;
  ALTER TABLE "site_settings_contact_numbers" ADD COLUMN "has_viber" boolean;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings_contact_numbers" DROP COLUMN "has_whats_app";
  ALTER TABLE "site_settings_contact_numbers" DROP COLUMN "has_viber";`)
}
