'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'

type HeroType = 'none' | 'highImpact' | 'mediumImpact' | 'lowImpact' | null | undefined

const PageClient: React.FC<{
  heroType?: HeroType
  hasFallbackStaticHero?: boolean
}> = ({ heroType, hasFallbackStaticHero = false }) => {
  const { setHeaderTheme, setHasHeroImage } = useHeaderTheme()

  useEffect(() => {
    const hasHeroImage =
      hasFallbackStaticHero || Boolean(heroType && heroType !== 'none' && heroType !== 'lowImpact')

    if (!hasHeroImage) {
      setHeaderTheme('light')
      setHasHeroImage(false)
    } else {
      setHasHeroImage(true)
    }
  }, [setHeaderTheme, setHasHeroImage, heroType, hasFallbackStaticHero])

  return <React.Fragment />
}

export default PageClient
