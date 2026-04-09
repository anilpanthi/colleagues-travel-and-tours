import type { CollectionConfig } from 'payload'
import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'
import { revalidateDelete, revalidateTestimonials } from './hooks/revalidateTestimonials'

export const Testimonials: CollectionConfig = {
	slug: 'testimonials',
	hooks: {
		afterChange: [revalidateTestimonials],
		afterDelete: [revalidateDelete],
	},
	access: {
		create: authenticated,
		delete: authenticated,
		read: anyone,
		update: authenticated,
	},
	admin: {
		useAsTitle: 'author',
		defaultColumns: ['author', 'position', 'updatedAt'],
		group: 'Products',
	},
	fields: [
		{
			name: 'quote',
			type: 'richText',
			required: true,
		},
		{
			name: 'author',
			type: 'text',
			required: true,
		},
		{
			name: 'rating',
			type: 'number',
			required: true,
		},
		{
			name: 'avatar',
			type: 'upload',
			relationTo: 'media',
		},
		{
			name: 'relatedPackages',
			type: 'relationship',
			relationTo: 'packages',
			hasMany: true,
		},
	],
	timestamps: true,
}
