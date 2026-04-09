import type { Block } from 'payload'

import { link } from '@/fields/link'

const collections = ['activities', 'packages', 'posts', 'testimonials'] as const

export const Cards: Block = {
	slug: 'cards',
	interfaceName: 'CardsBlock',
	fields: [
		{
			name: 'populateBy',
			type: 'radio',
			defaultValue: 'collection',
			options: [
				{ label: 'Collection', value: 'collection' },
				{ label: 'Specific Items', value: 'selection' },
			],
		},
		{
			name: 'collection',
			type: 'select',
			defaultValue: 'none',
			options: [
				{ label: 'None', value: 'none' },
				...collections.map((slug) => ({
					label: slug.charAt(0).toUpperCase() + slug.slice(1),
					value: slug,
				})),
			],
			hooks: {
				beforeChange: [
					({ value, siblingData }) => {
						if (value !== 'none' && Array.isArray(siblingData.selectedItems)) {
							siblingData.selectedItems = siblingData.selectedItems.filter(
								(item: { relationTo: string }) => item.relationTo === value,
							)
						}
						return value
					},
				],
			},
		},

		{
			name: 'limit',
			type: 'number',
			defaultValue: 10,
			admin: {
				condition: (_, siblingData) => siblingData?.populateBy === 'collection',
			},
		},
		{
			name: 'selectedItems',
			type: 'relationship',
			relationTo: [...collections],
			filterOptions: ({ siblingData, relationTo }) => {
				const data = siblingData as { collection?: string }
				if (!data || data.collection === 'none' || !data.collection) {
					return true
				}
				if (data.collection === relationTo) {
					return true
				}
				return false
			},
			hasMany: true,
			admin: {
				condition: (_, siblingData) => siblingData?.populateBy === 'selection',
			},
		},

		{
			name: 'cards',
			type: 'select',
			defaultValue: 'none',
			options: [
				{ label: 'None', value: 'none' },
				{ label: 'Normal', value: 'normal' },
				{ label: 'ActivitiesCard', value: 'activitiesCard' },
				{ label: 'TrekkingsCard', value: 'trekkingsCard' },
				{ label: 'PackagesCard', value: 'packagesCard' },
				{ label: 'TestimonialCard', value: 'testimonialCard' },
				{ label: 'BlogCard', value: 'blogCard' },
			],
			admin: {
				condition: (_, siblingData) => {
					if (siblingData?.populateBy === 'collection') {
						return siblingData?.collection !== 'none'
					}
					return siblingData?.selectedItems?.length > 0
				},
			},
		},

		{
			name: 'columns',
			type: 'select',
			defaultValue: '3',
			options: [
				{ label: '2 Columns', value: '2' },
				{ label: '3 Columns', value: '3' },
				{ label: '4 Columns', value: '4' },
				{ label: '5 Columns', value: '5' },
			],
		},

		{
			name: 'enableLink',
			type: 'checkbox',
			defaultValue: false,
			admin: {
				condition: (_, siblingData) => siblingData?.cards !== 'none',
			},
		},
		link({
			appearances: false,
			overrides: {
				admin: {
					condition: (_data, siblingData) => {
						return Boolean(siblingData?.enableLink)
					},
				},
			},
		}),
	],
}
