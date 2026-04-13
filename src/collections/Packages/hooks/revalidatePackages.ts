import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Package } from '../../../payload-types'

export const revalidatePackages: CollectionAfterChangeHook<Package> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    const path = `/${doc.slug}`

    payload.logger.info(`Revalidating product at path: ${path}`)

    revalidatePath(path)
    revalidateTag('packages-sitemap', 'max')

    // If the product was previously published, we need to revalidate the old path
    if (previousDoc?.slug && doc.slug !== previousDoc.slug) {
      const oldPath = `/${previousDoc.slug}`

      payload.logger.info(`Revalidating old product at path: ${oldPath}`)

      revalidatePath(oldPath)
      revalidateTag('packages-sitemap', 'max')
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Package> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    const path = `/${doc?.slug}`

    revalidatePath(path)
    revalidateTag('packages-sitemap', 'max')
  }

  return doc
}
