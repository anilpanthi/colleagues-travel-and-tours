'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'

const PageClient: React.FC<{
  heroType?: 'none' | 'highImpact' | 'mediumImpact' | 'lowImpact' | null
}> = ({ heroType }) => {
  const { setHeaderTheme, setHasHeroImage } = useHeaderTheme()

  useEffect(() => {
    const hasHeroImage = Boolean(heroType && heroType !== 'none' && heroType !== 'lowImpact')

    if (!hasHeroImage) {
      setHeaderTheme('light')
      setHasHeroImage(false)
    } else {
      setHasHeroImage(true)
    }
  }, [setHeaderTheme, setHasHeroImage, heroType])

  return <React.Fragment />
}

export default PageClient
