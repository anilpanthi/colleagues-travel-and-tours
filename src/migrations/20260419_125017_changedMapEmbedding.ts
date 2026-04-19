import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "packages" ALTER COLUMN "map_iframe" SET DATA TYPE varchar;
  ALTER TABLE "_packages_v" ALTER COLUMN "version_map_iframe" SET DATA TYPE varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "packages" ALTER COLUMN "map_iframe" SET DATA TYPE jsonb;
  ALTER TABLE "_packages_v" ALTER COLUMN "version_map_iframe" SET DATA TYPE jsonb;`)
}
