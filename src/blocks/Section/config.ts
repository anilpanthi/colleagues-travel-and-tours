import type { Block } from 'payload'
import { Cards } from '../Cards/config'
import { Carousel } from '../Carousel/config'
import { WhyUs } from '../WhyUs/config'


export const Section: Block = {
	slug: 'section',
	interfaceName: 'SectionBlock',
	fields: [
		{
			name: 'subHeading',
			type: 'text',
		},
		{
			name: 'heading',
			type: 'text',
		},
		{
			name: 'description',
			type: 'textarea',
		},
		{
			name: 'backgroundType',
			type: 'radio',
			defaultValue: 'none',
			options: [
				{ label: 'None', value: 'none' },
				{ label: 'Background Color', value: 'color' },
				{ label: 'Background Image', value: 'image' },
			],
		},
		{
			name: 'backgroundColor',
			type: 'text',
			admin: {
				condition: (_, { backgroundType }) => backgroundType === 'color',
			},
		},
		{
			name: 'backgroundImage',
			type: 'upload',
			relationTo: 'media',
			admin: {
				condition: (_, { backgroundType }) => backgroundType === 'image',
			},
		},
		{
			name: 'blocks',
			type: 'blocks',
			blocks: [Cards, Carousel, WhyUs],
			minRows: 1,
			maxRows: 1,
		},
	],
}
