import React from 'react'
import { CMSLink } from '@/components/Link'
import classes from './index.module.scss'
import type { Navigation } from '@/payload-types'

type SimpleLinks = NonNullable<NonNullable<Navigation['items']>[number]['simpleLinks']>

interface SimpleDropdownProps {
  links: SimpleLinks
  onNavClick?: () => void
}

export const SimpleDropdown: React.FC<SimpleDropdownProps> = ({ links, onNavClick }) => {
  return (
    <ul className={classes.simpleDropdown}>
      {links.map((link) => (
        <li key={link.id} className={classes.simpleDropdown_item}>
          <CMSLink
            className={classes.simpleDropdown_link}
            type={link.linkType === 'internal' ? 'reference' : 'custom'}
            url={link.externalUrl}
            reference={link.internalLink}
            label={link.label}
            onClick={onNavClick}
          />
        </li>
      ))}
    </ul>
  )
}
