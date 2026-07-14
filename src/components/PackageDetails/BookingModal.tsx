'use client'

import React from 'react'

import { FormBlock } from '@/blocks/Form/Component'
import Modal from '@/components/ui/Modal/Modal'
import type { SiteSetting } from '@/payload-types'

import type { BookingFormType } from './BookingProvider'
import style from './index.module.scss'

type BookingModalProps = {
  activeFormType: BookingFormType
  bookingForm: SiteSetting['bookingForm']
  enquiryForm: SiteSetting['enquiryForm']
  onClose: () => void
  packageId: number
  packageTitle: string
}

export const BookingModal: React.FC<BookingModalProps> = ({
  activeFormType,
  bookingForm,
  enquiryForm,
  onClose,
  packageId,
  packageTitle,
}) => {
  const activeForm = activeFormType === 'book' ? bookingForm : enquiryForm
  const formToDisplay = activeForm && typeof activeForm === 'object' ? activeForm : null

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={activeFormType === 'book' ? `Book ${packageTitle}` : `Enquire about ${packageTitle}`}
      size={activeFormType === 'enquiry' ? 'md' : 'lg'}
    >
      {formToDisplay ? (
        <FormBlock
          className={activeFormType === 'book' ? style.bookingForm : style.enquiryForm}
          enableIntro={false}
          form={formToDisplay}
          submissionContext={{
            packageId,
          }}
        />
      ) : (
        <p>Form is not available at the moment.</p>
      )}
    </Modal>
  )
}
