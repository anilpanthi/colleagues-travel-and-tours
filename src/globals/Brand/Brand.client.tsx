'use client'

import React from 'react'
import type { SiteSetting } from '@/payload-types'
import Link from 'next/link'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import styles from './Brand.module.scss'
import Image from 'next/image'

interface BrandClientProps {
  logos: SiteSetting['logos']
  theme: string | null
  isScrolled?: boolean
}

export const BrandClient: React.FC<BrandClientProps> = ({ logos, isScrolled }) => {
  const logo = isScrolled ? logos?.logoLight : logos?.logoDark
  const logoObj = typeof logo === 'object' ? logo : null
  const src = logoObj?.url ? getMediaUrl(logoObj.url, logoObj.updatedAt) : null
  // console.log(src)
  return (
    <div className={styles.brandLinkyyy} style={{ marginTop: '1px' }}>
      {/* <Link href="/" className={styles.brandname}>
        {src && <h2>Brandthenamesof test</h2>}
      </Link> */}
      <Link href={'/'}>
        {/* <img src={src} alt="logo" height="57px" width="100px" /> */}
        {src && <Image src={src} alt="logo" height={57} width={100} />}
      </Link>
    </div>
  )
}
