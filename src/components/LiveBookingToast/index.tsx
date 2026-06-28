'use client'

import { CheckCircle2, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import styles from './index.module.css'

type LiveBookingToastProps = {
  packageTitles: string[]
}

type BookingToast = {
  id: number
  name: string
  packageTitle: string
  minutesAgo: number
}

const firstToastDelay = 2000
const secondToastDelay = 2 * 60 * 1000
const recurringToastDelay = 5 * 60 * 1000
const toastVisibleDuration = 30 * 1000
const toastFadeDuration = 420

const names = [
  'Aarav',
  'Aisha',
  'Anita',
  'Ben',
  'Daniel',
  'Emily',
  'Hannah',
  'Ishan',
  'James',
  'Maya',
  'Nisha',
  'Olivia',
  'Prabin',
  'Priya',
  'Rahul',
  'Sanjay',
  'Sara',
  'Sophia',
  'Suman',
  'Tara',
] as const

const fallbackPackageTitles = [
  'Everest Base Camp Trek',
  'Annapurna Circuit Trek',
  'Chitwan Jungle Safari',
  'Kathmandu Valley Tour',
] as const

const randomItem = <Value,>(items: readonly Value[]): Value => {
  return items[Math.floor(Math.random() * items.length)]
}

export function LiveBookingToast({ packageTitles }: LiveBookingToastProps) {
  const [toast, setToast] = useState<BookingToast | null>(null)
  const [isLeaving, setIsLeaving] = useState(false)

  const availablePackages = useMemo(() => {
    const cleanTitles = packageTitles
      .map((title) => title.trim())
      .filter((title, index, titles) => title.length > 0 && titles.indexOf(title) === index)

    return cleanTitles.length > 0 ? cleanTitles : [...fallbackPackageTitles]
  }, [packageTitles])

  useEffect(() => {
    const showToast = () => {
      setIsLeaving(false)
      setToast({
        id: Date.now(),
        name: randomItem(names),
        packageTitle: randomItem(availablePackages),
        minutesAgo: Math.floor(Math.random() * 12) + 2,
      })
    }

    const firstToast = window.setTimeout(showToast, firstToastDelay)
    const secondToast = window.setTimeout(showToast, firstToastDelay + secondToastDelay)
    let recurringToasts: number | undefined

    const recurringStart = window.setTimeout(() => {
      showToast()
      recurringToasts = window.setInterval(showToast, recurringToastDelay)
    }, firstToastDelay + secondToastDelay + recurringToastDelay)

    return () => {
      window.clearTimeout(firstToast)
      window.clearTimeout(secondToast)
      window.clearTimeout(recurringStart)

      if (recurringToasts) {
        window.clearInterval(recurringToasts)
      }
    }
  }, [availablePackages])

  useEffect(() => {
    if (!toast) {
      return undefined
    }

    const fadeToast = window.setTimeout(() => {
      setIsLeaving(true)
    }, toastVisibleDuration)

    const removeToast = window.setTimeout(() => {
      setToast(null)
      setIsLeaving(false)
    }, toastVisibleDuration + toastFadeDuration)

    return () => {
      window.clearTimeout(fadeToast)
      window.clearTimeout(removeToast)
    }
  }, [toast])

  if (!toast) {
    return null
  }

  return (
    <aside
      aria-atomic="true"
      aria-live="polite"
      className={`${styles.toast} ${isLeaving ? styles.toastLeaving : ''}`}
      key={toast.id}
      role="status"
    >
      <div className={styles.iconWrap} aria-hidden="true">
        <CheckCircle2 size={20} strokeWidth={2.4} />
      </div>
      <div className={styles.content}>
        <p className={styles.eyebrow}>Live booking</p>
        <p className={styles.message}>
          <strong>{toast.name}</strong> just booked <span>{toast.packageTitle}</span>
        </p>
        <p className={styles.time}>{toast.minutesAgo} minutes ago</p>
      </div>
      <button
        aria-label="Hide live booking notification"
        className={styles.closeButton}
        onClick={() => {
          setToast(null)
          setIsLeaving(false)
        }}
        type="button"
      >
        <X size={16} strokeWidth={2.2} />
      </button>
    </aside>
  )
}
