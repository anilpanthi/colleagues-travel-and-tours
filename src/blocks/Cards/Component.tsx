import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import type { CardsBlock as CardBlockProps, Config } from '@/payload-types'
import Cards from '@/components/ui/Card/Cards'

export const CardsBlock: React.FC<CardBlockProps> = async (props) => {
	const {
		selectedItems: selectedItemsFromProps,
		cards,
		enableLink,
		collection,
		populateBy,
		limit,
		link,
		columns,
	} = props

	if (!cards || cards === 'none') return null

	let items = selectedItemsFromProps

	if (populateBy === 'selection' && items && items.length > 0) {
		const payload = await getPayload({ config: configPromise })
		const fetchedItems = await Promise.all(
			items.map(async (item) => {
				if (!item || typeof item.value === 'object') return item
				try {
					const doc = await payload.findByID({
						collection: item.relationTo ,
						id: item.value,
						depth: 2,
					})
					return {
						...item,
						value: doc,
					}
				} catch (err) {
					return item
				}
			}),
		)
		items = fetchedItems as CardBlockProps['selectedItems']
	}
	if (populateBy === 'collection' && collection && collection !== 'none') {
		const payload = await getPayload({ config: configPromise })
		const fetchedItems = await payload.find({
			collection: collection as keyof Config['collections'],
			depth: 2,
			limit: limit || 10,
			sort: '-createdAt',
		})
		items = fetchedItems.docs.map(
			(doc) =>
				({
					value: doc,
				}) as NonNullable<CardBlockProps['selectedItems']>[number],
		)
	}

	return (
		<Cards
			collection={collection}
			selectedItems={items}
			variant={cards}
			enableLink={enableLink}
			link={link}
			columns={columns}
		/>
	)
}

export default CardsBlock
