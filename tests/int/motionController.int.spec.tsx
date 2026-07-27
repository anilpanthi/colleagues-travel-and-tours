import { cleanup, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { MotionController } from '@/components/Motion/MotionController'

type ObserverCallback = IntersectionObserverCallback

class IntersectionObserverMock implements IntersectionObserver {
  static callback: ObserverCallback
  static options: IntersectionObserverInit | undefined

  readonly root = null
  readonly rootMargin: string
  readonly thresholds: readonly number[]

  disconnect = vi.fn()
  observe = vi.fn()
  takeRecords = vi.fn(() => [])
  unobserve = vi.fn()

  constructor(callback: ObserverCallback, options?: IntersectionObserverInit) {
    IntersectionObserverMock.callback = callback
    IntersectionObserverMock.options = options
    this.rootMargin = options?.rootMargin ?? '0px'
    this.thresholds = Array.isArray(options?.threshold)
      ? options.threshold
      : [options?.threshold ?? 0]
  }
}

describe('MotionController', () => {
  beforeEach(() => {
    vi.stubGlobal('IntersectionObserver', IntersectionObserverMock)
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({
        addEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
        matches: false,
        media: '',
        onchange: null,
        removeEventListener: vi.fn(),
      })),
    )
  })

  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
  })

  it('starts revealing content before it enters the viewport', () => {
    render(
      <main className="main-content">
        <section>
          <h2>Adventurous Experiences</h2>
        </section>
        <MotionController />
      </main>,
    )

    expect(IntersectionObserverMock.options).toMatchObject({
      rootMargin: '0px 0px 10% 0px',
      threshold: 0.01,
    })
  })

  it('uses a catch-up animation for content reached during a fast scroll', () => {
    const { getByRole } = render(
      <main className="main-content">
        <section>
          <h2>Adventurous Experiences</h2>
        </section>
        <MotionController />
      </main>,
    )
    const heading = getByRole('heading', { name: 'Adventurous Experiences' })

    IntersectionObserverMock.callback(
      [
        {
          boundingClientRect: {
            bottom: 600,
            top: 300,
          },
          isIntersecting: false,
          rootBounds: {
            bottom: 800,
          },
          target: heading,
        } as unknown as IntersectionObserverEntry,
      ],
      new IntersectionObserverMock(IntersectionObserverMock.callback),
    )

    expect(heading.className).toContain('visible')
    expect(heading.className).toContain('catchUp')
    expect(heading.className).not.toContain('instant')
  })

  it('reveals completely skipped content instantly', () => {
    const { getByRole } = render(
      <main className="main-content">
        <section>
          <h2>Adventurous Experiences</h2>
        </section>
        <MotionController />
      </main>,
    )
    const heading = getByRole('heading', { name: 'Adventurous Experiences' })

    IntersectionObserverMock.callback(
      [
        {
          boundingClientRect: {
            bottom: -100,
            top: -300,
          },
          isIntersecting: false,
          rootBounds: {
            bottom: 800,
          },
          target: heading,
        } as unknown as IntersectionObserverEntry,
      ],
      new IntersectionObserverMock(IntersectionObserverMock.callback),
    )

    expect(heading.className).toContain('visible')
    expect(heading.className).toContain('instant')
  })
})
