'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { Media as MediaComponent } from '@/components/Media'
import styles from './Component.module.scss'
import { cn } from '@/utilities/ui'
import type { LegalDocumentsBlock as LegalDocumentsBlockProps } from '@/payload-types'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

export const LegalDocumentsBlock: React.FC<
  LegalDocumentsBlockProps & {
    className?: string
  }
> = ({ documents, className }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)

  const toggleZoom = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setIsZoomed((prev) => !prev)
  }, [])

  const openLightbox = (index: number) => {
    setCurrentIndex(index)
    setIsOpen(true)
  }

  const closeLightbox = useCallback(() => {
    setIsOpen(false)
    setIsZoomed(false)
  }, [])

  const nextImage = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation()
      setIsZoomed(false)
      if (documents) {
        setCurrentIndex((prev) => (prev + 1) % documents.length)
      }
    },
    [documents],
  )

  const prevImage = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation()
      setIsZoomed(false)
      if (documents) {
        setCurrentIndex((prev) => (prev - 1 + documents.length) % documents.length)
      }
    },
    [documents],
  )

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (isOpen) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = 'unset'
      }
    }
    return () => {
      if (typeof window !== 'undefined') {
        document.body.style.overflow = 'unset'
      }
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowRight') nextImage()
      if (e.key === 'ArrowLeft') prevImage()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, closeLightbox, nextImage, prevImage])

  if (!documents || documents.length === 0) return null

  return (
    <div className={cn(styles.legalDocuments, className)}>
      <div className={styles.grid}>
        {documents.map((item, index) => (
          <div key={index} className={styles.documentItem} onClick={() => openLightbox(index)}>
            <div className={styles.imageWrapper}>
              <MediaComponent resource={item.document} />
            </div>
            {item.label && <span className={styles.label}>{item.label}</span>}
          </div>
        ))}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.lightboxOverlay}
            onClick={closeLightbox}
          >
            <button className={styles.closeButton} onClick={closeLightbox}>
              <X size={32} />
            </button>

            <div className={styles.lightboxContent} onClick={closeLightbox}>
              <button
                className={cn(styles.lightboxNav, styles.prev)}
                onClick={prevImage}
                aria-label="Previous image"
              >
                <ChevronLeft size={48} />
              </button>

              <div className={styles.activeImageWrapper} onClick={(e) => e.stopPropagation()}>
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{
                    opacity: 1,
                    scale: isZoomed ? 2 : 1,
                    cursor: isZoomed ? 'grab' : 'zoom-in',
                  }}
                  drag={isZoomed}
                  dragConstraints={{ left: -500, right: 500, top: -500, bottom: 500 }}
                  dragElastic={0.1}
                  whileDrag={{ cursor: 'grabbing' }}
                  transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                  className={styles.motionWrapper}
                  onClick={toggleZoom}
                >
                  <MediaComponent
                    resource={documents[currentIndex].document}
                    imgClassName={styles.activeImageStyle}
                  />
                  {documents[currentIndex].label && (
                    <p className={styles.activeLabel}>{documents[currentIndex].label}</p>
                  )}
                </motion.div>
              </div>

              <button
                className={cn(styles.lightboxNav, styles.next)}
                onClick={nextImage}
                aria-label="Next image"
              >
                <ChevronRight size={48} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
