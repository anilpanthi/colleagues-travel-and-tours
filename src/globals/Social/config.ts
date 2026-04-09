import type { GlobalConfig } from 'payload'

// import { link } from '@/fields/link'
// import { revalidateFooter } from './hooks/revalidateFooter'

export const Social: GlobalConfig = {
  slug: 'social',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'socialLinks',
      label: 'Social Media Links',
      type: 'array',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
              admin: {
                width: '50%',
              },
            },
            {
              name: 'icon',
              type: 'upload',
              relationTo: 'media',
              required: true,
              label: 'Icon',
              admin: {
                width: '50%',
              },
            },
          ],
        },
        {
          name: 'url',
          label: 'URL',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
  hooks: {
    afterChange: [],
  },
}
