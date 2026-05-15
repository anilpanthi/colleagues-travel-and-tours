import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DROP TABLE IF EXISTS "packages_best_season" CASCADE;
  DROP TABLE IF EXISTS "_packages_v_version_best_season" CASCADE;
  DROP TYPE IF EXISTS "public"."enum_packages_best_season" CASCADE;
  DROP TYPE IF EXISTS "public"."enum_packages_map_type" CASCADE;
  DROP TYPE IF EXISTS "public"."enum__packages_v_version_best_season" CASCADE;
  DROP TYPE IF EXISTS "public"."enum__packages_v_version_map_type" CASCADE;

  CREATE TYPE "public"."enum_packages_best_season" AS ENUM('january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december');
  CREATE TYPE "public"."enum_packages_map_type" AS ENUM('imageUpload', 'embedMap');
  CREATE TYPE "public"."enum__packages_v_version_best_season" AS ENUM('january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december');
  CREATE TYPE "public"."enum__packages_v_version_map_type" AS ENUM('imageUpload', 'embedMap');
  CREATE TABLE "packages_best_season" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_packages_best_season",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_packages_v_version_best_season" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__packages_v_version_best_season",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  ALTER TABLE "packages" ALTER COLUMN "trip_duration" SET DATA TYPE numeric USING NULLIF(regexp_replace("trip_duration", '[^0-9.]', '', 'g'), '')::numeric;
  ALTER TABLE "packages" ALTER COLUMN "elevation" SET DATA TYPE numeric USING NULLIF(regexp_replace("elevation", '[^0-9.]', '', 'g'), '')::numeric;
  ALTER TABLE "_packages_v" ALTER COLUMN "version_trip_duration" SET DATA TYPE numeric USING NULLIF(regexp_replace("version_trip_duration", '[^0-9.]', '', 'g'), '')::numeric;
  ALTER TABLE "_packages_v" ALTER COLUMN "version_elevation" SET DATA TYPE numeric USING NULLIF(regexp_replace("version_elevation", '[^0-9.]', '', 'g'), '')::numeric;
  ALTER TABLE "packages" ADD COLUMN "map_type" "enum_packages_map_type" DEFAULT 'embedMap';
  ALTER TABLE "packages" ADD COLUMN "map_image_id" integer;
  ALTER TABLE "_packages_v" ADD COLUMN "version_map_type" "enum__packages_v_version_map_type" DEFAULT 'embedMap';
  ALTER TABLE "_packages_v" ADD COLUMN "version_map_image_id" integer;
  ALTER TABLE "packages_best_season" ADD CONSTRAINT "packages_best_season_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."packages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_packages_v_version_best_season" ADD CONSTRAINT "_packages_v_version_best_season_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_packages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "packages_best_season_order_idx" ON "packages_best_season" USING btree ("order");
  CREATE INDEX "packages_best_season_parent_idx" ON "packages_best_season" USING btree ("parent_id");
  CREATE INDEX "_packages_v_version_best_season_order_idx" ON "_packages_v_version_best_season" USING btree ("order");
  CREATE INDEX "_packages_v_version_best_season_parent_idx" ON "_packages_v_version_best_season" USING btree ("parent_id");
  ALTER TABLE "packages" ADD CONSTRAINT "packages_map_image_id_media_id_fk" FOREIGN KEY ("map_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_packages_v" ADD CONSTRAINT "_packages_v_version_map_image_id_media_id_fk" FOREIGN KEY ("version_map_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "packages_map_image_idx" ON "packages" USING btree ("map_image_id");
  CREATE INDEX "_packages_v_version_version_map_image_idx" ON "_packages_v" USING btree ("version_map_image_id");
  ALTER TABLE "packages" DROP COLUMN "best_season";
  ALTER TABLE "_packages_v" DROP COLUMN "version_best_season";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "packages_best_season" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_packages_v_version_best_season" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "packages_best_season" CASCADE;
  DROP TABLE "_packages_v_version_best_season" CASCADE;
  ALTER TABLE "packages" DROP CONSTRAINT "packages_map_image_id_media_id_fk";
  
  ALTER TABLE "_packages_v" DROP CONSTRAINT "_packages_v_version_map_image_id_media_id_fk";
  
  DROP INDEX "packages_map_image_idx";
  DROP INDEX "_packages_v_version_version_map_image_idx";
  ALTER TABLE "packages" ALTER COLUMN "trip_duration" SET DATA TYPE varchar;
  ALTER TABLE "packages" ALTER COLUMN "elevation" SET DATA TYPE varchar;
  ALTER TABLE "_packages_v" ALTER COLUMN "version_trip_duration" SET DATA TYPE varchar;
  ALTER TABLE "_packages_v" ALTER COLUMN "version_elevation" SET DATA TYPE varchar;
  ALTER TABLE "packages" ADD COLUMN "best_season" varchar;
  ALTER TABLE "_packages_v" ADD COLUMN "version_best_season" varchar;
  ALTER TABLE "packages" DROP COLUMN "map_type";
  ALTER TABLE "packages" DROP COLUMN "map_image_id";
  ALTER TABLE "_packages_v" DROP COLUMN "version_map_type";
  ALTER TABLE "_packages_v" DROP COLUMN "version_map_image_id";
  DROP TYPE "public"."enum_packages_best_season";
  DROP TYPE "public"."enum_packages_map_type";
  DROP TYPE "public"."enum__packages_v_version_best_season";
  DROP TYPE "public"."enum__packages_v_version_map_type";`)
}
