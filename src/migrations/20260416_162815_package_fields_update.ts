import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "packages" ADD COLUMN "map_embed" varchar;
  ALTER TABLE "_packages_v" ADD COLUMN "version_map_embed" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "packages" DROP COLUMN "map_embed";
  ALTER TABLE "_packages_v" DROP COLUMN "version_map_embed";`)
}
