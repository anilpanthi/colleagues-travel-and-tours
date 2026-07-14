import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import type {
	CarouselBlock as CarouselBlockProps,
	Config,
	Testimonial,
} from '@/payload-types'
import Carousel from '@/components/ui/Carousel/Carousel'
import TestimonialCard from '@/components/ui/Card/Variants/TestimonialCard'
import carouselStyles from '@/components/ui/Carousel/Carousel.module.scss'

const carouselSelectByCollection = (collectionSlug: keyof Config['collections']) => {
	switch (collectionSlug) {
		case 'testimonials':
			return {
				quote: true,
				author: true,
				rating: true,
				avatar: true,
				updatedAt: true,
				createdAt: true,
			} as const
		case 'activities':
		case 'packages':
		case 'posts':
			return {
				title: true,
				updatedAt: true,
				createdAt: true,
			} as const
		default:
			return undefined
	}
}

export const CarouselBlock: React.FC<CarouselBlockProps> = async (props) => {
	const {
		selectedItems: selectedItemsFromProps,
		collection,
		populateBy,
		limit,
	} = props

	let items = selectedItemsFromProps

	if (populateBy === 'collection' && collection && collection !== 'none') {
		const payload = await getPayload({ config: configPromise })
		const typedCollection = collection as keyof Config['collections']
		const fetchedItems = await payload.find({
			collection: typedCollection,
			depth: 1,
			limit: limit || 10,
			select: carouselSelectByCollection(typedCollection),
			sort: '-createdAt',
		})

		items = fetchedItems.docs.map(
			(doc) =>
				({
					relationTo: collection,
					value: doc,
				}) as NonNullable<CarouselBlockProps['selectedItems']>[number],
		)
	}

	const fallbackItems = items?.slice(0, 3).map((item, index) => {
		if (typeof item.value === 'number') return null

		return (
			<div
				className={carouselStyles.carouselFallbackItem}
				key={`${item.relationTo}-${item.value.id ?? index}`}
			>
				{item.relationTo === 'testimonials' ? (
					<TestimonialCard testimonial={item.value as Testimonial} />
				) : (
					<div className={carouselStyles.placeholderCard}>
						<h3>
							{(item.value as { title?: string; author?: string }).title ||
								(item.value as { title?: string; author?: string }).author}
						</h3>
					</div>
				)}
			</div>
		)
	})
	const fallback = fallbackItems?.some(Boolean) ? (
		<div className={carouselStyles.carouselFallback}>{fallbackItems}</div>
	) : null

	return <Carousel fallback={fallback} selectedItems={items} />
}

export default CarouselBlock
