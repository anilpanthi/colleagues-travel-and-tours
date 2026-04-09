import { postgresAdapter } from '@payloadcms/db-postgres'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { migrations } from './migrations'

// Custom Collections
import { Activities } from './collections/Activities'
import { Packages } from './collections/Packages'
import { Posts } from './collections/Posts'
import { Categories } from './collections/Categories'
import { Pages } from './collections/Pages'
import { Testimonials } from './collections/Testimonials'
import { Navigation } from './collections/Navigation'

//Globals

//plugins
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Media,
    Activities,
    Packages,
    Posts,
    Pages,
    Testimonials,
    Navigation,
    Categories,
  ],

  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    prodMigrations: migrations,
  }),
  sharp,
  onInit: async (payload) => {
    if (process.env.NODE_ENV === 'production') {
      try {
        await payload.db.migrate()
        console.log('Migrations completed successfully.')
      } catch (error) {
        console.error('Error during migrations:', error)
      }
    }
  },
  email: nodemailerAdapter({
    defaultFromAddress: process.env.SMTP_FROM_ADDRESS || 'info@colleagues-travel.com',
    defaultFromName: process.env.SMTP_FROM_NAME || 'Colleagues Travel',
    transportOptions: {
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    },
  }),
  plugins: [
    formBuilderPlugin({
      // see below for a list of available options
    }),
  ],
})
