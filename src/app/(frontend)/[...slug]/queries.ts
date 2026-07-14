import { cache } from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import { unstable_cache } from 'next/cache'
import type { Package } from '@/payload-types'

type SlugQuery = {
  draft?: boolean
  slug: string
}

const getDraftModeEnabled = cache(async (): Promise<boolean> => {
  try {
    const { isEnabled } = await draftMode()
    return isEnabled
  } catch (_error) {
    // draftMode() can throw outside a request context or during parts of the build.
    return false
  }
})

const findPageBySlug = async ({ slug, draft }: Required<SlugQuery>) => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    // Blocks can contain a selected document whose image is another relationship.
    // Depth 2 preserves those existing card/testimonial visuals without the depth-5 overfetch.
    depth: 2,
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
}

const findPublishedPageBySlug = unstable_cache(
  async (slug: string) => findPageBySlug({ draft: false, slug }),
  ['published-page-by-slug'],
  {
    revalidate: 600,
    tags: ['published-pages'],
  },
)

const queryPageBySlugForRender = cache(async (slug: string, draft: boolean) => {
  try {
    return draft
      ? await findPageBySlug({ draft: true, slug })
      : await findPublishedPageBySlug(slug)
  } catch (error) {
    console.error(`Error querying page by slug "${slug}":`, error)
    return null
  }
})

export const queryPageBySlug = async ({ slug, draft }: SlugQuery) => {
  const draftEnabled = draft ?? (await getDraftModeEnabled())
  return queryPageBySlugForRender(slug, draftEnabled)
}

const findPackageBySlug = async ({ slug, draft }: Required<SlugQuery>) => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'packages',
    depth: 2,
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
}

const findPublishedPackageBySlug = unstable_cache(
  async (slug: string) => findPackageBySlug({ draft: false, slug }),
  ['published-package-by-slug'],
  {
    revalidate: 600,
    tags: ['published-packages'],
  },
)

const queryPackageBySlugForRender = cache(async (slug: string, draft: boolean) => {
  try {
    return draft
      ? await findPackageBySlug({ draft: true, slug })
      : await findPublishedPackageBySlug(slug)
  } catch (error) {
    console.error(`Error querying package by slug "${slug}":`, error)
    return null
  }
})

export const queryPackageBySlug = async ({ slug, draft }: SlugQuery) => {
  const draftEnabled = draft ?? (await getDraftModeEnabled())
  return queryPackageBySlugForRender(slug, draftEnabled)
}

/** Up to `limit` other packages that share an Activity with `pkg`, newest first. */
export const queryRelatedPackages = cache(
  async ({ pkg, limit = 6 }: { pkg: Package; limit?: number }): Promise<Package[]> => {
    let draft = false
    try {
      const { isEnabled } = await draftMode()
      draft = isEnabled
    } catch (_e) {}
    const payload = await getPayload({ config: configPromise })

    const activityIds = (pkg.Activity ?? [])
      .map((a) => (typeof a === 'object' && a !== null ? a.id : a))
      .filter((id): id is number => typeof id === 'number')

    if (activityIds.length === 0) {
      return []
    }

    const result = await payload.find({
      collection: 'packages',
      depth: 1,
      draft,
      limit,
      overrideAccess: draft,
      pagination: false,
      select: {
        id: true,
        title: true,
        slug: true,
        featuredImage: true,
        meta: true,
        tripDuration: true,
        tripGrade: true,
        elevation: true,
        Activity: true,
      },
      sort: '-updatedAt',
      where: {
        and: [
          { id: { not_equals: pkg.id } },
          {
            Activity: {
              in: activityIds,
            },
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
  let draft = false
  try {
    const { isEnabled } = await draftMode()
    draft = isEnabled
  } catch (_e) {}
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'categories',
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

export const queryFormsByTitle = cache(async ({ title }: { title: string }) => {
  let draft = false
  try {
    const { isEnabled } = await draftMode()
    draft = isEnabled
  } catch (_e) {}
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'forms',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    depth: 2, // Important: populate form fields & blocks
    where: {
      title: {
        equals: title,
      },
    },
  })

  return result.docs?.[0] || null
})
