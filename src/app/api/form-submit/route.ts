import config from '@payload-config'
import { getPayload } from 'payload'

import { verifyTurnstileToken } from '@/utilities/verifyTurnstile'
import { isTurnstileRequired } from '@/utilities/turnstileConfig'

type SubmissionField = {
  field: string
  value: string
}

const errorResponse = (message: string, status: number) =>
  Response.json({ errors: [{ message }], status: String(status) }, { status })

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

  const form = 'form' in body ? body.form : null
  const companyWebsite = 'companyWebsite' in body ? body.companyWebsite : null
  const turnstileToken = 'turnstileToken' in body ? body.turnstileToken : null
  const submissionData = parseSubmissionData('submissionData' in body ? body.submissionData : null)

  if (typeof form !== 'number' || !Number.isInteger(form) || form <= 0 || !submissionData) {
    return errorResponse('Invalid form submission.', 400)
  }

  if (companyWebsite !== null && companyWebsite !== '') {
    return Response.json({ success: true }, { status: 201 })
  }

  if (isTurnstileRequired()) {
    if (typeof turnstileToken !== 'string') {
      return errorResponse('Please complete the security verification.', 400)
    }

    const verification = await verifyTurnstileToken(turnstileToken, new URL(request.url).hostname)
    if (!verification.success) {
      console.warn('Turnstile rejected a form submission', verification.errorCodes)
      return errorResponse('Security verification failed. Please try again.', 403)
    }
  }

  try {
    const payload = await getPayload({ config })

    const submission = await payload.create({
      collection: 'form-submissions',
      data: {
        form,
        submissionData,
      },
    })

    return Response.json(submission, { status: 201 })
  } catch (error) {
    console.error('Unable to create form submission', error)
    return errorResponse('Unable to submit the form. Please try again.', 500)
  }
}
