import type { Metadata } from 'next/types'
import { getPayload } from 'payload'
import React from 'react'
import configPromise from '@payload-config'
import { StaticHero } from '@/heros/StaticHero/StaticHero'
import Cards from '@/components/ui/Card/Cards'
import { Pagination } from '@/components/Pagination'
import { PageRange } from '@/components/PageRange'
import PageClient from './page.client'

import styles from './page.module.css'
import containerStyles from '@/Styles/container.module.css'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
	const payload = await getPayload({ config: configPromise })

	const posts = await payload.find({
		collection: 'posts',
		depth: 1,
		limit: 6,
		overrideAccess: false,
	})

	// Transform posts to the format required by the Cards component
	const selectedItems = posts.docs.map((post) => ({
		relationTo: 'posts' as const,
		value: post,
	}))

	return (
		<div className={styles.postsPage}>
			<PageClient />
			<StaticHero
				title="Our Travel Stories"
				tagline="Blog & Updates"
				subtitle="Follow our journey, tips, and updates about traveling in Nepal and beyond."
				imageSrc="/media/trekking-blog.jpg"
				scrollDot={false}
			/>

			<div className={`${containerStyles.container} ${styles.rangeSection}`}>
				<PageRange
					collection="posts"
					currentPage={posts.page}
					limit={6}
					totalDocs={posts.totalDocs}
				/>
			</div>

			<div className={`${containerStyles.container} ${styles.cardsSection}`}>
				<Cards
					collection="posts"
					selectedItems={selectedItems}
					variant="blogCard"
					columns="3"
				/>
			</div>

			<div className={containerStyles.container}>
				{posts.totalPages > 1 && posts.page && (
					<Pagination
						page={posts.page}
						totalPages={posts.totalPages}
						basePath="/posts"
					/>
				)}
			</div>
		</div>
	)
}

export function generateMetadata(): Metadata {
	return {
		title: `Our Travel Stories | Blog`,
		description: 'Follow our journey, tips, and updates about traveling in Nepal and beyond.',
	}
}
