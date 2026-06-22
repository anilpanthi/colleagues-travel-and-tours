import { afterEach, describe, expect, it, vi } from 'vitest'

import { verifyTurnstileToken } from '@/utilities/verifyTurnstile'
import { isTurnstileRequired } from '@/utilities/turnstileConfig'

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

describe('Turnstile verification', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it('accepts a valid token for the expected action and hostname', async () => {
    vi.stubEnv('TURNSTILE_SECRET_KEY', 'test-secret')
    mockSiteverify({ action: 'form_submission', hostname: 'example.com', success: true })

    await expect(verifyTurnstileToken('valid-token', 'example.com')).resolves.toEqual({
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

    expect(isTurnstileRequired()).toBe(expected)
  })

  it.each([
    [{ action: 'different_action', hostname: 'example.com', success: true }, 'action-mismatch'],
    [
      { action: 'form_submission', hostname: 'other.example.com', success: true },
      'hostname-mismatch',
    ],
  ])('rejects tokens with mismatched context', async (siteverifyResult, errorCode) => {
    vi.stubEnv('TURNSTILE_SECRET_KEY', 'test-secret')
    mockSiteverify(siteverifyResult)

    await expect(verifyTurnstileToken('valid-token', 'example.com')).resolves.toEqual({
      errorCodes: [errorCode],
      success: false,
    })
  })
})
