/**
 * Generates a URL path for a given collection and slug.
 * 
 * Handles special cases like the 'home' slug being mapped to '/'.
 * 
 * @param relationTo - The collection slug (e.g., 'pages', 'posts', 'packages').
 * @param slug - The document slug.
 * @returns The generated URL path.
 */
export const generatePath = (relationTo: string, slug?: string | null) => {
  if (!slug) return '#'

  // Special case for home page
  if (relationTo === 'pages' && slug === 'home') {
    return '/'
  }

  // Define collections that are at the root level (no prefix)
  const rootCollections = ['pages', 'packages']

  if (rootCollections.includes(relationTo)) {
    return `/${slug}`
  }

  // For other collections, prefix with the collection name
  return `/${relationTo}/${slug}`
}
