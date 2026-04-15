import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "forms_blocks_email" ADD COLUMN "placeholder" varchar;
  ALTER TABLE "forms_blocks_number" ADD COLUMN "placeholder" varchar;
  ALTER TABLE "forms_blocks_text" ADD COLUMN "placeholder" varchar;
  ALTER TABLE "forms_blocks_textarea" ADD COLUMN "placeholder" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "forms_blocks_email" DROP COLUMN "placeholder";
  ALTER TABLE "forms_blocks_number" DROP COLUMN "placeholder";
  ALTER TABLE "forms_blocks_text" DROP COLUMN "placeholder";
  ALTER TABLE "forms_blocks_textarea" DROP COLUMN "placeholder";`)
}
