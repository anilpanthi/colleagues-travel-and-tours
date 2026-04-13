import { revalidatePath } from 'next/cache'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import type { Activity } from '../../../payload-types'

export const revalidateActivity: CollectionAfterChangeHook<Activity> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published' && doc.slug) {
      const path = `/activities/${doc.slug}`
      payload.logger.info(`Revalidating activity at path: ${path}`)

      try {
        revalidatePath(path)
        revalidatePath('/activities', 'layout')
      } catch (_err) {
        payload.logger.error(`Error revalidating activity at path: ${path}`)
      }
    }

    // If the activity was previously published, we need to revalidate the old path
    if (previousDoc?._status === 'published' && doc._status !== 'published' && previousDoc.slug) {
      const oldPath = `/activities/${previousDoc.slug}`
      payload.logger.info(`Revalidating old activity at path: ${oldPath}`)

      try {
        revalidatePath(oldPath)
        revalidatePath('/activities', 'layout')
      } catch (_err) {
        payload.logger.error(`Error revalidating old activity at path: ${oldPath}`)
      }
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Activity> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate && doc?.slug) {
    const path = `/activities/${doc.slug}`

    try {
      revalidatePath(path)
      revalidatePath('/activities', 'layout')
    } catch (_err) {
      // Ignore errors during render
    }
  }

  return doc
}
