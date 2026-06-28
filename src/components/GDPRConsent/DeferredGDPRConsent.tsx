'use client'

import dynamic from 'next/dynamic'

export const DeferredGDPRConsent = dynamic(
  () => import('./GDPRConsent').then((module) => module.GDPRConsent),
  {
    ssr: false,
  },
)
