import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_packages_best_season" ADD VALUE 'all-year-round' BEFORE 'january';
  ALTER TYPE "public"."enum__packages_v_version_best_season" ADD VALUE 'all-year-round' BEFORE 'january';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "packages_best_season" ALTER COLUMN "value" SET DATA TYPE text;
  DROP TYPE "public"."enum_packages_best_season";
  CREATE TYPE "public"."enum_packages_best_season" AS ENUM('january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december');
  ALTER TABLE "packages_best_season" ALTER COLUMN "value" SET DATA TYPE "public"."enum_packages_best_season" USING "value"::"public"."enum_packages_best_season";
  ALTER TABLE "_packages_v_version_best_season" ALTER COLUMN "value" SET DATA TYPE text;
  DROP TYPE "public"."enum__packages_v_version_best_season";
  CREATE TYPE "public"."enum__packages_v_version_best_season" AS ENUM('january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december');
  ALTER TABLE "_packages_v_version_best_season" ALTER COLUMN "value" SET DATA TYPE "public"."enum__packages_v_version_best_season" USING "value"::"public"."enum__packages_v_version_best_season";`)
}
