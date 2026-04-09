'use client'
import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay, FreeMode, Thumbs } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import Image from 'next/image'
import type { Media } from '@/payload-types'
import { ChevronLeft, ChevronRight } from 'lucide-react'

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

export const Gallery: React.FC<Props> = ({ images }) => {
	const [thumbsSwiper, setThumbsSwiper] = React.useState<SwiperType | null>(null)

	if (!images || images.length === 0) return null

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
				{images.map((item, index) => {
					const media = typeof item.image === 'object' ? (item.image as Media) : null
					if (!media || !media.url) return null

					return (
						<SwiperSlide key={index} className={styles.mainSlide}>
							<div className={styles.imageWrapper}>
								<Image
									src={media.url}
									alt={media.alt || 'Gallery Image'}
									fill
									className={styles.image}
									sizes="(max-width: 1200px) 100vw, 1200px"
									priority={index === 0}
									unoptimized // For local dev reliability
								/>
							</div>
						</SwiperSlide>
					)
				})}
			</Swiper>

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
				{images.map((item, index) => {
					const media = typeof item.image === 'object' ? (item.image as Media) : null
					if (!media || !media.url) return null

					return (
						<SwiperSlide key={index} className={styles.thumbSlide}>
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
					)
				})}
			</Swiper>

			{/* Custom Navigation Arrows */}
			<button className={`${styles.navButton} ${styles.prev}`}>
				<ChevronLeft size={30} />
			</button>
			<button className={`${styles.navButton} ${styles.next}`}>
				<ChevronRight size={30} />
			</button>
		</div>
	)
}

export default Gallery
