import { getCachedGlobal } from './getGlobals'

const formSelect = {
  id: true,
  title: true,
  fields: true,
  submitButtonLabel: true,
  confirmationType: true,
  confirmationMessage: true,
  redirect: true,
} as const

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
  contactForm: formSelect,
  bookingForm: formSelect,
  flightBookingForm: formSelect,
  enquiryForm: formSelect,
  tawkChat: {
    propertyId: true,
    widgetId: true,
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
