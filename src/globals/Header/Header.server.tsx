
import React from 'react'
import { HeaderClient } from './Header.client'

import type { SiteSetting } from '@/payload-types'

export async function Header({ mainNavigation, logos, flightBookingForm }: { mainNavigation?: SiteSetting['mainNavigation'], logos?: SiteSetting['logos'], flightBookingForm?: SiteSetting['flightBookingForm'] }) {
  return <HeaderClient mainNavigation={mainNavigation} logos={logos} flightBookingForm={flightBookingForm} />
}
