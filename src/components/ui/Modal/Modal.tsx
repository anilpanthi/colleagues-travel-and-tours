'use client'

import React, { useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import styles from './Modal.module.scss'

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode
  size?: ModalSize
  closeOnBackdropClick?: boolean
  closeOnEscape?: boolean
  showCloseButton?: boolean
  closeButtonClassName?: string
  className?: string
  overlayClassName?: string
  preventScroll?: boolean
  ariaLabel?: string
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnBackdropClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  closeButtonClassName = '',
  className = '',
  overlayClassName = '',
  preventScroll = true,
  ariaLabel = 'Modal',
}) => {
  const modalRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      if (e.key === 'Escape' && closeOnEscape) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, closeOnEscape, onClose])

  // Prevent background scroll
  useEffect(() => {
    if (!preventScroll) return

    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen, preventScroll])

  // Focus trap
  useEffect(() => {
    if (!isOpen) return

    previousFocusRef.current = document.activeElement as HTMLElement
    const modalElement = modalRef.current

    const focusableElements = modalElement?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    )

    const firstElement = focusableElements?.[0] as HTMLElement
    const lastElement = focusableElements?.[focusableElements.length - 1] as HTMLElement

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !firstElement || !lastElement) return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus()
          e.preventDefault()
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus()
          e.preventDefault()
        }
      }
    }

    document.addEventListener('keydown', handleTabKey)
    firstElement?.focus()

    return () => {
      document.removeEventListener('keydown', handleTabKey)
      previousFocusRef.current?.focus()
    }
  }, [isOpen])

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget && closeOnBackdropClick) {
        onClose()
      }
    },
    [closeOnBackdropClick, onClose],
  )

  if (!isOpen) return null

  const modalContent = (
    <div
      className={`${styles.overlay} ${overlayClassName}`}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      aria-label={ariaLabel}
    >
      <div
        ref={modalRef}
        className={`${styles.modal} ${styles[size]} ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {title && (
          <div className={styles.header}>
            {title && (
              <h2 id="modal-title" className={styles.title}>
                {title}
              </h2>
            )}
          </div>
        )}
        {showCloseButton && (
          <button
            type="button"
            className={`${styles.closeButton} ${closeButtonClassName}`}
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        )}
        {/* Body */}
        <div className={styles.body}>{children}</div>

        {/* Footer */}
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>
  )

  // Use Portal to render at root level
  return createPortal(modalContent, document.body)
}

export default Modal
