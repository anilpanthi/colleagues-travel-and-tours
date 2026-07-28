import configPromise from '@payload-config'
import { getPayload, type Payload } from 'payload'

import { generateLlmsText, type LlmsDocument } from '@/utilities/generateLlmsText'
import { getServerSideURL } from '@/utilities/getURL'

export const dynamic = 'force-dynamic'

type PublicContentCollection = 'activities' | 'categories' | 'packages' | 'pages' | 'posts'

const getPublishedDocuments = async (
  payload: Payload,
  collection: PublicContentCollection,
): Promise<LlmsDocument[]> => {
  try {
    const result = await payload.find({
      collection,
      draft: false,
      limit: 1000,
      overrideAccess: false,
      pagination: false,
      select: {
        meta: {
          description: true,
        },
        slug: true,
        title: true,
      },
      sort: collection === 'posts' ? '-publishedAt' : 'title',
      where: {
        _status: {
          equals: 'published',
        },
      },
    })

    return result.docs.map((document) => ({
      description:
        'meta' in document &&
        document.meta &&
        typeof document.meta === 'object' &&
        'description' in document.meta &&
        typeof document.meta.description === 'string'
          ? document.meta.description
          : null,
      slug: document.slug,
      title: document.title,
    }))
  } catch (error) {
    payload.logger.error(`Error loading ${collection} for llms.txt: ${String(error)}`)
    return []
  }
}

export async function GET() {
  let activities: LlmsDocument[] = []
  let categories: LlmsDocument[] = []
  let packages: LlmsDocument[] = []
  let pages: LlmsDocument[] = []
  let posts: LlmsDocument[] = []

  try {
    const payload = await getPayload({ config: configPromise })
    ;[activities, categories, packages, pages, posts] = await Promise.all([
      getPublishedDocuments(payload, 'activities'),
      getPublishedDocuments(payload, 'categories'),
      getPublishedDocuments(payload, 'packages'),
      getPublishedDocuments(payload, 'pages'),
      getPublishedDocuments(payload, 'posts'),
    ])
  } catch (error) {
    console.error(`Error initializing Payload for llms.txt: ${String(error)}`)
  }

  const body = generateLlmsText({
    activities,
    baseURL: getServerSideURL(),
    categories,
    packages,
    pages,
    posts,
  })

  return new Response(body, {
    headers: {
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
      'Content-Type': 'text/markdown; charset=utf-8',
    },
  })
}
