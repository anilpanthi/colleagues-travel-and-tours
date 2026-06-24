import { afterEach, describe, expect, it, vi } from 'vitest'

import { isRecaptchaRequired } from '@/utilities/recaptchaConfig'
import { verifyRecaptchaToken } from '@/utilities/verifyRecaptcha'

const mockSiteverify = (result: Record<string, unknown>) => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue(
      new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      }),
    ),
  )
}

describe('reCAPTCHA verification', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it('accepts a valid token for the expected hostname', async () => {
    vi.stubEnv('RECAPTCHA_SECRET_KEY', 'test-secret')
    mockSiteverify({ hostname: 'example.com', success: true })

    await expect(verifyRecaptchaToken('valid-token', 'example.com')).resolves.toEqual({
      errorCodes: [],
      success: true,
    })
  })

  it.each([
    ['development', false],
    ['test', false],
    ['production', true],
  ])('is required only in production', (environment, expected) => {
    vi.stubEnv('NODE_ENV', environment)

    expect(isRecaptchaRequired()).toBe(expected)
  })

  it('rejects tokens with a mismatched hostname', async () => {
    vi.stubEnv('RECAPTCHA_SECRET_KEY', 'test-secret')
    mockSiteverify({ hostname: 'other.example.com', success: true })

    await expect(verifyRecaptchaToken('valid-token', 'example.com')).resolves.toEqual({
      errorCodes: ['hostname-mismatch'],
      success: false,
    })
  })
})
