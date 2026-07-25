'use client'

import { lazy, Suspense, useEffect, useState } from 'react'

const MotionController = lazy(() =>
  import('./MotionController').then(({ MotionController: Component }) => ({
    default: Component,
  })),
)

const desktopMotionQuery = '(min-width: 769px)'

export function DeferredMotionController() {
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia(desktopMotionQuery)
    const updateMotionPreference = () => setIsDesktop(mediaQuery.matches)

    updateMotionPreference()
    mediaQuery.addEventListener('change', updateMotionPreference)

    return () => mediaQuery.removeEventListener('change', updateMotionPreference)
  }, [])

  if (!isDesktop) return null

  return (
    <Suspense fallback={null}>
      <MotionController />
    </Suspense>
  )
}
