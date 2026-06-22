const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
const TURNSTILE_ACTION = 'form_submission'

type TurnstileVerificationResponse = {
  action?: string
  'error-codes'?: string[]
  hostname?: string
  success: boolean
}

export type TurnstileVerificationResult = {
  errorCodes: string[]
  success: boolean
}

export async function verifyTurnstileToken(
  token: string,
  expectedHostname: string,
): Promise<TurnstileVerificationResult> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY

  if (!secretKey) {
    console.error('TURNSTILE_SECRET_KEY is not configured')
    return { errorCodes: ['missing-secret-key'], success: false }
  }

  if (!token || token.length > 2048) {
    return { errorCodes: ['invalid-input-response'], success: false }
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10_000)

  try {
    const body = new FormData()
    body.set('secret', secretKey)
    body.set('response', token)
    body.set('idempotency_key', crypto.randomUUID())

    const response = await fetch(SITEVERIFY_URL, {
      body,
      method: 'POST',
      signal: controller.signal,
    })

    if (!response.ok) {
      return { errorCodes: ['siteverify-request-failed'], success: false }
    }

    const result = (await response.json()) as TurnstileVerificationResponse
    const actionMatches = result.action === TURNSTILE_ACTION
    const hostnameMatches = result.hostname === expectedHostname
    const verificationMatches = actionMatches && hostnameMatches

    return {
      errorCodes: verificationMatches
        ? result['error-codes'] || []
        : [actionMatches ? 'hostname-mismatch' : 'action-mismatch'],
      success: result.success && verificationMatches,
    }
  } catch (error) {
    console.error('Turnstile verification failed', error)
    return { errorCodes: ['internal-error'], success: false }
  } finally {
    clearTimeout(timeout)
  }
}
