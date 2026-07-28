export type LlmsDocument = {
  description?: string | null
  slug?: string | null
  title?: string | null
}

export type LlmsTextInput = {
  activities: LlmsDocument[]
  baseURL: string
  categories: LlmsDocument[]
  packages: LlmsDocument[]
  pages: LlmsDocument[]
  posts: LlmsDocument[]
}

type LinkOptions = {
  description: string
  pathPrefix?: string
}

const collapseWhitespace = (value: string) => value.replace(/\s+/g, ' ').trim()

const escapeMarkdownLabel = (value: string) =>
  collapseWhitespace(value).replace(/([\\[\]])/g, '\\$1')

const normalizeDescription = (value: string) => collapseWhitespace(value)

const createURL = (baseURL: string, path: string) => {
  const normalizedBaseURL = `${baseURL.replace(/\/+$/, '')}/`
  const normalizedPath = path.replace(/^\/+/, '')

  return new URL(`/${normalizedPath}`, normalizedBaseURL).toString()
}

const createDocumentLinks = (
  documents: LlmsDocument[],
  baseURL: string,
  { description, pathPrefix = '' }: LinkOptions,
) =>
  documents
    .filter((document): document is LlmsDocument & { slug: string; title: string } =>
      Boolean(document.slug?.trim() && document.title?.trim()),
    )
    .map((document) => {
      const path = [pathPrefix, document.slug].filter(Boolean).join('/')
      const linkDescription = document.description?.trim() || description

      return `- [${escapeMarkdownLabel(document.title)}](${createURL(baseURL, path)}): ${normalizeDescription(linkDescription)}`
    })
    .join('\n')

const createSection = (heading: string, links: string) => (links ? `## ${heading}\n\n${links}` : '')

export const generateLlmsText = ({
  activities,
  baseURL,
  categories,
  packages,
  pages,
  posts,
}: LlmsTextInput) => {
  const coreLinks = [
    `- [Home](${createURL(baseURL, '')}): Overview of Colleagues Travel and Tours and featured Nepal trips.`,
    `- [Explore trips](${createURL(baseURL, 'explore')}): Search and filter available travel packages.`,
    `- [All travel packages](${createURL(baseURL, 'packages')}): Browse trekking, cultural, wildlife, and adventure packages.`,
    `- [Activities and experiences](${createURL(baseURL, 'activities')}): Browse Nepal travel experiences by activity.`,
    `- [Travel guides](${createURL(baseURL, 'posts')}): Practical Nepal travel articles, trekking advice, and destination guides.`,
    `- [Contact](${createURL(baseURL, 'contact-us')}): Contact the Kathmandu-based travel team for trip planning and booking questions.`,
  ].join('\n')

  const pageLinks = createDocumentLinks(
    pages.filter(({ slug }) => slug !== 'home' && slug !== 'contact-us'),
    baseURL,
    {
      description: 'Official information from Colleagues Travel and Tours.',
    },
  )

  const packageLinks = createDocumentLinks(packages, baseURL, {
    description: 'Trip overview, itinerary, inclusions, and booking information.',
  })

  const activityLinks = createDocumentLinks(activities, baseURL, {
    description: 'Activity overview and related travel packages.',
    pathPrefix: 'activities',
  })

  const postLinks = createDocumentLinks(posts, baseURL, {
    description: 'Nepal travel advice and planning information.',
    pathPrefix: 'posts',
  })

  const optionalLinks = [
    createDocumentLinks(categories, baseURL, {
      description: 'Browse travel articles in this category.',
      pathPrefix: 'categories',
    }),
    `- [XML sitemap](${createURL(baseURL, 'sitemap.xml')}): Complete, automatically updated index of public website URLs.`,
    `- [Robots policy](${createURL(baseURL, 'robots.txt')}): Crawler access rules for this website.`,
  ]
    .filter(Boolean)
    .join('\n')

  return [
    '# Colleagues Travel and Tours',
    '> A Kathmandu-based travel agency offering guided tours, trekking, cultural experiences, wildlife trips, and custom travel packages across Nepal.',
    'Use the linked pages as the authoritative source for current itineraries, availability, inclusions, exclusions, policies, and contact details. Package information may change; confirm booking-specific details directly with Colleagues Travel and Tours.',
    createSection('Start Here', coreLinks),
    createSection('Company and Information', pageLinks),
    createSection('Travel Packages', packageLinks),
    createSection('Activities and Experiences', activityLinks),
    createSection('Travel Guides', postLinks),
    createSection('Optional', optionalLinks),
  ]
    .filter(Boolean)
    .join('\n\n')
    .concat('\n')
}
