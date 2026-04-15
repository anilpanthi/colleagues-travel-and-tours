import type { Metadata } from 'next/types'
import { getPayload } from 'payload'
import React from 'react'
import configPromise from '@payload-config'
import { StaticHero } from '@/heros/StaticHero/StaticHero'
import Cards from '@/components/ui/Card/Cards'
import { Pagination } from '@/components/Pagination'
import { PageRange } from '@/components/PageRange'

import styles from './page.module.css'
import containerStyles from '@/Styles/container.module.css'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function ActivitiesPage() {
	const payload = await getPayload({ config: configPromise })

	const activities = await payload.find({
		collection: 'activities',
		depth: 1,
		limit: 6,
		overrideAccess: false,
	})

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
				imageSrc="/media/trekking-blog.jpg"
				scrollDot={false}
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
		title: `Things To Do In Nepal`,
		description:
			'Explore the best trekking, wildlife, and cultural experiences in the heart of the Himalayas.',
	}
}
