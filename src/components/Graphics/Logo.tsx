'use client'

import { useTheme } from '@payloadcms/ui'
import React from 'react'

export const AdminLogo: React.FC = () => {
  const { theme } = useTheme()
  const src = theme === 'dark' ? '/colleagues-white-logo.svg' : '/colleagues-original-logo.svg'

  return (
    // These public SVGs should bypass the restricted Next image optimizer.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt="Colleagues Logo"
      src={src}
      style={{ width: '150px', height: 'auto', objectFit: 'contain' }}
    />
  )
}
