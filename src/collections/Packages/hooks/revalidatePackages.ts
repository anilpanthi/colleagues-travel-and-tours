import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Package } from '../../../payload-types'

export const revalidatePackages: CollectionAfterChangeHook<Package> = async ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published' && doc.slug) {
      const path = `/${doc.slug}`

      payload.logger.info(`Revalidating product at path: ${path}`)

      try {
        revalidatePath(path)
        revalidateTag('packages-sitemap', 'max')
      } catch (_err) {
        payload.logger.error(`Error revalidating product at path: ${path}`)
      }
    }

    // If the product was previously published, we need to revalidate the old path
    if (previousDoc?._status === 'published' && doc._status !== 'published' && previousDoc.slug) {
      const oldPath = `/${previousDoc.slug}`

      payload.logger.info(`Revalidating old product at path: ${oldPath}`)

      try {
        revalidatePath(oldPath)
        revalidateTag('packages-sitemap', 'max')
      } catch (_err) {
        payload.logger.error(`Error revalidating old product at path: ${oldPath}`)
      }
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Package> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate && doc?.slug) {
    const path = `/${doc.slug}`

    try {
      revalidatePath(path)
      revalidateTag('packages-sitemap', 'max')
    } catch (_err) {
      // Ignore errors during render
    }
  }

  return doc
}
