'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import styles from './index.module.css'

const PROGRESS_BAR_CONTAINER_ID = 'route-progress-bar'
const PROGRESS_BAR_ID = 'route-progress-bar-inner'

export const ProgressBar = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const startedAtRef = useRef<number | null>(null)
  const progressRef = useRef(0)
  const trickleIntervalRef = useRef<number | null>(null)
  const currentUrl = useMemo(() => {
    const queryString = searchParams.toString()

    return queryString ? `${pathname}?${queryString}` : pathname
  }, [pathname, searchParams])
  const previousUrlRef = useRef(currentUrl)

  const getProgressBar = useCallback(() => {
    let container = document.getElementById(PROGRESS_BAR_CONTAINER_ID)
    let bar = document.getElementById(PROGRESS_BAR_ID)

    if (!container) {
      container = document.createElement('div')
      container.id = PROGRESS_BAR_CONTAINER_ID
      container.className = styles.progressBarContainer
      document.body.appendChild(container)
    }

    if (!bar) {
      bar = document.createElement('div')
      bar.id = PROGRESS_BAR_ID
      bar.className = styles.progressBar
      container.appendChild(bar)
    }

    return { bar, container }
  }, [])

  const stopTrickle = useCallback(() => {
    if (trickleIntervalRef.current) {
      window.clearInterval(trickleIntervalRef.current)
      trickleIntervalRef.current = null
    }
  }, [])

  const startProgress = useCallback(() => {
    const { bar, container } = getProgressBar()

    startedAtRef.current = Date.now()
    progressRef.current =
      progressRef.current > 0 && progressRef.current < 100 ? progressRef.current : 12

    container.style.display = 'block'
    bar.style.width = `${progressRef.current}%`

    if (!trickleIntervalRef.current) {
      trickleIntervalRef.current = window.setInterval(() => {
        if (progressRef.current >= 90) return

        const { bar: currentBar } = getProgressBar()
        progressRef.current = progressRef.current + (90 - progressRef.current) * 0.1
        currentBar.style.width = `${progressRef.current}%`
      }, 400)
    }
  }, [getProgressBar])

  const completeProgress = useCallback(() => {
    const elapsed = startedAtRef.current ? Date.now() - startedAtRef.current : 0
    const completionDelay = Math.max(120 - elapsed, 0)
    const hideDelay = Math.max(450 - elapsed, 250)

    const completeTimeout = window.setTimeout(() => {
      const { bar } = getProgressBar()
      progressRef.current = 100
      bar.style.width = '100%'
    }, completionDelay)
    const hideTimeout = window.setTimeout(() => {
      const { bar, container } = getProgressBar()
      stopTrickle()
      startedAtRef.current = null
      progressRef.current = 0
      container.style.display = 'none'
      bar.style.width = '0%'
    }, hideDelay)

    return () => {
      window.clearTimeout(completeTimeout)
      window.clearTimeout(hideTimeout)
    }
  }, [getProgressBar, stopTrickle])

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

    document.addEventListener('click', handleAnchorClick, { capture: true })

    return () => {
      document.removeEventListener('click', handleAnchorClick, { capture: true })
    }
  }, [startProgress])

  useEffect(() => {
    return () => {
      stopTrickle()
      document.getElementById(PROGRESS_BAR_CONTAINER_ID)?.remove()
    }
  }, [stopTrickle])

  return null
}
