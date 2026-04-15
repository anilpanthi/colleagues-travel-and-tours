'use client'

import React from 'react'
import type { SiteSetting } from '@/payload-types'
import styles from './Footer.module.scss'
import Container from '@/components/ui/Container'
import Link from 'next/link'

import type { Media as MediaType } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { MapPin, Phone, Mail, icons } from 'lucide-react'
import { generatePath } from '@/utilities/generatePath'

interface FooterClientProps {
  footerColumns: SiteSetting['footerColumns']
  footerBottom: SiteSetting['footerBottom']
  logos?: MediaType | number | null
  socialLinks?: SiteSetting['socialLinks']
  contactInfo?: SiteSetting['contactNumbers']
  address?: SiteSetting['address']
  emails?: SiteSetting['emailAddresses']
}

export const FooterClient: React.FC<FooterClientProps> = ({
  footerColumns,
  footerBottom,
  logos,
  socialLinks,
  contactInfo,
  address,
  emails,
}) => {
  console.log(contactInfo)
  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.footerGrid}>
          {footerColumns?.map((col, index) => {
            if (col.type === 'brand') {
              return (
                <div key={index} className={styles.footerCol}>
                  {logos && (
                    <Link href="/" className={styles.footerBrand}>
                      <Media resource={logos as MediaType} imgClassName={styles.footerLogo} />
                    </Link>
                  )}
                  {col.description && <p className={styles.footerDesc}>{col.description}</p>}
                  {socialLinks && socialLinks.length > 0 && (
                    <div className={styles.socialLinks}>
                      {socialLinks.map((social, i) => {
                        const icon = social.icon

                        return (
                          <a
                            key={i}
                            href={social.url || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.socialLink}
                          >
                            <Media
                              resource={icon as MediaType}
                              imgClassName={styles.socialIconMedia}
                            />
                          </a>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            }

            if (col.type === 'nav') {
              if (!col.navItems || col.navItems.length === 0) {
                return null
              }

              return (
                <div key={index} className={styles.footerCol}>
                  <h4 className={styles.footerTitle}>{col.title}</h4>
                  <ul className={styles.footerLinks}>
                    {col.navItems.map((navItem) => {
                      const link = navItem.link

                      return (
                        <li key={navItem?.id}>
                          <CMSLink {...link} url={link.url} />
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )
            }

            if (col.type === 'contact') {
              const displayAddress = address
              const displayPhone = contactInfo?.[0]?.number
              const displayEmail = emails?.[0]?.email
              console.log(displayAddress, displayPhone, displayEmail)
              return (
                <div key={index} className={styles.footerCol}>
                  <h4 className={styles.footerTitle}>{col.title}</h4>
                  <ul className={styles.contactInfo}>
                    {displayAddress && (
                      <li>
                        <MapPin className={styles.iconContact} />
                        <span>{displayAddress}</span>
                      </li>
                    )}
                    {displayPhone && (
                      <li>
                        <Phone className={styles.iconContact} />
                        <span>{displayPhone}</span>
                      </li>
                    )}
                    {displayEmail && (
                      <li>
                        <Mail className={styles.iconContact} />
                        <span>{displayEmail}</span>
                      </li>
                    )}
                  </ul>
                </div>
              )
            }

            return null
          })}
        </div>

        {footerBottom && (
          <div className={styles.footerBottom}>
            <p>{footerBottom.copyright}</p>
            <p className={styles.poweredBy}>
              Powered by
              <a href="https://www.antiqcode.com" target="_blank" rel="noopener noreferrer">
                antiqcode
              </a>
            </p>
            {footerBottom.legalLinks && footerBottom.legalLinks.length > 0 && (
              <div className={styles.footerLegal}>
                {footerBottom.legalLinks.map((item, i) => {
                  const { type, url, reference, label } = item.link
                  let href = url

                  if (type === 'reference' && reference?.value) {
                    const value = reference.value
                    if (typeof value === 'object' && 'slug' in value) {
                      href = generatePath(reference.relationTo as string, value.slug)
                    } else {
                      href = generatePath(reference.relationTo as string, String(value))
                    }
                  }

                  return (
                    <React.Fragment key={i}>
                      <Link href={href || '#'}>{label}</Link>
                      {i < footerBottom.legalLinks!.length - 1 && (
                        <span className={styles.separator}>|</span>
                      )}
                    </React.Fragment>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </Container>
    </footer>
  )
}
