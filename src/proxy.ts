import { NextResponse, type NextRequest } from 'next/server'

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

  return !accept.includes('text/html')
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

  if (!requestHost) {
    return NextResponse.next()
  }

  if (canonicalURL && requestHost !== canonicalURL.host) {
    redirectURL.host = canonicalURL.host
    shouldRedirect = true
  } else if (!canonicalURL && /^www\./i.test(requestHost)) {
    redirectURL.host = getNonWWWHost(requestHost)
    shouldRedirect = true
  }

  if (canonicalURL && requestProtocol !== canonicalURL.protocol) {
    redirectURL.protocol = canonicalURL.protocol
    shouldRedirect = true
  }

  if (redirectURL.pathname !== '/' && redirectURL.pathname.endsWith('/')) {
    redirectURL.pathname = redirectURL.pathname.replace(/\/+$/, '')
    shouldRedirect = true
  }

  if (!shouldRedirect) {
    return NextResponse.next()
  }

  return NextResponse.redirect(redirectURL, 308)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|site.webmanifest|sw.js|media/|api/).*)'],
}
