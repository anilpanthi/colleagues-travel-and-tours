'use client'

import React from 'react'

export const AdminLogo: React.FC = () => {
  return (
    <picture>
      <source srcSet="/colleagues-white-logo.svg" media="(prefers-color-scheme: dark)" />
      <img
        alt="Colleagues Logo"
        src="/colleagues-original-logo.svg"
        style={{ width: '150px', height: 'auto', objectFit: 'contain' }}
      />
    </picture>
  )
}
