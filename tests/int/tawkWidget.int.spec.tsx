import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { TawkWidget } from '@/components/ChatSupport/TawkWidget'

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
  })

  it('loads the standard Tawk embed without the incompatible React callback bridge', () => {
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
          mobile: {
            position: 'br',
            xOffset: 0,
            yOffset: 120,
          },
        },
      },
    })
    expect(window.Tawk_LoadStart).toBeInstanceOf(Date)
  })

  it('does not insert a duplicate widget script', () => {
    const first = render(<TawkWidget propertyId="property-id" widgetId="widget-id" />)
    first.unmount()
    render(<TawkWidget propertyId="property-id" widgetId="widget-id" />)

    expect(document.querySelectorAll('script[src^="https://embed.tawk.to/"]')).toHaveLength(1)
  })
})
