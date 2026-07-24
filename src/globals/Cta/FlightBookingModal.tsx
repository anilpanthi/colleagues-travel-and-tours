'use client'

import { useState } from 'react'

import { FormBlock } from '@/blocks/Form/Component'
import Modal from '@/components/ui/Modal/Modal'
import type { Form as FormType, SiteSetting } from '@/payload-types'

import CtaStyle from './Cta.module.css'

interface FlightBookingModalProps {
  flightBookingForm: SiteSetting['flightBookingForm']
  onClose: () => void
}

export function FlightBookingModal({ flightBookingForm, onClose }: FlightBookingModalProps) {
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const form =
    flightBookingForm && typeof flightBookingForm === 'object'
      ? (flightBookingForm as FormType)
      : null

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={
        hasSubmitted
          ? 'Flight Request Received'
          : 'Enter your flight details below to make your reservation.'
      }
      size="xl"
    >
      {form ? (
        <FormBlock
          form={form}
          enableIntro={false}
          className={CtaStyle.reservationForm}
          onSubmissionSuccess={() => setHasSubmitted(true)}
        />
      ) : (
        <p>Form is not available at the moment.</p>
      )}
    </Modal>
  )
}
