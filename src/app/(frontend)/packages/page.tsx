import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Cards from '@/components/ui/Card/Cards'
import style from './page.module.scss'
import { StaticHero } from '@/heros/StaticHero/StaticHero'
import Content from '@/components/ui/Content/Index'

import { Pagination } from '@/components/Pagination'
import { PageRange } from '@/components/PageRange'
import containerStyles from '@/Styles/container.module.css'
import type { PaginatedDocs } from 'payload'
import type { Package } from '@/payload-types'

export const metadata: Metadata = {
	title: 'Packages | Colleagues Travel And Tours',
	description: 'Explore our travel packages.',
}

export default async function PackagesPage() {
	const payload = await getPayload({ config: configPromise })

	let packages: PaginatedDocs<Package>

	try {
		packages = await payload.find({
			collection: 'packages',
			depth: 2,
			limit: 6,
			overrideAccess: false,
		})
	} catch (error) {
		packages = {
			docs: [],
			totalDocs: 0,
			limit: 6,
			totalPages: 0,
			page: 1,
			pagingCounter: 1,
			hasPrevPage: false,
			hasNextPage: false,
			prevPage: null,
			nextPage: null,
		}
	}

	const selectedItems = packages.docs.map((pkg) => ({
		relationTo: 'packages' as const,
		value: pkg,
	}))

	return (
		<div className={style.packages}>
			<StaticHero
				title="Our Travel Packages"
				tagline="Unforgettable Journeys"
				subtitle="Explore our curated travel packages for the best trekking, wildlife, and cultural experiences."
				imageSrc="/media/trekking-blog.jpg"
				scrollDot={false}
			/>
			<Content>
				{/* add gallery */}
				<div className={`${containerStyles.container} ${style.rangeSection}`}>
					<PageRange
						collection="packages"
						currentPage={packages.page}
						limit={6}
						totalDocs={packages.totalDocs}
					/>
				</div>
				<div className={`${containerStyles.container} ${style.cardsSection}`}>
					<Cards
						collection="packages"
						selectedItems={selectedItems}
						variant="packagesCard"
						columns="3"
					/>
				</div>
				<div className={containerStyles.container}>
					{packages.totalPages > 1 && packages.page && (
						<Pagination
							page={packages.page}
							totalPages={packages.totalPages}
							basePath="/packages"
						/>
					)}
				</div>
			</Content>
		</div>
	)
}
