'use client'

import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'

const PageClient: React.FC = () => {
  const { setHeaderTheme, setHasHeroImage } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('light')
    setHasHeroImage(false)
  }, [setHeaderTheme, setHasHeroImage])

  return <React.Fragment />
}

export default PageClient
