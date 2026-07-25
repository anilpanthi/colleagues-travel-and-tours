'use client'

import { lazy, Suspense, useEffect, useState } from 'react'

import type { LiveBookingPackage } from './index'

const toastStartDelay = 30 * 1000

const LiveBookingToast = lazy(() =>
  import('./index').then(({ LiveBookingToast: Component }) => ({ default: Component })),
)

type DeferredLiveBookingToastProps = {
  packages: LiveBookingPackage[]
}

export function DeferredLiveBookingToast({ packages }: DeferredLiveBookingToastProps) {
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setShouldLoad(true), toastStartDelay)
    return () => window.clearTimeout(timer)
  }, [])

  if (!shouldLoad) return null

  return (
    <Suspense fallback={null}>
      <LiveBookingToast initiallyVisible packages={packages} />
    </Suspense>
  )
}
