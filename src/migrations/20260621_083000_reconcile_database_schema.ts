import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  const adapter = payload.db
  const { pushSchema } = adapter.requireDrizzleKit()
  const schemaFilters = adapter.schemaName ? [adapter.schemaName] : undefined
  const extensionFilters: 'postgis'[] | undefined = adapter.extensions?.postgis
    ? ['postgis']
    : undefined

  const { apply, hasDataLoss, warnings } = await pushSchema(
    adapter.schema,
    adapter.drizzle,
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
