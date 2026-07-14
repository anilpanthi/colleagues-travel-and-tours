'use client'

import CtaStyle from './Cta.module.css'
import { Button } from '@/components/ui/Button/Button'
import { Plane } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import type { SiteSetting } from '@/payload-types'
import { DeferredDialogStatus } from '@/components/ui/DeferredDialogStatus'

const loadFlightBookingModal = () =>
  import('./FlightBookingModal').then((module) => module.FlightBookingModal)

const FlightBookingModal = dynamic(loadFlightBookingModal, {
  loading: () => <DeferredDialogStatus label="Loading flight booking form" />,
  ssr: false,
})

const preloadFlightBookingModal = () => {
  void loadFlightBookingModal()
}

interface CtaProps {
  flightBookingForm: SiteSetting['flightBookingForm']
}

export default function Cta({ flightBookingForm }: CtaProps) {
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const openFromUrl = () => {
      const params = new URLSearchParams(window.location.search)
      const modal = params.get('modal')
      const flightBooking = params.get('flightBooking')
      const hash = window.location.hash

      if (hash === '#flight-booking' || modal === 'flight-booking' || flightBooking === 'true') {
        setShowModal(true)
      }
    }

    openFromUrl()
    window.addEventListener('hashchange', openFromUrl)
    window.addEventListener('popstate', openFromUrl)

    return () => {
      window.removeEventListener('hashchange', openFromUrl)
      window.removeEventListener('popstate', openFromUrl)
    }
  }, [])

  const handleOpenModal = () => setShowModal(true)
  const handleCloseModal = () => setShowModal(false)

  return (
    <>
      <Button
        aria-expanded={showModal}
        aria-haspopup="dialog"
        appearance="primary"
        size="sm"
        className={CtaStyle.ctaButton}
        iconLeft={<Plane className={CtaStyle.iconPlane} />}
        onClick={handleOpenModal}
        onFocus={preloadFlightBookingModal}
        onPointerDown={preloadFlightBookingModal}
        onPointerEnter={preloadFlightBookingModal}
      >
        Book Your Flight
      </Button>

      {showModal ? (
        <FlightBookingModal flightBookingForm={flightBookingForm} onClose={handleCloseModal} />
      ) : null}
    </>
  )
}

// 'use client'
// import CtaStyle from './Cta.module.css'
// import { Button } from '@/components/ui/Button/Button'
// import { Plane } from 'lucide-react'
// import { useState, useEffect } from 'react'
// import Modal from '@/components/ui/Modal/Modal'
// import { FormBlock } from '@/blocks/Form/Component'
// import type { Form as FormType } from '@payloadcms/plugin-form-builder/types'
// import { getClientSideURL } from '@/utilities/getURL'

// export default function Cta() {
//   const [showModal, setShowModal] = useState(false)
//   const [contactForm, setContactForm] = useState<FormType | null>(null)

//   useEffect(() => {
//     const fetchContactForm = async () => {
//       try {
//         const res = await fetch(
//           `${getClientSideURL()}/api/forms?where[title][equals]=Reservation&limit=1`,
//         )
//         const data = await res.json()
//         if (data?.docs?.[0]) {
//           setContactForm(data.docs[0] as FormType)
//         }
//       } catch (err) {
//         console.error('Failed to fetch contact form:', err)
//       }
//     }
//     void fetchContactForm()
//   }, [])

//   const handleOpenModal = () => {
//     setShowModal(true)
//   }

//   const handleCloseModal = () => {
//     setShowModal(false)
//   }

//   return (
//     <>
//       <Button
//         appearance="primary"
//         size="sm"
//         iconLeft={<Plane className={CtaStyle.iconPlane} />}
//         onClick={handleOpenModal}
//       >
//         Book Your Flight
//       </Button>

//       {showModal && (
//         <Modal
//           isOpen={showModal}
//           onClose={handleCloseModal}
//           title="Enter your flight details below to complete your reservation."
//           size="lg"
//         >
//           {contactForm ? (
//             <FormBlock
//               form={contactForm}
//               enableIntro={false}
//               className={CtaStyle.reservationForm}
//             />
//           ) : (
//             <p>Loading form...</p>
//           )}
//         </Modal>
//       )}
//     </>
//   )
// }
