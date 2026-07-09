import type { Metadata } from 'next/types'
import { getPayload } from 'payload'
import React from 'react'
import configPromise from '@payload-config'
import Cards from '@/components/ui/Card/Cards'
import { Pagination } from '@/components/Pagination'
import type { Activity } from '@/payload-types'
import PageClient from './page.client'
import { activitiesPageDescription, activitiesPageTitle } from './seo'
import { ResultsSummary } from './ResultsSummary'

import styles from './page.module.css'
import containerStyles from '@/Styles/container.module.css'

export const revalidate = 600
export const dynamic = 'force-dynamic'

const getQueryValue = (value: string | string[] | undefined): string | undefined => {
  if (Array.isArray(value)) return value[0]?.trim() || undefined
  return value?.trim() || undefined
}

export default async function ActivitiesPage({
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const payload = await getPayload({ config: configPromise })
  const searchParams = await searchParamsPromise
  const pageParam = getQueryValue(searchParams.page) ?? '1'
  const currentPage = Math.max(1, Number.parseInt(pageParam, 10) || 1)

  const activities = await payload.find({
    collection: 'activities',
    depth: 1,
    limit: 6,
    page: currentPage,
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
  })

  // Transform activities to the format required by the Cards component
  const selectedItems = activities.docs.map((activity) => ({
    relationTo: 'activities' as const,
    value: activity as Activity,
  }))
  const hasSingleActivity = selectedItems.length === 1

  return (
    <div className={styles.activitiesPage}>
      <PageClient />

      <section className={`${containerStyles.container} ${styles.pageHeader}`}>
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
        {activities.totalPages > 1 && activities.page && (
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

export function generateMetadata(): Metadata {
  return {
    alternates: {
      canonical: '/activities',
    },
    title: `${activitiesPageTitle} | Colleagues Travel and Tours`,
    description: activitiesPageDescription,
  }
}
