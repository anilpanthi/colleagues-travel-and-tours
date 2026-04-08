import { getPayload } from 'payload'
import config from '../payload.config'

const migrate = async () => {
  console.log('Starting migrations...')
  const payload = await getPayload({ config })

  try {
    await payload.db.migrate()
    console.log('Migrations completed successfully.')
  } catch (error) {
    console.error('Error during migrations:', error)
    process.exit(1)
  }

  process.exit(0)
}

migrate()
