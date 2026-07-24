import { nodemailerAdapter, type NodemailerAdapterArgs } from '@payloadcms/email-nodemailer'
import type { EmailAdapter, SendEmailOptions } from 'payload'

import { getServerSideURL } from '@/utilities/getURL'

import {
  buildBrandedEmailHTML,
  buildBrandedEmailText,
  plainTextToEmailHTML,
  type BrandedEmailLayoutOptions,
} from './brandedEmailLayout'

const UNKNOWN_NODE_PATTERN = /<span[^>]*>\s*unknown node\s*<\/span>/gi

const decodeHTMLEntities = (value: string): string =>
  value.replace(/&(#\d+|#x[\da-f]+|amp|apos|gt|lt|nbsp|quot);/gi, (entity, code: string) => {
    const namedEntities: Record<string, string> = {
      amp: '&',
      apos: "'",
      gt: '>',
      lt: '<',
      nbsp: ' ',
      quot: '"',
    }
    const normalizedCode = code.toLowerCase()

    if (normalizedCode in namedEntities) return namedEntities[normalizedCode]

    const codePoint = normalizedCode.startsWith('#x')
      ? Number.parseInt(normalizedCode.slice(2), 16)
      : Number.parseInt(normalizedCode.slice(1), 10)

    return Number.isSafeInteger(codePoint) && codePoint >= 0 && codePoint <= 0x10ffff
      ? String.fromCodePoint(codePoint)
      : entity
  })

export const sanitizeEmailHTML = (html: string): string => html.replace(UNKNOWN_NODE_PATTERN, '')

export const emailHTMLToPlainText = (html: string): string => {
  const text = sanitizeEmailHTML(html)
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<\s*br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|h[1-6]|li|tr)>/gi, '\n')
    .replace(/<li[^>]*>/gi, '- ')
    .replace(/<[^>]+>/g, '')

  return decodeHTMLEntities(text)
    .replace(/\r/g, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n[ \t]+/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

type EmailCompanyDetails = Pick<BrandedEmailLayoutOptions, 'contactNumbers' | 'emailAddress'>

export const improveEmailMessage = (
  message: SendEmailOptions,
  companyDetails: EmailCompanyDetails = {},
): SendEmailOptions => {
  const sanitizedHTML =
    typeof message.html === 'string' ? sanitizeEmailHTML(message.html) : undefined
  const sourceText =
    typeof message.text === 'string'
      ? message.text
      : sanitizedHTML
        ? emailHTMLToPlainText(sanitizedHTML)
        : undefined

  if (!sanitizedHTML && !sourceText) return message

  const websiteURL = getServerSideURL()
  const html = buildBrandedEmailHTML(sanitizedHTML ?? plainTextToEmailHTML(sourceText ?? ''), {
    ...companyDetails,
    websiteURL,
  })

  return {
    ...message,
    html,
    text: sourceText
      ? buildBrandedEmailText(sourceText, { ...companyDetails, websiteURL })
      : message.text,
  }
}

export const deliverableNodemailerAdapter = async (
  args: NodemailerAdapterArgs,
): Promise<EmailAdapter<unknown>> => {
  const adapter = await nodemailerAdapter(args)

  return ({ payload }) => {
    const initializedAdapter = adapter({ payload })

    return {
      ...initializedAdapter,
      sendEmail: async (message) => {
        let companyDetails: EmailCompanyDetails = {}

        try {
          const siteSettings = await payload.findGlobal({
            slug: 'site-settings',
            depth: 0,
          })

          companyDetails = {
            contactNumbers: siteSettings.contactNumbers
              ?.map(({ number }) => number?.trim())
              .filter((number): number is string => Boolean(number))
              .slice(0, 3),
            emailAddress: siteSettings.emailAddresses
              ?.map(({ email }) => email?.trim())
              .find((email): email is string => Boolean(email)),
          }
        } catch (error) {
          console.error('Unable to load company details for the email footer', error)
        }

        return initializedAdapter.sendEmail(improveEmailMessage(message, companyDetails))
      },
    }
  }
}
