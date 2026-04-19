import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Cards from '@/components/ui/Card/Cards'
import style from './page.module.scss'
import { StaticHero } from '@/heros/StaticHero/StaticHero'
import Content from '@/components/ui/Content/Index'
import { PackagesFilters } from './PackagesFilters'
import { PackagesSearch } from './PackagesSearch'

import { Pagination } from '@/components/Pagination'
import { PageRange } from '@/components/PageRange'
import containerStyles from '@/Styles/container.module.css'
import type { PaginatedDocs, Where } from 'payload'
import type { Package } from '@/payload-types'

const tripFactFields = [
	'tripDuration',
	'tripGrade',
	'bestSeason',
	'perDayHiking',
	'elevation',
	'accommodation',
	'transportation',
] as const

type TripFactField = (typeof tripFactFields)[number]

const tripFactLabels: Record<TripFactField, string> = {
	tripDuration: 'Trip Duration',
	tripGrade: 'Trip Grade',
	bestSeason: 'Best Season',
	perDayHiking: 'Per Day Hiking',
	elevation: 'Elevation',
	accommodation: 'Accommodation',
	transportation: 'Transportation',
}

const getQueryValue = (
	value: string | string[] | undefined,
): string | undefined => {
	if (Array.isArray(value)) return value[0]?.trim() || undefined
	return value?.trim() || undefined
}

const getQueryValues = (value: string | string[] | undefined): string[] => {
	if (Array.isArray(value)) return value.filter(Boolean)
	if (!value) return []
	return [value]
}

export const metadata: Metadata = {
	title: 'Packages | Colleagues Travel And Tours',
	description: 'Explore our travel packages.',
}

export default async function PackagesPage({
	searchParams: searchParamsPromise,
}: {
	searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
	const payload = await getPayload({ config: configPromise })
	const searchParams = await searchParamsPromise
	const pageParam = getQueryValue(searchParams.page) ?? '1'
	const searchQuery = getQueryValue(searchParams.q)
	const selectedActivityIds = getQueryValues(searchParams.activity)
	const currentPage = Math.max(1, Number.parseInt(pageParam, 10) || 1)

	const selectedTripFacts = Object.fromEntries(
		tripFactFields.map((field) => [field, getQueryValue(searchParams[field])]),
	) as Record<TripFactField, string | undefined>

	const allPackages = await payload.find({
		collection: 'packages',
		pagination: false,
		depth: 0,
		overrideAccess: false,
	})

	const tripFactOptions = Object.fromEntries(
		tripFactFields.map((field) => {
			const options = Array.from(
				new Set(
					allPackages.docs
						.map((pkg) => pkg[field])
						.filter((value): value is string => typeof value === 'string' && value.length > 0),
				),
			).sort((a, b) => a.localeCompare(b))

			return [field, options]
		}),
	) as Record<TripFactField, string[]>

	const activities = await payload.find({
		collection: 'activities',
		pagination: false,
		depth: 0,
		overrideAccess: false,
		sort: 'title',
	})

	const whereClauses: Where[] = []

	if (searchQuery) {
		whereClauses.push({
			or: [
				{ title: { contains: searchQuery } },
				{ 'meta.description': { contains: searchQuery } },
			],
		})
	}

	if (selectedActivityIds.length > 0) {
		whereClauses.push({
			Activity: {
				in: selectedActivityIds,
			},
		})
	}

	tripFactFields.forEach((field) => {
		const selectedValue = selectedTripFacts[field]
		if (!selectedValue) return
		whereClauses.push({
			[field]: {
				equals: selectedValue,
			},
		})
	})

	let packages: PaginatedDocs<Package>

	try {
		packages = await payload.find({
			collection: 'packages',
			depth: 2,
			limit: 6,
			page: currentPage,
			where: whereClauses.length > 0 ? { and: whereClauses } : undefined,
			overrideAccess: false,
		})
	} catch (_error) {
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

	const activeFilterCount =
		(selectedActivityIds.length > 0 ? 1 : 0) +
		(searchQuery ? 1 : 0) +
		Object.values(selectedTripFacts).filter(Boolean).length

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
				<div className={`${containerStyles.container} ${style.rangeSection}`}>
					<PageRange
						collection="packages"
						currentPage={packages.page}
						limit={6}
						totalDocs={packages.totalDocs}
					/>
				</div>
				<div className={`${containerStyles.container} ${style.layout}`}>
					<aside className={style.filterSidebar}>
						<PackagesFilters
							selectedActivityIds={selectedActivityIds}
							selectedTripFacts={selectedTripFacts}
							activities={activities.docs.map((activity) => ({
								id: String(activity.id),
								title: activity.title,
							}))}
							tripFactFields={[...tripFactFields]}
							tripFactLabels={tripFactLabels}
							tripFactOptions={tripFactOptions}
							styles={style}
						/>
					</aside>
					<div className={style.cardsSection}>
						<PackagesSearch searchQuery={searchQuery} styles={style} />
						<div className={style.resultsHeader}>
							<div>
								<h3 className={style.resultsTitle}>Available Packages</h3>
								<p className={style.resultsMeta}>
									{packages.totalDocs} result{packages.totalDocs === 1 ? '' : 's'}
								</p>
							</div>
							{activeFilterCount > 0 && (
								<span className={style.activeFilterBadge}>
									{activeFilterCount} active filter{activeFilterCount === 1 ? '' : 's'}
								</span>
							)}
						</div>
						{selectedItems.length > 0 ? (
							<Cards
								collection="packages"
								selectedItems={selectedItems}
								variant="packagesCard"
								columns="3"
							/>
						) : (
							<div className={style.emptyState}>
								<h4>No packages found</h4>
								<p>Try changing keywords or clearing one of the selected filters.</p>
							</div>
						)}
					</div>
				</div>
				<div className={containerStyles.container}>
					{packages.totalPages > 1 && packages.page && (
						<Pagination
							page={packages.page}
							totalPages={packages.totalPages}
							basePath="/packages"
							queryParams={searchParams}
						/>
					)}
				</div>
			</Content>
		</div>
	)
}
