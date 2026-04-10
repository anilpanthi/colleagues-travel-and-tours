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
import { SiteSettings } from '@/globals/SiteSettings/config'

//plugins
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Check for required environment variables in production
if (process.env.NODE_ENV === 'production') {
  if (!process.env.PAYLOAD_SECRET) {
    console.warn('WARNING: PAYLOAD_SECRET is not set in production. This will cause authentication failures.')
  }
  if (!process.env.DATABASE_URL) {
    console.warn('WARNING: DATABASE_URL is not set in production. Connection will fail.')
  }
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  cors: [process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'].filter(Boolean),
  csrf: [process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'].filter(Boolean),
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
  globals: [SiteSettings],
  rateLimit: {
    trustProxy: true,
  },

  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '', // Explicitly empty to trigger error if missing
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
      console.log('Production mode detected. Checking for pending migrations...')
      try {
        await payload.db.migrate()
        console.log('Migrations completed successfully.')
      } catch (error) {
        console.error('CRITICAL ERROR during migrations:', error)
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
    redirectsPlugin({
      collections: ['pages', 'posts', 'activities', 'packages', 'testimonials', 'categories'],

      overrides: {
        admin: {
          group: 'Plugins',
        },
      },
    }),
  ],
})
