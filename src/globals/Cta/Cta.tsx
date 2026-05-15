'use client'
import CtaStyle from './Cta.module.css'
import { Button } from '@/components/ui/Button/Button'
import { Plane } from 'lucide-react'
import { useState, useEffect } from 'react'
import Modal from '@/components/ui/Modal/Modal'
import { FormBlock } from '@/blocks/Form/Component'
import type { Form as FormType } from '@payloadcms/plugin-form-builder/types'
import { getClientSideURL } from '@/utilities/getURL'

export default function Cta() {
  const [showModal, setShowModal] = useState(false)
  const [contactForm, setContactForm] = useState<FormType | null>(null)

  useEffect(() => {
    const fetchContactForm = async () => {
      try {
        const res = await fetch(
          `${getClientSideURL()}/api/forms?where[title][equals]=Reservation&limit=1`,
        )
        const data = await res.json()
        if (data?.docs?.[0]) {
          setContactForm(data.docs[0] as FormType)
        }
      } catch (err) {
        console.error('Failed to fetch contact form:', err)
      }
    }
    void fetchContactForm()
  }, [])

  const handleOpenModal = () => {
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }

  return (
    <>
      <Button
        appearance="primary"
        size="sm"
        iconLeft={<Plane className={CtaStyle.iconPlane} />}
        onClick={handleOpenModal}
      >
        Book Your Flight
      </Button>

      {showModal && (
        <Modal
          isOpen={showModal}
          onClose={handleCloseModal}
          title="Enter your flight details below to complete your reservation."
          size="lg"
        >
          {contactForm ? (
            <FormBlock
              form={contactForm}
              enableIntro={false}
              className={CtaStyle.reservationForm}
            />
          ) : (
            <p>Loading form...</p>
          )}
        </Modal>
      )}
    </>
  )
}
