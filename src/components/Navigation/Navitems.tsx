import React, { useId, useState } from 'react'
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
  const dropdownId = useId()
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
  const simpleDropdownPaths =
    simpleLinks?.map((link) =>
      link.linkType === 'internal' ? getReferencePath(link.internalLink) : getPathFromUrl(link.externalUrl),
    ) ?? []
  const megaDropdownPaths =
    columns?.flatMap((column) => {
      const titlePath =
        column.titleLinkType === 'internal'
          ? getReferencePath(column.titleInternalLink)
          : getPathFromUrl(column.titleExternalUrl)
      const linkPaths =
        column.links?.map((link) =>
          link.linkType === 'internal'
            ? getReferencePath(link.internalLink)
            : getPathFromUrl(link.externalUrl),
        ) ?? []

      return [titlePath, ...linkPaths]
    }) ?? []
  const navPaths = [linkPath, ...simpleDropdownPaths, ...megaDropdownPaths].filter(
    (path): path is string => Boolean(path),
  )
  const isActive = navPaths.some(
    (path) => currentPath === path || (path !== '/' && currentPath.startsWith(`${path}/`)),
  )

  const handleLinkClick = () => onNavClick?.()
  const handleDropdownToggle = () => setIsOpen((open) => !open)

  const linkContent = (
    <>
      <span>{label}</span>
      {hasDropdown && (
        <ChevronDown
          aria-hidden="true"
          className={cn(cssItem.navItem_icon, isOpen && cssItem.iconRotated)}
          focusable="false"
        />
      )}
    </>
  )

  return (
    <li
      className={cn(
        cssItem.navItem,
        isActive && cssItem.navItemActive,
        isMobile && cssItem.navItemMobile,
        isOpen && cssItem.isOpen,
      )}
    >
      {isMobile && hasDropdown ? (
        <button
          aria-controls={dropdownId}
          aria-expanded={isOpen}
          className={cn(cssItem.navItem_link, cssItem.navItem_toggle)}
          onClick={handleDropdownToggle}
          type="button"
        >
          {linkContent}
        </button>
      ) : (
        <CMSLink
          ariaCurrent={isActive ? 'page' : undefined}
          className={cssItem.navItem_link}
          onClick={isMobile ? handleLinkClick : undefined}
          reference={internalLink}
          type={linkType === 'internal' ? 'reference' : 'custom'}
          url={externalUrl}
        >
          {linkContent}
        </CMSLink>
      )}

      {hasDropdown && (
        <div
          aria-hidden={isMobile && !isOpen ? true : undefined}
          className={cn(cssItem.navItem_dropdown, isMobile && cssItem.navItem_dropdownMobile)}
          id={isMobile ? dropdownId : undefined}
        >
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
