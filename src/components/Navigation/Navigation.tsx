'use client'
import type { Navigation as NavigationType } from '@/payload-types'

import navcss from './Navigation.module.scss'
import Navitems from './Navitems'

interface NavigationProps {
  menuItems: NavigationType['items']
  isMobile?: boolean
  isOpen?: boolean
  onNavClick?: () => void
}

import { cn } from '@/utilities/ui'

/**
 * Navigation component that maps through the menu items.
 */
export default function Navigation({ menuItems, isMobile, isOpen, onNavClick }: NavigationProps) {
  if (!menuItems || menuItems.length === 0) return null

  return (
    <nav className={cn(navcss.nav, isMobile && navcss.navMobile, isOpen && navcss.isOpen)}>
      <ul className={cn(navcss.nav_list, isMobile && navcss.navMobile_list)}>
        {menuItems.map((item, index) => (
          <Navitems key={index} item={item} isMobile={isMobile} onNavClick={onNavClick} />
        ))}
      </ul>
    </nav>
  )
}
