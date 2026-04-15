import { FooterClient } from './Footer.client'

import type { SiteSetting, Media as MediaType } from '@/payload-types'

export async function Footer({
  footerColumns,
  footerBottom,
  logos,
  socialLinks,
  contactInfo,
  address,
  emails,
}: {
  footerColumns?: SiteSetting['footerColumns']
  footerBottom?: SiteSetting['footerBottom']
  logos?: MediaType | number | null
  socialLinks?: SiteSetting['socialLinks']
  contactInfo?: SiteSetting['contactNumbers']
  address?: SiteSetting['address']
  emails?: SiteSetting['emailAddresses']
}) {
  return (
    <FooterClient
      footerColumns={footerColumns}
      footerBottom={footerBottom}
      logos={logos}
      socialLinks={socialLinks}
      contactInfo={contactInfo}
      address={address}
      emails={emails}
    />
  )
}
