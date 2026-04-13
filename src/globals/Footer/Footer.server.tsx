import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'
import { FooterClient } from './Footer.client'

import type { SiteSetting } from '@/payload-types'

export async function Footer({ footerColumns , footerBottom }: { footerColumns?: SiteSetting['footerColumns'] , footerBottom?: SiteSetting['footerBottom'] }) {
  return (
    <FooterClient 
      footerColumns={footerColumns}
      footerBottom={footerBottom}
    />
  )
}
