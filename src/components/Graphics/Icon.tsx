'use client'

import React from 'react'

export const AdminIcon: React.FC = () => {
  return (
    <picture>
      <source srcSet="/icon-white.svg" media="(prefers-color-scheme: dark)" />
      <img
        alt="Colleagues Icon"
        src="/icon-original.svg"
        style={{ width: '25px', height: '25px', objectFit: 'contain' }}
      />
    </picture>
  )
}
