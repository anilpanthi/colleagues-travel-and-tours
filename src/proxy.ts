import { NextResponse, type NextRequest } from 'next/server'

const getCanonicalURL = () => {
  const serverURL = process.env.NEXT_PUBLIC_SERVER_URL

  if (!serverURL) return null

  try {
    const url = new URL(serverURL)

    if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
      return null
    }

    return url
  } catch {
    return null
  }
}

const getRequestProtocol = (request: NextRequest) => {
  const forwardedProtocol = request.headers.get('x-forwarded-proto')?.split(',')[0]?.trim()

  return forwardedProtocol ? `${forwardedProtocol}:` : request.nextUrl.protocol
}

export function proxy(request: NextRequest) {
  const canonicalURL = getCanonicalURL()

  if (!canonicalURL) {
    return NextResponse.next()
  }

  const requestURL = request.nextUrl
  const requestHost = request.headers.get('x-forwarded-host') || request.headers.get('host')
  const requestProtocol = getRequestProtocol(request)
  const redirectURL = new URL(requestURL)
  let shouldRedirect = false

  if (requestHost !== canonicalURL.host) {
    redirectURL.host = canonicalURL.host
    shouldRedirect = true
  }

  if (requestProtocol !== canonicalURL.protocol) {
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
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|media/).*)'],
}
