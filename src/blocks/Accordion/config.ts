import type { Block } from 'payload'

export const Accordion: Block = {
	slug: 'accordionBlock',
	interfaceName: 'AccordionBlock',
	fields: [
		{
			name: 'items',
			type: 'array',
			label: 'Accordion Items',
			minRows: 1,
			fields: [
				{
					name: 'title',
					type: 'text',
				},
				{
					name: 'heading',
					type: 'text',
				},
				{
					name: 'details',
					type: 'textarea',
				},
			],
		},
	],
}
