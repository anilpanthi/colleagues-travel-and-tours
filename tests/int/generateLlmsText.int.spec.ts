import { describe, expect, it } from 'vitest'

import { generateLlmsText } from '@/utilities/generateLlmsText'

describe('llms.txt generator', () => {
  it('creates a spec-style Markdown index for published site content', () => {
    const result = generateLlmsText({
      activities: [{ slug: 'trekking', title: 'Trekking & Hiking' }],
      baseURL: 'https://example.com/',
      categories: [{ slug: 'guides', title: 'Travel Guides' }],
      packages: [
        {
          description: 'A guided Himalayan trek.\nIncludes a detailed itinerary.',
          slug: 'everest-base-camp',
          title: 'Everest [Base Camp]',
        },
      ],
      pages: [
        { slug: 'home', title: 'Home' },
        { slug: 'about-us', title: 'About Us' },
      ],
      posts: [{ slug: 'packing-guide', title: 'Nepal Packing Guide' }],
    })

    expect(result).toMatch(/^# Colleagues Travel and Tours\n\n>/)
    expect(result).toContain('## Travel Packages')
    expect(result).toContain(
      '- [Everest \\[Base Camp\\]](https://example.com/everest-base-camp): A guided Himalayan trek. Includes a detailed itinerary.',
    )
    expect(result).toContain(
      '- [Trekking & Hiking](https://example.com/activities/trekking): Activity overview and related travel packages.',
    )
    expect(result).toContain(
      '- [Nepal Packing Guide](https://example.com/posts/packing-guide): Nepal travel advice and planning information.',
    )
    expect(result).not.toContain('[Home](https://example.com/home)')
    expect(result.endsWith('\n')).toBe(true)
  })

  it('omits documents without a usable title or slug', () => {
    const result = generateLlmsText({
      activities: [],
      baseURL: 'https://example.com',
      categories: [],
      packages: [
        { slug: null, title: 'Missing slug' },
        { slug: 'missing-title', title: '  ' },
      ],
      pages: [],
      posts: [],
    })

    expect(result).not.toContain('## Travel Packages')
    expect(result).not.toContain('Missing slug')
    expect(result).not.toContain('missing-title')
  })
})
