'use client'

import TawkMessengerReact from '@tawk.to/tawk-messenger-react'

interface ChatSupportProps {
  propertyId?: null | string
  widgetId?: null | string
}

export function ChatSupport({ propertyId, widgetId }: ChatSupportProps) {
  if (!propertyId || !widgetId) {
    return null
  }

  return <TawkMessengerReact propertyId={propertyId} widgetId={widgetId} />
}
