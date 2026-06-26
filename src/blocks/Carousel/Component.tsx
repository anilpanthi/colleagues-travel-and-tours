import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import type { CarouselBlock as CarouselBlockProps, Config } from '@/payload-types'
import Carousel from '@/components/ui/Carousel/Carousel'

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
		enableLink,
		collection,
		populateBy,
		limit,
		link,
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

	return (
		<Carousel
			collection={collection}
			selectedItems={items}
			enableLink={enableLink}
			link={link}
		/>
	)
}

export default CarouselBlock
