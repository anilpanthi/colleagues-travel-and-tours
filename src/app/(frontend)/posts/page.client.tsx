'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'

const PageClient: React.FC = () => {
  /* Force the header to be dark mode while we have an image behind it */
  const { setHeaderTheme, setHasHeroImage } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('light')
    setHasHeroImage(false)
  }, [setHeaderTheme, setHasHeroImage])
  return <React.Fragment />
}

export default PageClient
