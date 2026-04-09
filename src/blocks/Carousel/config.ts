import type { Block } from 'payload'

import { link } from '@/fields/link'

const collections = ['activities', 'packages', 'posts', 'testimonials'] as const

export const Carousel: Block = {
    slug: 'carousel',
    interfaceName: 'CarouselBlock',
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