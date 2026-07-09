import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_form_submissions_status" AS ENUM(
      'new',
      'in-progress',
      'confirmed',
      'cancelled'
    );
    ALTER TABLE "form_submissions"
      ADD COLUMN "status" "enum_form_submissions_status" DEFAULT 'new';
    CREATE INDEX "form_submissions_status_idx"
      ON "form_submissions" USING btree ("status");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX "form_submissions_status_idx";
    ALTER TABLE "form_submissions" DROP COLUMN "status";
    DROP TYPE "public"."enum_form_submissions_status";
  `)
}
