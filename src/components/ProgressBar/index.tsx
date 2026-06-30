'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import styles from './index.module.css'

export const ProgressBar = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const startedAtRef = useRef<number | null>(null)
  const currentUrl = useMemo(() => {
    const queryString = searchParams.toString()

    return queryString ? `${pathname}?${queryString}` : pathname
  }, [pathname, searchParams])
  const previousUrlRef = useRef(currentUrl)

  const startProgress = useCallback(() => {
    startedAtRef.current = Date.now()
    setIsVisible(true)
    setProgress((currentProgress) => (currentProgress > 0 && currentProgress < 100 ? currentProgress : 12))
  }, [])

  const completeProgress = useCallback(() => {
    const elapsed = startedAtRef.current ? Date.now() - startedAtRef.current : 0
    const completionDelay = Math.max(120 - elapsed, 0)
    const hideDelay = Math.max(450 - elapsed, 250)

    const completeTimeout = window.setTimeout(() => {
      setProgress(100)
    }, completionDelay)
    const hideTimeout = window.setTimeout(() => {
      startedAtRef.current = null
      setIsVisible(false)
      setProgress(0)
    }, hideDelay)

    return () => {
      window.clearTimeout(completeTimeout)
      window.clearTimeout(hideTimeout)
    }
  }, [])

  useEffect(() => {
    if (previousUrlRef.current === currentUrl) return

    previousUrlRef.current = currentUrl

    if (!startedAtRef.current) {
      startProgress()
    }

    return completeProgress()
  }, [completeProgress, currentUrl, startProgress])

  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      if (e.defaultPrevented) return

      const target = e.target as HTMLElement
      const anchor = target.closest('a')
      const rawHref = anchor?.getAttribute('href')
      const isHashOnlyNavigation =
        rawHref?.startsWith('#') ||
        (anchor &&
          anchor.origin === window.location.origin &&
          anchor.pathname === window.location.pathname &&
          anchor.search === window.location.search &&
          anchor.hash !== window.location.hash)

      if (
        anchor &&
        anchor.href &&
        anchor.target !== '_blank' &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.shiftKey &&
        !e.altKey &&
        anchor.origin === window.location.origin &&
        anchor.href !== window.location.href &&
        !isHashOnlyNavigation
      ) {
        startProgress()
      }
    }

    document.addEventListener('click', handleAnchorClick)
    return () => document.removeEventListener('click', handleAnchorClick)
  }, [startProgress])

  useEffect(() => {
    if (!isVisible || progress >= 100) return

    const interval = window.setInterval(() => {
      setProgress((currentProgress) => {
        if (currentProgress >= 90) return currentProgress

        return currentProgress + (90 - currentProgress) * 0.1
      })
    }, 400)

    return () => window.clearInterval(interval)
  }, [isVisible, progress])

  if (!isVisible || typeof document === 'undefined') return null

  return createPortal(
    <div className={styles.progressBarContainer}>
      <div className={styles.progressBar} style={{ width: `${progress}%` }} />
    </div>,
    document.body,
  )
}
