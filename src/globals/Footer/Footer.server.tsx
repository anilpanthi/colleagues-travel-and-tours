import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'
import { FooterClient } from './Footer.client'

export async function Footer() {
  const siteSettings = await getCachedGlobal('site-settings', 1)()
  
  return (
    <FooterClient 
      footerColumns={siteSettings?.footerColumns}
      footerBottom={siteSettings?.footerBottom}
    />
  )
}
