import config from '@payload-config'
import { getPayload } from 'payload'

import { isRecaptchaRequired } from '@/utilities/recaptchaConfig'
import { verifyRecaptchaToken } from '@/utilities/verifyRecaptcha'

const RECAPTCHA_ACTION = 'form_submit'

type SubmissionField = {
  field: string
  value: string
}

type SubmissionContext = {
  packageId: number
}

type SubmissionType = 'booking' | 'enquiry' | 'flight-booking'

const errorResponse = (message: string, status: number) =>
  Response.json({ errors: [{ message }], status: String(status) }, { status })

const addHostnameVariants = (hostnames: Set<string>, value: string | null) => {
  if (!value) return

  const hostname = value.split(',')[0]?.trim().split(':')[0]?.toLowerCase()
  if (!hostname) return

  hostnames.add(hostname)

  if (hostname.startsWith('www.')) {
    hostnames.add(hostname.slice(4))
  } else {
    hostnames.add(`www.${hostname}`)
  }
}

const addURLHostname = (hostnames: Set<string>, value: string | null) => {
  if (!value) return

  try {
    addHostnameVariants(hostnames, new URL(value).hostname)
  } catch {
    addHostnameVariants(hostnames, value)
  }
}

const getExpectedHostnames = (request: Request): string[] => {
  const hostnames = new Set<string>()
  const headers = request.headers

  addURLHostname(hostnames, request.url)
  addHostnameVariants(hostnames, headers.get('host'))
  addHostnameVariants(hostnames, headers.get('x-forwarded-host'))
  addURLHostname(hostnames, headers.get('origin'))
  addURLHostname(hostnames, headers.get('referer'))
  addURLHostname(hostnames, process.env.NEXT_PUBLIC_SERVER_URL || null)

  return [...hostnames]
}

const parseSubmissionData = (value: unknown): SubmissionField[] | null => {
  if (!Array.isArray(value) || value.length === 0 || value.length > 100) return null

  const fields: SubmissionField[] = []

  for (const item of value) {
    if (!item || typeof item !== 'object' || !('field' in item) || !('value' in item)) {
      return null
    }

    const field = item.field
    const fieldValue = item.value

    if (typeof field !== 'string' || !field || field.length > 200) return null
    if (!['boolean', 'number', 'string'].includes(typeof fieldValue)) return null

    const normalizedValue = String(fieldValue)
    if (normalizedValue.length > 20_000) return null

    fields.push({ field, value: normalizedValue })
  }

  return fields
}

const parseFormID = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isInteger(value) && value > 0) return value

  if (typeof value === 'string' && /^\d+$/.test(value)) {
    const formID = Number(value)

    return Number.isSafeInteger(formID) && formID > 0 ? formID : null
  }

  return null
}

const parseSubmissionContext = (value: unknown): SubmissionContext | null => {
  if (!value || typeof value !== 'object') return null

  const packageId = 'packageId' in value ? parseFormID(value.packageId) : null

  if (!packageId) return null

  return { packageId }
}

const getRelationshipID = (value: unknown): number | null => {
  if (value && typeof value === 'object' && 'id' in value) return parseFormID(value.id)

  return parseFormID(value)
}

export async function POST(request: Request) {
  let body: unknown

  try {
    body = await request.json()
  } catch {
    return errorResponse('Invalid request body.', 400)
  }

  if (!body || typeof body !== 'object') {
    return errorResponse('Invalid request body.', 400)
  }

  const form = parseFormID('form' in body ? body.form : null)
  const botCheck = 'botCheck' in body ? body.botCheck : null
  const recaptchaToken = 'recaptchaToken' in body ? body.recaptchaToken : null
  const submissionData = parseSubmissionData('submissionData' in body ? body.submissionData : null)
  const hasSubmissionContext = 'submissionContext' in body && body.submissionContext != null
  const submissionContext = parseSubmissionContext(
    'submissionContext' in body ? body.submissionContext : null,
  )

  if (!form || !submissionData || (hasSubmissionContext && !submissionContext)) {
    return errorResponse('Invalid form submission.', 400)
  }

  if (typeof botCheck === 'string' && botCheck.trim() !== '') {
    console.warn('Discarded form submission because the honeypot field was filled.', {
      fields: submissionData.map(({ field }) => field),
      form,
    })

    return Response.json({ success: true }, { status: 201 })
  }

  if (isRecaptchaRequired()) {
    if (typeof recaptchaToken !== 'string') {
      return errorResponse('Please complete the security verification.', 400)
    }

    const verification = await verifyRecaptchaToken(
      recaptchaToken,
      getExpectedHostnames(request),
      RECAPTCHA_ACTION,
    )
    if (!verification.success) {
      console.warn('reCAPTCHA rejected a form submission', verification.errorCodes)
      return errorResponse('Security verification failed. Please try again.', 403)
    }
  }

  try {
    const payload = await getPayload({ config })
    const siteSettings = await payload.findGlobal({
      slug: 'site-settings',
      depth: 0,
      overrideAccess: false,
    })
    let submissionType: SubmissionType | undefined
    let packageName: string | undefined

    if (getRelationshipID(siteSettings.bookingForm) === form) {
      submissionType = 'booking'
    } else if (getRelationshipID(siteSettings.enquiryForm) === form) {
      submissionType = 'enquiry'
    } else if (getRelationshipID(siteSettings.flightBookingForm) === form) {
      submissionType = 'flight-booking'
    }

    if (submissionContext) {
      if (submissionType !== 'booking' && submissionType !== 'enquiry') {
        return errorResponse('This form is not configured for package submissions.', 400)
      }

      try {
        const selectedPackage = await payload.findByID({
          collection: 'packages',
          id: submissionContext.packageId,
          depth: 0,
          overrideAccess: false,
        })

        packageName = selectedPackage.title
      } catch {
        return errorResponse('The selected package could not be found.', 400)
      }
    }

    const submission = await payload.create({
      collection: 'form-submissions',
      data: {
        form,
        submissionData: packageName
          ? [...submissionData, { field: 'packageName', value: packageName }]
          : submissionData,
        package: submissionContext?.packageId,
        submissionType,
      },
    })

    return Response.json(submission, { status: 201 })
  } catch (error) {
    console.error('Unable to create form submission', error)
    return errorResponse('Unable to submit the form. Please try again.', 500)
  }
}
