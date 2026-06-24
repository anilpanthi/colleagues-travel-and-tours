const SITEVERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify'

type RecaptchaVerificationResponse = {
  action?: string
  'error-codes'?: string[]
  hostname?: string
  score?: number
  success: boolean
}

export type RecaptchaVerificationResult = {
  errorCodes: string[]
  success: boolean
}

export async function verifyRecaptchaToken(
  token: string,
  expectedHostnames: string[],
  expectedAction: string,
): Promise<RecaptchaVerificationResult> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY
  const minimumScore = Number(process.env.RECAPTCHA_MIN_SCORE || 0.3)

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
    const actionMatches = result.action === expectedAction
    const hostnameMatches = Boolean(result.hostname && expectedHostnames.includes(result.hostname))
    const scoreMatches = typeof result.score === 'number' && result.score >= minimumScore
    const verificationMatches = actionMatches && hostnameMatches && scoreMatches

    return {
      errorCodes: verificationMatches
        ? result['error-codes'] || []
        : [
            ...(actionMatches ? [] : ['action-mismatch']),
            ...(hostnameMatches ? [] : ['hostname-mismatch']),
            ...(scoreMatches ? [] : ['score-too-low']),
          ],
      success: result.success && verificationMatches,
    }
  } catch (error) {
    console.error('reCAPTCHA verification failed', error)
    return { errorCodes: ['internal-error'], success: false }
  } finally {
    clearTimeout(timeout)
  }
}
