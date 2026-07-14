'use client'
import type { Navigation as NavigationType } from '@/payload-types'

import navcss from './Navigation.module.scss'
import Navitems from './Navitems'

interface NavigationProps {
  id?: string
  menuItems: NavigationType['items']
  isMobile?: boolean
  isOpen?: boolean
  onNavClick?: () => void
}

import { cn } from '@/utilities/ui'

/**
 * Navigation component that maps through the menu items.
 */
export default function Navigation({ id, menuItems, isMobile, isOpen, onNavClick }: NavigationProps) {
  if (!menuItems || menuItems.length === 0) return null

  return (
    <nav
      aria-hidden={isMobile && !isOpen ? true : undefined}
      aria-label={isMobile ? 'Mobile navigation' : 'Primary navigation'}
      className={cn(navcss.nav, isMobile && navcss.navMobile, isOpen && navcss.isOpen)}
      id={id}
      inert={isMobile && !isOpen ? true : undefined}
    >
      <ul className={cn(navcss.nav_list, isMobile && navcss.navMobile_list)}>
        {menuItems.map((item, index) => (
          <Navitems
            key={`${isOpen ? 'open' : 'closed'}-${item.id ?? index}`}
            item={item}
            isMobile={isMobile}
            onNavClick={onNavClick}
          />
        ))}
      </ul>
    </nav>
  )
}
