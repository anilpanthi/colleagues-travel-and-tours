'use client'

import React, { createContext, useCallback, use, useEffect, useState } from 'react'

import type { Theme, ThemeContextType } from './types'


import { defaultTheme, getImplicitPreference, themeLocalStorageKey } from './shared'

import { themeIsValid } from './types'

const initialContext: ThemeContextType = {
	setTheme: () => null,
	theme: undefined,
}

const ThemeContext = createContext(initialContext)

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
	const [theme, setThemeState] = useState<Theme | undefined>(undefined)

	const setTheme = useCallback((themeToSet: Theme | null) => {
		if (themeToSet === null) {
			window.localStorage.removeItem(themeLocalStorageKey)
			const implicitPreference = getImplicitPreference()
			document.documentElement.setAttribute('data-theme', implicitPreference || '')
			if (implicitPreference) setThemeState(implicitPreference)
		} else {
			setThemeState(themeToSet)
			window.localStorage.setItem(themeLocalStorageKey, themeToSet)
			document.documentElement.setAttribute('data-theme', themeToSet)
		}
	}, [])

	useEffect(() => {
		const themeToSet = ((): Theme => {
			const savedTheme = document.documentElement.getAttribute('data-theme') as Theme
			if (themeIsValid(savedTheme)) return savedTheme

			const preference = window.localStorage.getItem(themeLocalStorageKey)
			if (themeIsValid(preference)) return preference

			const implicitPreference = getImplicitPreference()
			if (implicitPreference) return implicitPreference

			return defaultTheme
		})()


		document.documentElement.setAttribute('data-theme', themeToSet)
		
		// Use a delay to avoid synchronous state update within effect
		const timeout = setTimeout(() => {
			setThemeState(themeToSet)
		}, 0)

		return () => clearTimeout(timeout)
	}, [])


	return <ThemeContext value={{ setTheme, theme }}>{children}</ThemeContext>
}


export const useTheme = (): ThemeContextType => use(ThemeContext)
