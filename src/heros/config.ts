import type { Field } from 'payload'

import {
	FixedToolbarFeature,
	HeadingFeature,
	InlineToolbarFeature,
	lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '@/fields/linkGroup'
import { lucideIcon } from '@/fields/lucideIcon'

export const hero: Field = {
	name: 'hero',
	type: 'group',
	fields: [
		{
			name: 'type',
			type: 'select',
			defaultValue: 'none',
			label: 'Type',
			options: [
				{
					label: 'None',
					value: 'none',
				},
				{
					label: 'High Impact',
					value: 'highImpact',
				},
				{
					label: 'Medium Impact',
					value: 'mediumImpact',
				},
				{
					label: 'Low Impact',
					value: 'lowImpact',
				},
			],
			admin: {
				description:
					'High: Full Hero with Video Background | Medium: BreadCrumbs with Image Background | Low: BreadCrumbs Only',
			},
			required: true,
		},
		{
			name: 'backgroundVideo',
			label: 'Upload Background Media',
			type: 'upload',
			admin: {
				condition: (_, { type } = {}) => type === 'highImpact',
			},
			relationTo: 'media',
		},
		{
			name: 'tagline',
			type: 'text',
			admin: {
				condition: (_, { type } = {}) => type === 'highImpact',
			},
		},
		{
			name: 'title',
			type: 'text',
			admin: {
				condition: (_, { type } = {}) => type === 'highImpact',
			},
		},
		{
			name: 'subtitle',
			type: 'text',
			admin: {
				condition: (_, { type } = {}) => type === 'highImpact',
			},
		},
		{
			name: 'description',
			type: 'richText',
			admin: {
				condition: (_, { type } = {}) => type === 'highImpact',
			},
			editor: lexicalEditor({
				features: ({ rootFeatures }) => {
					return [
						...rootFeatures,
						HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
						FixedToolbarFeature(),
						InlineToolbarFeature(),
					]
				},
			}),
		},
		linkGroup({
			overrides: {
				admin: {
					condition: (_, { type } = {}) => ['highImpact'].includes(type),
				},
				maxRows: 2,
			},
		}),
		{
			name: 'features',
			type: 'array',
			admin: {
				condition: (_, { type } = {}) => type === 'highImpact',
			},
			maxRows: 3,
			fields: [
				lucideIcon,
				{
					name: 'title',
					type: 'text',
				},
				{
					name: 'description',
					type: 'text',
				},
			],
		},
		{
			name: 'media',
			type: 'upload',
			admin: {
				condition: (_, { type } = {}) => ['mediumImpact'].includes(type),
			},
			relationTo: 'media',
		},
	],
}
