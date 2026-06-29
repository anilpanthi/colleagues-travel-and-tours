import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_activities_hero_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_activities_hero_links_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum_activities_hero_type" AS ENUM('none', 'highImpact', 'mediumImpact', 'lowImpact');
  CREATE TYPE "public"."enum__activities_v_version_hero_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__activities_v_version_hero_links_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum__activities_v_version_hero_type" AS ENUM('none', 'highImpact', 'mediumImpact', 'lowImpact');
  CREATE TABLE "activities_hero_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_activities_hero_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum_activities_hero_links_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "activities_hero_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "activities_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"posts_id" integer,
  	"packages_id" integer,
  	"activities_id" integer,
  	"testimonials_id" integer
  );
  
  CREATE TABLE "_activities_v_version_hero_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum__activities_v_version_hero_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum__activities_v_version_hero_links_link_appearance" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_activities_v_version_hero_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_activities_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"posts_id" integer,
  	"packages_id" integer,
  	"activities_id" integer,
  	"testimonials_id" integer
  );
  
  ALTER TABLE "activities" ADD COLUMN "hero_type" "enum_activities_hero_type" DEFAULT 'none';
  ALTER TABLE "activities" ADD COLUMN "hero_background_video_id" integer;
  ALTER TABLE "activities" ADD COLUMN "hero_tagline" varchar;
  ALTER TABLE "activities" ADD COLUMN "hero_title" varchar;
  ALTER TABLE "activities" ADD COLUMN "hero_subtitle" varchar;
  ALTER TABLE "activities" ADD COLUMN "hero_description" jsonb;
  ALTER TABLE "activities" ADD COLUMN "hero_media_id" integer;
  ALTER TABLE "_activities_v" ADD COLUMN "version_hero_type" "enum__activities_v_version_hero_type" DEFAULT 'none';
  ALTER TABLE "_activities_v" ADD COLUMN "version_hero_background_video_id" integer;
  ALTER TABLE "_activities_v" ADD COLUMN "version_hero_tagline" varchar;
  ALTER TABLE "_activities_v" ADD COLUMN "version_hero_title" varchar;
  ALTER TABLE "_activities_v" ADD COLUMN "version_hero_subtitle" varchar;
  ALTER TABLE "_activities_v" ADD COLUMN "version_hero_description" jsonb;
  ALTER TABLE "_activities_v" ADD COLUMN "version_hero_media_id" integer;
  ALTER TABLE "activities_hero_links" ADD CONSTRAINT "activities_hero_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."activities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "activities_hero_features" ADD CONSTRAINT "activities_hero_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."activities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "activities_rels" ADD CONSTRAINT "activities_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."activities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "activities_rels" ADD CONSTRAINT "activities_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "activities_rels" ADD CONSTRAINT "activities_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "activities_rels" ADD CONSTRAINT "activities_rels_packages_fk" FOREIGN KEY ("packages_id") REFERENCES "public"."packages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "activities_rels" ADD CONSTRAINT "activities_rels_activities_fk" FOREIGN KEY ("activities_id") REFERENCES "public"."activities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "activities_rels" ADD CONSTRAINT "activities_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_activities_v_version_hero_links" ADD CONSTRAINT "_activities_v_version_hero_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_activities_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_activities_v_version_hero_features" ADD CONSTRAINT "_activities_v_version_hero_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_activities_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_activities_v_rels" ADD CONSTRAINT "_activities_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_activities_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_activities_v_rels" ADD CONSTRAINT "_activities_v_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_activities_v_rels" ADD CONSTRAINT "_activities_v_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_activities_v_rels" ADD CONSTRAINT "_activities_v_rels_packages_fk" FOREIGN KEY ("packages_id") REFERENCES "public"."packages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_activities_v_rels" ADD CONSTRAINT "_activities_v_rels_activities_fk" FOREIGN KEY ("activities_id") REFERENCES "public"."activities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_activities_v_rels" ADD CONSTRAINT "_activities_v_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "activities_hero_links_order_idx" ON "activities_hero_links" USING btree ("_order");
  CREATE INDEX "activities_hero_links_parent_id_idx" ON "activities_hero_links" USING btree ("_parent_id");
  CREATE INDEX "activities_hero_features_order_idx" ON "activities_hero_features" USING btree ("_order");
  CREATE INDEX "activities_hero_features_parent_id_idx" ON "activities_hero_features" USING btree ("_parent_id");
  CREATE INDEX "activities_rels_order_idx" ON "activities_rels" USING btree ("order");
  CREATE INDEX "activities_rels_parent_idx" ON "activities_rels" USING btree ("parent_id");
  CREATE INDEX "activities_rels_path_idx" ON "activities_rels" USING btree ("path");
  CREATE INDEX "activities_rels_pages_id_idx" ON "activities_rels" USING btree ("pages_id");
  CREATE INDEX "activities_rels_posts_id_idx" ON "activities_rels" USING btree ("posts_id");
  CREATE INDEX "activities_rels_packages_id_idx" ON "activities_rels" USING btree ("packages_id");
  CREATE INDEX "activities_rels_activities_id_idx" ON "activities_rels" USING btree ("activities_id");
  CREATE INDEX "activities_rels_testimonials_id_idx" ON "activities_rels" USING btree ("testimonials_id");
  CREATE INDEX "_activities_v_version_hero_links_order_idx" ON "_activities_v_version_hero_links" USING btree ("_order");
  CREATE INDEX "_activities_v_version_hero_links_parent_id_idx" ON "_activities_v_version_hero_links" USING btree ("_parent_id");
  CREATE INDEX "_activities_v_version_hero_features_order_idx" ON "_activities_v_version_hero_features" USING btree ("_order");
  CREATE INDEX "_activities_v_version_hero_features_parent_id_idx" ON "_activities_v_version_hero_features" USING btree ("_parent_id");
  CREATE INDEX "_activities_v_rels_order_idx" ON "_activities_v_rels" USING btree ("order");
  CREATE INDEX "_activities_v_rels_parent_idx" ON "_activities_v_rels" USING btree ("parent_id");
  CREATE INDEX "_activities_v_rels_path_idx" ON "_activities_v_rels" USING btree ("path");
  CREATE INDEX "_activities_v_rels_pages_id_idx" ON "_activities_v_rels" USING btree ("pages_id");
  CREATE INDEX "_activities_v_rels_posts_id_idx" ON "_activities_v_rels" USING btree ("posts_id");
  CREATE INDEX "_activities_v_rels_packages_id_idx" ON "_activities_v_rels" USING btree ("packages_id");
  CREATE INDEX "_activities_v_rels_activities_id_idx" ON "_activities_v_rels" USING btree ("activities_id");
  CREATE INDEX "_activities_v_rels_testimonials_id_idx" ON "_activities_v_rels" USING btree ("testimonials_id");
  ALTER TABLE "activities" ADD CONSTRAINT "activities_hero_background_video_id_media_id_fk" FOREIGN KEY ("hero_background_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "activities" ADD CONSTRAINT "activities_hero_media_id_media_id_fk" FOREIGN KEY ("hero_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_activities_v" ADD CONSTRAINT "_activities_v_version_hero_background_video_id_media_id_fk" FOREIGN KEY ("version_hero_background_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_activities_v" ADD CONSTRAINT "_activities_v_version_hero_media_id_media_id_fk" FOREIGN KEY ("version_hero_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "activities_hero_hero_background_video_idx" ON "activities" USING btree ("hero_background_video_id");
  CREATE INDEX "activities_hero_hero_media_idx" ON "activities" USING btree ("hero_media_id");
  CREATE INDEX "_activities_v_version_hero_version_hero_background_video_idx" ON "_activities_v" USING btree ("version_hero_background_video_id");
  CREATE INDEX "_activities_v_version_hero_version_hero_media_idx" ON "_activities_v" USING btree ("version_hero_media_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "activities_hero_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "activities_hero_features" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "activities_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_activities_v_version_hero_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_activities_v_version_hero_features" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_activities_v_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "activities_hero_links" CASCADE;
  DROP TABLE "activities_hero_features" CASCADE;
  DROP TABLE "activities_rels" CASCADE;
  DROP TABLE "_activities_v_version_hero_links" CASCADE;
  DROP TABLE "_activities_v_version_hero_features" CASCADE;
  DROP TABLE "_activities_v_rels" CASCADE;
  ALTER TABLE "activities" DROP CONSTRAINT "activities_hero_background_video_id_media_id_fk";
  
  ALTER TABLE "activities" DROP CONSTRAINT "activities_hero_media_id_media_id_fk";
  
  ALTER TABLE "_activities_v" DROP CONSTRAINT "_activities_v_version_hero_background_video_id_media_id_fk";
  
  ALTER TABLE "_activities_v" DROP CONSTRAINT "_activities_v_version_hero_media_id_media_id_fk";
  
  DROP INDEX "activities_hero_hero_background_video_idx";
  DROP INDEX "activities_hero_hero_media_idx";
  DROP INDEX "_activities_v_version_hero_version_hero_background_video_idx";
  DROP INDEX "_activities_v_version_hero_version_hero_media_idx";
  ALTER TABLE "activities" DROP COLUMN "hero_type";
  ALTER TABLE "activities" DROP COLUMN "hero_background_video_id";
  ALTER TABLE "activities" DROP COLUMN "hero_tagline";
  ALTER TABLE "activities" DROP COLUMN "hero_title";
  ALTER TABLE "activities" DROP COLUMN "hero_subtitle";
  ALTER TABLE "activities" DROP COLUMN "hero_description";
  ALTER TABLE "activities" DROP COLUMN "hero_media_id";
  ALTER TABLE "_activities_v" DROP COLUMN "version_hero_type";
  ALTER TABLE "_activities_v" DROP COLUMN "version_hero_background_video_id";
  ALTER TABLE "_activities_v" DROP COLUMN "version_hero_tagline";
  ALTER TABLE "_activities_v" DROP COLUMN "version_hero_title";
  ALTER TABLE "_activities_v" DROP COLUMN "version_hero_subtitle";
  ALTER TABLE "_activities_v" DROP COLUMN "version_hero_description";
  ALTER TABLE "_activities_v" DROP COLUMN "version_hero_media_id";
  DROP TYPE "public"."enum_activities_hero_links_link_type";
  DROP TYPE "public"."enum_activities_hero_links_link_appearance";
  DROP TYPE "public"."enum_activities_hero_type";
  DROP TYPE "public"."enum__activities_v_version_hero_links_link_type";
  DROP TYPE "public"."enum__activities_v_version_hero_links_link_appearance";
  DROP TYPE "public"."enum__activities_v_version_hero_type";`)
}
