'use client'

import React from 'react'
import type { SiteSetting } from '@/payload-types'

interface BrandClientProps {
  logos: SiteSetting['logos']
}

export const BrandClient: React.FC<BrandClientProps> = ({ logos }) => {
  return <h1>Hi Brand</h1>
}
