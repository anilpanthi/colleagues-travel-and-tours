import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_form_submissions_submission_type" AS ENUM('booking', 'enquiry', 'flight-booking');
  ALTER TABLE "form_submissions" ADD COLUMN "package_id" integer;
  ALTER TABLE "form_submissions" ADD COLUMN "submission_type" "enum_form_submissions_submission_type";
  ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_package_id_packages_id_fk" FOREIGN KEY ("package_id") REFERENCES "public"."packages"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "form_submissions_package_idx" ON "form_submissions" USING btree ("package_id");
  CREATE INDEX "form_submissions_submission_type_idx" ON "form_submissions" USING btree ("submission_type");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "form_submissions" DROP CONSTRAINT "form_submissions_package_id_packages_id_fk";
  
  DROP INDEX "form_submissions_package_idx";
  DROP INDEX "form_submissions_submission_type_idx";
  ALTER TABLE "form_submissions" DROP COLUMN "package_id";
  ALTER TABLE "form_submissions" DROP COLUMN "submission_type";
  DROP TYPE "public"."enum_form_submissions_submission_type";`)
}
