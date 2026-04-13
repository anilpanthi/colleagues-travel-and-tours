'use client'

import React from 'react'
import type { SiteSetting } from '@/payload-types'
import Link from 'next/link'
import { Media } from '@/components/Media'
import styles from './Brand.module.scss'

interface BrandClientProps {
  logos: SiteSetting['logos']
  theme: string | null
  isScrolled?: boolean
}

export const BrandClient: React.FC<BrandClientProps> = ({ logos, isScrolled }) => {
  const logo = isScrolled ? logos?.logoLight : logos?.logoDark
  return (
    <div className={styles.brandLink} style={{ marginTop: '1px' }}>
      <Link href="/" className={styles.brandname}>
        <Media
          resource={typeof logo === 'object' ? logo : undefined}
          imgClassName={styles.brandImage}
          priority={true}
          loading="eager"
        />
      </Link>
    </div>
  )
}
