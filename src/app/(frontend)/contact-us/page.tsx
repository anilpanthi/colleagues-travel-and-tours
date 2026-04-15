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
import type { Media } from '@/payload-types'

import styles from './page.module.css'
import Container from '@/components/ui/Container'
import { Breadcrumbs } from '@/components/Breadcrumbs/Index'

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
                  {contactNumbers.map((item, index) => (
                    <p key={index}>{item.number}</p>
                  ))}
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
        {mapEmbed ? (
          <div dangerouslySetInnerHTML={{ __html: mapEmbed }} />
        ) : (
          <iframe
            title="Contact Map"
            src="https://www.openstreetmap.org/export/embed.html?bbox=-122.40428388118745%2C37.781682705573424%2C-122.39250361919404%2C37.78841724035677&amp;layer=mapnik&amp;marker=37.78505004746624%2C-122.39839375019073"
          />
        )}
      </div>
    </article>
  )
}

export async function generateMetadata() {
  const page = await queryPageBySlug({ slug: 'contact-us' })
  if (!page) return {}

  return {
    title: page.meta?.title || page.title,
    description: page.meta?.description,
  }
}
