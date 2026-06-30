import React from 'react'
import { notFound } from 'next/navigation'
import { queryPageBySlug } from '../[...slug]/queries'
import { RenderHero } from '@/heros/RenderHero'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import PageClient from '../[...slug]/page.client'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { draftMode } from 'next/headers'
import { MapPin, Phone, Mail } from 'lucide-react'
import { getSiteSettings } from '@/utilities/getSiteSettings'
import { LazyEmbed } from '@/components/LazyEmbed'
import { isPayloadBuildTime } from '@/utilities/isBuildTime'
import styles from './page.module.css'

export const dynamic = 'force-dynamic'

const fallbackMapSrc =
  'https://www.openstreetmap.org/export/embed.html?bbox=-122.40428388118745%2C37.781682705573424%2C-122.39250361919404%2C37.78841724035677&layer=mapnik&marker=37.78505004746624%2C-122.39839375019073'

const allowedMapHosts = new Set([
  'maps.google.com',
  'www.google.com',
  'google.com',
  'www.openstreetmap.org',
  'openstreetmap.org',
])

const getMapIframeSrc = (embedCode?: string | null): string => {
  if (!embedCode) return fallbackMapSrc

  const iframeSrcMatch = embedCode.match(/<iframe[^>]+src=["']([^"']+)["']/i)
  const rawSrc = iframeSrcMatch?.[1] || embedCode

  try {
    const url = new URL(rawSrc.replaceAll('&amp;', '&'))

    if (!allowedMapHosts.has(url.hostname)) {
      return fallbackMapSrc
    }

    return url.toString()
  } catch {
    return fallbackMapSrc
  }
}

const getDialableNumber = (number?: string | null): string => number?.replace(/[^\d+]/g, '') || ''

const getWhatsAppUrl = (number?: string | null): string => {
  const dialableNumber = getDialableNumber(number).replace(/^\+/, '')
  return `https://wa.me/${dialableNumber}`
}

const getViberUrl = (number?: string | null): string => {
  const dialableNumber = getDialableNumber(number)
  return `https://viber.me/${dialableNumber}`
}

const WhatsAppIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
    <path
      fill="currentColor"
      d="M12.04 2.01c-5.48 0-9.94 4.43-9.94 9.88 0 1.74.46 3.44 1.33 4.94L2 22l5.3-1.38a10 10 0 0 0 4.74 1.2c5.48 0 9.94-4.43 9.94-9.88s-4.46-9.93-9.94-9.93Zm0 18.1a8.3 8.3 0 0 1-4.23-1.16l-.3-.18-3.14.82.84-3.04-.2-.32a8.08 8.08 0 0 1-1.25-4.34c0-4.51 3.71-8.18 8.28-8.18s8.28 3.67 8.28 8.18-3.72 8.22-8.28 8.22Zm4.54-6.14c-.25-.12-1.48-.73-1.71-.81-.23-.08-.4-.12-.57.12-.17.25-.65.81-.8.98-.15.16-.3.18-.55.06-.25-.12-1.06-.39-2.02-1.24-.75-.66-1.25-1.48-1.4-1.73-.15-.25-.02-.38.11-.5.12-.12.25-.3.38-.44.13-.15.17-.25.25-.42.08-.16.04-.31-.02-.44-.06-.12-.57-1.36-.78-1.86-.2-.49-.41-.42-.57-.43h-.49c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.09s.9 2.42 1.03 2.59c.13.16 1.77 2.69 4.29 3.77.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.48-.6 1.69-1.18.21-.58.21-1.08.15-1.18-.06-.1-.23-.16-.48-.28Z"
    />
  </svg>
)

const ViberIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
    <path
      fill="currentColor"
      d="M17.5 2.7C13.9 2 10.2 2 6.6 2.7 4.3 3.1 2.6 4.9 2.3 7.2a34 34 0 0 0 0 6.5c.3 2.3 2 4.1 4.3 4.5l.4.07v2.84c0 .76.9 1.15 1.45.63l3.04-2.9c2 .07 4-.08 6-.45 2.3-.43 4-2.2 4.3-4.54a34 34 0 0 0 0-6.64c-.3-2.33-2-4.1-4.3-4.52Zm2.55 10.94a3.27 3.27 0 0 1-2.84 3.06 27.5 27.5 0 0 1-5.92.39.88.88 0 0 0-.64.24l-1.88 1.8v-1.55c0-.43-.31-.8-.74-.87l-1.13-.2a3.27 3.27 0 0 1-2.84-3.05 32.1 32.1 0 0 1 0-6.05A3.27 3.27 0 0 1 6.9 4.36a27.6 27.6 0 0 1 10.28 0 3.27 3.27 0 0 1 2.84 3.05c.23 2.07.23 4.16.03 6.23ZM15.8 14.8c-.33.35-.83.52-1.3.4-3.15-.78-5.58-3.2-6.37-6.35-.12-.48.05-.97.4-1.3l.53-.5c.35-.34.93-.28 1.2.13l.74 1.1c.2.31.16.72-.1.98l-.32.32c.5 1.02 1.33 1.85 2.36 2.35l.32-.32c.26-.26.67-.3.98-.1l1.1.74c.4.27.47.85.13 1.2l-.67.7Zm-2.08-7.7a.55.55 0 0 1 .62-.46 3.9 3.9 0 0 1 3.24 3.27.55.55 0 1 1-1.08.16 2.8 2.8 0 0 0-2.32-2.35.55.55 0 0 1-.46-.62Zm.03 1.87a.55.55 0 0 1 .64-.44c.8.15 1.43.78 1.58 1.58a.55.55 0 1 1-1.08.2.83.83 0 0 0-.7-.7.55.55 0 0 1-.44-.64Z"
    />
  </svg>
)

export default async function ContactPage() {
  const { isEnabled: draft } = await draftMode()
  const page = await queryPageBySlug({ slug: 'contact-us' })

  if (!page) {
    return notFound()
  }

  const siteSettings = await getSiteSettings()

  // const { companyDetails } = siteSettings
  const { address, contactNumbers, emailAddresses, map: mapEmbed } = siteSettings

  const { hero, layout } = page
  const mapSrc = getMapIframeSrc(mapEmbed)

  return (
    <article className={styles.contactPage}>
      <PageClient />
      <PayloadRedirects disableNotFound url="/contact-us" />
      {draft && <LivePreviewListener />}
      <RenderHero
        {...hero}
        breadcrumbs={page.breadcrumbs || undefined}
        title={hero.title || page.title}
      />
      <div className={styles.contactContainer}>
        <div className={styles.formWrapper}>
          <h3 className={styles.formTitle}>Send us a Message</h3>
          <RenderBlocks blocks={layout} />
        </div>

        <aside className={styles.contactInfo}>
          <h2 className={styles.contactTitle}>Get in Touch</h2>
          <p className={styles.contactDesc}>
            Have questions or ready to plan your next adventure? We are here to help you every step
            of the way.
          </p>

          <ul className={styles.infoList}>
            {address && (
              <li className={styles.infoItem}>
                <div className={styles.infoIcon}>
                  <MapPin size={24} />
                </div>
                <div className={styles.infoText}>
                  <h4>Visit Us</h4>
                  <p>{address}</p>
                </div>
              </li>
            )}
            {contactNumbers && contactNumbers.length > 0 && (
              <li className={styles.infoItem}>
                <div className={styles.infoIcon}>
                  <Phone size={24} />
                </div>
                <div className={styles.infoText}>
                  <h4>Call Us</h4>
                  {contactNumbers.map((item, index) => {
                    const hasNumber = Boolean(item.number)
                    const hasWhatsApp = hasNumber && item.hasWhatsApp
                    const hasViber = hasNumber && item.hasViber

                    return (
                      <p className={styles.phoneLine} key={index}>
                        <span>{item.number}</span>
                        {(hasWhatsApp || hasViber) && (
                          <span className={styles.messagingLinks}>
                            {hasWhatsApp && (
                              <a
                                aria-label={`Message ${item.number} on WhatsApp`}
                                className={`${styles.messagingLink} ${styles.whatsAppLink}`}
                                href={getWhatsAppUrl(item.number)}
                                rel="noopener noreferrer"
                                target="_blank"
                              >
                                <WhatsAppIcon />
                              </a>
                            )}
                            {hasViber && (
                              <a
                                aria-label={`Message ${item.number} on Viber`}
                                className={`${styles.messagingLink} ${styles.viberLink}`}
                                href={getViberUrl(item.number)}
                                rel="noopener noreferrer"
                                target="_blank"
                              >
                                <ViberIcon />
                              </a>
                            )}
                          </span>
                        )}
                      </p>
                    )
                  })}
                </div>
              </li>
            )}
            {emailAddresses && emailAddresses.length > 0 && (
              <li className={styles.infoItem}>
                <div className={styles.infoIcon}>
                  <Mail size={24} />
                </div>
                <div className={styles.infoText}>
                  <h4>Email Us</h4>
                  {emailAddresses.map((item, index) => (
                    <p key={index}>{item.email}</p>
                  ))}
                </div>
              </li>
            )}
          </ul>
        </aside>
      </div>

      <div className={styles.mapSection}>
        <LazyEmbed
          loadImmediately
          title="Contact Map"
          referrerPolicy="no-referrer-when-downgrade"
          src={mapSrc}
        />
      </div>
    </article>
  )
}

export async function generateMetadata() {
  if (isPayloadBuildTime) return {}

  const page = await queryPageBySlug({ slug: 'contact-us' })
  if (!page) return {}

  return {
    alternates: {
      canonical: '/contact-us',
    },
    title: page.meta?.title || page.title,
    description: page.meta?.description,
  }
}
