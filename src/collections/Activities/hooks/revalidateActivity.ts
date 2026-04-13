import { revalidatePath } from 'next/cache'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, Payload } from 'payload'
import type { Activity } from '../../../payload-types'

const revalidateAffectedPages = async (payload: Payload, activityId: string | number) => {
  payload.logger.info(`Checking for pages affected by activity ${activityId}`)

  try {
    const pages = await payload.find({
      collection: 'pages',
      where: {
        or: [
          {
            'layout.collection': {
              equals: 'activities',
            },
          },
          {
            'layout.selectedItems': {
              in: [activityId],
            },
          },
          {
            'layout.selectedActivities': {
              in: [activityId],
            },
          },
        ],
      },
      depth: 0,
      limit: 100,
    })

    for (const page of pages.docs) {
      if (page.slug) {
        const path = page.slug === 'home' ? '/' : `/${page.slug}`
        payload.logger.info(`Revalidating affected page: ${path}`)
        try {
          revalidatePath(path)
        } catch (_err) {
          // Ignore errors
        }
      }
    }
  } catch (err) {
    payload.logger.error(`Error finding affected pages for activity ${activityId}: ${err}`)
  }
}

export const revalidateActivity: CollectionAfterChangeHook<Activity> = async ({
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

      // Revalidate pages that might contain this activity
      await revalidateAffectedPages(payload, doc.id)
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

      // Also revalidate affected pages when unpublishing
      await revalidateAffectedPages(payload, doc.id)
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Activity> = async ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate && doc?.slug) {
    const path = `/activities/${doc.slug}`

    try {
      revalidatePath(path)
      revalidatePath('/activities', 'layout')
    } catch (_err) {
      // Ignore errors during render
    }

    // Revalidate pages that contained this deleted activity
    if (doc.id) {
      await revalidateAffectedPages(payload, doc.id)
    }
  }

  return doc
}
