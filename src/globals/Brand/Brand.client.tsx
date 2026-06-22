'use client'

import React from 'react'
import type { SiteSetting } from '@/payload-types'
import Link from 'next/link'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import styles from './Brand.module.scss'
import { BrandImage } from '@/components/BrandImage'

interface BrandClientProps {
  logos: SiteSetting['logos']
  theme: string | null
  isScrolled?: boolean
}

export const BrandClient: React.FC<BrandClientProps> = ({ logos, isScrolled }) => {
  const lightLogo = typeof logos?.logoLight === 'object' ? logos.logoLight : null
  const darkLogo = typeof logos?.logoDark === 'object' ? logos.logoDark : null
  const lightSrc = lightLogo?.url ? getMediaUrl(lightLogo.url, lightLogo.updatedAt) : null
  const darkSrc = darkLogo?.url ? getMediaUrl(darkLogo.url, darkLogo.updatedAt) : null
  const src = isScrolled ? lightSrc : darkSrc
  const alternateSrc = isScrolled ? darkSrc : lightSrc
  const fallbackSrc = isScrolled ? '/colleagues-original-logo.svg' : '/colleagues-white-logo.svg'

  return (
    <div className={styles.brandLinkyyy} style={{ marginTop: '1px' }}>
      {/* <Link href="/" className={styles.brandname}>
        {src && <h2>Brandthenamesof test</h2>}
      </Link> */}
      <Link href={'/'}>
        <BrandImage alternateSrc={alternateSrc} fallbackSrc={fallbackSrc} src={src} />
      </Link>
    </div>
  )
}
