'use client'
import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay, FreeMode, Thumbs } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import Image from 'next/image'
import type { Media } from '@/payload-types'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/thumbs'
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

const getGalleryImageKey = (media: GalleryMedia, index: number) =>
	`${media.id ?? media.url}-${index}`

export const Gallery: React.FC<Props> = ({ images }) => {
	const [thumbsSwiper, setThumbsSwiper] = React.useState<SwiperType | null>(null)
	const [isMounted, setIsMounted] = React.useState(false)
	const [isOpen, setIsOpen] = React.useState(false)
	const [currentIndex, setCurrentIndex] = React.useState(0)
	const [isZoomed, setIsZoomed] = React.useState(false)

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
				thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
				modules={[FreeMode, Navigation, Thumbs, Pagination, Autoplay]}
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
				<Swiper
					onSwiper={setThumbsSwiper}
					loop={false}
					spaceBetween={10}
					slidesPerView={'auto'}
					freeMode={true}
					watchSlidesProgress={true}
					slideToClickedSlide={true}
					modules={[FreeMode, Navigation, Thumbs]}
					observer={true}
					observeParents={true}
					className={styles.thumbSwiper}
				>
					{validImages.map((media, index) => (
						<SwiperSlide key={getGalleryImageKey(media, index)} className={styles.thumbSlide}>
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
						</SwiperSlide>
					))}
				</Swiper>
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
