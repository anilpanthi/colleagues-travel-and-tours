import React, { useState } from 'react'
import type { Navigation as NavigationType } from '@/payload-types'
import cssItem from './Navitems.module.scss'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/utilities/ui'

import { CMSLink } from '@/components/Link'

import { SimpleDropdown } from './SimpleDropdown'
import { MegaDropdown } from './MegaDropdown'
import { generatePath } from '@/utilities/generatePath'

type NavigationItem = NonNullable<NavigationType['items']>[number]

interface NavItemsProp {
  item: NavigationItem
  isMobile?: boolean
  onNavClick?: () => void
}

export default function Navitems({ item, isMobile, onNavClick }: NavItemsProp) {
  const { label, dropdownType, simpleLinks, columns, linkType, internalLink, externalUrl } = item
  const [isOpen, setIsOpen] = useState(false)

  const hasDropdown =
    dropdownType &&
    dropdownType !== 'none' &&
    ((dropdownType === 'simple' && simpleLinks && simpleLinks.length > 0) ||
      (dropdownType === 'mega' && columns && columns.length > 0))

  // const isExternal = item.linkType === 'external'

  // // Helper to resolve href
  // let linkHref = '#'
  // if (item.linkType === 'internal' && item.internalLink) {
  //   const link = item.internalLink
  //   // Check if 'value' is an object (populated) and has a slug
  //   if (typeof link.value === 'object' && link.value?.slug) {
  //     linkHref = generatePath(link.relationTo as string, link.value.slug)
  //   }
  // } else if (item.linkType === 'external' && item.externalUrl) {
  //   linkHref = item.externalUrl
  // }

  const handleToggle = (e: React.MouseEvent) => {
    if (isMobile && hasDropdown) {
      e.preventDefault()
      setIsOpen(!isOpen)
    } else if (onNavClick) {
      onNavClick()
    }
  }

  return (
    <li
      className={cn(cssItem.navItem, isMobile && cssItem.navItemMobile, isOpen && cssItem.isOpen)}
    >
      <CMSLink
        className={cssItem.navItem_link}
        type={linkType === 'internal' ? 'reference' : 'custom'}
        url={externalUrl}
        reference={internalLink}
        onClick={handleToggle}
      >
        <span>{label}</span>
        {hasDropdown && (
          <ChevronDown className={cn(cssItem.navItem_icon, isOpen && cssItem.iconRotated)} />
        )}
      </CMSLink>

      {hasDropdown && (
        <div className={cn(cssItem.navItem_dropdown, isMobile && cssItem.navItem_dropdownMobile)}>
          {dropdownType === 'simple' && simpleLinks && (
            <SimpleDropdown links={simpleLinks} onNavClick={onNavClick} />
          )}

          {dropdownType === 'mega' && columns && (
            <MegaDropdown columns={columns} onNavClick={onNavClick} />
          )}
        </div>
      )}
    </li>
  )
}
