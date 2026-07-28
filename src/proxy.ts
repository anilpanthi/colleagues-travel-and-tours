import { NextResponse, type NextRequest } from 'next/server'

import { acceptsMarkdown, isHTMLPath } from '@/utilities/markdownNegotiation'

const getCanonicalURL = () => {
  const serverURL = process.env.NEXT_PUBLIC_SERVER_URL

  if (!serverURL) return null

  try {
    const url = new URL(serverURL)

    if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
      return null
    }

    url.hostname = url.hostname.replace(/^www\./i, '')

    return url
  } catch {
    return null
  }
}

const getForwardedValue = (value: string | null) => value?.split(',')[0]?.trim() || null

const getRequestHost = (request: NextRequest) =>
  getForwardedValue(request.headers.get('x-forwarded-host')) || request.headers.get('host')

const getNonWWWHost = (host: string) => host.replace(/^www\./i, '')

const getRequestProtocol = (request: NextRequest) => {
  const forwardedProtocol = getForwardedValue(request.headers.get('x-forwarded-proto'))

  return forwardedProtocol ? `${forwardedProtocol}:` : request.nextUrl.protocol
}

const shouldSkipCanonicalRedirect = (request: NextRequest) => {
  const { pathname } = request.nextUrl
  const accept = request.headers.get('accept') || ''
  const secFetchDest = request.headers.get('sec-fetch-dest')

  if (request.headers.get('x-agent-markdown-bypass') === '1') {
    return true
  }

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return true
  }

  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/media/') ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname === '/site.webmanifest' ||
    pathname === '/sw.js'
  ) {
    return true
  }

  if (secFetchDest && secFetchDest !== 'document' && secFetchDest !== 'empty') {
    return true
  }

  return !accept.toLowerCase().includes('text/html') && !acceptsMarkdown(accept)
}

const shouldServeMarkdown = (request: NextRequest) => {
  if (request.headers.get('x-agent-markdown-bypass') === '1') return false
  if (request.method !== 'GET' && request.method !== 'HEAD') return false

  return isHTMLPath(request.nextUrl.pathname) && acceptsMarkdown(request.headers.get('accept'))
}

const rewriteToMarkdown = (request: NextRequest) => {
  const rewriteURL = request.nextUrl.clone()
  const requestHeaders = new Headers(request.headers)

  requestHeaders.set(
    'x-agent-markdown-source',
    `${request.nextUrl.pathname}${request.nextUrl.search}`,
  )
  rewriteURL.pathname = '/agent-markdown-internal'
  rewriteURL.search = ''

  return NextResponse.rewrite(rewriteURL, {
    request: {
      headers: requestHeaders,
    },
  })
}

export function proxy(request: NextRequest) {
  if (shouldSkipCanonicalRedirect(request)) {
    return NextResponse.next()
  }

  const canonicalURL = getCanonicalURL()
  const requestURL = request.nextUrl
  const requestHost = getRequestHost(request)
  const requestProtocol = getRequestProtocol(request)
  const redirectURL = new URL(requestURL)
  let shouldRedirect = false

  if (requestHost) {
    if (canonicalURL && requestHost !== canonicalURL.host) {
      redirectURL.host = canonicalURL.host
      shouldRedirect = true
    } else if (!canonicalURL && /^www\./i.test(requestHost)) {
      redirectURL.host = getNonWWWHost(requestHost)
      shouldRedirect = true
    }
  }

  if (canonicalURL && requestProtocol !== canonicalURL.protocol) {
    redirectURL.protocol = canonicalURL.protocol
    shouldRedirect = true
  }

  if (redirectURL.pathname !== '/' && redirectURL.pathname.endsWith('/')) {
    redirectURL.pathname = redirectURL.pathname.replace(/\/+$/, '')
    shouldRedirect = true
  }

  if (shouldRedirect) return NextResponse.redirect(redirectURL, 308)
  if (shouldServeMarkdown(request)) return rewriteToMarkdown(request)

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!agent-markdown-internal|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|site.webmanifest|sw.js|media/|api/).*)',
  ],
}
