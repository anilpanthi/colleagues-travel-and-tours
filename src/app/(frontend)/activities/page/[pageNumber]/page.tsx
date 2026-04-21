import type { Metadata } from 'next/types'
import Cards from '@/components/ui/Card/Cards'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import { notFound } from 'next/navigation'
import { StaticHero } from '@/heros/StaticHero/StaticHero'

import styles from '../../page.module.css'
import containerStyles from '@/Styles/container.module.css'
import type { PaginatedDocs } from 'payload'
import type { Activity } from '@/payload-types'

export const revalidate = 600

type Args = {
  params: Promise<{
    pageNumber: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { pageNumber } = await paramsPromise
  const payload = await getPayload({ config: configPromise })

  const sanitizedPageNumber = Number(pageNumber)

  if (!Number.isInteger(sanitizedPageNumber)) notFound()

  let activities: PaginatedDocs<Activity>

  try {
    activities = await payload.find({
      collection: 'activities',
      depth: 1,
      limit: 6,
      page: sanitizedPageNumber,
      overrideAccess: false,
    })
  } catch (error) {
    console.error('Error fetching activities:', error)
    activities = {
      docs: [],
      totalDocs: 0,
      limit: 6,
      totalPages: 0,
      page: sanitizedPageNumber,
      pagingCounter: 1,
      hasPrevPage: false,
      hasNextPage: false,
      prevPage: null,
      nextPage: null,
    }
  }

  // Transform activities to the format required by the Cards component
  const selectedItems = activities.docs.map((activity) => ({
    relationTo: 'activities' as const,
    value: activity,
  }))

  return (
    <div className={styles.activitiesPage}>
      <StaticHero
        title="Things To Do In Nepal"
        tagline="Epic Adventures"
        subtitle="Explore the best trekking, wildlife, and cultural experiences in the heart of the Himalayas."
        // imageSrc="/media/trekking-blog.jpg"
      />

      <div className={`${containerStyles.container} ${styles.rangeSection}`}>
        <PageRange
          collection="activities"
          currentPage={activities.page}
          limit={6}
          totalDocs={activities.totalDocs}
        />
      </div>

      <div className={`${containerStyles.container} ${styles.cardsSection}`}>
        <Cards
          collection="activities"
          selectedItems={selectedItems}
          variant="activitiesCard"
          columns="3"
        />
      </div>

      <div className={containerStyles.container}>
        {activities?.page && activities?.totalPages > 1 && (
          <Pagination
            page={activities.page}
            totalPages={activities.totalPages}
            basePath="/activities"
          />
        )}
      </div>
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { pageNumber } = await paramsPromise
  return {
    title: `Activities | Colleagues Travel and Tours ${pageNumber || ''}`,
  }
}

export async function generateStaticParams() {
  try {
    const payload = await getPayload({ config: configPromise })
    const { totalDocs } = await payload.count({
      collection: 'activities',
      overrideAccess: false,
    })

    const totalPages = Math.ceil(totalDocs / 6)

    const pages: { pageNumber: string }[] = []

    for (let i = 1; i <= totalPages; i++) {
      pages.push({ pageNumber: String(i) })
    }

    return pages
  } catch (error) {
    console.error('Error generating static params for activities pagination:', error)
    return []
  }
}
