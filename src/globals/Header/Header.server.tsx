import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'
import { HeaderClient } from './Header.client'

export async function Header() {
  const siteSettings = await getCachedGlobal('site-settings', 1)()
  
  return <HeaderClient mainNavigation={siteSettings?.mainNavigation} />
}
