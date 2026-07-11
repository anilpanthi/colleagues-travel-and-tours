import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "activities" ADD COLUMN "hero_background_video_poster_id" integer;
  ALTER TABLE "_activities_v" ADD COLUMN "version_hero_background_video_poster_id" integer;
  ALTER TABLE "packages" ADD COLUMN "hero_background_video_poster_id" integer;
  ALTER TABLE "_packages_v" ADD COLUMN "version_hero_background_video_poster_id" integer;
  ALTER TABLE "posts" ADD COLUMN "hero_background_video_poster_id" integer;
  ALTER TABLE "_posts_v" ADD COLUMN "version_hero_background_video_poster_id" integer;
  ALTER TABLE "pages" ADD COLUMN "hero_background_video_poster_id" integer;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_background_video_poster_id" integer;
  ALTER TABLE "activities" ADD CONSTRAINT "activities_hero_background_video_poster_id_media_id_fk" FOREIGN KEY ("hero_background_video_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_activities_v" ADD CONSTRAINT "_activities_v_version_hero_background_video_poster_id_media_id_fk" FOREIGN KEY ("version_hero_background_video_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "packages" ADD CONSTRAINT "packages_hero_background_video_poster_id_media_id_fk" FOREIGN KEY ("hero_background_video_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_packages_v" ADD CONSTRAINT "_packages_v_version_hero_background_video_poster_id_media_id_fk" FOREIGN KEY ("version_hero_background_video_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_hero_background_video_poster_id_media_id_fk" FOREIGN KEY ("hero_background_video_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_hero_background_video_poster_id_media_id_fk" FOREIGN KEY ("version_hero_background_video_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_hero_background_video_poster_id_media_id_fk" FOREIGN KEY ("hero_background_video_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_hero_background_video_poster_id_media_id_fk" FOREIGN KEY ("version_hero_background_video_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "activities_hero_hero_background_video_poster_idx" ON "activities" USING btree ("hero_background_video_poster_id");
  CREATE INDEX "_activities_v_version_hero_version_hero_background_vid_1_idx" ON "_activities_v" USING btree ("version_hero_background_video_poster_id");
  CREATE INDEX "packages_hero_hero_background_video_poster_idx" ON "packages" USING btree ("hero_background_video_poster_id");
  CREATE INDEX "_packages_v_version_hero_version_hero_background_video_p_idx" ON "_packages_v" USING btree ("version_hero_background_video_poster_id");
  CREATE INDEX "posts_hero_hero_background_video_poster_idx" ON "posts" USING btree ("hero_background_video_poster_id");
  CREATE INDEX "_posts_v_version_hero_version_hero_background_video_post_idx" ON "_posts_v" USING btree ("version_hero_background_video_poster_id");
  CREATE INDEX "pages_hero_hero_background_video_poster_idx" ON "pages" USING btree ("hero_background_video_poster_id");
  CREATE INDEX "_pages_v_version_hero_version_hero_background_video_post_idx" ON "_pages_v" USING btree ("version_hero_background_video_poster_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "activities" DROP CONSTRAINT "activities_hero_background_video_poster_id_media_id_fk";
  
  ALTER TABLE "_activities_v" DROP CONSTRAINT "_activities_v_version_hero_background_video_poster_id_media_id_fk";
  
  ALTER TABLE "packages" DROP CONSTRAINT "packages_hero_background_video_poster_id_media_id_fk";
  
  ALTER TABLE "_packages_v" DROP CONSTRAINT "_packages_v_version_hero_background_video_poster_id_media_id_fk";
  
  ALTER TABLE "posts" DROP CONSTRAINT "posts_hero_background_video_poster_id_media_id_fk";
  
  ALTER TABLE "_posts_v" DROP CONSTRAINT "_posts_v_version_hero_background_video_poster_id_media_id_fk";
  
  ALTER TABLE "pages" DROP CONSTRAINT "pages_hero_background_video_poster_id_media_id_fk";
  
  ALTER TABLE "_pages_v" DROP CONSTRAINT "_pages_v_version_hero_background_video_poster_id_media_id_fk";
  
  DROP INDEX "activities_hero_hero_background_video_poster_idx";
  DROP INDEX "_activities_v_version_hero_version_hero_background_vid_1_idx";
  DROP INDEX "packages_hero_hero_background_video_poster_idx";
  DROP INDEX "_packages_v_version_hero_version_hero_background_video_p_idx";
  DROP INDEX "posts_hero_hero_background_video_poster_idx";
  DROP INDEX "_posts_v_version_hero_version_hero_background_video_post_idx";
  DROP INDEX "pages_hero_hero_background_video_poster_idx";
  DROP INDEX "_pages_v_version_hero_version_hero_background_video_post_idx";
  ALTER TABLE "activities" DROP COLUMN "hero_background_video_poster_id";
  ALTER TABLE "_activities_v" DROP COLUMN "version_hero_background_video_poster_id";
  ALTER TABLE "packages" DROP COLUMN "hero_background_video_poster_id";
  ALTER TABLE "_packages_v" DROP COLUMN "version_hero_background_video_poster_id";
  ALTER TABLE "posts" DROP COLUMN "hero_background_video_poster_id";
  ALTER TABLE "_posts_v" DROP COLUMN "version_hero_background_video_poster_id";
  ALTER TABLE "pages" DROP COLUMN "hero_background_video_poster_id";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_background_video_poster_id";`)
}
