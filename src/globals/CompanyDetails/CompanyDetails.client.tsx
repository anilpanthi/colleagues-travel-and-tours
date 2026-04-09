'use client'

import React from 'react'
import type { SiteSetting } from '@/payload-types'

interface CompanyDetailsClientProps {
  address: SiteSetting['address']
  map: SiteSetting['map']
  contactNumbers: SiteSetting['contactNumbers']
  emailAddresses: SiteSetting['emailAddresses']
}

export const CompanyDetailsClient: React.FC<CompanyDetailsClientProps> = ({
  address,
  map,
  contactNumbers,
  emailAddresses,
}) => {
  return <h1>Hi Company Details</h1>
}
