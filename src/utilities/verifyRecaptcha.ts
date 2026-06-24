const SITEVERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify'

type RecaptchaVerificationResponse = {
  'error-codes'?: string[]
  hostname?: string
  success: boolean
}

export type RecaptchaVerificationResult = {
  errorCodes: string[]
  success: boolean
}

export async function verifyRecaptchaToken(
  token: string,
  expectedHostname: string,
): Promise<RecaptchaVerificationResult> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY

  if (!secretKey) {
    console.error('RECAPTCHA_SECRET_KEY is not configured')
    return { errorCodes: ['missing-secret-key'], success: false }
  }

  if (!token || token.length > 4096) {
    return { errorCodes: ['invalid-input-response'], success: false }
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10_000)

  try {
    const body = new FormData()
    body.set('secret', secretKey)
    body.set('response', token)

    const response = await fetch(SITEVERIFY_URL, {
      body,
      method: 'POST',
      signal: controller.signal,
    })

    if (!response.ok) {
      return { errorCodes: ['siteverify-request-failed'], success: false }
    }

    const result = (await response.json()) as RecaptchaVerificationResponse
    const hostnameMatches = result.hostname === expectedHostname

    return {
      errorCodes: hostnameMatches ? result['error-codes'] || [] : ['hostname-mismatch'],
      success: result.success && hostnameMatches,
    }
  } catch (error) {
    console.error('reCAPTCHA verification failed', error)
    return { errorCodes: ['internal-error'], success: false }
  } finally {
    clearTimeout(timeout)
  }
}
