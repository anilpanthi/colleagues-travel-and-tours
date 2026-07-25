'use client'

import { useEffect } from 'react'

const ANALYTICS_DELAY_MS = 8_000
const ANALYTICS_SCRIPT_ID = 'google-analytics-script'
const interactionEvents = ['keydown', 'pointerdown'] as const

type AnalyticsWindow = Window & {
  dataLayer?: unknown[][]
  gtag?: (...args: unknown[]) => void
}

interface DeferredGoogleAnalyticsProps {
  measurementId: string
}

export function DeferredGoogleAnalytics({ measurementId }: DeferredGoogleAnalyticsProps) {
  useEffect(() => {
    const normalizedMeasurementId = measurementId.trim()
    if (!normalizedMeasurementId) return

    let hasLoaded = false

    const removeInteractionListeners = () => {
      interactionEvents.forEach((eventName) => {
        window.removeEventListener(eventName, loadAnalytics)
      })
    }

    const loadAnalytics = () => {
      if (hasLoaded) return

      hasLoaded = true
      removeInteractionListeners()
      window.clearTimeout(timeoutId)

      const analyticsWindow = window as AnalyticsWindow
      analyticsWindow.dataLayer = analyticsWindow.dataLayer ?? []
      analyticsWindow.gtag =
        analyticsWindow.gtag ??
        ((...args: unknown[]) => {
          analyticsWindow.dataLayer?.push(args)
        })

      analyticsWindow.gtag('js', new Date())
      analyticsWindow.gtag('config', normalizedMeasurementId)

      if (document.getElementById(ANALYTICS_SCRIPT_ID)) return

      const script = document.createElement('script')
      script.async = true
      script.id = ANALYTICS_SCRIPT_ID
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(normalizedMeasurementId)}`
      document.head.appendChild(script)
    }

    interactionEvents.forEach((eventName) => {
      window.addEventListener(eventName, loadAnalytics, { once: true, passive: true })
    })
    const timeoutId = window.setTimeout(loadAnalytics, ANALYTICS_DELAY_MS)

    return () => {
      removeInteractionListeners()
      window.clearTimeout(timeoutId)
    }
  }, [measurementId])

  return null
}
