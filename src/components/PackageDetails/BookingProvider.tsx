'use client'

import React, {
  Suspense,
  createContext,
  lazy,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'

import type { SiteSetting } from '@/payload-types'
import { DeferredDialogStatus } from '@/components/ui/DeferredDialogStatus'

const BookingModal = lazy(() =>
  import('./BookingModal').then(({ BookingModal: Component }) => ({ default: Component })),
)

export type BookingFormType = 'book' | 'enquiry'

type BookingContextValue = {
  activeFormType: BookingFormType | null
  openForm: (type: BookingFormType) => void
}

type BookingProviderProps = {
  bookingForm: SiteSetting['bookingForm']
  children: React.ReactNode
  enquiryForm: SiteSetting['enquiryForm']
  packageId: number
  packageTitle: string
}

const BookingContext = createContext<BookingContextValue | null>(null)

export const BookingProvider: React.FC<BookingProviderProps> = ({
  bookingForm,
  children,
  enquiryForm,
  packageId,
  packageTitle,
}) => {
  const [activeFormType, setActiveFormType] = useState<BookingFormType | null>(null)
  const openForm = useCallback((type: BookingFormType) => setActiveFormType(type), [])
  const closeForm = useCallback(() => setActiveFormType(null), [])
  const contextValue = useMemo(() => ({ activeFormType, openForm }), [activeFormType, openForm])

  return (
    <BookingContext.Provider value={contextValue}>
      {children}
      {activeFormType && (
        <Suspense fallback={<DeferredDialogStatus label="Loading package booking form" />}>
          <BookingModal
            activeFormType={activeFormType}
            bookingForm={bookingForm}
            enquiryForm={enquiryForm}
            onClose={closeForm}
            packageId={packageId}
            packageTitle={packageTitle}
          />
        </Suspense>
      )}
    </BookingContext.Provider>
  )
}

export const usePackageBooking = (): BookingContextValue => {
  const context = useContext(BookingContext)

  if (!context) {
    throw new Error('usePackageBooking must be used within BookingProvider')
  }

  return context
}
