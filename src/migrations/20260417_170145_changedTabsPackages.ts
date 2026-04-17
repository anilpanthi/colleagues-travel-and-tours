import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "packages_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" jsonb
  );
  
  CREATE TABLE "_packages_v_version_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" jsonb,
  	"_uuid" varchar
  );
  
  ALTER TABLE "packages_breadcrumbs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_packages_v_version_breadcrumbs" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "packages_breadcrumbs" CASCADE;
  DROP TABLE "_packages_v_version_breadcrumbs" CASCADE;
  ALTER TABLE "packages" DROP CONSTRAINT "packages_parent_id_packages_id_fk";
  
  ALTER TABLE "_packages_v" DROP CONSTRAINT "_packages_v_version_parent_id_packages_id_fk";
  
  DROP INDEX "packages_parent_idx";
  DROP INDEX "_packages_v_version_version_parent_idx";
  ALTER TABLE "packages" ADD COLUMN "map_iframe" jsonb;
  ALTER TABLE "packages" ADD COLUMN "miscellaneous" jsonb;
  ALTER TABLE "_packages_v" ADD COLUMN "version_map_iframe" jsonb;
  ALTER TABLE "_packages_v" ADD COLUMN "version_miscellaneous" jsonb;
  ALTER TABLE "packages_faqs" ADD CONSTRAINT "packages_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."packages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_packages_v_version_faqs" ADD CONSTRAINT "_packages_v_version_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_packages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "packages_faqs_order_idx" ON "packages_faqs" USING btree ("_order");
  CREATE INDEX "packages_faqs_parent_id_idx" ON "packages_faqs" USING btree ("_parent_id");
  CREATE INDEX "_packages_v_version_faqs_order_idx" ON "_packages_v_version_faqs" USING btree ("_order");
  CREATE INDEX "_packages_v_version_faqs_parent_id_idx" ON "_packages_v_version_faqs" USING btree ("_parent_id");
  ALTER TABLE "packages" DROP COLUMN "map_embed";
  ALTER TABLE "packages" DROP COLUMN "parent_id";
  ALTER TABLE "_packages_v" DROP COLUMN "version_map_embed";
  ALTER TABLE "_packages_v" DROP COLUMN "version_parent_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "packages_breadcrumbs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"doc_id" integer,
  	"url" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "_packages_v_version_breadcrumbs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"doc_id" integer,
  	"url" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  ALTER TABLE "packages_faqs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_packages_v_version_faqs" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "packages_faqs" CASCADE;
  DROP TABLE "_packages_v_version_faqs" CASCADE;
  ALTER TABLE "packages" ADD COLUMN "map_embed" varchar;
  ALTER TABLE "packages" ADD COLUMN "parent_id" integer;
  ALTER TABLE "_packages_v" ADD COLUMN "version_map_embed" varchar;
  ALTER TABLE "_packages_v" ADD COLUMN "version_parent_id" integer;
  ALTER TABLE "packages_breadcrumbs" ADD CONSTRAINT "packages_breadcrumbs_doc_id_packages_id_fk" FOREIGN KEY ("doc_id") REFERENCES "public"."packages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "packages_breadcrumbs" ADD CONSTRAINT "packages_breadcrumbs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."packages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_packages_v_version_breadcrumbs" ADD CONSTRAINT "_packages_v_version_breadcrumbs_doc_id_packages_id_fk" FOREIGN KEY ("doc_id") REFERENCES "public"."packages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_packages_v_version_breadcrumbs" ADD CONSTRAINT "_packages_v_version_breadcrumbs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_packages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "packages_breadcrumbs_order_idx" ON "packages_breadcrumbs" USING btree ("_order");
  CREATE INDEX "packages_breadcrumbs_parent_id_idx" ON "packages_breadcrumbs" USING btree ("_parent_id");
  CREATE INDEX "packages_breadcrumbs_doc_idx" ON "packages_breadcrumbs" USING btree ("doc_id");
  CREATE INDEX "_packages_v_version_breadcrumbs_order_idx" ON "_packages_v_version_breadcrumbs" USING btree ("_order");
  CREATE INDEX "_packages_v_version_breadcrumbs_parent_id_idx" ON "_packages_v_version_breadcrumbs" USING btree ("_parent_id");
  CREATE INDEX "_packages_v_version_breadcrumbs_doc_idx" ON "_packages_v_version_breadcrumbs" USING btree ("doc_id");
  ALTER TABLE "packages" ADD CONSTRAINT "packages_parent_id_packages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."packages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_packages_v" ADD CONSTRAINT "_packages_v_version_parent_id_packages_id_fk" FOREIGN KEY ("version_parent_id") REFERENCES "public"."packages"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "packages_parent_idx" ON "packages" USING btree ("parent_id");
  CREATE INDEX "_packages_v_version_version_parent_idx" ON "_packages_v" USING btree ("version_parent_id");
  ALTER TABLE "packages" DROP COLUMN "map_iframe";
  ALTER TABLE "packages" DROP COLUMN "miscellaneous";
  ALTER TABLE "_packages_v" DROP COLUMN "version_map_iframe";
  ALTER TABLE "_packages_v" DROP COLUMN "version_miscellaneous";`)
}
