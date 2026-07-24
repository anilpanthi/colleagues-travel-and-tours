import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { TawkWidget } from '@/components/ChatSupport/TawkWidget'

const initialInnerWidth = window.innerWidth

const removeTawkScript = () => {
  document.querySelectorAll('script[src^="https://embed.tawk.to/"]').forEach((script) => {
    script.remove()
  })
}

describe('Tawk chat widget', () => {
  afterEach(() => {
    cleanup()
    removeTawkScript()
    delete window.Tawk_API
    delete window.Tawk_LoadStart
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      value: initialInnerWidth,
    })
  })

  it('loads the standard Tawk embed above the mobile booking bar', () => {
    render(<TawkWidget propertyId="property-id" widgetId="widget-id" />)

    const script = document.querySelector<HTMLScriptElement>(
      'script[src^="https://embed.tawk.to/"]',
    )

    expect(script).not.toBeNull()
    expect(script?.id).toBe('tawk-chat-script')
    expect(script?.src).toBe('https://embed.tawk.to/property-id/widget-id')
    expect(script?.async).toBe(true)
    expect(window.Tawk_API).toEqual({
      customStyle: {
        visibility: {
          desktop: {
            position: 'br',
            xOffset: 0,
            yOffset: 120,
          },
          mobile: {
            position: 'br',
            xOffset: 0,
            yOffset: 120,
          },
        },
        zIndex: '2147483001 !important',
      },
    })
    expect(window.Tawk_LoadStart).toBeInstanceOf(Date)
  })

  it('leaves the desktop position unchanged above the site mobile breakpoint', () => {
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      value: 1280,
    })

    render(<TawkWidget propertyId="property-id" widgetId="widget-id" />)

    expect(window.Tawk_API?.customStyle).toEqual({
      visibility: {
        mobile: {
          position: 'br',
          xOffset: 0,
          yOffset: 120,
        },
      },
      zIndex: '2147483001 !important',
    })
  })

  it('does not insert a duplicate widget script', () => {
    const first = render(<TawkWidget propertyId="property-id" widgetId="widget-id" />)
    first.unmount()
    render(<TawkWidget propertyId="property-id" widgetId="widget-id" />)

    expect(document.querySelectorAll('script[src^="https://embed.tawk.to/"]')).toHaveLength(1)
  })
})
