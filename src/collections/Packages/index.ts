import type { CollectionConfig } from 'payload'

import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  UnorderedListFeature,
  OrderedListFeature,
  AlignFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { Banner } from '../../blocks/Banner/config'
import { Code } from '../../blocks/Code/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { populateAuthors } from '../Posts/hooks/populateAuthors'
import { hero } from '@/heros/config'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { slugField } from 'payload'
import { revalidateDelete, revalidatePackages } from './hooks/revalidatePackages'

export const Packages: CollectionConfig<'packages'> = {
  slug: 'packages',
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },

  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'packages',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'packages',
        req,
      }),
    useAsTitle: 'title',
    group: 'Products',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [hero],
          label: 'Hero',
        },
        {
          label: 'Gallery',
          fields: [
            {
              name: 'gallery',
              type: 'array',
              label: 'Package Gallery',
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
              ],
            },
          ],
        },
        {
          label: 'Overview',
          fields: [
            {
              name: 'overview',
              type: 'richText',
              label: 'Package Overview',
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                    BlocksFeature({ blocks: [Banner, Code, MediaBlock] }),
                    FixedToolbarFeature(),
                    InlineToolbarFeature(),
                    HorizontalRuleFeature(),
                    UnorderedListFeature(),
                    OrderedListFeature(),
                    AlignFeature(),
                  ]
                },
              }),
              required: false,
            },
          ],
        },
        {
          label: 'Highlights',
          fields: [
            {
              name: 'packageFacts',
              type: 'richText',
              label: 'Trip Highlights',
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    FixedToolbarFeature(),
                    InlineToolbarFeature(),
                    UnorderedListFeature(),
                    OrderedListFeature(),
                  ]
                },
              }),
            },
          ],
        },
        {
          label: 'Itineraries',
          fields: [
            {
              name: 'detailedItinerary',
              type: 'array',
              interfaceName: 'DetailedItinerary',
              label: 'Detailed Itinerary',
              minRows: 1,
              admin: {
                components: {
                  RowLabel: '@/blocks/Accordion/RowLabel',
                },
              },
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
                  type: 'richText',
                  editor: lexicalEditor({
                    features: ({ rootFeatures }) => {
                      return [
                        ...rootFeatures,
                        FixedToolbarFeature(),
                        InlineToolbarFeature(),
                        UnorderedListFeature(),
                        OrderedListFeature(),
                      ]
                    },
                  }),
                },
              ],
            },
          ],
        },

        {
          label: 'Inc/Exc',
          fields: [
            {
              name: 'includes',
              type: 'richText',
              label: 'Package Includes',
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    FixedToolbarFeature(),
                    InlineToolbarFeature(),
                    UnorderedListFeature(),
                    OrderedListFeature(),
                  ]
                },
              }),
            },
            {
              name: 'excludes',
              type: 'richText',
              label: 'Package Excludes',
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    FixedToolbarFeature(),
                    InlineToolbarFeature(),
                    UnorderedListFeature(),
                    OrderedListFeature(),
                  ]
                },
              }),
            },
          ],
        },
        {
          label: 'Map',
          fields: [
            {
              name: 'mapIframe',
              type: 'textarea',
              label: 'Map Embed',
            },
          ],
        },

        {
          label: 'FAQs',
          fields: [
            {
              name: 'faqs',
              type: 'array',
              interfaceName: 'FAQs',
              label: 'FAQs',
              minRows: 1,
              admin: {
                components: {
                  RowLabel: '@/blocks/Accordion/RowLabel',
                },
              },
              fields: [
                {
                  name: 'question',
                  type: 'text',
                },
                {
                  name: 'answer',
                  type: 'richText',
                  editor: lexicalEditor({
                    features: ({ rootFeatures }) => {
                      return [
                        ...rootFeatures,
                        FixedToolbarFeature(),
                        InlineToolbarFeature(),
                        UnorderedListFeature(),
                        OrderedListFeature(),
                      ]
                    },
                  }),
                },
              ],
            },
          ],
        },

        {
          label: 'Msc',
          fields: [
            {
              name: 'miscellaneous',
              type: 'richText',
              label: 'Miscellaneous Content',
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                    FixedToolbarFeature(),
                    InlineToolbarFeature(),
                    UnorderedListFeature(),
                    OrderedListFeature(),
                    HorizontalRuleFeature(),
                  ]
                },
              }),
            },
          ],
        },

        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),

            MetaDescriptionField({}),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    slugField(),
    {
      name: 'Activity',
      type: 'relationship',
      admin: {
        position: 'sidebar',
      },
      hasMany: true,
      relationTo: 'activities',
      label: 'Activity',
    },
    {
      type: 'collapsible',
      label: 'Trip Facts',
      admin: {
        position: 'sidebar',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'tripDuration',
          type: 'text',
          label: 'Trip Duration',
        },
        {
          name: 'tripGrade',
          type: 'select',
          label: 'Trip Grade',
          options: [
            { label: 'Easy', value: 'easy' },
            { label: 'Moderate', value: 'moderate' },
            { label: 'Difficult', value: 'difficult' },
            { label: 'Strenuous', value: 'strenuous' },
          ],
        },
        {
          name: 'bestSeason',
          type: 'text',
          label: 'Best Season',
        },
        {
          name: 'perDayHiking',
          type: 'text',
          label: 'Per Day Hiking',
        },
        {
          name: 'elevation',
          type: 'text',
          label: 'Elevation',
        },
        {
          name: 'accommodation',
          type: 'text',
          label: 'Accommodation',
        },
        {
          name: 'transportation',
          type: 'text',
          label: 'Transportation',
        },
        {
          name: 'customFacts',
          type: 'array',
          label: 'Custom Trip Facts',
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
            },
            {
              name: 'value',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Featured Image',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'price',
      type: 'number',
      label: 'Regular Price',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'salePrice',
      type: 'number',
      label: 'Sale Price',
      admin: {
        position: 'sidebar',
      },
    },

    {
      name: 'bookingForm',
      type: 'relationship',
      relationTo: 'forms',
      admin: {
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    afterChange: [revalidatePackages],
    afterRead: [populateAuthors],
    afterDelete: [revalidateDelete],
  },
  // versions: {
  //   drafts: {
  //     autosave: {
  //       interval: 100,
  //     },
  //     schedulePublish: true,
  //   },
  //   maxPerDoc: 50,
  // },
}
