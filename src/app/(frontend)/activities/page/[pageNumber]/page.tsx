import type { Metadata } from 'next/types'
import Cards from '@/components/ui/Card/Cards'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import { notFound } from 'next/navigation'

import styles from '../../page.module.css'
import containerStyles from '@/Styles/container.module.css'
import type { PaginatedDocs } from 'payload'
import type { Activity } from '@/payload-types'
import { isPayloadBuildTime } from '@/utilities/isBuildTime'
import PageClient from '../../page.client'
import { activitiesPageDescription, activitiesPageTitle } from '../../seo'
import { ResultsSummary } from '../../ResultsSummary'

export const revalidate = 600
export const dynamic = 'force-dynamic'

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
    activities = (await payload.find({
      collection: 'activities',
      depth: 1,
      limit: 6,
      page: sanitizedPageNumber,
      overrideAccess: false,
      select: {
        title: true,
        slug: true,
        meta: true,
        packageCount: true,
        featuredIcon: true,
        updatedAt: true,
        createdAt: true,
      },
    })) as PaginatedDocs<Activity>
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
  const hasSingleActivity = selectedItems.length === 1

  return (
    <div className={styles.activitiesPage}>
      <PageClient />

      <section className={`${containerStyles.container} ${styles.pageHeader}`}>
        <p className={styles.eyebrow}>Epic Adventures</p>
        <h1 className={styles.title}>{activitiesPageTitle}</h1>
        <p className={styles.description}>{activitiesPageDescription}</p>
      </section>

      <div className={`${containerStyles.container} ${styles.resultsBar}`}>
        <ResultsSummary shownCount={activities.docs.length} totalDocs={activities.totalDocs} />
      </div>

      <div className={`${containerStyles.container} ${styles.cardsSection}`}>
        <Cards
          cardsClassName={hasSingleActivity ? styles.singleActivityGrid : undefined}
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
    alternates: {
      canonical: `/activities/page/${pageNumber}`,
    },
    title: `${activitiesPageTitle} | Page ${pageNumber} | Colleagues Travel and Tours`,
    description: activitiesPageDescription,
  }
}

export async function generateStaticParams() {
  if (isPayloadBuildTime) {
    return []
  }

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
