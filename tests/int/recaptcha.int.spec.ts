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
    mockSiteverify({ action: 'form_submit', hostname: 'example.com', score: 0.9, success: true })

    await expect(
      verifyRecaptchaToken('valid-token', ['example.com'], 'form_submit'),
    ).resolves.toEqual({
      errorCodes: [],
      success: true,
    })
  })

  it.each([
    ['development', 'test-site-key', false],
    ['test', 'test-site-key', false],
    ['production', '', false],
    ['production', 'test-site-key', true],
  ])(
    'is required in the browser only when production has a site key',
    (environment, siteKey, expected) => {
      vi.stubEnv('NODE_ENV', environment)
      vi.stubEnv('NEXT_PUBLIC_RECAPTCHA_SITE_KEY', siteKey)

      expect(isRecaptchaRequired()).toBe(expected)
    },
  )

  it.each([
    ['', 'test-secret', false],
    ['test-site-key', '', false],
    ['test-site-key', 'test-secret', true],
  ])(
    'is required on the server only when production has both reCAPTCHA keys',
    (siteKey, secretKey, expected) => {
      vi.stubGlobal('window', undefined)
      vi.stubEnv('NODE_ENV', 'production')
      vi.stubEnv('NEXT_PUBLIC_RECAPTCHA_SITE_KEY', siteKey)
      vi.stubEnv('RECAPTCHA_SECRET_KEY', secretKey)

      expect(isRecaptchaRequired()).toBe(expected)
    },
  )

  it('rejects tokens with a mismatched hostname', async () => {
    vi.stubEnv('RECAPTCHA_SECRET_KEY', 'test-secret')
    mockSiteverify({
      action: 'form_submit',
      hostname: 'other.example.com',
      score: 0.9,
      success: true,
    })

    await expect(
      verifyRecaptchaToken('valid-token', ['example.com'], 'form_submit'),
    ).resolves.toEqual({
      errorCodes: ['hostname-mismatch'],
      success: false,
    })
  })

  it('rejects tokens with a mismatched action', async () => {
    vi.stubEnv('RECAPTCHA_SECRET_KEY', 'test-secret')
    mockSiteverify({ action: 'other_action', hostname: 'example.com', score: 0.9, success: true })

    await expect(
      verifyRecaptchaToken('valid-token', ['example.com'], 'form_submit'),
    ).resolves.toEqual({
      errorCodes: ['action-mismatch'],
      success: false,
    })
  })

  it('rejects tokens below the minimum score', async () => {
    vi.stubEnv('RECAPTCHA_SECRET_KEY', 'test-secret')
    mockSiteverify({ action: 'form_submit', hostname: 'example.com', score: 0.1, success: true })

    await expect(
      verifyRecaptchaToken('valid-token', ['example.com'], 'form_submit'),
    ).resolves.toEqual({
      errorCodes: ['score-too-low'],
      success: false,
    })
  })
})
