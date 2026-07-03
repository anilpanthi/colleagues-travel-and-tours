import type React from 'react'
import type {
  Activity,
  Category,
  Package,
  Page,
  Post,
  Redirect,
  Testimonial,
} from '@/payload-types'

import { getCachedDocumentByID } from '@/utilities/getDocument'
import { getCachedRedirects } from '@/utilities/getRedirects'
import { generatePath } from '@/utilities/generatePath'
import { notFound, redirect } from 'next/navigation'

interface Props {
  disableNotFound?: boolean
  url: string
}

type RedirectDocument = Activity | Category | Package | Page | Post | Testimonial

const getDocumentSlug = (document: RedirectDocument) => {
  return 'slug' in document ? document.slug : null
}

/* This component helps us with SSR based dynamic redirects */
export const PayloadRedirects: React.FC<Props> = async ({ disableNotFound, url }) => {
  const redirects = (await getCachedRedirects()()) as Redirect[]

  const redirectItem = redirects.find((redirect) => redirect.from === url)

  if (redirectItem) {
    if (redirectItem.to?.url) {
      redirect(redirectItem.to.url)
    }

    let redirectUrl: string

    if (
      typeof redirectItem.to?.reference?.value === 'string' ||
      typeof redirectItem.to?.reference?.value === 'number'
    ) {
      const collection = redirectItem.to?.reference?.relationTo
      const id = redirectItem.to?.reference?.value

      const document = (await getCachedDocumentByID(collection, id)()) as RedirectDocument
      redirectUrl = generatePath(collection, getDocumentSlug(document))
    } else {
      const collection = redirectItem.to?.reference?.relationTo
      const slug =
        typeof redirectItem.to?.reference?.value === 'object' &&
        'slug' in redirectItem.to.reference.value
          ? redirectItem.to.reference.value.slug
          : null

      redirectUrl = collection ? generatePath(collection, slug) : '#'
    }

    if (redirectUrl) redirect(redirectUrl)
  }

  if (disableNotFound) return null

  notFound()
}
