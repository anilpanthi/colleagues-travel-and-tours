import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "activities_breadcrumbs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"doc_id" integer,
  	"url" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "_activities_v_version_breadcrumbs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"doc_id" integer,
  	"url" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
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
  
  CREATE TABLE "pages_breadcrumbs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"doc_id" integer,
  	"url" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "_pages_v_version_breadcrumbs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"doc_id" integer,
  	"url" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "categories_breadcrumbs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"doc_id" integer,
  	"url" varchar,
  	"label" varchar
  );
  
  ALTER TABLE "activities" ADD COLUMN "parent_id" integer;
  ALTER TABLE "_activities_v" ADD COLUMN "version_parent_id" integer;
  ALTER TABLE "packages" ADD COLUMN "parent_id" integer;
  ALTER TABLE "_packages_v" ADD COLUMN "version_parent_id" integer;
  ALTER TABLE "pages" ADD COLUMN "parent_id" integer;
  ALTER TABLE "_pages_v" ADD COLUMN "version_parent_id" integer;
  ALTER TABLE "categories" ADD COLUMN "parent_id" integer;
  ALTER TABLE "activities_breadcrumbs" ADD CONSTRAINT "activities_breadcrumbs_doc_id_activities_id_fk" FOREIGN KEY ("doc_id") REFERENCES "public"."activities"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "activities_breadcrumbs" ADD CONSTRAINT "activities_breadcrumbs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."activities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_activities_v_version_breadcrumbs" ADD CONSTRAINT "_activities_v_version_breadcrumbs_doc_id_activities_id_fk" FOREIGN KEY ("doc_id") REFERENCES "public"."activities"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_activities_v_version_breadcrumbs" ADD CONSTRAINT "_activities_v_version_breadcrumbs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_activities_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "packages_breadcrumbs" ADD CONSTRAINT "packages_breadcrumbs_doc_id_packages_id_fk" FOREIGN KEY ("doc_id") REFERENCES "public"."packages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "packages_breadcrumbs" ADD CONSTRAINT "packages_breadcrumbs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."packages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_packages_v_version_breadcrumbs" ADD CONSTRAINT "_packages_v_version_breadcrumbs_doc_id_packages_id_fk" FOREIGN KEY ("doc_id") REFERENCES "public"."packages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_packages_v_version_breadcrumbs" ADD CONSTRAINT "_packages_v_version_breadcrumbs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_packages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_breadcrumbs" ADD CONSTRAINT "pages_breadcrumbs_doc_id_pages_id_fk" FOREIGN KEY ("doc_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_breadcrumbs" ADD CONSTRAINT "pages_breadcrumbs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_breadcrumbs" ADD CONSTRAINT "_pages_v_version_breadcrumbs_doc_id_pages_id_fk" FOREIGN KEY ("doc_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_version_breadcrumbs" ADD CONSTRAINT "_pages_v_version_breadcrumbs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_breadcrumbs" ADD CONSTRAINT "categories_breadcrumbs_doc_id_categories_id_fk" FOREIGN KEY ("doc_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories_breadcrumbs" ADD CONSTRAINT "categories_breadcrumbs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "activities_breadcrumbs_order_idx" ON "activities_breadcrumbs" USING btree ("_order");
  CREATE INDEX "activities_breadcrumbs_parent_id_idx" ON "activities_breadcrumbs" USING btree ("_parent_id");
  CREATE INDEX "activities_breadcrumbs_doc_idx" ON "activities_breadcrumbs" USING btree ("doc_id");
  CREATE INDEX "_activities_v_version_breadcrumbs_order_idx" ON "_activities_v_version_breadcrumbs" USING btree ("_order");
  CREATE INDEX "_activities_v_version_breadcrumbs_parent_id_idx" ON "_activities_v_version_breadcrumbs" USING btree ("_parent_id");
  CREATE INDEX "_activities_v_version_breadcrumbs_doc_idx" ON "_activities_v_version_breadcrumbs" USING btree ("doc_id");
  CREATE INDEX "packages_breadcrumbs_order_idx" ON "packages_breadcrumbs" USING btree ("_order");
  CREATE INDEX "packages_breadcrumbs_parent_id_idx" ON "packages_breadcrumbs" USING btree ("_parent_id");
  CREATE INDEX "packages_breadcrumbs_doc_idx" ON "packages_breadcrumbs" USING btree ("doc_id");
  CREATE INDEX "_packages_v_version_breadcrumbs_order_idx" ON "_packages_v_version_breadcrumbs" USING btree ("_order");
  CREATE INDEX "_packages_v_version_breadcrumbs_parent_id_idx" ON "_packages_v_version_breadcrumbs" USING btree ("_parent_id");
  CREATE INDEX "_packages_v_version_breadcrumbs_doc_idx" ON "_packages_v_version_breadcrumbs" USING btree ("doc_id");
  CREATE INDEX "pages_breadcrumbs_order_idx" ON "pages_breadcrumbs" USING btree ("_order");
  CREATE INDEX "pages_breadcrumbs_parent_id_idx" ON "pages_breadcrumbs" USING btree ("_parent_id");
  CREATE INDEX "pages_breadcrumbs_doc_idx" ON "pages_breadcrumbs" USING btree ("doc_id");
  CREATE INDEX "_pages_v_version_breadcrumbs_order_idx" ON "_pages_v_version_breadcrumbs" USING btree ("_order");
  CREATE INDEX "_pages_v_version_breadcrumbs_parent_id_idx" ON "_pages_v_version_breadcrumbs" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_version_breadcrumbs_doc_idx" ON "_pages_v_version_breadcrumbs" USING btree ("doc_id");
  CREATE INDEX "categories_breadcrumbs_order_idx" ON "categories_breadcrumbs" USING btree ("_order");
  CREATE INDEX "categories_breadcrumbs_parent_id_idx" ON "categories_breadcrumbs" USING btree ("_parent_id");
  CREATE INDEX "categories_breadcrumbs_doc_idx" ON "categories_breadcrumbs" USING btree ("doc_id");
  ALTER TABLE "activities" ADD CONSTRAINT "activities_parent_id_activities_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."activities"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_activities_v" ADD CONSTRAINT "_activities_v_version_parent_id_activities_id_fk" FOREIGN KEY ("version_parent_id") REFERENCES "public"."activities"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "packages" ADD CONSTRAINT "packages_parent_id_packages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."packages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_packages_v" ADD CONSTRAINT "_packages_v_version_parent_id_packages_id_fk" FOREIGN KEY ("version_parent_id") REFERENCES "public"."packages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_parent_id_pages_id_fk" FOREIGN KEY ("version_parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "activities_parent_idx" ON "activities" USING btree ("parent_id");
  CREATE INDEX "_activities_v_version_version_parent_idx" ON "_activities_v" USING btree ("version_parent_id");
  CREATE INDEX "packages_parent_idx" ON "packages" USING btree ("parent_id");
  CREATE INDEX "_packages_v_version_version_parent_idx" ON "_packages_v" USING btree ("version_parent_id");
  CREATE INDEX "pages_parent_idx" ON "pages" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_version_parent_idx" ON "_pages_v" USING btree ("version_parent_id");
  CREATE INDEX "categories_parent_idx" ON "categories" USING btree ("parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "activities_breadcrumbs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_activities_v_version_breadcrumbs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "packages_breadcrumbs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_packages_v_version_breadcrumbs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_breadcrumbs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_version_breadcrumbs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "categories_breadcrumbs" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "activities_breadcrumbs" CASCADE;
  DROP TABLE "_activities_v_version_breadcrumbs" CASCADE;
  DROP TABLE "packages_breadcrumbs" CASCADE;
  DROP TABLE "_packages_v_version_breadcrumbs" CASCADE;
  DROP TABLE "pages_breadcrumbs" CASCADE;
  DROP TABLE "_pages_v_version_breadcrumbs" CASCADE;
  DROP TABLE "categories_breadcrumbs" CASCADE;
  ALTER TABLE "activities" DROP CONSTRAINT "activities_parent_id_activities_id_fk";
  
  ALTER TABLE "_activities_v" DROP CONSTRAINT "_activities_v_version_parent_id_activities_id_fk";
  
  ALTER TABLE "packages" DROP CONSTRAINT "packages_parent_id_packages_id_fk";
  
  ALTER TABLE "_packages_v" DROP CONSTRAINT "_packages_v_version_parent_id_packages_id_fk";
  
  ALTER TABLE "pages" DROP CONSTRAINT "pages_parent_id_pages_id_fk";
  
  ALTER TABLE "_pages_v" DROP CONSTRAINT "_pages_v_version_parent_id_pages_id_fk";
  
  ALTER TABLE "categories" DROP CONSTRAINT "categories_parent_id_categories_id_fk";
  
  DROP INDEX "activities_parent_idx";
  DROP INDEX "_activities_v_version_version_parent_idx";
  DROP INDEX "packages_parent_idx";
  DROP INDEX "_packages_v_version_version_parent_idx";
  DROP INDEX "pages_parent_idx";
  DROP INDEX "_pages_v_version_version_parent_idx";
  DROP INDEX "categories_parent_idx";
  ALTER TABLE "activities" DROP COLUMN "parent_id";
  ALTER TABLE "_activities_v" DROP COLUMN "version_parent_id";
  ALTER TABLE "packages" DROP COLUMN "parent_id";
  ALTER TABLE "_packages_v" DROP COLUMN "version_parent_id";
  ALTER TABLE "pages" DROP COLUMN "parent_id";
  ALTER TABLE "_pages_v" DROP COLUMN "version_parent_id";
  ALTER TABLE "categories" DROP COLUMN "parent_id";`)
}
