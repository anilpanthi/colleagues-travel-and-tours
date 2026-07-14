'use client'

import React, { useEffect, useRef, useState } from 'react'

import type { CarouselBlock as CarouselBlockProps } from '@/payload-types'

import styles from './Carousel.module.scss'

type CarouselProps = {
  fallback: React.ReactNode
  selectedItems?: CarouselBlockProps['selectedItems']
}

type InteractiveCarouselComponent = React.ComponentType<{
  selectedItems: NonNullable<CarouselBlockProps['selectedItems']>
}>

export default function Carousel({ fallback, selectedItems }: CarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [InteractiveCarousel, setInteractiveCarousel] =
    useState<InteractiveCarouselComponent | null>(null)

  useEffect(() => {
    if (!selectedItems?.length) return

    let cancelled = false
    const loadInteractiveCarousel = () => {
      void import('./CarouselInteractive').then(({ default: Component }) => {
        if (!cancelled) setInteractiveCarousel(() => Component)
      })
    }

    const container = containerRef.current
    if (!container || !('IntersectionObserver' in window)) {
      loadInteractiveCarousel()
      return () => {
        cancelled = true
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        loadInteractiveCarousel()
      },
      { rootMargin: '600px 0px' },
    )

    observer.observe(container)

    return () => {
      cancelled = true
      observer.disconnect()
    }
  }, [selectedItems])

  if (!selectedItems?.length) return null

  return (
    <div className={styles.carouselContainer} ref={containerRef}>
      {InteractiveCarousel ? (
        <InteractiveCarousel selectedItems={selectedItems} />
      ) : (
        <div className={styles.mySwiper}>{fallback}</div>
      )}
    </div>
  )
}
