import type { Metadata } from 'next/types'
import { getPayload } from 'payload'
import React from 'react'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import { StaticHero } from '@/heros/StaticHero/StaticHero'
import Cards from '@/components/ui/Card/Cards'
import { Pagination } from '@/components/Pagination'
import { PageRange } from '@/components/PageRange'
import { queryCategoryBySlug } from '../../[...slug]/queries'

import styles from './page.module.css'
import containerStyles from '@/Styles/container.module.css'

export const dynamic = 'force-static'
export const revalidate = 600

type Args = {
	params: Promise<{
		slug: string
	}>
}

export default async function CategoryPage({ params: paramsPromise }: Args) {
	const { slug } = await paramsPromise
	const payload = await getPayload({ config: configPromise })

	const category = await queryCategoryBySlug({ slug })

	if (!category) {
		return notFound()
	}

	const posts = await payload.find({
		collection: 'posts',
		depth: 1,
		limit: 6,
		where: {
			categories: {
				contains: category.id,
			},
		},
		overrideAccess: false,
	})

	// Transform posts to the format required by the Cards component
	const selectedItems = posts.docs.map((post) => ({
		relationTo: 'posts' as const,
		value: post,
	}))

	return (
		<div className={styles.categoryPage}>
			<StaticHero
				title={category.title}
				tagline="Category Archive"
				subtitle={`Explore our latest stories, news, and updates filed under ${category.title}.`}
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
						basePath={`/categories/${slug}`}
					/>
				)}
			</div>
		</div>
	)
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
	const { slug } = await paramsPromise
	const category = await queryCategoryBySlug({ slug })

	if (!category) return {}

	return {
		title: `${category.title} | Category`,
		description: `Browse all posts in the ${category.title} category.`,
	}
}

export async function generateStaticParams() {
	try {
		const payload = await getPayload({ config: configPromise })
		const categories = await payload.find({
			collection: 'categories',
			limit: 1000,
			select: {
				slug: true,
			},
		})

		return categories.docs.map(({ slug }) => ({
			slug,
		}))
	} catch (error) {
		console.error('Error generating static params for categories:', error)
		return []
	}
}
