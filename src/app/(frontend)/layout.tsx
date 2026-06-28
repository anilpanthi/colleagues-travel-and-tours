import React from 'react'
import type { Metadata, Viewport } from 'next'

import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { Inter, Jost } from 'next/font/google'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getServerSideURL } from '@/utilities/getURL'
import { cn } from '@/utilities/ui'

import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import './global.css'

import { DeferredProgressBar } from '@/components/ProgressBar/DeferredProgressBar'
import { ServiceWorkerRegistration } from '@/components/PWA/ServiceWorkerRegistration'
import { DeferredGDPRConsent } from '@/components/GDPRConsent/DeferredGDPRConsent'

import { getCachedSiteSettings } from '@/utilities/getSiteSettings'

import { FooterClient } from '@/globals/Footer/Footer.client'
import { HeaderClient } from '@/globals/Header/Header.client'
import { LiveBookingToast } from '@/components/LiveBookingToast'

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  manifest: '/site.webmanifest',
  applicationName: 'Colleagues Travel and Tours',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Colleagues',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
}

export const viewport: Viewport = {
  themeColor: '#f59e0b',
}

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})
const jost = Jost({
  subsets: ['latin'],
  variable: '--font-jost',
})

const getLiveBookingPackageTitles = async (): Promise<string[]> => {
  try {
    const payload = await getPayload({ config: configPromise })

    const packages = await payload.find({
      collection: 'packages',
      draft: false,
      limit: 50,
      overrideAccess: false,
      pagination: false,
      select: {
        title: true,
      },
      sort: '-updatedAt',
    })

    return packages.docs.map((pkg) => pkg.title).filter((title): title is string => Boolean(title))
  } catch (error) {
    console.error('Error loading packages for live booking notifications:', error)
    return []
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [siteSettings, liveBookingPackageTitles] = await Promise.all([
    getCachedSiteSettings(),
    getLiveBookingPackageTitles(),
  ])

  const { mainNavigation, logos, flightBookingForm } = siteSettings

  const footerData = {
    footerColumns: siteSettings?.footerColumns,
    logos: siteSettings?.logos?.logoDark,
    footerBottom: siteSettings?.footerBottom,
    socialLinks: siteSettings?.socialLinks,
    contactInfo: siteSettings?.contactNumbers,
    address: siteSettings?.address,
    emails: siteSettings?.emailAddresses,
  }

  return (
    <html className={cn(inter.variable, jost.variable)} lang="en" suppressHydrationWarning>
      <head>
        <InitTheme />
      </head>
      <body suppressHydrationWarning>
        <ServiceWorkerRegistration />
        <Providers>
          <div className="layout-wrapper">
            <DeferredProgressBar />
            <HeaderClient
              mainNavigation={mainNavigation}
              logos={logos}
              flightBookingForm={flightBookingForm}
            />
            <main className="main-content">{children}</main>
            <FooterClient {...footerData} />
            <LiveBookingToast packageTitles={liveBookingPackageTitles} />
            <DeferredGDPRConsent />
          </div>
        </Providers>
      </body>
    </html>
  )
}
