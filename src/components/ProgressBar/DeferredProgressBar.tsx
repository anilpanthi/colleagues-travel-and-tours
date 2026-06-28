'use client'

import dynamic from 'next/dynamic'

export const DeferredProgressBar = dynamic(
  () => import('./index').then((module) => module.ProgressBar),
  {
    ssr: false,
  },
)
