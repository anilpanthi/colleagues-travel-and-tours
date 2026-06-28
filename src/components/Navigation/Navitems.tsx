import React, { useState } from 'react'
import type { Navigation as NavigationType } from '@/payload-types'
import cssItem from './Navitems.module.scss'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/utilities/ui'
import { usePathname } from 'next/navigation'

import { CMSLink } from '@/components/Link'

import { SimpleDropdown } from './SimpleDropdown'
import { MegaDropdown } from './MegaDropdown'
import { generatePath } from '@/utilities/generatePath'

type NavigationItem = NonNullable<NavigationType['items']>[number]
type NavigationReference = NonNullable<NavigationItem['internalLink']>

interface NavItemsProp {
  item: NavigationItem
  isMobile?: boolean
  onNavClick?: () => void
}

export default function Navitems({ item, isMobile, onNavClick }: NavItemsProp) {
  const { label, dropdownType, simpleLinks, columns, linkType, internalLink, externalUrl } = item
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const hasDropdown =
    dropdownType &&
    dropdownType !== 'none' &&
    ((dropdownType === 'simple' && simpleLinks && simpleLinks.length > 0) ||
      (dropdownType === 'mega' && columns && columns.length > 0))

  const normalizePath = (path: string) => {
    if (path === '/') return path

    return path.replace(/\/+$/, '')
  }

  const getPathFromUrl = (url?: string | null) => {
    if (!url) return null

    if (url.startsWith('/')) return normalizePath(url.split(/[?#]/)[0] || '/')

    return null
  }

  const getReferencePath = (reference?: NavigationReference | null) => {
    if (!reference?.value) return null

    const { relationTo, value } = reference

    if (typeof value === 'object' && 'slug' in value && typeof value.slug === 'string') {
      return normalizePath(generatePath(relationTo, value.slug))
    }

    if (typeof value === 'string' || typeof value === 'number') {
      return normalizePath(generatePath(relationTo, String(value)))
    }

    return null
  }

  const linkPath =
    linkType === 'internal' ? getReferencePath(internalLink) : getPathFromUrl(externalUrl)
  const currentPath = normalizePath(pathname || '/')
  const isActive =
    Boolean(linkPath) &&
    (currentPath === linkPath || (linkPath !== '/' && currentPath.startsWith(`${linkPath}/`)))

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
        ariaCurrent={isActive ? 'page' : undefined}
        className={cn(cssItem.navItem_link, isActive && cssItem.navItem_linkActive)}
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
