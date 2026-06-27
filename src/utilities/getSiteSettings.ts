import { getCachedGlobal } from './getGlobals'

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
    socialLinks: true,
    contactNumbers: true,
    address: true,
    map: true,
    emailAddresses: true,
    contactForm: {
      items: true,
    },
    bookingForm: {
      items: true,
    },
    flightBookingForm: {
      items: true,
    },
    enquiryForm: {
      items: true,
    },
  })()

// Re-export as getSiteSettings for backward compatibility if needed,
// though we should prefer the cached version for layout components.
export const getSiteSettings = getCachedSiteSettings
