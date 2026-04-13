
import React from 'react'
import { HeaderClient } from './Header.client'

import type { SiteSetting } from '@/payload-types'

export async function Header({ mainNavigation , logos }: { mainNavigation?: SiteSetting['mainNavigation'] , logos?: SiteSetting['logos'] }) {
  return <HeaderClient mainNavigation={mainNavigation} logos={logos} />
}
