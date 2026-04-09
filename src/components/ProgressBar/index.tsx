'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import styles from './index.module.css'

export const ProgressBar = () => {
  const pathname = usePathname()
  const [progress, setProgress] = useState(0)
  const [isNavigating, setIsNavigating] = useState(false)

  useEffect(() => {
    // When pathname changes, navigation has finished
    setIsNavigating(false)
    setProgress(100)
    
    const timeout = setTimeout(() => {
      setProgress(0)
    }, 400)

    return () => clearTimeout(timeout)
  }, [pathname])

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
        anchor.pathname !== window.location.pathname
      ) {
        setIsNavigating(true)
        setProgress(10)
      }
    }

    document.addEventListener('click', handleAnchorClick)
    return () => document.removeEventListener('click', handleAnchorClick)
  }, [])

  useEffect(() => {
    if (isNavigating) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev
          return prev + (90 - prev) * 0.1
        })
      }, 500)
      return () => clearInterval(interval)
    }
  }, [isNavigating])

  if (progress === 0) return null

  return (
    <div className={styles.progressBarContainer}>
      <div 
        className={styles.progressBar} 
        style={{ width: `${progress}%`, opacity: progress === 100 ? 0 : 1, transition: progress === 100 ? 'opacity 0.4s ease, width 0.3s ease' : 'width 0.3s ease' }} 
      />
    </div>
  )
}
