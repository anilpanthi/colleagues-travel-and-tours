'use client'

import Script from 'next/script'
import { useCallback, useEffect, useRef } from 'react'

import classes from './index.module.scss'

type ReCaptchaAPI = {
  render: (
    container: HTMLElement,
    options: {
      callback: (token: string) => void
      'error-callback': () => void
      'expired-callback': () => void
      sitekey: string
      size: 'normal'
      theme: 'light'
    },
  ) => number
  reset: (widgetID?: number) => void
}

declare global {
  interface Window {
    grecaptcha?: ReCaptchaAPI
  }
}

interface ReCaptchaProps {
  onTokenChange: (token: string | null) => void
}

const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY

export function ReCaptcha({ onTokenChange }: ReCaptchaProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIDRef = useRef<number | null>(null)

  const renderWidget = useCallback(() => {
    if (!siteKey || !containerRef.current || !window.grecaptcha || widgetIDRef.current !== null) {
      return
    }

    widgetIDRef.current = window.grecaptcha.render(containerRef.current, {
      callback: (token) => onTokenChange(token),
      'error-callback': () => onTokenChange(null),
      'expired-callback': () => onTokenChange(null),
      sitekey: siteKey,
      size: 'normal',
      theme: 'light',
    })
  }, [onTokenChange])

  useEffect(() => {
    renderWidget()
  }, [renderWidget])

  useEffect(() => {
    return () => {
      if (widgetIDRef.current !== null && window.grecaptcha) {
        window.grecaptcha.reset(widgetIDRef.current)
      }
    }
  }, [])

  if (!siteKey) {
    return null
  }

  return (
    <>
      <Script
        id="google-recaptcha"
        onLoad={renderWidget}
        src="https://www.google.com/recaptcha/api.js?render=explicit"
        strategy="afterInteractive"
      />
      <div className={classes.widget} ref={containerRef} />
    </>
  )
}
