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
  const currentUrl = useMemo(() => {
    const queryString = searchParams.toString()

    return queryString ? `${pathname}?${queryString}` : pathname
  }, [pathname, searchParams])
  const previousUrlRef = useRef(currentUrl)

  const startProgress = useCallback(() => {
    setIsVisible(true)
    setProgress((currentProgress) => (currentProgress > 0 && currentProgress < 100 ? currentProgress : 12))
  }, [])

  useEffect(() => {
    if (previousUrlRef.current === currentUrl) return

    previousUrlRef.current = currentUrl

    const completeTimeout = window.setTimeout(() => {
      setProgress(100)
    }, 0)
    const hideTimeout = window.setTimeout(() => {
      setIsVisible(false)
      setProgress(0)
    }, 350)

    return () => {
      window.clearTimeout(completeTimeout)
      window.clearTimeout(hideTimeout)
    }
  }, [currentUrl])

  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const anchor = target.closest('a')

      if (
        anchor &&
        anchor.href &&
        anchor.target !== '_blank' &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.shiftKey &&
        !e.altKey &&
        anchor.origin === window.location.origin &&
        anchor.href !== window.location.href
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
