'use client'

import { TawkWidget } from './TawkWidget'

interface ChatSupportProps {
  propertyId?: null | string
  widgetId?: null | string
}

export function ChatSupport({ propertyId, widgetId }: ChatSupportProps) {
  if (!propertyId || !widgetId) {
    return null
  }

  return <TawkWidget propertyId={propertyId} widgetId={widgetId} />
}
