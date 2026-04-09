import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'
import { BrandClient } from './Brand.client'

export async function Brand() {
  const siteSettings = await getCachedGlobal('site-settings', 1)()
  
  return <BrandClient logos={siteSettings?.logos} />
}
