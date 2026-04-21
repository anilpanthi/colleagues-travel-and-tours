import type { Block } from 'payload'

export const OurTeam: Block = {
  slug: 'ourTeam',
  interfaceName: 'OurTeamBlock',
  labels: {
    singular: 'Our Team',
    plural: 'Our Team',
  },
  fields: [
    {
      name: 'members',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'profilePicture',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'role',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}
