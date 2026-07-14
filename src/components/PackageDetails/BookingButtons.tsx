'use client'

import React from 'react'

import { Button } from '@/components/ui/Button'

import { usePackageBooking } from './BookingProvider'

const preloadBookingModal = () => {
  void import('./BookingModal')
}

export const BookingButtons = () => {
  const { activeFormType, openForm } = usePackageBooking()

  return (
    <React.Fragment>
      <Button
        aria-expanded={activeFormType === 'book'}
        aria-haspopup="dialog"
        appearance="primary"
        onClick={() => openForm('book')}
        onFocus={preloadBookingModal}
        onPointerDown={preloadBookingModal}
        onPointerEnter={preloadBookingModal}
        size="lg"
      >
        Book this package
      </Button>
      <Button
        aria-expanded={activeFormType === 'enquiry'}
        aria-haspopup="dialog"
        appearance="outlineBlack"
        onClick={() => openForm('enquiry')}
        onFocus={preloadBookingModal}
        onPointerDown={preloadBookingModal}
        onPointerEnter={preloadBookingModal}
        size="lg"
      >
        Customize This Trip
      </Button>
    </React.Fragment>
  )
}
