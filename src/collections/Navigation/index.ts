import { CollectionConfig } from 'payload'
import { revalidateDelete, revalidateNavigation } from './hooks/revalidateNavigation'

export const Navigation: CollectionConfig = {
	slug: 'navigation',
	hooks: {
		afterChange: [revalidateNavigation],
		afterDelete: [revalidateDelete],
	},
	labels: {
		singular: 'Navigation Menu',
		plural: 'Navigation Menus',
	},
	versions: false,
	admin: {
		description:
			'Manage navigation menus with support for simple links, single dropdowns, and multi-column mega menus.',
		useAsTitle: 'name',
		group: 'Appearance',
	},
	fields: [
		{
			name: 'name',
			type: 'text',
			required: true,
			admin: {
				description: 'Internal name for this menu (e.g., "Main Header Navigation")',
			},
		},
		{
			name: 'items',
			type: 'array',
			label: 'Menu Items',
			minRows: 1,
			labels: {
				singular: 'Menu Item',
				plural: 'Menu Items',
			},
			admin: {
				components: {
					RowLabel: '@/collections/Navigation/Labels/MenuItemRowLabel',
				},
			},
			fields: [
				{
					type: 'row',
					fields: [
						{
							name: 'label',
							type: 'text',
							required: true,
							admin: { width: '40%' },
						},
						{
							name: 'linkType',
							type: 'radio',
							defaultValue: 'internal',
							options: [
								{ label: 'Internal Link', value: 'internal' },
								{ label: 'External URL', value: 'external' },
							],
							admin: { width: '30%', layout: 'horizontal' },
						},
					],
				},
				{
					name: 'internalLink',
					type: 'relationship',
					relationTo: ['pages', 'packages', 'posts', 'categories', 'activities'],
					admin: {
						condition: (_, siblingData) => siblingData?.linkType === 'internal',
					},
				},
				{
					name: 'externalUrl',
					type: 'text',
					admin: {
						condition: (_, siblingData) => siblingData?.linkType === 'external',
						placeholder: 'https://example.com',
					},
				},
				{
					name: 'dropdownType',
					type: 'radio',
					defaultValue: 'none',
					options: [
						{ label: 'No Dropdown', value: 'none' },
						{ label: 'Simple Dropdown (single list)', value: 'simple' },
						{ label: 'Mega Menu (multi-column grid)', value: 'mega' },
					],
					admin: {
						description: 'Choose the type of dropdown for this menu item',
						layout: 'horizontal',
					},
				},
				// Simple Dropdown Links
				{
					name: 'simpleLinks',
					type: 'array',
					label: 'Simple Dropdown Links',
					minRows: 1,
					admin: {
						condition: (_, siblingData) => siblingData?.dropdownType === 'simple',
						components: {
							RowLabel: '@/collections/Navigation/Labels/SimpleLinkRowLabel',
						},
					},
					fields: [
						{
							type: 'row',
							fields: [
								{
									name: 'label',
									type: 'text',
									required: true,
									admin: { width: '40%' },
								},
								{
									name: 'linkType',
									type: 'radio',
									defaultValue: 'internal',
									options: [
										{ label: 'Internal', value: 'internal' },
										{ label: 'External', value: 'external' },
									],
									admin: { width: '60%', layout: 'horizontal' },
								},
							],
						},
						{
							name: 'internalLink',
							type: 'relationship',
							relationTo: ['pages', 'packages', 'posts', 'categories', 'activities'],
							admin: {
								condition: (_, siblingData) => siblingData?.linkType === 'internal',
							},
						},
						{
							name: 'externalUrl',
							type: 'text',
							admin: {
								condition: (_, siblingData) => siblingData?.linkType === 'external',
							},
						},
					],
				},
				// Mega Menu Columns
				{
					name: 'columns',
					type: 'array',
					minRows: 1,
					maxRows: 6,
					label: 'Mega Menu Columns',
					admin: {
						condition: (_, siblingData) => siblingData?.dropdownType === 'mega',
						components: {
							RowLabel: '@/collections/Navigation/Labels/ColumnRowLabel',
						},
					},
					fields: [
						{
							type: 'row',
							fields: [
								{
									name: 'title',
									type: 'text',
									required: true,
									admin: { width: '50%' },
								},
								{
									name: 'titleLinkType',
									type: 'radio',
									defaultValue: 'none',
									options: [
										{ label: 'No Link', value: 'none' },
										{ label: 'Internal', value: 'internal' },
										{ label: 'External', value: 'external' },
									],
									admin: { width: '50%', layout: 'horizontal' },
								},
							],
						},
						{
							name: 'titleInternalLink',
							type: 'relationship',
							relationTo: ['pages', 'packages', 'posts', 'categories', 'activities'],
							admin: {
								condition: (_, siblingData) => siblingData?.titleLinkType === 'internal',
							},
						},
						{
							name: 'titleExternalUrl',
							type: 'text',
							admin: {
								condition: (_, siblingData) => siblingData?.titleLinkType === 'external',
							},
						},
						{
							name: 'links',
							type: 'array',
							label: 'Column Links',
							fields: [
								{
									type: 'row',
									fields: [
										{
											name: 'label',
											type: 'text',
											required: true,
											admin: { width: '40%' },
										},
										{
											name: 'linkType',
											type: 'radio',
											defaultValue: 'internal',
											options: [
												{ label: 'Internal', value: 'internal' },
												{ label: 'External', value: 'external' },
											],
											admin: { width: '60%', layout: 'horizontal' },
										},
									],
								},
								{
									name: 'internalLink',
									type: 'relationship',
									relationTo: ['pages', 'packages', 'posts', 'categories', 'activities'],
									admin: {
										condition: (_, siblingData) => siblingData?.linkType === 'internal',
									},
								},
								{
									name: 'externalUrl',
									type: 'text',
									admin: {
										condition: (_, siblingData) => siblingData?.linkType === 'external',
									},
								},
							],
						},
					],
				},
			],
		},
	],
}
