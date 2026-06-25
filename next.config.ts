import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const NEXT_PUBLIC_SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000')

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
    ],
    remotePatterns: [
      ...([NEXT_PUBLIC_SERVER_URL]
        .filter(Boolean)
        .map((item) => {
          try {
            const url = new URL(item as string)
            return {
              hostname: url.hostname,
              protocol: url.protocol.replace(':', '') as 'http' | 'https',
            }
          } catch {
            return null
          }
        })
        .filter((item): item is { hostname: string; protocol: 'http' | 'https' } =>
          Boolean(item),
        )),
    ],
    qualities: [75, 100],
  },
  output: 'standalone',
  webpack: (webpackConfig, { dev, isServer, webpack }) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    if (dev && !isServer) {
      webpackConfig.plugins.push(
        new webpack.BannerPlugin({
          raw: true,
          banner: `
;(() => {
  if (typeof window === 'undefined' || !window.performance) return

  const performanceObject = window.performance

  if (performanceObject.__nextRSCMeasurePatch) return
  if (typeof performanceObject.measure !== 'function') return

  const originalMeasure = performanceObject.measure.bind(performanceObject)

  Object.defineProperty(performanceObject, '__nextRSCMeasurePatch', {
    configurable: false,
    enumerable: false,
    value: true,
  })

  performanceObject.measure = function patchedMeasure(name, startOrMeasureOptions, endMark) {
    try {
      return originalMeasure(name, startOrMeasureOptions, endMark)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      const isReactServerComponentMeasure = typeof name === 'string' && name.charCodeAt(0) === 8203
      const isNegativeTimestampError = message.includes('cannot have a negative time stamp')

      if (isReactServerComponentMeasure && isNegativeTimestampError) {
        return undefined
      }

      throw error
    }
  }
})();`,
        }),
      )
    }

    return webpackConfig
  },
  reactStrictMode: true,
  serverExternalPackages: ['@payloadcms/db-postgres', 'drizzle-kit', 'sharp'],
  transpilePackages: ['react-image-crop', '@payloadcms/next', '@payloadcms/ui'],
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
