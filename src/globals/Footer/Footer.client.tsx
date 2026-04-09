'use client'

import React from 'react'
import type { SiteSetting } from '@/payload-types'

interface FooterClientProps {
  footerColumns: SiteSetting['footerColumns']
  footerBottom: SiteSetting['footerBottom']
}

export const FooterClient: React.FC<FooterClientProps> = ({ footerColumns, footerBottom }) => {
  return <h1>Hi Footer</h1>
}
