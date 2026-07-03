import { DefaultTemplate } from '@payloadcms/next/templates'
import { redirect } from 'next/navigation'
import type { AdminViewServerProps, VisibleEntities } from 'payload'

import './index.scss'

const getVisibleEntities = ({
  initPageResult,
  payload,
}: AdminViewServerProps): VisibleEntities => ({
  collections:
    initPageResult.visibleEntities.collections.length > 0
      ? initPageResult.visibleEntities.collections
      : payload.config.collections.map(({ slug }) => slug),
  globals:
    initPageResult.visibleEntities.globals.length > 0
      ? initPageResult.visibleEntities.globals
      : payload.config.globals.map(({ slug }) => slug),
})

export default function FlightReservationView(props: AdminViewServerProps) {
  if (!props.initPageResult.permissions.canAccessAdmin) {
    redirect(props.payload.config.routes.admin)
  }

  const { initPageResult } = props

  return (
    <DefaultTemplate
      {...props}
      locale={initPageResult.locale}
      permissions={initPageResult.permissions}
      req={initPageResult.req}
      user={initPageResult.req.user ?? undefined}
      visibleEntities={getVisibleEntities(props)}
    >
      <main className="flight-reservation-view">
        <p className="flight-reservation-view__eyebrow">Form Data</p>
        <h1>Flight reservation</h1>

        <section className="flight-reservation-view__stats" aria-label="Flight reservation summary">
          <div>
            <span>New requests</span>
            <strong>0</strong>
          </div>
          <div>
            <span>In progress</span>
            <strong>0</strong>
          </div>
          <div>
            <span>Confirmed</span>
            <strong>0</strong>
          </div>
        </section>

        <section className="flight-reservation-view__panel">
          <h2>Reservations</h2>
          <p>No flight reservations to display.</p>
        </section>
      </main>
    </DefaultTemplate>
  )
}
