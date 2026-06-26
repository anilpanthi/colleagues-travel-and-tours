import React, { Suspense } from 'react'
import type { Metadata, Viewport } from 'next'

import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { Inter, Jost } from 'next/font/google'
import { getServerSideURL } from '@/utilities/getURL'
import { cn } from '@/utilities/ui'

import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import './global.css'

import { ProgressBar } from '@/components/ProgressBar'
import { ServiceWorkerRegistration } from '@/components/PWA/ServiceWorkerRegistration'
import { GDPRConsent } from '@/components/GDPRConsent'

import { getCachedSiteSettings } from '@/utilities/getSiteSettings'

import { FooterClient } from '@/globals/Footer/Footer.client'
import { HeaderClient } from '@/globals/Header/Header.client'

export const dynamic = 'force-dynamic'

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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const siteSettings = await getCachedSiteSettings()

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
            <Suspense fallback={null}>
              <ProgressBar />
            </Suspense>
            <HeaderClient
              mainNavigation={mainNavigation}
              logos={logos}
              flightBookingForm={flightBookingForm}
            />
            <main className="main-content">{children}</main>
            <FooterClient {...footerData} />
            <GDPRConsent />
          </div>
        </Providers>
      </body>
    </html>
  )
}
