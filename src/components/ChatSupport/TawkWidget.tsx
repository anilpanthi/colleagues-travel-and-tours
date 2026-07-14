'use client'

import TawkMessengerReact from '@tawk.to/tawk-messenger-react'

interface TawkWidgetProps {
  propertyId: string
  widgetId: string
}

export function TawkWidget({ propertyId, widgetId }: TawkWidgetProps) {
  return <TawkMessengerReact propertyId={propertyId} widgetId={widgetId} />
}
