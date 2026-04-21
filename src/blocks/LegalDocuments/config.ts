import type { Block } from 'payload'

export const LegalDocuments: Block = {
  slug: 'legalDocuments',
  interfaceName: 'LegalDocumentsBlock',
  fields: [

    {
      name: 'documents',
      type: 'array',
      label: 'Documents',
      minRows: 1,
      fields: [
        {
          name: 'document',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Document Image',
        },
        {
          name: 'label',
          type: 'text',
          label: 'Document Label',
        },
      ],
    },
  ],
}
