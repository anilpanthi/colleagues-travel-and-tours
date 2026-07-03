import { describe, expect, it } from 'vitest'

import { POST } from '@/app/api/form-submit/route'

describe('form submission honeypot', () => {
  it('silently accepts but discards submissions that fill the honeypot', async () => {
    const response = await POST(
      new Request('http://localhost/api/form-submit', {
        body: JSON.stringify({
          botCheck: 'https://spam.example',
          form: 1,
          submissionData: [{ field: 'email', value: 'bot@example.com' }],
        }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      }),
    )

    expect(response.status).toBe(201)
    await expect(response.json()).resolves.toEqual({ success: true })
  })
})
