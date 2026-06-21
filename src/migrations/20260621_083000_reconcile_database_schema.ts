import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { pushSchema } from 'drizzle-kit/api'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  const adapter = payload.db
  const schemaFilters = adapter.schemaName ? [adapter.schemaName] : undefined
  const extensionFilters: 'postgis'[] | undefined = adapter.extensions?.postgis
    ? ['postgis']
    : undefined

  const { apply, hasDataLoss, warnings } = await pushSchema(
    adapter.schema,
    adapter.drizzle as unknown as Parameters<typeof pushSchema>[1],
    schemaFilters,
    adapter.tablesFilter,
    extensionFilters,
  )

  if (hasDataLoss) {
    throw new Error(
      `Schema reconciliation was stopped because it may cause data loss: ${warnings.join('; ')}`,
    )
  }

  for (const warning of warnings) {
    payload.logger.warn(`Schema reconciliation warning: ${warning}`)
  }

  await apply()
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.warn('Schema reconciliation cannot be reversed automatically.')
}
