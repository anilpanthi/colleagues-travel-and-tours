'use client'

import Script from 'next/script'
import { useCallback, useEffect, useRef } from 'react'

import classes from './index.module.scss'

type TurnstileAPI = {
  remove: (widgetID: string) => void
  render: (
    container: HTMLElement,
    options: {
      action: string
      appearance: 'always'
      callback: (token: string) => void
      'error-callback': () => void
      'expired-callback': () => void
      sitekey: string
      size: 'flexible'
      theme: 'auto'
    },
  ) => string
}

declare global {
  interface Window {
    turnstile?: TurnstileAPI
  }
}

interface TurnstileProps {
  onTokenChange: (token: string | null) => void
}

const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

export function Turnstile({ onTokenChange }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIDRef = useRef<string | null>(null)

  const renderWidget = useCallback(() => {
    if (!siteKey || !containerRef.current || !window.turnstile || widgetIDRef.current) return

    widgetIDRef.current = window.turnstile.render(containerRef.current, {
      action: 'form_submission',
      appearance: 'always',
      callback: (token) => onTokenChange(token),
      'error-callback': () => onTokenChange(null),
      'expired-callback': () => onTokenChange(null),
      sitekey: siteKey,
      size: 'flexible',
      theme: 'auto',
    })
  }, [onTokenChange])

  useEffect(() => {
    renderWidget()

    return () => {
      if (widgetIDRef.current && window.turnstile) {
        window.turnstile.remove(widgetIDRef.current)
        widgetIDRef.current = null
      }
    }
  }, [renderWidget])

  if (!siteKey) {
    return null
  }

  return (
    <>
      <Script
        id="cloudflare-turnstile"
        onLoad={renderWidget}
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
      />
      <div className={classes.widget} ref={containerRef} />
    </>
  )
}
