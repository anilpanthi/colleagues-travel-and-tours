import { cache } from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import type { Package } from '@/payload-types'

export const queryPageBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    depth: 5,
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})

export const queryPackageBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'packages',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})

/** Up to `limit` other packages that share an Activity with `pkg`, newest first. */
export const queryRelatedPackages = cache(
  async ({ pkg, limit = 6 }: { pkg: Package; limit?: number }): Promise<Package[]> => {
    const { isEnabled: draft } = await draftMode()
    const payload = await getPayload({ config: configPromise })

    const activityIds = (pkg.Activity ?? [])
      .map((a) => (typeof a === 'object' && a !== null ? a.id : a))
      .filter((id): id is number => typeof id === 'number')

    if (activityIds.length === 0) {
      return []
    }

    const result = await payload.find({
      collection: 'packages',
      depth: 2,
      draft,
      limit,
      overrideAccess: draft,
      pagination: false,
      sort: '-updatedAt',
      where: {
        and: [
          { id: { not_equals: pkg.id } },
          {
            or: activityIds.map((id) => ({
              Activity: {
                contains: id,
              },
            })),
          },
        ],
      },
    })

    return result.docs
  },
)

export const queryPages = cache(async () => {
  try {
    const payload = await getPayload({ config: configPromise })
    const pages = await payload.find({
      collection: 'pages',
      draft: false,
      limit: 1000,
      overrideAccess: false,
      pagination: false,
      select: {
        slug: true,
      },
    })
    return pages.docs || []
  } catch (error) {
    console.error('Error querying pages:', error)
    return []
  }
})

export const queryPackages = cache(async () => {
  try {
    const payload = await getPayload({ config: configPromise })
    const packages = await payload.find({
      collection: 'packages',
      draft: false,
      limit: 1000,
      overrideAccess: false,
      pagination: false,
      select: {
        slug: true,
      },
    })
    return packages.docs || []
  } catch (error) {
    console.error('Error querying packages:', error)
    return []
  }
})

export const queryCategoryBySlug = cache(async ({ slug }: { slug: string }) => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'categories',
    limit: 1,
    pagination: false,
    overrideAccess: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
