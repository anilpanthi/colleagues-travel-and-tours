'use client'
import Link from 'next/link'
import React, { useEffect } from 'react'
import { useHeaderTheme } from '@/providers/HeaderTheme'

import styles from './not-found.module.css'

export default function NotFound() {
  const { setHasHeroImage } = useHeaderTheme()

  useEffect(() => {
    setHasHeroImage(false)
  }, [setHasHeroImage])

  return (
    <div className={styles.notFoundWrapper}>
      <div className={styles.bgText}>404</div>
      <div className={styles.content}>
        <h1 className={styles.title}>Oops! Page Not Found Test</h1>
        <p className={styles.description}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Don&apos;t worry,
          even the best explorers get lost sometimes.
        </p>

        <div className={styles.actions}>
          <Link href="/" className={styles.homeButton}>
            Back to Home
          </Link>
          <Link href="/contact-us" className={styles.contactButton}>
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  )
}
