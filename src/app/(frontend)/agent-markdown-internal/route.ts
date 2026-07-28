import { convertHTMLToMarkdown } from '@/utilities/markdownForAgents'
import { mergeVaryHeader } from '@/utilities/markdownNegotiation'

export const dynamic = 'force-dynamic'

const BODY_SPECIFIC_HEADERS = new Set([
  'content-encoding',
  'content-length',
  'content-range',
  'content-type',
  'etag',
  'last-modified',
  'transfer-encoding',
])

const getSourceURL = (request: Request) => {
  const sourcePath = request.headers.get('x-agent-markdown-source')
  if (!sourcePath?.startsWith('/') || sourcePath.startsWith('//')) return null

  const requestURL = new URL(request.url)
  const sourceURL = new URL(sourcePath, requestURL)

  return sourceURL.origin === requestURL.origin ? sourceURL : null
}

const createUpstreamHeaders = (request: Request) => {
  const headers = new Headers({
    Accept: 'text/html',
    'x-agent-markdown-bypass': '1',
  })

  for (const name of ['accept-language', 'cookie', 'user-agent']) {
    const value = request.headers.get(name)
    if (value) headers.set(name, value)
  }

  return headers
}

const createResponseHeaders = (upstreamHeaders: Headers) => {
  const headers = new Headers(upstreamHeaders)

  BODY_SPECIFIC_HEADERS.forEach((name) => headers.delete(name))
  headers.set('Content-Type', 'text/markdown; charset=utf-8')
  headers.set('Vary', mergeVaryHeader(headers.get('Vary'), 'Accept'))

  return headers
}

const markdownError = (message: string, status: number) =>
  new Response(`# ${message}\n`, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      Vary: 'Accept',
    },
    status,
  })

export async function GET(request: Request) {
  const sourceURL = getSourceURL(request)

  if (!sourceURL) return markdownError('Not found', 404)

  let upstreamResponse: Response

  try {
    upstreamResponse = await fetch(sourceURL, {
      cache: 'no-store',
      headers: createUpstreamHeaders(request),
      redirect: 'manual',
    })
  } catch {
    return markdownError('Unable to render this page', 502)
  }

  if (upstreamResponse.status >= 300 && upstreamResponse.status < 400) {
    const location = upstreamResponse.headers.get('location')

    return new Response(null, {
      headers: location ? { Location: location, Vary: 'Accept' } : { Vary: 'Accept' },
      status: upstreamResponse.status,
    })
  }

  const contentType = upstreamResponse.headers.get('content-type') || ''

  if (!contentType.toLowerCase().includes('text/html')) {
    return markdownError('Markdown is not available for this resource', 406)
  }

  const html = await upstreamResponse.text()
  const conversion = convertHTMLToMarkdown(html, sourceURL)

  if (!conversion) {
    return markdownError('Page is too large to convert to Markdown', 413)
  }

  const headers = createResponseHeaders(upstreamResponse.headers)
  headers.set('x-markdown-tokens', String(conversion.markdownTokens))
  headers.set('x-original-tokens', String(conversion.originalTokens))

  return new Response(conversion.markdown, {
    headers,
    status: upstreamResponse.status,
    statusText: upstreamResponse.statusText,
  })
}
