'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import styles from './GDPRConsent.module.css'

type ConsentPreferences = {
  analytics: boolean
  marketing: boolean
  necessary: true
}

const consentStorageKey = 'colleagues-gdpr-consent-v1'

const defaultPreferences: ConsentPreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
}

export function GDPRConsent() {
  const [isVisible, setIsVisible] = useState(false)
  const [preferences, setPreferences] = useState<ConsentPreferences>(defaultPreferences)

  useEffect(() => {
    const savedConsent = window.localStorage.getItem(consentStorageKey)

    if (!savedConsent) {
      setIsVisible(true)
    }
  }, [])

  const saveConsent = (nextPreferences: ConsentPreferences) => {
    window.localStorage.setItem(
      consentStorageKey,
      JSON.stringify({
        preferences: nextPreferences,
        savedAt: new Date().toISOString(),
      }),
    )
    setIsVisible(false)
  }

  const updateOptionalPreference = (name: keyof Omit<ConsentPreferences, 'necessary'>) => {
    setPreferences((currentPreferences) => ({
      ...currentPreferences,
      [name]: !currentPreferences[name],
    }))
  }

  if (!isVisible) {
    return null
  }

  return (
    <div className={styles.backdrop} role="presentation">
      <section
        aria-describedby="gdpr-consent-description"
        aria-labelledby="gdpr-consent-title"
        aria-modal="true"
        className={styles.panel}
        role="dialog"
      >
        <div className={styles.content}>
          <div className={styles.header}>
            <h2 className={styles.title} id="gdpr-consent-title">
              Privacy preferences
            </h2>
            <p className={styles.description} id="gdpr-consent-description">
              We use essential cookies to make this website work. With your permission, we can
              also use analytics and marketing cookies to improve Colleagues Travel and Tours and
              show more relevant travel content. You can change your choice at any time in your
              browser settings. Read our{' '}
              <Link className={styles.privacyLink} href="/privacy-policy">
                privacy policy
              </Link>
              .
            </p>
          </div>

          <div className={styles.preferences}>
            <label className={styles.preference}>
              <input checked className={styles.checkbox} disabled type="checkbox" />
              <span className={styles.preferenceText}>
                <span className={styles.preferenceTitle}>Necessary cookies</span>
                <span className={styles.preferenceDescription}>
                  Required for site security, forms, navigation, and core booking features.
                </span>
              </span>
            </label>

            <label className={styles.preference}>
              <input
                checked={preferences.analytics}
                className={styles.checkbox}
                onChange={() => updateOptionalPreference('analytics')}
                type="checkbox"
              />
              <span className={styles.preferenceText}>
                <span className={styles.preferenceTitle}>Analytics cookies</span>
                <span className={styles.preferenceDescription}>
                  Help us understand visits and improve pages, packages, and enquiry journeys.
                </span>
              </span>
            </label>

            <label className={styles.preference}>
              <input
                checked={preferences.marketing}
                className={styles.checkbox}
                onChange={() => updateOptionalPreference('marketing')}
                type="checkbox"
              />
              <span className={styles.preferenceText}>
                <span className={styles.preferenceTitle}>Marketing cookies</span>
                <span className={styles.preferenceDescription}>
                  Allow us to personalize travel offers and measure campaign performance.
                </span>
              </span>
            </label>
          </div>

          <div className={styles.actions}>
            <button
              className={`${styles.button} ${styles.textButton}`}
              onClick={() => saveConsent(defaultPreferences)}
              type="button"
            >
              Reject optional
            </button>
            <button
              className={`${styles.button} ${styles.secondaryButton}`}
              onClick={() => saveConsent(preferences)}
              type="button"
            >
              Save preferences
            </button>
            <button
              className={`${styles.button} ${styles.primaryButton}`}
              onClick={() =>
                saveConsent({
                  necessary: true,
                  analytics: true,
                  marketing: true,
                })
              }
              type="button"
            >
              Accept all
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
