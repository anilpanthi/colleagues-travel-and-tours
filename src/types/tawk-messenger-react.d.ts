declare module '@tawk.to/tawk-messenger-react' {
  import type { ForwardRefExoticComponent, RefAttributes } from 'react'

  interface TawkMessengerProps {
    basePath?: string
    customStyle?: Record<string, unknown>
    embedId?: string
    propertyId: string
    widgetId: string
  }

  interface TawkMessengerRef {
    maximize: () => void
    minimize: () => void
    toggle: () => void
  }

  const TawkMessengerReact: ForwardRefExoticComponent<
    TawkMessengerProps & RefAttributes<TawkMessengerRef>
  >

  export default TawkMessengerReact
}
