'use client'

import { Link, NavGroup, useConfig } from '@payloadcms/ui'
import { usePathname } from 'next/navigation'
import { formatAdminURL } from 'payload/shared'
import { useCallback, useEffect, useState } from 'react'

import './index.scss'

const flightReservationPath = '/form-data/flight-reservation'
export const reservationStatusChangedEvent = 'flight-reservation-status-changed'

export default function FormDataNav() {
  const pathname = usePathname()
  const [newReservationCount, setNewReservationCount] = useState(0)
  const {
    config: {
      routes: { admin: adminRoute },
    },
  } = useConfig()

  const href = formatAdminURL({
    adminRoute,
    path: flightReservationPath,
  })
  const isActive = pathname === href

  const refreshNewReservationCount = useCallback(async () => {
    const searchParams = new URLSearchParams({
      limit: '1',
      'where[status][equals]': 'new',
      'where[submissionType][equals]': 'flight-booking',
    })

    try {
      const response = await fetch(`/api/form-submissions?${searchParams.toString()}`, {
        credentials: 'same-origin',
      })
      if (!response.ok) return

      const result: unknown = await response.json()
      if (
        result &&
        typeof result === 'object' &&
        'totalDocs' in result &&
        typeof result.totalDocs === 'number'
      ) {
        setNewReservationCount(result.totalDocs)
      }
    } catch {
      // Keep the existing count when the background refresh is unavailable.
    }
  }, [])

  useEffect(() => {
    const refresh = () => void refreshNewReservationCount()
    const initialRefresh = window.setTimeout(refresh, 0)
    const interval = window.setInterval(refresh, 60_000)
    window.addEventListener(reservationStatusChangedEvent, refresh)

    return () => {
      window.clearTimeout(initialRefresh)
      window.clearInterval(interval)
      window.removeEventListener(reservationStatusChangedEvent, refresh)
    }
  }, [pathname, refreshNewReservationCount])

  return (
    <div className="form-data-nav">
      <NavGroup isOpen label="Form Data">
        <Link
          aria-current={isActive ? 'page' : undefined}
          className={['form-data-nav__link', isActive ? 'form-data-nav__link--active' : '']
            .filter(Boolean)
            .join(' ')}
          href={href}
          prefetch={false}
        >
          <span>Flight reservation</span>
          {newReservationCount > 0 && (
            <span
              aria-label={`${newReservationCount} new flight ${
                newReservationCount === 1 ? 'reservation' : 'reservations'
              }`}
              className="form-data-nav__badge"
            >
              {newReservationCount > 99 ? '99+' : newReservationCount}
            </span>
          )}
        </Link>
      </NavGroup>
    </div>
  )
}
