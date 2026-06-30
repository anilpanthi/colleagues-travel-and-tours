import type { Metadata } from 'next'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import { generateMeta } from '@/utilities/generateMeta'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import RichText from '@/components/RichText'
import PageClient from './page.client'
import Content from '@/components/ui/Content/Index'
import { StaticHero } from '@/heros/StaticHero/StaticHero'
import { RenderHero } from '@/heros/RenderHero'
import { Pagination } from '@/components/Pagination'
import { PageRange } from '@/components/PageRange'
import Cards from '@/components/ui/Card/Cards'
import containerStyles from '@/Styles/container.module.css'
import { isPayloadBuildTime } from '@/utilities/isBuildTime'

export async function generateStaticParams() {
  if (isPayloadBuildTime) {
    return []
  }

  try {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'activities',
      draft: false,
      limit: 1000,
      overrideAccess: false,
      pagination: false,
      select: {
        slug: true,
      },
    })

    return result.docs.map(({ slug }) => ({ slug }))
  } catch (error) {
    console.error('Error generating static params for activities:', error)
    return []
  }
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

import styles from './page.module.scss'

export const dynamic = 'force-dynamic'

export default async function ActivityPage({
  params: paramsPromise,
  searchParams: searchParamsPromise,
}: Args & { searchParams: Promise<{ page?: string }> }) {
  let draft = false
  try {
    const { isEnabled } = await draftMode()
    draft = isEnabled
  } catch (e) {
    // draftMode() can throw when not called from a server component or during build
  }
  const { slug = '' } = await paramsPromise
  const { page: pageNumber = '1' } = await searchParamsPromise

  const decodedSlug = decodeURIComponent(slug)
  const url = '/activities/' + decodedSlug
  const activity = await queryActivityBySlug({ slug: decodedSlug, draft })

  if (!activity) return <PayloadRedirects url={url} />

  const payload = await getPayload({ config: configPromise })

  const packages = await payload.find({
    collection: 'packages',
    depth: 1,
    draft,
    limit: 6,
    page: parseInt(pageNumber),
    overrideAccess: draft,
    select: {
      title: true,
      slug: true,
      featuredImage: true,
      meta: true,
      tripDuration: true,
      tripGrade: true,
      elevation: true,
      Activity: true,
      hero: true,
      updatedAt: true,
      createdAt: true,
    },
    where: {
      Activity: {
        in: [activity.id],
      },
    },
  })

  const selectedItems = packages.docs.map((pkg) => ({
    relationTo: 'packages' as const,
    value: pkg,
  }))

  const hasConfiguredHero = Boolean(activity.hero?.type && activity.hero.type !== 'none')
  const breadcrumbs = [
    {
      label: 'Activities',
      url: '/activities',
    },
    {
      label: activity.title,
    },
  ]

  return (
    <>
      <PageClient heroType={activity.hero?.type} hasFallbackStaticHero={!hasConfiguredHero} />

      {hasConfiguredHero ? (
        <RenderHero
          {...activity.hero}
          breadcrumbs={breadcrumbs}
          title={activity.hero?.title || activity.title}
        />
      ) : (
        <StaticHero
          title={activity.title}
          scrollDot={false}
          tagline={false}
          subtitle={activity?.meta?.description}
        />
      )}

      {draft && <LivePreviewListener />}
      <PayloadRedirects disableNotFound url={url} />
      <Content>
        {/* {activity.content && (
					<RichText
						data={activity.content}
						style={{
							fontFamily: 'var(--font-jost)',
						}}
					/>
				)} */}

        {selectedItems.length > 0 && (
          <div className={`${containerStyles.container} ${styles.relatedSection}`}>
            <PageRange
              collection="packages"
              currentPage={packages.page}
              limit={6}
              totalDocs={packages.totalDocs}
            />

            <div className={styles.cardsWrapper}>
              <Cards
                collection="packages"
                selectedItems={selectedItems}
                variant="packagesCard"
                columns="3"
              />
            </div>

            {packages.totalPages > 1 && packages.page && (
              <div className={styles.paginationWrapper}>
                <Pagination
                  page={packages.page}
                  totalPages={packages.totalPages}
                  basePath={`/activities/${slug}`}
                />
              </div>
            )}
          </div>
        )}
      </Content>
    </>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  if (isPayloadBuildTime) {
    return {}
  }

  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const activity = await queryActivityBySlug({ slug: decodedSlug, draft: false })

  return generateMeta({ doc: activity, path: `/activities/${decodedSlug}` })
}

const queryActivityBySlug = cache(async ({ slug, draft }: { slug: string; draft: boolean }) => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'activities',
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
