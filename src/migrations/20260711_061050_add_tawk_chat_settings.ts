import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" ADD COLUMN "tawk_chat_property_id" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "tawk_chat_widget_id" varchar;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" DROP COLUMN "tawk_chat_property_id";
  ALTER TABLE "site_settings" DROP COLUMN "tawk_chat_widget_id";`)
}
