'use client'

import { useEffect } from 'react'

const TAWK_SCRIPT_ID = 'tawk-chat-script'
const TAWK_SCRIPT_ORIGIN = 'https://embed.tawk.to'
const MOBILE_BOTTOM_OFFSET_PX = 120
const SITE_MOBILE_BREAKPOINT_PX = 1024
const TAWK_WIDGET_Z_INDEX = '2147483001 !important'

interface TawkWidgetPosition {
  position: 'br'
  xOffset: number
  yOffset: number
}

interface TawkCustomStyle {
  visibility: {
    desktop?: TawkWidgetPosition
    mobile: TawkWidgetPosition
  }
  zIndex: string
}

interface TawkAPI {
  customStyle?: TawkCustomStyle
  [key: string]: unknown
}

declare global {
  interface Window {
    Tawk_API?: TawkAPI
    Tawk_LoadStart?: Date
  }
}

interface TawkWidgetProps {
  propertyId: string
  widgetId: string
}

const getTawkCustomStyle = (): TawkCustomStyle => {
  const clearsMobileBookingBar: TawkWidgetPosition = {
    position: 'br',
    xOffset: 0,
    yOffset: MOBILE_BOTTOM_OFFSET_PX,
  }

  return {
    visibility: {
      // Tawk can classify tablet-sized viewports as desktop even though the site's fixed
      // booking bar is visible. Offset both placements while the site uses its mobile layout.
      ...(window.innerWidth <= SITE_MOBILE_BREAKPOINT_PX
        ? { desktop: clearsMobileBookingBar }
        : {}),
      mobile: clearsMobileBookingBar,
    },
    // Keep the launcher and an open chat above the booking bar's 2147483000 stacking layer.
    zIndex: TAWK_WIDGET_Z_INDEX,
  }
}

export function TawkWidget({ propertyId, widgetId }: TawkWidgetProps) {
  useEffect(() => {
    const normalizedPropertyId = propertyId.trim()
    const normalizedWidgetId = widgetId.trim()

    if (!normalizedPropertyId || !normalizedWidgetId) return

    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src^="${TAWK_SCRIPT_ORIGIN}/"]`,
    )

    if (existingScript) return

    window.Tawk_API = window.Tawk_API ?? {}
    window.Tawk_API.customStyle = getTawkCustomStyle()
    window.Tawk_LoadStart = new Date()

    const script = document.createElement('script')
    script.async = true
    script.charset = 'UTF-8'
    script.id = TAWK_SCRIPT_ID
    script.src = `${TAWK_SCRIPT_ORIGIN}/${encodeURIComponent(normalizedPropertyId)}/${encodeURIComponent(normalizedWidgetId)}`
    script.setAttribute('crossorigin', '*')

    const firstScript = document.getElementsByTagName('script')[0]

    if (firstScript?.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript)
    } else {
      document.head.appendChild(script)
    }

    // Tawk is a page-level singleton and injects its own iframe and global API. It intentionally
    // stays mounted across client-side route changes, matching Tawk's standard embed behavior.
  }, [propertyId, widgetId])

  return null
}
