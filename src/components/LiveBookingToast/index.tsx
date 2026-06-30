'use client'

import { CheckCircle2, X } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

import styles from './index.module.css'

export type LiveBookingPackage = {
  title: string
  slug: string
}

type LiveBookingToastProps = {
  packages: LiveBookingPackage[]
}

type BookingToast = {
  id: number
  name: string
  package: LiveBookingPackage
  minutesAgo: number
}

const firstToastDelay = 30 * 1000
const secondToastDelay = 2 * 60 * 1000
const recurringToastDelay = 5 * 60 * 1000
const toastVisibleDuration = 30 * 1000
const toastFadeDuration = 420

const names = [
  'Abigail',
  'Adam',
  'Addison',
  'Aiden',
  'Alexander',
  'Alice',
  'Amelia',
  'Andrew',
  'Anna',
  'Anthony',
  'Archie',
  'Arthur',
  'Audrey',
  'Ava',
  'Beatrice',
  'Ben',
  'Benjamin',
  'Bethany',
  'Blake',
  'Brandon',
  'Brian',
  'Brianna',
  'Brooklyn',
  'Caleb',
  'Callum',
  'Cameron',
  'Caroline',
  'Charlotte',
  'Chloe',
  'Christopher',
  'Claire',
  'Connor',
  'Daisy',
  'Daniel',
  'David',
  'Dylan',
  'Edward',
  'Eleanor',
  'Elijah',
  'Elizabeth',
  'Ella',
  'Emily',
  'Emma',
  'Ethan',
  'Evelyn',
  'Florence',
  'Freddie',
  'George',
  'Grace',
  'Grayson',
  'Harper',
  'Harry',
  'Hannah',
  'Henry',
  'Hudson',
  'Isaac',
  'Isabella',
  'Isla',
  'Jack',
  'Jackson',
  'Jacob',
  'James',
  'Jasmine',
  'Jessica',
  'John',
  'Joseph',
  'Joshua',
  'Julia',
  'Katherine',
  'Kayla',
  'Liam',
  'Lily',
  'Logan',
  'Lucas',
  'Lucy',
  'Luke',
  'Madison',
  'Mason',
  'Matthew',
  'Megan',
  'Michael',
  'Mia',
  'Nathan',
  'Nicholas',
  'Noah',
  'Oliver',
  'Olivia',
  'Oscar',
  'Owen',
  'Poppy',
  'Rebecca',
  'Riley',
  'Ruby',
  'Samuel',
  'Sara',
  'Scarlett',
  'Sebastian',
  'Sophia',
  'Sophie',
  'Thomas',
  'Tara',
  'Taylor',
  'Theo',
  'Victoria',
  'William',
  'Zoe',
] as const

const fallbackPackages: LiveBookingPackage[] = [
  { title: 'Everest Base Camp Trek', slug: 'everest-base-camp-trek' },
  { title: 'Annapurna Circuit Trek', slug: 'annapurna-circuit-trek' },
  { title: 'Chitwan Jungle Safari', slug: 'chitwan-jungle-safari' },
  { title: 'Kathmandu Valley Tour', slug: 'kathmandu-valley-tour' },
] as const

const randomItem = <Value,>(items: readonly Value[]): Value => {
  return items[Math.floor(Math.random() * items.length)]
}

type WindowWithWebAudio = Window & {
  webkitAudioContext?: typeof AudioContext
}

const playNotificationSound = () => {
  const AudioContextClass = window.AudioContext ?? (window as WindowWithWebAudio).webkitAudioContext

  if (!AudioContextClass || document.visibilityState === 'hidden') {
    return
  }

  try {
    const audioContext = new AudioContextClass()
    const masterGain = audioContext.createGain()
    const startTime = audioContext.currentTime

    masterGain.gain.setValueAtTime(0.0001, startTime)
    masterGain.gain.exponentialRampToValueAtTime(0.045, startTime + 0.03)
    masterGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.75)
    masterGain.connect(audioContext.destination)

    const playTone = (frequency: number, startOffset: number, duration: number) => {
      const oscillator = audioContext.createOscillator()
      const toneGain = audioContext.createGain()
      const toneStart = startTime + startOffset
      const toneEnd = toneStart + duration

      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(frequency, toneStart)
      toneGain.gain.setValueAtTime(0.0001, toneStart)
      toneGain.gain.exponentialRampToValueAtTime(0.8, toneStart + 0.04)
      toneGain.gain.exponentialRampToValueAtTime(0.0001, toneEnd)

      oscillator.connect(toneGain)
      toneGain.connect(masterGain)
      oscillator.start(toneStart)
      oscillator.stop(toneEnd + 0.02)
    }

    playTone(659.25, 0, 0.28)
    playTone(987.77, 0.16, 0.42)

    window.setTimeout(() => {
      void audioContext.close()
    }, 900)
  } catch (_error) {
    // Browsers may block autoplay until the visitor interacts with the page.
  }
}

export function LiveBookingToast({ packages }: LiveBookingToastProps) {
  const [toast, setToast] = useState<BookingToast | null>(null)
  const [isLeaving, setIsLeaving] = useState(false)

  const availablePackages = useMemo(() => {
    const uniquePackages = new Map<string, LiveBookingPackage>()

    packages.forEach((pkg) => {
      const title = pkg.title.trim()
      const slug = pkg.slug.trim()

      if (title && slug) {
        uniquePackages.set(slug, { title, slug })
      }
    })

    const cleanPackages = [...uniquePackages.values()]

    return cleanPackages.length > 0 ? cleanPackages : [...fallbackPackages]
  }, [packages])

  useEffect(() => {
    const showToast = () => {
      setIsLeaving(false)
      setToast({
        id: Date.now(),
        name: randomItem(names),
        package: randomItem(availablePackages),
        minutesAgo: Math.floor(Math.random() * 12) + 2,
      })
      playNotificationSound()
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
          <strong>{toast.name}</strong> just booked{' '}
          <Link className={styles.packageLink} href={`/packages/${toast.package.slug}`}>
            {toast.package.title}
          </Link>
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
