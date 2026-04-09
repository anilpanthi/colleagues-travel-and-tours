'use client'

import type { Theme } from '@/providers/Theme/types'

import React, { createContext, useCallback, use, useEffect, useState } from 'react'

import canUseDOM from '@/utilities/canUseDOM'

export interface ContextType {
  headerTheme?: Theme | null
  setHeaderTheme: (theme: Theme | null) => void
  hasHeroImage?: boolean
  setHasHeroImage: (hasHeroImage: boolean) => void
}

const initialContext: ContextType = {
  headerTheme: undefined,
  setHeaderTheme: () => null,
  hasHeroImage: true,
  setHasHeroImage: () => null,
}

const HeaderThemeContext = createContext(initialContext)

export const HeaderThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [headerTheme, setThemeState] = useState<Theme | undefined | null>(undefined)
  const [hasHeroImage, setHasHeroImageState] = useState<boolean>(true)

  useEffect(() => {
    if (canUseDOM) {
      const initTheme = document.documentElement.getAttribute('data-theme') as Theme
      setThemeState(initTheme)
    }
  }, [])

  const setHeaderTheme = useCallback((themeToSet: Theme | null) => {
    setThemeState(themeToSet)
  }, [])

  const setHasHeroImage = useCallback((hasHeroImageToSet: boolean) => {
    setHasHeroImageState(hasHeroImageToSet)
  }, [])

  return (
    <HeaderThemeContext value={{ headerTheme, setHeaderTheme, hasHeroImage, setHasHeroImage }}>
      {children}
    </HeaderThemeContext>
  )
}

export const useHeaderTheme = (): ContextType => use(HeaderThemeContext)
