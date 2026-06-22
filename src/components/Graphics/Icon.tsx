'use client'

import React from 'react'

export const AdminIcon: React.FC = () => {
  return (
    // This public admin asset should bypass the restricted Next image optimizer.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt="Colleagues Icon"
      src="/android-chrome-192x192.png"
      style={{ width: '25px', height: '25px', objectFit: 'contain', borderRadius: '5px' }}
    />
  )
}
