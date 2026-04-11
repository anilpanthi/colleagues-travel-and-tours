import React from 'react'
import type { Metadata } from 'next'

import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { Inter, Jost } from 'next/font/google'
import { getServerSideURL } from '@/utilities/getURL'

import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import './global.css'

import { ProgressBar } from '@/components/ProgressBar'

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
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

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        <Providers>
          <div className="layout-wrapper">
            <ProgressBar />

            {/* <Header />
            <main className="main-content">{children}</main>
            <Footer /> */}
          </div>
        </Providers>
      </body>
    </html>
  )
}
