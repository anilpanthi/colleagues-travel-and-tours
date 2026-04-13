import React from 'react'
import { CMSLink } from '@/components/Link'
import classes from './index.module.scss'
import type { Navigation } from '@/payload-types'

type Columns = NonNullable<NonNullable<Navigation['items']>[number]['columns']>

interface MegaDropdownProps {
  columns: Columns
  onNavClick?: () => void
}

export const MegaDropdown: React.FC<MegaDropdownProps> = ({ columns, onNavClick }) => {
  return (
    <div className={classes.megaDropdown}>
      {columns.map((column, columnIndex) => (
        <div key={column.id || columnIndex} className={classes.megaDropdown_column}>
          <div className={classes.megaDropdown_columnTitle}>
            {column.titleLinkType !== 'none' ? (
              <CMSLink
                type={column.titleLinkType === 'internal' ? 'reference' : 'custom'}
                url={column.titleExternalUrl}
                reference={column.titleInternalLink}
                label={column.title}
                onClick={onNavClick}
              />
            ) : (
              <span>{column.title}</span>
            )}
          </div>
          {column.links && (
            <ul className={classes.megaDropdown_links}>
              {column.links.map((link) => (
                <li key={link.id} className={classes.megaDropdown_linkItem}>
                  <CMSLink
                    className={classes.megaDropdown_link}
                    type={link.linkType === 'internal' ? 'reference' : 'custom'}
                    url={link.externalUrl}
                    reference={link.internalLink}
                    label={link.label}
                    onClick={onNavClick}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  )
}
