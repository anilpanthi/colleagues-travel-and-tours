'use client'

import type { Theme } from '@/providers/Theme/types'

import React, { createContext, useCallback, use, useEffect, useState } from 'react'

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
  // Initialize to undefined to ensure match between server and client during hydration
  const [headerTheme, setThemeState] = useState<Theme | undefined | null>(undefined)
  const [hasHeroImage, setHasHeroImageState] = useState<boolean>(true)

  useEffect(() => {
    // Safely read the theme after component mounts on the client
    const theme = document.documentElement.getAttribute('data-theme') as Theme
    if (theme) {
      // Use a timeout to avoid synchronous state update within effect (cascading renders)
      const timeout = setTimeout(() => {
        setThemeState(theme)
      }, 0)

      return () => clearTimeout(timeout)
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
