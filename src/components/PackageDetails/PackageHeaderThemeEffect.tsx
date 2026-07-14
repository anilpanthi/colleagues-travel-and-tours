'use client'

import { useEffect } from 'react'

import { useHeaderTheme } from '@/providers/HeaderTheme'

type PackageHeaderThemeEffectProps = {
  hasHeroImage: boolean
}

export const PackageHeaderThemeEffect = ({ hasHeroImage }: PackageHeaderThemeEffectProps) => {
  const { setHeaderTheme, setHasHeroImage } = useHeaderTheme()

  useEffect(() => {
    if (!hasHeroImage) {
      setHeaderTheme('light')
      setHasHeroImage(false)
    } else {
      setHasHeroImage(true)
    }
  }, [hasHeroImage, setHeaderTheme, setHasHeroImage])

  return null
}
