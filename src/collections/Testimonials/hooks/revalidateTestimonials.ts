import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath } from 'next/cache'
import type { Testimonial, Package } from '../../../payload-types'

export const revalidateTestimonials: CollectionAfterChangeHook<Testimonial> = async ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    const packageIds = new Set<number>()

    // Combine package IDs from current and previous document to ensure all affected pages are revalidated
    const addIds = (packages: (number | Package)[] | null | undefined) => {
      packages?.forEach((pkg) => {
        if (typeof pkg === 'number') {
          packageIds.add(pkg)
        } else if (typeof pkg === 'object' && pkg !== null && 'id' in pkg) {
          packageIds.add(pkg.id as number)
        }
      })
    }

    addIds(doc.relatedPackages)
    addIds(previousDoc?.relatedPackages)

    for (const id of packageIds) {
      try {
        const pkg = await payload.findByID({
          collection: 'packages',
          id,
          depth: 0,
        })

        if (pkg?.slug) {
          const path = `/${pkg.slug}`
          payload.logger.info(`Revalidating package at path: ${path} due to testimonial change`)
          revalidatePath(path)
        }
      } catch (err) {
        payload.logger.error(`Error revalidating package ${id}: ${err}`)
      }
    }
  }

  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Testimonial> = async ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate && doc?.relatedPackages) {
    for (const pkg of doc.relatedPackages) {
      const id = typeof pkg === 'number' ? pkg : pkg?.id
      if (typeof id === 'number') {
        try {
          const fetchedPkg = await payload.findByID({
            collection: 'packages',
            id,
            depth: 0,
          })

          if (fetchedPkg?.slug) {
            const path = `/${fetchedPkg.slug}`
            payload.logger.info(`Revalidating package at path: ${path} due to testimonial deletion`)
            revalidatePath(path)
          }
        } catch (err) {
          payload.logger.error(`Error revalidating package ${id}: ${err}`)
        }
      }
    }
  }

  return doc
}
