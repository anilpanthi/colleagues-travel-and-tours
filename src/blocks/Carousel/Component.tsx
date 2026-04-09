import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import type { CarouselBlock as CarouselBlockProps } from '@/payload-types'
import Carousel from '@/components/ui/Carousel/Carousel'

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
		const fetchedItems = await payload.find({
			collection: collection as any,
			depth: 1,
			limit: limit || 10,
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
