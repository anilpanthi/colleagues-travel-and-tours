import type { Block } from 'payload'

export const Activities: Block = {
	slug: 'activities_block',
	interfaceName: 'ActivitiesBlock',
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
			name: 'selectedActivities',
			type: 'relationship',
			relationTo: 'activities',
			hasMany: true,
		},
	],
}
