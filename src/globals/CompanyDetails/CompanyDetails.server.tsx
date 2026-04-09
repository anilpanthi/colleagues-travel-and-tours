import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'
import { CompanyDetailsClient } from './CompanyDetails.client'

export async function CompanyDetails() {
  const siteSettings = await getCachedGlobal('site-settings', 1)()
  
  return (
    <CompanyDetailsClient 
      address={siteSettings?.address}
      map={siteSettings?.map}
      contactNumbers={siteSettings?.contactNumbers}
      emailAddresses={siteSettings?.emailAddresses}
    />
  )
}
