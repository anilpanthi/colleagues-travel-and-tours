import { NodeHtmlMarkdown } from 'node-html-markdown'
import { parse } from 'node-html-parser'

const MAX_HTML_BYTES = 2_097_152

const REMOVED_CONTENT_SELECTORS = [
  'button',
  'canvas',
  'dialog',
  'footer',
  'form',
  'header',
  'iframe',
  'input',
  'nav',
  'noscript',
  'script',
  'select',
  'style',
  'svg',
  'template',
  'textarea',
  '[aria-hidden="true"]',
  '[hidden]',
]

const MARKDOWN_OPTIONS = {
  bulletMarker: '-',
  codeBlockStyle: 'fenced' as const,
  keepDataImages: false,
  maxConsecutiveNewlines: 2,
  useLinkReferenceDefinitions: false,
}

type MarkdownMetadata = {
  description?: string
  image?: string
  title?: string
}

export type MarkdownConversion = {
  markdown: string
  markdownTokens: number
  originalTokens: number
}

export const estimateTokens = (value: string) =>
  value.length === 0 ? 0 : Math.max(1, Math.ceil(value.length / 4))

const resolveURL = (value: string | undefined, sourceURL: URL) => {
  if (!value) return undefined

  try {
    return new URL(value, sourceURL).toString()
  } catch {
    return undefined
  }
}

const getMetaContent = (
  root: ReturnType<typeof parse>,
  name: string,
  propertyFallback?: string,
) => {
  const namedValue = root.querySelector(`meta[name="${name}"]`)?.getAttribute('content')?.trim()

  if (namedValue) return namedValue

  return propertyFallback
    ? root.querySelector(`meta[property="${propertyFallback}"]`)?.getAttribute('content')?.trim()
    : undefined
}

const getMetadata = (root: ReturnType<typeof parse>, sourceURL: URL): MarkdownMetadata => {
  const image = resolveURL(getMetaContent(root, 'image', 'og:image'), sourceURL)

  return {
    description: getMetaContent(root, 'description', 'og:description'),
    image,
    title:
      getMetaContent(root, 'title', 'og:title') ||
      root.querySelector('title')?.textContent.trim() ||
      undefined,
  }
}

const renderFrontmatter = (metadata: MarkdownMetadata) => {
  const values = Object.entries(metadata).filter((entry): entry is [string, string] =>
    Boolean(entry[1]),
  )

  if (values.length === 0) return ''

  return ['---', ...values.map(([key, value]) => `${key}: ${JSON.stringify(value)}`), '---'].join(
    '\n',
  )
}

const getJSONLD = (root: ReturnType<typeof parse>) =>
  root
    .querySelectorAll('script[type="application/ld+json"]')
    .map((script) => script.textContent.trim())
    .filter(Boolean)
    .map((value) => {
      try {
        return JSON.stringify(JSON.parse(value), null, 2)
      } catch {
        return value
      }
    })
    .join('\n')

const makeLinksAbsolute = (contentRoot: ReturnType<typeof parse>, sourceURL: URL) => {
  contentRoot.querySelectorAll('[href]').forEach((element) => {
    const href = element.getAttribute('href')

    if (!href || /^(?:data|javascript):/i.test(href)) {
      element.removeAttribute('href')
      return
    }

    const resolvedURL = resolveURL(href, sourceURL)
    if (resolvedURL) element.setAttribute('href', resolvedURL)
  })

  contentRoot.querySelectorAll('[src]').forEach((element) => {
    const src = element.getAttribute('src')

    if (!src || /^(?:data|javascript):/i.test(src)) {
      element.removeAttribute('src')
      return
    }

    const resolvedURL = resolveURL(src, sourceURL)
    if (resolvedURL) element.setAttribute('src', resolvedURL)
  })
}

export const convertHTMLToMarkdown = (html: string, sourceURL: URL): MarkdownConversion | null => {
  if (Buffer.byteLength(html, 'utf8') > MAX_HTML_BYTES) return null

  const root = parse(html)
  const metadata = getMetadata(root, sourceURL)
  const jsonLD = getJSONLD(root)
  const contentRoot = root.querySelector('main') || root.querySelector('body') || root

  REMOVED_CONTENT_SELECTORS.forEach((selector) => {
    contentRoot.querySelectorAll(selector).forEach((element) => element.remove())
  })

  makeLinksAbsolute(contentRoot, sourceURL)

  const bodyMarkdown = NodeHtmlMarkdown.translate(contentRoot.innerHTML, MARKDOWN_OPTIONS).trim()
  const frontmatter = renderFrontmatter(metadata)
  const structuredData = jsonLD ? `\`\`\`json\n${jsonLD}\n\`\`\`` : ''
  const markdown = [frontmatter, bodyMarkdown, structuredData]
    .filter(Boolean)
    .join('\n\n')
    .concat('\n')

  return {
    markdown,
    markdownTokens: estimateTokens(markdown),
    originalTokens: estimateTokens(html),
  }
}
