import { getCachedGlobal } from './getGlobals'
import type { SiteSetting } from '@/payload-types'

/**
 * Optimized fetcher for Site Settings used by both Header and Footer.
 * Consolidates all necessary fields into a single request with a unified cache key.
 */
export const getCachedSiteSettings = () =>
  getCachedGlobal('site-settings', 2, {
    logos: {
      logoDark: true,
      logoLight: true,
    },
    mainNavigation: {
      items: true,
    },
    footerColumns: true,
    footerBottom: true,
  })()

// Re-export as getSiteSettings for backward compatibility if needed, 
// though we should prefer the cached version for layout components.
export const getSiteSettings = getCachedSiteSettings
