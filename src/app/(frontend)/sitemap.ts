import { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getServerSideURL } from '@/utilities/getURL'

export const revalidate = 3600 // Cache sitemap for 1 hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config: configPromise })
  const baseURL = getServerSideURL()

  // Helper to format URLs
  const getURL = (path: string) => {
    const cleanPath = path.startsWith('/') ? path : `/${path}`
    return `${baseURL}${cleanPath}`
  }

  // Helper to format date safely
  const getLocalDate = (dateStr?: string | Date | null) => {
    if (!dateStr) return new Date()
    return new Date(dateStr)
  }

  // 1. Static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: getURL('/explore'),
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: getURL('/packages'),
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: getURL('/activities'),
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: getURL('/posts'),
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ]

  // 2. Fetch pages
  let pageRoutes: MetadataRoute.Sitemap = []
  try {
    const pages = await payload.find({
      collection: 'pages',
      draft: false,
      limit: 1000,
      overrideAccess: false,
      select: {
        slug: true,
        updatedAt: true,
      },
    })

    pageRoutes = pages.docs.map((doc) => {
      const isHome = doc.slug === 'home'
      return {
        url: getURL(isHome ? '/' : doc.slug),
        lastModified: getLocalDate(doc.updatedAt),
        changeFrequency: isHome ? 'daily' : 'weekly',
        priority: isHome ? 1.0 : 0.8,
      }
    })
  } catch (error) {
    payload.logger.error(`Error generating sitemap pages: ${error}`)
  }

  // 3. Fetch packages
  let packageRoutes: MetadataRoute.Sitemap = []
  try {
    const packages = await payload.find({
      collection: 'packages',
      draft: false,
      limit: 1000,
      overrideAccess: false,
      select: {
        slug: true,
        updatedAt: true,
      },
    })

    packageRoutes = packages.docs.map((doc) => ({
      url: getURL(doc.slug),
      lastModified: getLocalDate(doc.updatedAt),
      changeFrequency: 'daily',
      priority: 0.9,
    }))
  } catch (error) {
    payload.logger.error(`Error generating sitemap packages: ${error}`)
  }

  // 4. Fetch activities
  let activityRoutes: MetadataRoute.Sitemap = []
  try {
    const activities = await payload.find({
      collection: 'activities',
      draft: false,
      limit: 1000,
      overrideAccess: false,
      select: {
        slug: true,
        updatedAt: true,
      },
    })

    activityRoutes = activities.docs.map((doc) => ({
      url: getURL(`/activities/${doc.slug}`),
      lastModified: getLocalDate(doc.updatedAt),
      changeFrequency: 'weekly',
      priority: 0.8,
    }))
  } catch (error) {
    payload.logger.error(`Error generating sitemap activities: ${error}`)
  }

  // 5. Fetch posts
  let postRoutes: MetadataRoute.Sitemap = []
  try {
    const posts = await payload.find({
      collection: 'posts',
      draft: false,
      limit: 1000,
      overrideAccess: false,
      select: {
        slug: true,
        updatedAt: true,
      },
    })

    postRoutes = posts.docs.map((doc) => ({
      url: getURL(`/posts/${doc.slug}`),
      lastModified: getLocalDate(doc.updatedAt),
      changeFrequency: 'weekly',
      priority: 0.7,
    }))
  } catch (error) {
    payload.logger.error(`Error generating sitemap posts: ${error}`)
  }

  // 6. Fetch categories
  let categoryRoutes: MetadataRoute.Sitemap = []
  try {
    const categories = await payload.find({
      collection: 'categories',
      draft: false,
      limit: 1000,
      overrideAccess: false,
      select: {
        slug: true,
        updatedAt: true,
      },
    })

    categoryRoutes = categories.docs.map((doc) => ({
      url: getURL(`/categories/${doc.slug}`),
      lastModified: getLocalDate(doc.updatedAt),
      changeFrequency: 'weekly',
      priority: 0.5,
    }))
  } catch (error) {
    payload.logger.error(`Error generating sitemap categories: ${error}`)
  }

  return [
    ...pageRoutes,
    ...staticRoutes,
    ...packageRoutes,
    ...activityRoutes,
    ...postRoutes,
    ...categoryRoutes,
  ]
}
