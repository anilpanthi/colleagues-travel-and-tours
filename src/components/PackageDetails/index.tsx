'use client'
import React, { useState, useCallback, useEffect, useRef } from 'react'
import { RenderHero } from '@/heros/RenderHero'
import RichText from '@/components/RichText'
import Content from '@/components/ui/Content/Index'
import { Accordion, AccordionItem } from '@/components/Accordion/Index'
import type { Package, SiteSetting } from '@/payload-types'
import Gallery from '@/components/Gallery'
import { Breadcrumbs } from '@/components/Breadcrumbs/Index'
import { ReadMore } from '@/components/ui/ReadMore'
import { Media } from '@/components/Media'
import { LazyEmbed } from '@/components/LazyEmbed'
import { AnimatePresence, motion, useAnimation } from 'framer-motion'
import { ZoomIn, ZoomOut, RotateCcw, X } from 'lucide-react'

import style from './index.module.scss'
import { BookingButtons } from './BookingButtons'
import { BookingProvider } from './BookingProvider'
import { PackageHeaderThemeEffect } from './PackageHeaderThemeEffect'

interface PackageDetailsProps {
  pkg: Package
  bookingForm: SiteSetting['bookingForm']
  enquiryForm: SiteSetting['enquiryForm']
  tripCustomizerForm: SiteSetting['tripCustomizerForm']
  children?: React.ReactNode
}

export const PackageDetails: React.FC<PackageDetailsProps> = ({
  pkg,
  bookingForm,
  enquiryForm,
  tripCustomizerForm,
  children,
}) => {
  const [isMapLightboxOpen, setIsMapLightboxOpen] = useState(false)
  const [zoomScale, setZoomScale] = useState(1)
  const controls = useAnimation()
  const containerRef = useRef<HTMLDivElement>(null)

  const handleZoomIn = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation()
    setZoomScale((prev) => {
      const next = Math.min(prev + 0.5, 4)
      controls.start({ scale: next, transition: { type: 'spring', damping: 25, stiffness: 220 } })
      return next
    })
  }, [controls])

  const handleZoomOut = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation()
    setZoomScale((prev) => {
      const next = Math.max(prev - 0.5, 1)
      if (next === 1) {
        controls.start({ scale: 1, x: 0, y: 0, transition: { type: 'spring', damping: 25, stiffness: 220 } })
      } else {
        controls.start({ scale: next, transition: { type: 'spring', damping: 25, stiffness: 220 } })
      }
      return next
    })
  }, [controls])

  const handleResetZoom = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation()
    setZoomScale(1)
    controls.start({ scale: 1, x: 0, y: 0, transition: { type: 'spring', damping: 25, stiffness: 220 } })
  }, [controls])

  const closeMapLightbox = useCallback(() => {
    setIsMapLightboxOpen(false)
    setZoomScale(1)
    controls.set({ scale: 1, x: 0, y: 0 })
  }, [controls])

  useEffect(() => {
    if (isMapLightboxOpen) {
      controls.set({ scale: 1, x: 0, y: 0 })
    }
  }, [isMapLightboxOpen, controls])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isMapLightboxOpen) return
      if (e.key === 'Escape') closeMapLightbox()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isMapLightboxOpen, closeMapLightbox])

  useEffect(() => {
    if (isMapLightboxOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMapLightboxOpen])

  const packageHasHeroImage = Boolean(
    pkg?.hero?.type && pkg?.hero?.type !== 'none' && pkg?.hero?.type !== 'lowImpact',
  )

  // Construct custom breadcrumbs: Home -> Activities -> [Activity Name] -> Package Name
  const activity =
    pkg.Activity && pkg.Activity.length > 0 && typeof pkg.Activity[0] === 'object'
      ? pkg.Activity[0]
      : null

  const customBreadcrumbs = [
    { label: 'Activities', url: '/activities' },
    ...(activity ? [{ label: activity.title, url: `/activities/${activity.slug}` }] : []),
    { label: pkg.title },
  ]

  const tripFactsContent = (pkg.tripDuration ||
    pkg.tripGrade ||
    pkg.bestSeason ||
    pkg.perDayHiking ||
    pkg.elevation ||
    pkg.accommodation ||
    pkg.transportation ||
    (pkg.customFacts && pkg.customFacts.length > 0)) && (
    <div className={style.tripFacts}>
      <h3 className={style.sidebarTitle}>Trip Facts</h3>
      <div className={style.tripFacts__body}>
        <table className={style.tripFacts__table}>
          <tbody>
            {pkg.tripDuration && (
              <tr>
                <th>Trip Duration:</th>
                <td>{pkg.tripDuration} Days</td>
              </tr>
            )}
            {pkg.tripGrade && (
              <tr>
                <th>Trip Grade:</th>
                <td className={style.capitalize}>{pkg.tripGrade}</td>
              </tr>
            )}
            {pkg.bestSeason &&
              (Array.isArray(pkg.bestSeason)
                ? pkg.bestSeason.length > 0
                : String(pkg.bestSeason).trim() !== '') && (
                <tr>
                  <th>Best Season:</th>
                  <td>
                    {Array.isArray(pkg.bestSeason)
                      ? pkg.bestSeason.map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(', ')
                      : pkg.bestSeason}
                  </td>
                </tr>
              )}
            {/* {pkg.bestSeason && (
              <tr>
                <th>Best Season:</th>
                <td>
                  {Array.isArray(pkg.bestSeason)
                    ? pkg.bestSeason.map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(', ')
                    : pkg.bestSeason}
                </td>
              </tr>
            )} */}
            {pkg.perDayHiking && (
              <tr>
                <th>Per Day Hiking:</th>
                <td>{pkg.perDayHiking}</td>
              </tr>
            )}
            {pkg.elevation && (
              <tr>
                <th>Elevation:</th>
                <td>{pkg.elevation} Meters</td>
              </tr>
            )}
            {pkg.accommodation && (
              <tr>
                <th>Accommodation:</th>
                <td>{pkg.accommodation}</td>
              </tr>
            )}
            {pkg.transportation && (
              <tr>
                <th>Transportation:</th>
                <td>{pkg.transportation}</td>
              </tr>
            )}
            {pkg.customFacts?.map((fact, index) => (
              <tr key={index}>
                <th>{fact.label}:</th>
                <td>{fact.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  return (
    <BookingProvider
      bookingForm={bookingForm}
      enquiryForm={enquiryForm}
      tripCustomizerForm={tripCustomizerForm}
      packageId={pkg.id}
      packageTitle={pkg.title}
    >
      <PackageHeaderThemeEffect hasHeroImage={packageHasHeroImage} />
      <RenderHero {...pkg?.hero} title={pkg.title} breadcrumbs={customBreadcrumbs} />

      {(!pkg?.hero || pkg?.hero?.type === 'none') && (
        <div className={style.packageHeader}>
          <Content>
            <h1 className={style.mainTitle}>{pkg.title}</h1>
            <Breadcrumbs items={customBreadcrumbs} />
          </Content>
        </div>
      )}

      <Content className={style.packageWrap} data-motion-speed="fast">
        <div className={style.singlePackage}>
          <div className={style.singlePackage__left}>
            {pkg.gallery && pkg.gallery.length > 0 && (
              <div className={style.gallerySection}>
                <Gallery images={pkg.gallery} />
              </div>
            )}
            {pkg.overview && (
              <div className={style.overviewSection}>
                <h2 className={style.title}>{'Overview of ' + pkg.title}</h2>
                <ReadMore lines={10}>
                  <RichText className={style.textDesc} data={pkg.overview} enableGutter={false} />
                </ReadMore>
              </div>
            )}

            <div className={style.tripFactsMobile}>{tripFactsContent}</div>

            {pkg?.packageFacts && (
              <div className={style.highlightsSection}>
                <h2 className={style.title}>Trip Highlights</h2>
                <RichText
                  className={style.hightlights_content}
                  data={pkg.packageFacts}
                  enableGutter={false}
                />
              </div>
            )}

            {pkg?.detailedItinerary && pkg.detailedItinerary.length > 0 && (
              <div className={style.detailedItinerary}>
                <Accordion
                  title="Detailed Itinerary"
                  variant="minimal"
                  allowMultiple={false}
                  defaultOpenIds={
                    pkg.detailedItinerary[0]?.id ? [`${pkg.detailedItinerary[0].id}-0`] : []
                  }
                >
                  {pkg.detailedItinerary.map((item, index) => {
                    const itemKey = `${item.id ?? 'itinerary'}-${index}`
                    return <AccordionItem key={itemKey} value={itemKey} data={item} />
                  })}
                </Accordion>
              </div>
            )}

            {pkg.includes && (
              <div className={style.includeExcludeSection}>
                <h2 className={style.title}>Cost Includes</h2>
                <RichText className={style.includesList} data={pkg.includes} enableGutter={false} />
              </div>
            )}

            {pkg.excludes && (
              <div className={style.includeExcludeSection}>
                <h2 className={style.title}>Cost Excludes</h2>
                <RichText className={style.excludesList} data={pkg.excludes} enableGutter={false} />
              </div>
            )}

            {(pkg.mapType === 'embedMap' ? pkg.mapIframe : pkg.mapImage) && (
              <div className={style.mapSection}>
                <h2 className={style.title}>Map</h2>
                {pkg.mapType === 'embedMap' && typeof pkg.mapIframe === 'string' && (
                  <div className={style.mapEmbed}>
                    <LazyEmbed src={pkg.mapIframe} title={`${pkg.title} map`} />
                  </div>
                )}
                {pkg.mapType === 'embedMap' &&
                  pkg.mapIframe &&
                  typeof pkg.mapIframe !== 'string' && (
                    <div className={style.mapIframeRichText}>
                      <RichText data={pkg.mapIframe} enableGutter={false} />
                    </div>
                  )}
                {pkg.mapType === 'imageUpload' &&
                  pkg.mapImage &&
                  typeof pkg.mapImage === 'object' && (
                    <button
                      type="button"
                      className={style.mapImageButton}
                      onClick={() => setIsMapLightboxOpen(true)}
                      aria-label={`Open ${pkg.title} map in lightbox`}
                    >
                      <div className={style.mapImageWrapper}>
                        <Media resource={pkg.mapImage} />
                      </div>
                    </button>
                  )}
              </div>
            )}

            {/* Faqs */}
            {pkg?.faqs && pkg.faqs.length > 0 && (
              <div className={style.detailedItinerary}>
                <Accordion
                  title="Faqs"
                  variant="ghost"
                  allowMultiple={false}
                  defaultOpenIds={pkg.faqs[0]?.id ? [`${pkg.faqs[0].id}-0`] : []}
                >
                  {pkg.faqs.map((item, index) => {
                    const itemKey = `${item.id ?? 'faq'}-${index}`
                    return (
                      <AccordionItem key={itemKey} value={itemKey} heading={item.question ?? ''}>
                        {item.answer && <RichText data={item.answer} enableGutter={false} />}
                      </AccordionItem>
                    )
                  })}
                </Accordion>
              </div>
            )}

            {pkg?.miscellaneous && (
              <div className="msc">
                <RichText data={pkg.miscellaneous} enableGutter={false} />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className={style.singlePackage__right}>
            <div className={style.tripFactsDesktop}>{tripFactsContent}</div>
            <div className={`${style.contactGroup} ${style.contactGroupDesktop}`}>
              <BookingButtons />
            </div>
          </aside>
        </div>
        {children}
      </Content>

      <div className={`${style.contactGroup} ${style.contactGroupMobile}`} data-mobile-booking-bar>
        <BookingButtons />
      </div>

      <AnimatePresence>
        {isMapLightboxOpen && typeof pkg.mapImage === 'object' && pkg.mapImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={style.mapLightboxOverlay}
            onClick={closeMapLightbox}
          >
            {/* Control buttons */}
            <div className={style.mapLightboxControls} onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={handleZoomIn}
                disabled={zoomScale >= 4}
                className={style.mapLightboxBtn}
                title="Zoom In"
                aria-label="Zoom In"
              >
                <ZoomIn size={24} />
              </button>
              <button
                type="button"
                onClick={handleZoomOut}
                disabled={zoomScale <= 1}
                className={style.mapLightboxBtn}
                title="Zoom Out"
                aria-label="Zoom Out"
              >
                <ZoomOut size={24} />
              </button>
              <button
                type="button"
                onClick={handleResetZoom}
                disabled={zoomScale === 1}
                className={style.mapLightboxBtn}
                title="Reset Zoom"
                aria-label="Reset Zoom"
              >
                <RotateCcw size={24} />
              </button>
              <div className={style.mapLightboxDivider} />
              <button
                type="button"
                onClick={closeMapLightbox}
                className={`${style.mapLightboxBtn} ${style.mapLightboxClose}`}
                title="Close"
                aria-label="Close"
              >
                <X size={24} />
              </button>
            </div>

            {/* Container for the zoomable image */}
            <div className={style.mapLightboxContent} onClick={closeMapLightbox}>
              <div
                ref={containerRef}
                className={style.mapLightboxImageWrapper}
                onClick={(e) => e.stopPropagation()}
              >
                <motion.div
                  animate={controls}
                  style={{ cursor: zoomScale > 1 ? 'grab' : 'zoom-in' }}
                  drag={zoomScale > 1}
                  dragConstraints={containerRef}
                  dragElastic={0.15}
                  whileDrag={{ cursor: 'grabbing' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                  onClick={(e) => {
                    const rect = containerRef.current?.getBoundingClientRect()
                    if (!rect) return

                    const clickX = e.clientX - (rect.left + rect.width / 2)
                    const clickY = e.clientY - (rect.top + rect.height / 2)

                    if (zoomScale > 1) {
                      setZoomScale(1)
                      controls.start({
                        scale: 1,
                        x: 0,
                        y: 0,
                        transition: { type: 'spring', damping: 25, stiffness: 220 },
                      })
                    } else {
                      const targetScale = 2
                      const targetX = -clickX * (targetScale - 1)
                      const targetY = -clickY * (targetScale - 1)

                      setZoomScale(targetScale)
                      controls.start({
                        scale: targetScale,
                        x: targetX,
                        y: targetY,
                        transition: { type: 'spring', damping: 25, stiffness: 220 },
                      })
                    }
                  }}
                  className={style.mapLightboxMotion}
                >
                  <Media resource={pkg.mapImage} />
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </BookingProvider>
  )
}
