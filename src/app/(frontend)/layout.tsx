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
import { Header } from '@/globals/Header/Header.server'
import { Footer } from '@/globals/Footer/Footer.server'
import { getCachedSiteSettings } from '@/utilities/getSiteSettings'

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

  const { mainNavigation, logos, footerColumns, footerBottom } = siteSettings

  return (
    <html className={cn(inter.variable, jost.variable)} lang="en" suppressHydrationWarning>
      <head>
        <InitTheme />
      </head>
      <body>
        <Providers>
          <div className="layout-wrapper">
            <ProgressBar />
            <Header mainNavigation={mainNavigation} logos={logos} />
            <main className="main-content">
              {children}
            </main>
            <Footer footerColumns={footerColumns} footerBottom={footerBottom} />
          </div>
        </Providers>
      </body>
    </html>
  )
}
