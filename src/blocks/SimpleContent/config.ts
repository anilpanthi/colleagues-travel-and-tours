import type { Block } from 'payload'

export const SimpleContent: Block = {
  slug: 'simplecontent',
  interfaceName: 'SimpleContentBlock',
  fields: [
    {
      name: 'content',
      type: 'richText',
    },
  ],
}
