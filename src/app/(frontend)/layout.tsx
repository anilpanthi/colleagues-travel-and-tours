import React from 'react'
import './styles.css'
import { Social } from '@/globals/Social/Social.server'

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body>
        <main>{children}</main>
        <Social />
      </body>
    </html>
  )
}
