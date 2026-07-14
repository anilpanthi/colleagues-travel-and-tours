'use client'

import dynamic from 'next/dynamic'
import React, { useState } from 'react'
import { Play } from 'lucide-react'

import { Button } from '@/components/ui/Button/Button'
import { DeferredDialogStatus } from '@/components/ui/DeferredDialogStatus'

import cssClass from './index.module.css'

const loadModal = () => import('@/components/ui/Modal/Modal')
const Modal = dynamic(loadModal, {
  loading: () => <DeferredDialogStatus label="Loading video dialog" />,
  ssr: false,
})

const preloadModal = () => {
  void loadModal()
}

type HeroVideoActionProps = {
  embedUrl: string | null
  label: string
}

export const HeroVideoAction: React.FC<HeroVideoActionProps> = ({ embedUrl, label }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        appearance="outline"
        iconLeft={<Play className={cssClass.iconPlay} />}
        onClick={() => setIsOpen(true)}
        onFocus={preloadModal}
        onPointerDown={preloadModal}
        onPointerEnter={preloadModal}
        size="lg"
        type="button"
      >
        {label}
      </Button>
      {isOpen && (
        <Modal
          ariaLabel={label}
          className={cssClass.videoModal}
          closeButtonClassName={cssClass.videoModalCloseButton}
          isOpen
          onClose={() => setIsOpen(false)}
          size="xl"
        >
          <div className={cssClass.videoFrame}>
            {embedUrl ? (
              <iframe
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                src={embedUrl}
                title={label}
              />
            ) : (
              <div className={cssClass.videoFallback}>
                Add a YouTube URL to this outline button in the hero links.
              </div>
            )}
          </div>
        </Modal>
      )}
    </>
  )
}
