'use client'
import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay, FreeMode } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import Image from 'next/image'
import type { Media } from '@/payload-types'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/free-mode'

import styles from './index.module.scss'

type Props = {
	images: {
		image: number | Media
		id?: string | null
	}[]
}

type GalleryMedia = Media & {
	url: string
}

type ThumbScrollbarMetrics = {
	hasOverflow: boolean
	thumbLeft: number
	thumbWidth: number
}

const getGalleryImageKey = (media: GalleryMedia, index: number) =>
	`${media.id ?? media.url}-${index}`

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

export const Gallery: React.FC<Props> = ({ images }) => {
	const mainSwiperRef = React.useRef<SwiperType | null>(null)
	const thumbStripRef = React.useRef<HTMLDivElement | null>(null)
	const scrollbarTrackRef = React.useRef<HTMLDivElement | null>(null)
	const scrollbarDragRef = React.useRef<{ startScrollLeft: number; startX: number } | null>(null)
	const [isMounted, setIsMounted] = React.useState(false)
	const [isOpen, setIsOpen] = React.useState(false)
	const [currentIndex, setCurrentIndex] = React.useState(0)
	const [isZoomed, setIsZoomed] = React.useState(false)
	const [thumbScrollbar, setThumbScrollbar] = React.useState<ThumbScrollbarMetrics>({
		hasOverflow: false,
		thumbLeft: 0,
		thumbWidth: 100,
	})

	const validImages = React.useMemo(
		() =>
			images
				.map((item) => (typeof item.image === 'object' ? (item.image as Media) : null))
				.filter(
					(media): media is GalleryMedia => typeof media?.url === 'string' && media.url.length > 0,
				),
		[images],
	)

	React.useEffect(() => {
		setIsMounted(true)
	}, [])

	const openLightbox = React.useCallback((index: number) => {
		setCurrentIndex(index)
		setIsOpen(true)
	}, [])

	const selectImage = React.useCallback((index: number) => {
		setCurrentIndex(index)
		mainSwiperRef.current?.slideTo(index)
	}, [])

	const updateThumbScrollbar = React.useCallback(() => {
		const thumbStrip = thumbStripRef.current
		if (!thumbStrip) return

		const maxScrollLeft = thumbStrip.scrollWidth - thumbStrip.clientWidth
		const hasOverflow = maxScrollLeft > 1
		const thumbWidth = hasOverflow
			? Math.max((thumbStrip.clientWidth / thumbStrip.scrollWidth) * 100, 14)
			: 100
		const maxThumbLeft = 100 - thumbWidth
		const thumbLeft =
			hasOverflow && maxScrollLeft > 0
				? clamp((thumbStrip.scrollLeft / maxScrollLeft) * maxThumbLeft, 0, maxThumbLeft)
				: 0

		setThumbScrollbar({ hasOverflow, thumbLeft, thumbWidth })
	}, [])

	const scrollThumbStripToTrackPosition = React.useCallback(
		(clientX: number) => {
			const thumbStrip = thumbStripRef.current
			const scrollbarTrack = scrollbarTrackRef.current
			if (!thumbStrip || !scrollbarTrack) return

			const trackRect = scrollbarTrack.getBoundingClientRect()
			const thumbWidthPx = (thumbScrollbar.thumbWidth / 100) * trackRect.width
			const maxThumbLeftPx = trackRect.width - thumbWidthPx
			const targetThumbLeftPx = clamp(clientX - trackRect.left - thumbWidthPx / 2, 0, maxThumbLeftPx)
			const scrollRatio = maxThumbLeftPx > 0 ? targetThumbLeftPx / maxThumbLeftPx : 0

			thumbStrip.scrollLeft = scrollRatio * (thumbStrip.scrollWidth - thumbStrip.clientWidth)
			updateThumbScrollbar()
		},
		[thumbScrollbar.thumbWidth, updateThumbScrollbar],
	)

	const handleScrollbarTrackPointerDown = React.useCallback(
		(event: React.PointerEvent<HTMLDivElement>) => {
			event.preventDefault()
			scrollThumbStripToTrackPosition(event.clientX)
		},
		[scrollThumbStripToTrackPosition],
	)

	const handleScrollbarThumbPointerDown = React.useCallback(
		(event: React.PointerEvent<HTMLDivElement>) => {
			const thumbStrip = thumbStripRef.current
			if (!thumbStrip) return

			event.preventDefault()
			event.stopPropagation()
			event.currentTarget.setPointerCapture(event.pointerId)
			scrollbarDragRef.current = {
				startScrollLeft: thumbStrip.scrollLeft,
				startX: event.clientX,
			}
		},
		[],
	)

	const handleScrollbarThumbPointerMove = React.useCallback(
		(event: React.PointerEvent<HTMLDivElement>) => {
			const thumbStrip = thumbStripRef.current
			const scrollbarTrack = scrollbarTrackRef.current
			const dragStart = scrollbarDragRef.current
			if (!thumbStrip || !scrollbarTrack || !dragStart) return

			const trackWidth = scrollbarTrack.getBoundingClientRect().width
			const thumbWidthPx = (thumbScrollbar.thumbWidth / 100) * trackWidth
			const maxThumbLeftPx = trackWidth - thumbWidthPx
			const maxScrollLeft = thumbStrip.scrollWidth - thumbStrip.clientWidth
			const scrollPerPixel = maxThumbLeftPx > 0 ? maxScrollLeft / maxThumbLeftPx : 0

			thumbStrip.scrollLeft = dragStart.startScrollLeft + (event.clientX - dragStart.startX) * scrollPerPixel
			updateThumbScrollbar()
		},
		[thumbScrollbar.thumbWidth, updateThumbScrollbar],
	)

	const handleScrollbarThumbPointerUp = React.useCallback((event: React.PointerEvent<HTMLDivElement>) => {
		scrollbarDragRef.current = null
		if (event.currentTarget.hasPointerCapture(event.pointerId)) {
			event.currentTarget.releasePointerCapture(event.pointerId)
		}
	}, [])

	const closeLightbox = React.useCallback(() => {
		setIsOpen(false)
		setIsZoomed(false)
	}, [])

	const toggleZoom = React.useCallback((e: React.MouseEvent) => {
		e.stopPropagation()
		setIsZoomed((prev) => !prev)
	}, [])

	const nextImage = React.useCallback(
		(e?: React.MouseEvent) => {
			e?.stopPropagation()
			setIsZoomed(false)
			setCurrentIndex((prev) => (prev + 1) % validImages.length)
		},
		[validImages.length],
	)

	const prevImage = React.useCallback(
		(e?: React.MouseEvent) => {
			e?.stopPropagation()
			setIsZoomed(false)
			setCurrentIndex((prev) => (prev - 1 + validImages.length) % validImages.length)
		},
		[validImages.length],
	)

	React.useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden'
		} else {
			document.body.style.overflow = 'unset'
		}

		return () => {
			document.body.style.overflow = 'unset'
		}
	}, [isOpen])

	React.useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (!isOpen) return
			if (e.key === 'Escape') closeLightbox()
			if (e.key === 'ArrowRight') nextImage()
			if (e.key === 'ArrowLeft') prevImage()
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [isOpen, closeLightbox, nextImage, prevImage])

	React.useEffect(() => {
		const thumbStrip = thumbStripRef.current
		if (!thumbStrip) return

		updateThumbScrollbar()
		thumbStrip.addEventListener('scroll', updateThumbScrollbar, { passive: true })

		const resizeObserver = new ResizeObserver(updateThumbScrollbar)
		resizeObserver.observe(thumbStrip)

		return () => {
			thumbStrip.removeEventListener('scroll', updateThumbScrollbar)
			resizeObserver.disconnect()
		}
	}, [updateThumbScrollbar, validImages.length])

	if (!validImages.length) return null

	if (!isMounted) {
		// Render just the first image as a static placeholder during SSR/hydration to prevent CLS and hydration mismatch
		const media = validImages[0]

		return (
			<div className={styles.galleryContainer}>
				<div className={styles.mainSwiper}>
					<div className={styles.imageWrapper}>
						<Image
							src={media.url}
							alt={media.alt || 'Gallery Image'}
							fill
							className={styles.image}
							sizes="(max-width: 1200px) 100vw, 1200px"
							priority
							unoptimized
						/>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className={styles.galleryContainer}>
			<Swiper
				style={
					{
						'--swiper-navigation-color': '#fff',
						'--swiper-pagination-color': '#fff',
					} as React.CSSProperties
				}
				loop={false}
				spaceBetween={10}
				navigation={{
					nextEl: `.${styles.next}`,
					prevEl: `.${styles.prev}`,
				}}
				onSwiper={(swiper) => {
					mainSwiperRef.current = swiper
				}}
				onSlideChange={(swiper) => {
					setCurrentIndex(swiper.realIndex)
				}}
				modules={[FreeMode, Navigation, Pagination, Autoplay]}
				autoplay={{
					delay: 5000,
					disableOnInteraction: false,
				}}
				observer={true}
				observeParents={true}
				className={styles.mainSwiper}
			>
				{validImages.map((media, index) => (
					<SwiperSlide key={getGalleryImageKey(media, index)} className={styles.mainSlide}>
						<button
							type="button"
							className={styles.imageButton}
							onClick={() => openLightbox(index)}
							aria-label={`Open gallery image ${index + 1}`}
						>
							<Image
								src={media.url}
								alt={media.alt || 'Gallery Image'}
								fill
								className={styles.image}
								sizes="(max-width: 1200px) 100vw, 1200px"
								priority={index === 0}
								unoptimized // For local dev reliability
							/>
						</button>
					</SwiperSlide>
				))}
			</Swiper>

			{validImages.length > 1 && (
				<div className={styles.thumbArea}>
					<div
						className={styles.thumbSwiper}
						ref={thumbStripRef}
						role="list"
						aria-label="Gallery thumbnails"
					>
						{validImages.map((media, index) => (
							<button
								key={getGalleryImageKey(media, index)}
								type="button"
								className={`${styles.thumbSlide} ${
									currentIndex === index ? styles.thumbSlideActive : ''
								}`}
								onClick={() => selectImage(index)}
								aria-label={`Show gallery image ${index + 1}`}
								aria-current={currentIndex === index ? 'true' : undefined}
								role="listitem"
							>
								<div className={styles.thumbWrapper}>
									<Image
										src={media.url}
										alt={media.alt || 'Gallery Thumb'}
										fill
										className={styles.thumbImage}
										sizes="10px"
										unoptimized
									/>
								</div>
							</button>
						))}
					</div>

					{thumbScrollbar.hasOverflow && (
						<div
							className={styles.thumbScrollbar}
							ref={scrollbarTrackRef}
							onPointerDown={handleScrollbarTrackPointerDown}
							role="presentation"
						>
							<div
								className={styles.thumbScrollbarThumb}
								onPointerDown={handleScrollbarThumbPointerDown}
								onPointerMove={handleScrollbarThumbPointerMove}
								onPointerUp={handleScrollbarThumbPointerUp}
								onPointerCancel={handleScrollbarThumbPointerUp}
								style={{
									left: `${thumbScrollbar.thumbLeft}%`,
									width: `${thumbScrollbar.thumbWidth}%`,
								}}
							/>
						</div>
					)}
				</div>
			)}

			{/* Custom Navigation Arrows */}
			{validImages.length > 1 && (
				<>
					<button className={`${styles.navButton} ${styles.prev}`} aria-label="Previous image">
						<ChevronLeft size={30} />
					</button>
					<button className={`${styles.navButton} ${styles.next}`} aria-label="Next image">
						<ChevronRight size={30} />
					</button>
				</>
			)}

			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className={styles.lightboxOverlay}
						onClick={closeLightbox}
					>
						<button
							type="button"
							className={styles.closeButton}
							onClick={closeLightbox}
							aria-label="Close lightbox"
						>
							<X size={32} />
						</button>

						<div className={styles.lightboxContent} onClick={closeLightbox}>
							{validImages.length > 1 && (
								<button
									type="button"
									className={`${styles.lightboxNav} ${styles.lightboxPrev}`}
									onClick={prevImage}
									aria-label="Previous image"
								>
									<ChevronLeft size={48} />
								</button>
							)}

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
									<Image
										src={validImages[currentIndex].url}
										alt={validImages[currentIndex].alt || 'Gallery Image'}
										fill
										className={styles.activeImageStyle}
										sizes="100vw"
										unoptimized
									/>
								</motion.div>
							</div>

							{validImages.length > 1 && (
								<button
									type="button"
									className={`${styles.lightboxNav} ${styles.lightboxNext}`}
									onClick={nextImage}
									aria-label="Next image"
								>
									<ChevronRight size={48} />
								</button>
							)}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}

export default Gallery
