import { afterEach, describe, expect, it, vi } from 'vitest'

import { GET } from '@/app/(frontend)/agent-markdown-internal/route'
import { convertHTMLToMarkdown } from '@/utilities/markdownForAgents'
import { acceptsMarkdown, isHTMLPath, mergeVaryHeader } from '@/utilities/markdownNegotiation'

describe('Markdown for Agents', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('recognizes Markdown content negotiation without accepting q=0', () => {
    expect(acceptsMarkdown('text/markdown')).toBe(true)
    expect(acceptsMarkdown('text/html, text/markdown;q=0.8')).toBe(true)
    expect(acceptsMarkdown('text/markdown;q=0, text/html')).toBe(false)
    expect(acceptsMarkdown('text/markdown; q = 0')).toBe(false)
    expect(acceptsMarkdown('text/html')).toBe(false)
  })

  it('only negotiates HTML page paths', () => {
    expect(isHTMLPath('/everest-base-camp')).toBe(true)
    expect(isHTMLPath('/posts/packing-guide')).toBe(true)
    expect(isHTMLPath('/admin')).toBe(false)
    expect(isHTMLPath('/api/posts')).toBe(false)
    expect(isHTMLPath('/apple-touch-icon.png')).toBe(false)
  })

  it('converts main content while preserving metadata and structured data', () => {
    const conversion = convertHTMLToMarkdown(
      `<!doctype html>
      <html>
        <head>
          <title>Fallback title</title>
          <meta name="title" content="Everest Base Camp Trek">
          <meta name="description" content="A guided trek in Nepal.">
          <meta property="og:image" content="/media/everest.jpg">
          <script type="application/ld+json">{"@type":"TouristTrip","name":"Everest Base Camp"}</script>
        </head>
        <body>
          <header>Site navigation</header>
          <main>
            <h1>Everest Base Camp</h1>
            <p>Explore the <a href="/packages">available trips</a>.</p>
            <form><label>Email <input name="email"></label></form>
          </main>
          <footer>Site footer</footer>
        </body>
      </html>`,
      new URL('https://example.com/everest-base-camp'),
    )

    expect(conversion).not.toBeNull()
    expect(conversion?.markdown).toContain('title: "Everest Base Camp Trek"')
    expect(conversion?.markdown).toContain('image: "https://example.com/media/everest.jpg"')
    expect(conversion?.markdown).toContain('# Everest Base Camp')
    expect(conversion?.markdown).toContain('[available trips](https://example.com/packages)')
    expect(conversion?.markdown).toContain('"@type": "TouristTrip"')
    expect(conversion?.markdown).not.toContain('Site navigation')
    expect(conversion?.markdown).not.toContain('Site footer')
    expect(conversion?.markdown).not.toContain('Email')
    expect(conversion?.markdownTokens).toBeGreaterThan(0)
    expect(conversion?.originalTokens).toBeGreaterThan(conversion?.markdownTokens || 0)
  })

  it('adds Accept to Vary without duplicating it', () => {
    expect(mergeVaryHeader('Accept-Encoding', 'Accept')).toBe('Accept-Encoding, Accept')
    expect(mergeVaryHeader('accept, Accept-Encoding', 'Accept')).toBe('accept, Accept-Encoding')
  })

  it('returns the negotiated response headers and token estimates', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        '<html><head><meta name="title" content="About"></head><body><main><h1>About</h1><p>Travel with us.</p></main></body></html>',
        {
          headers: {
            'Cache-Control': 'public, max-age=60',
            'Content-Type': 'text/html; charset=utf-8',
            Vary: 'Accept-Encoding',
          },
        },
      ),
    )
    vi.stubGlobal('fetch', fetchMock)

    const response = await GET(
      new Request('https://example.com/agent-markdown-internal', {
        headers: {
          'x-agent-markdown-source': '/about-us',
        },
      }),
    )

    expect(fetchMock).toHaveBeenCalledWith(
      new URL('http://127.0.0.1:3000/about-us'),
      expect.objectContaining({
        cache: 'no-store',
        redirect: 'manual',
      }),
    )
    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toBe('text/markdown; charset=utf-8')
    expect(response.headers.get('vary')).toBe('Accept-Encoding, Accept')
    expect(response.headers.get('cache-control')).toBe('public, max-age=60')
    expect(Number(response.headers.get('x-markdown-tokens'))).toBeGreaterThan(0)
    expect(Number(response.headers.get('x-original-tokens'))).toBeGreaterThan(0)
    await expect(response.text()).resolves.toContain('# About')
  })
})
