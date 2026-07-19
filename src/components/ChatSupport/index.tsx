'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

const TawkWidget = dynamic(() => import('./TawkWidget').then((module) => module.TawkWidget), {
  ssr: false,
})

const FALLBACK_DELAY_MS = 3_000

interface ChatSupportProps {
  propertyId?: null | string
  widgetId?: null | string
}

export function ChatSupport({ propertyId, widgetId }: ChatSupportProps) {
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    if (!propertyId || !widgetId || shouldLoad) {
      return
    }

    let fallbackTimer: number | undefined

    const removeActivationListeners = () => {
      window.removeEventListener('pointerdown', activate)
      window.removeEventListener('keydown', activate)
      window.removeEventListener('load', scheduleFallback)
    }

    const activate = () => {
      removeActivationListeners()

      if (fallbackTimer !== undefined) {
        window.clearTimeout(fallbackTimer)
      }

      setShouldLoad(true)
    }

    const scheduleFallback = () => {
      const navigationEntry = performance.getEntriesByType('navigation')[0] as
        | PerformanceNavigationTiming
        | undefined
      const timeSinceLoad = navigationEntry?.loadEventEnd
        ? Math.max(0, performance.now() - navigationEntry.loadEventEnd)
        : 0
      const remainingDelay = Math.max(0, FALLBACK_DELAY_MS - timeSinceLoad)

      fallbackTimer = window.setTimeout(activate, remainingDelay)
    }

    window.addEventListener('pointerdown', activate, { passive: true })
    window.addEventListener('keydown', activate)

    if (document.readyState === 'complete') {
      scheduleFallback()
    } else {
      window.addEventListener('load', scheduleFallback, { once: true })
    }

    return () => {
      removeActivationListeners()

      if (fallbackTimer !== undefined) {
        window.clearTimeout(fallbackTimer)
      }
    }
  }, [propertyId, shouldLoad, widgetId])

  if (!propertyId || !widgetId) {
    return null
  }

  return shouldLoad ? <TawkWidget propertyId={propertyId} widgetId={widgetId} /> : null
}
