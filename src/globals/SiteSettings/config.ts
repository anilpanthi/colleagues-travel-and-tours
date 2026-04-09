import type { GlobalConfig } from 'payload'
import { revalidateSiteSettings } from './hooks/revalidateSiteSettings'
import { link } from '@/fields/link'
import { lucideIcon } from '@/fields/lucideIcon'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Company Details',
          fields: [
            {
              name: 'address',
              type: 'text',
              label: 'Address',
              required: false,
              admin: {
                placeholder: 'e.g., Nursing Chowk, Thamel, Kathmandu, Nepal',
              },
            },
            {
              name: 'map',
              type: 'textarea',
              label: 'Map (OpenStreetMap Embed)',
              admin: {
                description: 'Paste the OpenStreetMap iframe embed code here.',
              },
            },
            {
              name: 'contactNumbers',
              type: 'array',
              label: 'Contact Information (Phone Numbers)',
              fields: [
                {
                  name: 'number',
                  type: 'text',
                  label: 'Phone Number',
                  required: false,
                },
              ],
            },
            {
              name: 'emailAddresses',
              type: 'array',
              label: 'Email Addresses',
              fields: [
                {
                  name: 'email',
                  type: 'email',
                  label: 'Email Address',
                  required: false,
                },
              ],
            },
          ],
        },
        {
          label: 'Brand',
          fields: [
            {
              type: 'group',
              name: 'logos',
              label: 'Brand Logos',
              admin: {
                description: 'Manage light and dark theme logos',
                style: {
                  width: '100%',
                  alignItems: 'center',
                },
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'logoLight',
                      label: 'Logo (Light Theme)',
                      type: 'upload',
                      relationTo: 'media',
                      admin: {
                        description: 'For light backgrounds',
                        width: '50%',
                      },
                    },
                    {
                      name: 'logoDark',
                      label: 'Logo (Dark Theme)',
                      type: 'upload',
                      relationTo: 'media',
                      admin: {
                        description: 'For dark backgrounds',
                        width: '50%',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Header',
          fields: [
            {
              name: 'mainNavigation',
              label: 'Main Navigation',
              type: 'relationship',
              relationTo: 'navigation',
              required: false,
              admin: {
                description: 'Select the main navigation menu to handle the header navigation',
                style: {
                  maxWidth: '500px',
                },
              },
            },
          ],
        },
        {
          label: 'Footer',
          fields: [
            {
              name: 'footerColumns',
              label: 'Footer Columns',
              type: 'array',
              minRows: 1,
              maxRows: 4,
              labels: {
                singular: 'Column',
                plural: 'Columns',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'title',
                      type: 'text',
                      required: false,
                      label: 'Column Title',
                      admin: {
                        width: '50%',
                      },
                    },
                    {
                      name: 'type',
                      type: 'select',
                      defaultValue: 'nav',
                      options: [
                        { label: 'Brand & About', value: 'brand' },
                        { label: 'Navigation Links', value: 'nav' },
                        { label: 'Contact Info', value: 'contact' },
                      ],
                      required: false,
                      admin: {
                        width: '50%',
                      },
                    },
                  ],
                },
                {
                  name: 'brandLogo',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Brand Logo',
                  admin: {
                    condition: (_, siblingData) => siblingData?.type === 'brand',
                  },
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Description',
                  admin: {
                    condition: (_, siblingData) => siblingData?.type === 'brand',
                    description: 'Text to display below the logo in this column',
                  },
                },
                {
                  name: 'socialLinks',
                  type: 'array',
                  label: 'Social Media Links',
                  admin: {
                    condition: (_, siblingData) => siblingData?.type === 'brand',
                  },
                  fields: [
                    lucideIcon,
                    {
                      name: 'url',
                      type: 'text',
                      required: false,
                      label: 'URL',
                    },
                  ],
                },
                {
                  name: 'navItems',
                  type: 'array',
                  label: 'Links',
                  admin: {
                    condition: (_, siblingData) => siblingData?.type === 'nav',
                  },
                  fields: [
                    link({
                      appearances: false,
                    }),
                  ],
                },
                {
                  name: 'contactInfo',
                  type: 'group',
                  label: 'Contact Information',
                  admin: {
                    condition: (_, siblingData) => siblingData?.type === 'contact',
                  },
                  fields: [
                    {
                      name: 'address',
                      type: 'text',
                      label: 'Address',
                    },
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'phone',
                          type: 'text',
                          label: 'Phone Number',
                          admin: {
                            width: '50%',
                          },
                        },
                        {
                          name: 'email',
                          type: 'text',
                          label: 'Email Address',
                          admin: {
                            width: '50%',
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              name: 'footerBottom',
              type: 'group',
              label: 'Footer Bottom',
              fields: [
                {
                  name: 'copyright',
                  type: 'text',
                  label: 'Copyright Text',
                  defaultValue: '© 2025 Colleagues Travel & Tour. All rights reserved.',
                },
                {
                  name: 'legalLinks',
                  type: 'array',
                  label: 'Legal Links',
                  fields: [
                    link({
                      appearances: false,
                    }),
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Social',
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
                      required: false,
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
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateSiteSettings],
  },
}
