import type { Block } from 'payload'
import { lucideIcon } from '@/fields/lucideIcon'

export const WhyUs: Block = {
	slug: 'whyUs',
	interfaceName: 'WhyUsBlock',
	fields: [
		{
			name: 'features',
			type: 'array',
			label: 'Features',
			minRows: 1,
			maxRows: 6,
			fields: [
				lucideIcon,
				{
					name: 'title',
					type: 'text',
					required: true,
				},
				{
					name: 'description',
					type: 'textarea',
					required: true,
				},
			],
		},
	],
}
