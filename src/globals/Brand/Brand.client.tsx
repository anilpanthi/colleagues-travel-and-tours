'use client'

import React, { useEffect, useState } from 'react'
import type { SiteSetting } from '@/payload-types'
import Link from 'next/link'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import styles from './Brand.module.scss'
import { BrandImage } from '@/components/BrandImage'
import { cn } from '@/utilities/ui'

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
  const originalLogoSrc = lightSrc || '/colleagues-original-logo.svg'
  const whiteLogoSrc = darkSrc || '/colleagues-white-logo.svg'
  const shouldUseOriginalLogo = Boolean(isScrolled)
  const [displayOriginalLogo, setDisplayOriginalLogo] = useState(shouldUseOriginalLogo)
  const [isLogoVisible, setIsLogoVisible] = useState(true)
  const activeLogoSrc = displayOriginalLogo ? originalLogoSrc : whiteLogoSrc
  const alternateLogoSrc = displayOriginalLogo ? whiteLogoSrc : originalLogoSrc
  const fallbackLogoSrc = displayOriginalLogo
    ? '/colleagues-original-logo.svg'
    : '/colleagues-white-logo.svg'

  useEffect(() => {
    if (displayOriginalLogo === shouldUseOriginalLogo) return

    const fadeOutTimeout = window.setTimeout(() => {
      setIsLogoVisible(false)
    }, 0)
    const swapTimeout = window.setTimeout(() => {
      setDisplayOriginalLogo(shouldUseOriginalLogo)
      window.requestAnimationFrame(() => setIsLogoVisible(true))
    }, 90)

    return () => {
      window.clearTimeout(fadeOutTimeout)
      window.clearTimeout(swapTimeout)
    }
  }, [displayOriginalLogo, shouldUseOriginalLogo])

  return (
    <div className={styles.brandLink}>
      <Link aria-label="Colleagues Travel and Tours home" className={styles.brandAnchor} href="/">
        <BrandImage
          alt=""
          alternateSrc={alternateLogoSrc}
          className={cn(styles.brandImage, isLogoVisible && styles.brandImageVisible)}
          fallbackSrc={fallbackLogoSrc}
          src={activeLogoSrc}
        />
      </Link>
    </div>
  )
}
