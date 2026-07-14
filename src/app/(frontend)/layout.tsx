import React from 'react'
import type { Metadata, Viewport } from 'next'
import Script from 'next/script'

import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { Inter, Jost } from 'next/font/google'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { unstable_cache } from 'next/cache'
import { getServerSideURL } from '@/utilities/getURL'
import { cn } from '@/utilities/ui'

import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import './global.css'

import { DeferredProgressBar } from '@/components/ProgressBar/DeferredProgressBar'
import { ServiceWorkerRegistration } from '@/components/PWA/ServiceWorkerRegistration'
// import { DeferredGDPRConsent } from '@/components/GDPRConsent/DeferredGDPRConsent'

import { getCachedSiteSettings } from '@/utilities/getSiteSettings'

import { FooterClient } from '@/globals/Footer/Footer.client'
import { HeaderClient } from '@/globals/Header/Header.client'
import { LiveBookingToast, type LiveBookingPackage } from '@/components/LiveBookingToast'
import { ChatSupport } from '@/components/ChatSupport'

const siteURL = getServerSideURL()
const googleTagID = 'G-0W0BY09GS7'

export const metadata: Metadata = {
  metadataBase: new URL(siteURL),
  alternates: {
    canonical: '/',
  },
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

const loadLiveBookingPackages = async (): Promise<LiveBookingPackage[]> => {
  const payload = await getPayload({ config: configPromise })

  const packages = await payload.find({
    collection: 'packages',
    draft: false,
    limit: 12,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
      title: true,
    },
    sort: '-updatedAt',
  })

  return packages.docs
    .map((pkg) => ({
      slug: pkg.slug,
      title: pkg.title,
    }))
    .filter((pkg): pkg is LiveBookingPackage => Boolean(pkg.slug && pkg.title))
}

const getCachedLiveBookingPackages = unstable_cache(
  loadLiveBookingPackages,
  ['live-booking-packages'],
  {
    revalidate: 3600,
    tags: ['live-booking-packages', 'published-packages'],
  },
)

const getLiveBookingPackages = async (): Promise<LiveBookingPackage[]> => {
  try {
    return await getCachedLiveBookingPackages()
  } catch (error) {
    console.error('Error loading packages for live booking notifications:', error)
    return []
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [siteSettings, liveBookingPackages] = await Promise.all([
    getCachedSiteSettings(),
    getLiveBookingPackages(),
  ])

  const { mainNavigation, logos, flightBookingForm, tawkChat } = siteSettings

  const footerData = {
    footerColumns: siteSettings?.footerColumns,
    logos: siteSettings?.logos?.logoDark,
    footerBottom: siteSettings?.footerBottom,
    socialLinks: siteSettings?.socialLinks,
    contactInfo: siteSettings?.contactNumbers,
    address: siteSettings?.address,
    emails: siteSettings?.emailAddresses,
  }

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    '@id': `${siteURL}/#organization`,
    name: 'Colleagues Travel and Tours',
    url: siteURL,
    logo: `${siteURL}/apple-touch-icon.png`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteSettings?.address || 'Indrayani Galli, Chhetrapati',
      addressLocality: 'Kathmandu',
      addressCountry: 'NP',
    },
    email: siteSettings?.emailAddresses?.[0]?.email,
    telephone: siteSettings?.contactNumbers?.[0]?.number,
    sameAs: siteSettings?.socialLinks?.map((item) => item.url).filter(Boolean),
  }

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteURL}/#website`,
    name: 'Colleagues Travel and Tours',
    url: siteURL,
    publisher: {
      '@id': `${siteURL}/#organization`,
    },
  }

  return (
    <html className={cn(inter.variable, jost.variable)} lang="en" suppressHydrationWarning>
      <head>
        <Script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${googleTagID}`}
          strategy="lazyOnload"
        />
        <Script id="google-tag" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${googleTagID}');
          `}
        </Script>
        <InitTheme />
        <script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([organizationJsonLd, websiteJsonLd]),
          }}
          type="application/ld+json"
        />
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
            <LiveBookingToast packages={liveBookingPackages} />
            <ChatSupport propertyId={tawkChat?.propertyId} widgetId={tawkChat?.widgetId} />
            {/* <DeferredGDPRConsent /> */}
          </div>
        </Providers>
      </body>
    </html>
  )
}
