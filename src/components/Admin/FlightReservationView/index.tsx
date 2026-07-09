import { DefaultTemplate } from '@payloadcms/next/templates'
import { redirect } from 'next/navigation'
import type { AdminViewServerProps, VisibleEntities } from 'payload'

import FlightReservationManager from './Manager'
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

export default async function FlightReservationView(props: AdminViewServerProps) {
  if (!props.initPageResult.permissions.canAccessAdmin) {
    redirect(props.payload.config.routes.admin)
  }

  const { initPageResult } = props
  const { docs } = await props.payload.find({
    collection: 'form-submissions',
    depth: 1,
    limit: 500,
    overrideAccess: false,
    sort: '-createdAt',
    user: initPageResult.req.user,
    where: {
      submissionType: {
        equals: 'flight-booking',
      },
    },
  })

  return (
    <DefaultTemplate
      {...props}
      locale={initPageResult.locale}
      permissions={initPageResult.permissions}
      req={initPageResult.req}
      user={initPageResult.req.user ?? undefined}
      visibleEntities={getVisibleEntities(props)}
    >
      <FlightReservationManager
        adminRoute={props.payload.config.routes.admin}
        initialReservations={docs}
      />
    </DefaultTemplate>
  )
}
