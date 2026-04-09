'use client'

import React from 'react'
import type { SiteSetting } from '@/payload-types'

interface HeaderClientProps {
  mainNavigation: SiteSetting['mainNavigation']
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ mainNavigation }) => {
  return <h1>Hi Header</h1>
}
