import React from 'react'
import type { Metadata } from 'next'

import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { Inter, Jost } from 'next/font/google'
import { getServerSideURL } from '@/utilities/getURL'
import { cn } from '@/utilities/ui'

import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import './global.css'

import { ProgressBar } from '@/components/ProgressBar'

import { getCachedSiteSettings } from '@/utilities/getSiteSettings'

import { FooterClient } from '@/globals/Footer/Footer.client'
import { HeaderClient } from '@/globals/Header/Header.client'

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/fav-icon.svg', type: 'image/svg+xml' },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
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

  const { mainNavigation, logos } = siteSettings

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
      <body>
        <Providers>
          <div className="layout-wrapper">
            <ProgressBar />
            <HeaderClient mainNavigation={mainNavigation} logos={logos} />
            <main className="main-content">{children}</main>
            <FooterClient {...footerData} />
          </div>
        </Providers>
      </body>
    </html>
  )
}
