import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

import type { SiteSetting } from '@/payload-types'
import { SocialClient } from './Social.client'

export async function Social() {
  const siteSettings: SiteSetting = await getCachedGlobal('site-settings', 1)()
  const socialLinks = siteSettings?.socialLinks

  return <SocialClient data={socialLinks} />
}
