import type { Field } from 'payload'

export const lucideIcon: Field = {
	name: 'icon',
	type: 'text',
	admin: {
		components: {
			Field: '@/components/LucideIconPicker/index#default',
		},
	},
}
