'use client'

import { Link, NavGroup, useConfig } from '@payloadcms/ui'
import { usePathname } from 'next/navigation'
import { formatAdminURL } from 'payload/shared'

import './index.scss'

const flightReservationPath = '/form-data/flight-reservation'

export default function FormDataNav() {
  const pathname = usePathname()
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
          Flight reservation
        </Link>
      </NavGroup>
    </div>
  )
}
