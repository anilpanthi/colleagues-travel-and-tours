'use client'

import Script from 'next/script'

type ReCaptchaAPI = {
  execute: (siteKey: string, options: { action: string }) => Promise<string>
  ready: (callback: () => void) => void
}

declare global {
  interface Window {
    grecaptcha?: ReCaptchaAPI
  }
}

const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
const SCRIPT_WAIT_TIMEOUT_MS = 10_000
const SCRIPT_WAIT_INTERVAL_MS = 100

function ensureRecaptchaScript(): void {
  if (!siteKey || typeof document === 'undefined' || window.grecaptcha) return
  if (document.getElementById('google-recaptcha')) return

  const script = document.createElement('script')
  script.async = true
  script.defer = true
  script.id = 'google-recaptcha'
  script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`
  document.head.appendChild(script)
}

export function ReCaptchaScript() {
  if (!siteKey) {
    return null
  }

  return (
    <Script
      id="google-recaptcha"
      src={`https://www.google.com/recaptcha/api.js?render=${siteKey}`}
      strategy="afterInteractive"
    />
  )
}

async function waitForRecaptcha(): Promise<ReCaptchaAPI | null> {
  const startedAt = Date.now()

  while (Date.now() - startedAt < SCRIPT_WAIT_TIMEOUT_MS) {
    if (window.grecaptcha) {
      return window.grecaptcha
    }

    await new Promise((resolve) => setTimeout(resolve, SCRIPT_WAIT_INTERVAL_MS))
  }

  return null
}

export async function executeRecaptcha(action: string): Promise<string | null> {
  if (!siteKey) {
    return null
  }

  // Interaction normally mounts ReCaptchaScript ahead of submit. This imperative fallback
  // also covers autofill, programmatic submission, and a submit in the same render tick.
  ensureRecaptchaScript()
  const grecaptcha = await waitForRecaptcha()
  if (!grecaptcha) {
    return null
  }

  return new Promise((resolve) => {
    grecaptcha.ready(() => {
      grecaptcha
        .execute(siteKey, { action })
        .then(resolve)
        .catch(() => resolve(null))
    })
  })
}
