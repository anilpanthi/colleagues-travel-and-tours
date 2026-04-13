import { getServerSideURL } from '@/utilities/getURL'

/**
 * Processes media resource URL to ensure proper formatting
 * @param url The original URL from the resource
 * @param cacheTag Optional cache tag to append to the URL
 * @returns Properly formatted URL with cache tag if provided
 */
export const getMediaUrl = (url: string | null | undefined, cacheTag?: string | null): string => {
  if (!url) return ''

  if (cacheTag && cacheTag !== '') {
    cacheTag = encodeURIComponent(cacheTag)
  }

  // Convert absolute internal URLs to relative paths (best for next/image)
  // We use getServerSideURL consistently to avoid hydration mismatches
  const serverUrl = getServerSideURL()
  if (serverUrl && url.startsWith(serverUrl)) {
    url = url.substring(serverUrl.length)
  }

  // Check if URL still has http/https protocol (external URLs)
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return cacheTag ? `${url}?${cacheTag}` : url
  }

  // Return formatted relative path
  return cacheTag ? `${url}?${cacheTag}` : `${url}`
}
