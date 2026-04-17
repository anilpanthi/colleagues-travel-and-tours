'use client'

import React from 'react'
import type { SiteSetting } from '@/payload-types'
import Link from 'next/link'
import Image from 'next/image'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import styles from './Brand.module.scss'

interface BrandClientProps {
  logos: SiteSetting['logos']
  theme: string | null
  isScrolled?: boolean
}

export const BrandClient: React.FC<BrandClientProps> = ({ logos, isScrolled }) => {
  const logo = isScrolled ? logos?.logoLight : logos?.logoDark
  const logoObj = typeof logo === 'object' ? logo : null
  const src = logoObj?.url ? getMediaUrl(logoObj.url, logoObj.updatedAt) : null

  return (
    <div className={styles.brandLink} style={{ marginTop: '1px' }}>
      <Link href="/" className={styles.brandname}>
        {src && (
          <Image
            src={src}
            alt={logoObj?.alt || 'Logo'}
            width={logoObj?.width || 89}
            height={logoObj?.height || 57}
            className={styles.brandImage}
            priority={true}
          />
        )}
      </Link>
    </div>
  )
}
