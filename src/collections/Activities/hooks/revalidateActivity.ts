import { revalidatePath } from 'next/cache'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

export const revalidateActivity: CollectionAfterChangeHook<any> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = `/activities/${doc.slug}`
      payload.logger.info(`Revalidating activity at path: ${path}`)

      revalidatePath(path)
      revalidatePath('/activities', 'layout')
    }

    // If the activity was previously published, we need to revalidate the old path
    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      const oldPath = `/activities/${previousDoc.slug}`
      payload.logger.info(`Revalidating old activity at path: ${oldPath}`)

      revalidatePath(oldPath)
      revalidatePath('/activities', 'layout')
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<any> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    const path = `/activities/${doc?.slug}`

    revalidatePath(path)
    revalidatePath('/activities', 'layout')
  }

  return doc
}
