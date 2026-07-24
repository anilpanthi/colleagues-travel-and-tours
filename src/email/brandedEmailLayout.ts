const BRAND_MARKER = 'data-colleagues-email="true"'
const BRAND_NAME = 'Colleagues Travel & Tours'
const BRAND_TAGLINE = 'Explore more. Experience better.'
const FALLBACK_WEBSITE_URL = 'https://colleaguestravel.com'
const PLAIN_TEXT_HEADER = `COLLEAGUES TRAVEL & TOURS\n${BRAND_TAGLINE}`

export type BrandedEmailLayoutOptions = {
  contactNumbers?: readonly string[]
  emailAddress?: string
  websiteURL?: string
  year?: number
}

const escapeHTML = (value: string): string =>
  value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
      })[character] ?? character,
  )

const normalizeWebsiteURL = (websiteURL?: string): string => {
  try {
    const url = new URL(websiteURL || FALLBACK_WEBSITE_URL)

    if (url.protocol !== 'http:' && url.protocol !== 'https:') return FALLBACK_WEBSITE_URL

    return url.toString().replace(/\/$/, '')
  } catch {
    return FALLBACK_WEBSITE_URL
  }
}

const getWebsiteLabel = (websiteURL: string): string => {
  try {
    return new URL(websiteURL).host.replace(/^www\./, '')
  } catch {
    return 'colleaguestravel.com'
  }
}

const getContactNumbers = (contactNumbers?: readonly string[]): string[] =>
  (contactNumbers ?? [])
    .map((number) => number.trim())
    .filter((number, index, numbers) => Boolean(number) && numbers.indexOf(number) === index)
    .slice(0, 3)

const getTelephoneURL = (phoneNumber: string): string => {
  const digits = phoneNumber.replace(/\D/g, '')

  return `${phoneNumber.startsWith('+') ? '+' : ''}${digits}`
}

const openWebLinksInNewTab = (html: string): string =>
  html.replace(/<a\b([^>]*)>/gi, (anchor, attributes: string) => {
    const hrefMatch = attributes.match(/\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i)
    const href = hrefMatch?.[1] ?? hrefMatch?.[2] ?? hrefMatch?.[3]

    if (!href || /^(?:mailto|sms|tel):/i.test(href)) return anchor

    const newTabAttributes = attributes
      .replace(/\s+target\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
      .replace(/\s+rel\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')

    return `<a${newTabAttributes} target="_blank" rel="noopener noreferrer">`
  })

const extractDocumentParts = (html: string): { content: string; styles: string } => {
  const bodyMatch = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)
  const styles = [...html.matchAll(/<style\b[^>]*>[\s\S]*?<\/style>/gi)]
    .map(([style]) => style)
    .join('\n')

  return {
    content: bodyMatch?.[1] ?? html.replace(/<!doctype[^>]*>/gi, ''),
    styles,
  }
}

export const plainTextToEmailHTML = (text: string): string =>
  escapeHTML(text).replace(/\r?\n/g, '<br />')

export const buildBrandedEmailHTML = (
  emailContent: string,
  options: BrandedEmailLayoutOptions = {},
): string => {
  if (emailContent.includes(BRAND_MARKER)) return emailContent

  const { content, styles } = extractDocumentParts(emailContent)
  const websiteURL = normalizeWebsiteURL(options.websiteURL)
  const websiteLabel = getWebsiteLabel(websiteURL)
  const contactNumbers = getContactNumbers(options.contactNumbers)
  const emailAddress = options.emailAddress?.trim()
  const year = options.year ?? new Date().getFullYear()
  const brandNameHTML = escapeHTML(BRAND_NAME)
  const brandTaglineHTML = escapeHTML(BRAND_TAGLINE)
  const coloredLogoURL = new URL('/email/colleagues-logo-colored.png', websiteURL).toString()
  const whiteLogoURL = new URL('/email/colleagues-logo-white.png', websiteURL).toString()
  const phoneLinksHTML = contactNumbers
    .map((phoneNumber) => {
      const telephoneURL = getTelephoneURL(phoneNumber)
      const phoneNumberHTML = escapeHTML(phoneNumber)

      return telephoneURL
        ? `<a href="tel:${telephoneURL}" style="color: #ffffff; font-weight: 700; text-decoration: none;">${phoneNumberHTML}</a>`
        : phoneNumberHTML
    })
    .join('<span style="color: #66728a;">&nbsp;&nbsp;&bull;&nbsp;&nbsp;</span>')
  const emailLinkHTML = emailAddress
    ? `<a href="mailto:${escapeHTML(emailAddress)}" style="color: #ffffff; font-weight: 700; text-decoration: none;">${escapeHTML(emailAddress)}</a>`
    : ''
  const primaryContactLinksHTML = [
    emailLinkHTML,
    `<a href="${websiteURL}" style="color: #ffffff; font-weight: 700; text-decoration: none;">${escapeHTML(websiteLabel)}</a>`,
  ]
    .filter(Boolean)
    .join('<span style="color: #66728a;">&nbsp;&nbsp;&bull;&nbsp;&nbsp;</span>')

  return openWebLinksInNewTab(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="x-apple-disable-message-reformatting" />
    <title>${brandNameHTML}</title>
    <style>
      body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
      table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
      table { border-collapse: collapse !important; }
      img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
      .email-content h1, .email-content h2, .email-content h3 { color: #172033; line-height: 1.25; margin: 0 0 16px; }
      .email-content p { margin: 0 0 18px; }
      .email-content a { color: #9a6500; font-weight: 700; }
      .email-content img { max-width: 100%; }
      @media only screen and (max-width: 680px) {
        .email-shell-padding { padding: 16px 10px !important; }
        .email-header { padding: 22px 20px !important; }
        .email-content { padding: 30px 22px !important; }
        .email-footer { padding: 26px 22px !important; }
        .email-header-link { display: none !important; }
        .email-cta-logo, .email-cta-copy, .email-cta-action { display: block !important; text-align: left !important; width: 100% !important; }
        .email-cta-logo { padding: 0 0 14px !important; }
        .email-cta-action { padding: 16px 0 0 !important; }
      }
    </style>
    ${styles}
  </head>
  <body ${BRAND_MARKER} style="background-color: #f1f4f8; margin: 0; padding: 0; width: 100%;">
    <div style="display: none; font-size: 1px; color: #f1f4f8; line-height: 1px; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all;">
      A message from Colleagues Travel &amp; Tours.
    </div>
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f1f4f8;">
      <tr>
        <td class="email-shell-padding" align="center" style="padding: 32px 14px;">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 10px 30px rgba(23, 32, 51, 0.08); max-width: 640px; overflow: hidden;">
            <tr>
              <td style="background-color: #e7aa18; font-size: 0; height: 5px; line-height: 5px;">&nbsp;</td>
            </tr>
            <tr>
              <td class="email-header" style="background-color: #172033; padding: 26px 34px;">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td valign="middle">
                      <a href="${websiteURL}" style="display: inline-block; text-decoration: none;">
                        <img src="${whiteLogoURL}" alt="${brandNameHTML}" width="134" style="display: block; height: auto; max-width: 134px; width: 134px;" />
                      </a>
                    </td>
                    <td class="email-header-link" align="right" valign="middle">
                      <a href="${websiteURL}" style="border: 1px solid #43506a; border-radius: 999px; color: #ffffff; display: inline-block; font-family: Arial, Helvetica, sans-serif; font-size: 12px; font-weight: 700; padding: 9px 14px; text-decoration: none;">Visit website&nbsp;&nbsp;&rarr;</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td class="email-content" style="background-color: #ffffff; color: #394258; font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.7; padding: 42px 40px; text-align: left;">
                ${content}
              </td>
            </tr>
            <tr>
              <td style="background-color: #fff8e8; border-top: 1px solid #f5e5b9; padding: 22px 34px;">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td class="email-cta-logo" width="106" valign="middle" style="padding-right: 20px;">
                      <a href="${websiteURL}" style="display: inline-block; text-decoration: none;">
                        <img src="${coloredLogoURL}" alt="${brandNameHTML}" width="92" style="display: block; height: auto; max-width: 92px; width: 92px;" />
                      </a>
                    </td>
                    <td class="email-cta-copy" style="color: #5b4820; font-family: Arial, Helvetica, sans-serif; font-size: 14px; line-height: 21px;">
                      <strong style="color: #172033;">Ready for your next journey?</strong><br />
                      Discover thoughtfully curated trips across Nepal and beyond.
                    </td>
                    <td class="email-cta-action" align="right" valign="middle" style="padding-left: 16px;">
                      <a href="${websiteURL}" style="background-color: #e7aa18; border-radius: 6px; color: #172033; display: inline-block; font-family: Arial, Helvetica, sans-serif; font-size: 13px; font-weight: 800; padding: 11px 16px; text-decoration: none; white-space: nowrap;">Explore trips</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td class="email-footer" style="background-color: #172033; padding: 28px 34px; text-align: center;">
                <p style="color: #ffffff; font-family: Arial, Helvetica, sans-serif; font-size: 17px; font-weight: 800; line-height: 24px; margin: 0 0 4px;">
                  ${brandNameHTML}
                </p>
                <p style="color: #e7aa18; font-family: Georgia, 'Times New Roman', serif; font-size: 14px; font-style: italic; line-height: 22px; margin: 0 0 17px;">
                  ${brandTaglineHTML}
                </p>
                ${
                  phoneLinksHTML
                    ? `<p style="color: #ffffff; font-family: Arial, Helvetica, sans-serif; font-size: 13px; line-height: 23px; margin: 0 0 5px;">
                  ${phoneLinksHTML}
                </p>`
                    : ''
                }
                <p style="color: #ffffff; font-family: Arial, Helvetica, sans-serif; font-size: 13px; line-height: 23px; margin: 0;">
                  ${primaryContactLinksHTML}
                </p>
                <div style="border-top: 1px solid #344058; font-size: 0; line-height: 0; margin: 22px 0 18px;">&nbsp;</div>
                <p style="color: #b8c1d1; font-family: Arial, Helvetica, sans-serif; font-size: 12px; line-height: 19px; margin: 0 0 10px;">
                  You&rsquo;re receiving this message because you contacted our travel team or have an account with us.
                </p>
                <p style="color: #8f9ab0; font-family: Arial, Helvetica, sans-serif; font-size: 11px; line-height: 18px; margin: 0;">
                  &copy; ${year} ${brandNameHTML}. All rights reserved.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`)
}

export const buildBrandedEmailText = (
  emailContent: string,
  options: BrandedEmailLayoutOptions = {},
): string => {
  if (emailContent.startsWith(PLAIN_TEXT_HEADER)) return emailContent

  const websiteURL = normalizeWebsiteURL(options.websiteURL)
  const contactNumbers = getContactNumbers(options.contactNumbers)
  const emailAddress = options.emailAddress?.trim()
  const year = options.year ?? new Date().getFullYear()
  const contactLines = [
    contactNumbers.length > 0 ? `Phone: ${contactNumbers.join(' · ')}` : undefined,
    emailAddress ? `Email: ${emailAddress}` : undefined,
    `Website: ${websiteURL}`,
  ].filter((line): line is string => Boolean(line))

  return `${PLAIN_TEXT_HEADER}\n\n${emailContent.trim()}\n\n---\n${contactLines.join('\n')}\n\n© ${year} ${BRAND_NAME}. All rights reserved.`
}
