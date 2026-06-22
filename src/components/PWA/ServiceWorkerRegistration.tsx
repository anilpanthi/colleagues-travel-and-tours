'use client'

import { useEffect } from 'react'

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return

    const registerServiceWorker = () => {
      void navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch((error: unknown) => {
        console.error('Service worker registration failed:', error)
      })
    }

    if (document.readyState === 'complete') {
      registerServiceWorker()
      return
    }

    window.addEventListener('load', registerServiceWorker)

    return () => window.removeEventListener('load', registerServiceWorker)
  }, [])

  return null
}
