import { getPayload } from 'payload'
import config from './src/payload.config'
import dotenv from 'dotenv'

dotenv.config()

async function main() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  
  const submissions = await payload.find({
    collection: 'form-submissions',
    sort: '-createdAt',
    limit: 5,
  })
  
  console.log('--- FORM SUBMISSIONS ---')
  console.dir(submissions.docs, { depth: null })
  
  process.exit(0)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
