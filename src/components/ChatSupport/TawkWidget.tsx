'use client'

import { useEffect } from 'react'

const TAWK_SCRIPT_ID = 'tawk-chat-script'
const TAWK_SCRIPT_ORIGIN = 'https://embed.tawk.to'
const MOBILE_BOTTOM_OFFSET_PX = 120

interface TawkAPI {
  customStyle?: {
    visibility: {
      mobile: {
        position: 'br'
        xOffset: number
        yOffset: number
      }
    }
  }
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
    window.Tawk_API.customStyle = {
      visibility: {
        mobile: {
          position: 'br',
          xOffset: 0,
          // Clears the fixed package booking bar, including iPhone safe-area padding.
          yOffset: MOBILE_BOTTOM_OFFSET_PX,
        },
      },
    }
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
