import { getCachedGlobal } from './getGlobals'

const baseSiteSettingsSelect = {
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
} as const

/**
 * Optimized fetcher for Site Settings used by both Header and Footer.
 * Consolidates all necessary fields into a single request with a unified cache key.
 */
export const getCachedSiteSettings = () =>
  getCachedGlobal('site-settings', 2, {
    ...baseSiteSettingsSelect,
    contactNumbers: {
      number: true,
    },
  })()

export const getSiteSettings = () =>
  getCachedGlobal('site-settings', 2, {
    ...baseSiteSettingsSelect,
    contactNumbers: {
      number: true,
      hasWhatsApp: true,
      hasViber: true,
    },
  })()
