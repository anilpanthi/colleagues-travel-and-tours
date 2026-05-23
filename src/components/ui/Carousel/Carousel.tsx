'use client'
import React from 'react'
import type { CarouselBlock as CarouselBlockProps, Testimonial } from '@/payload-types'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay, Pagination } from 'swiper/modules'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import TestimonialCard from '../Card/Variants/TestimonialCard'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import styles from './Carousel.module.scss'

type CarouselProps = {
	selectedItems?: CarouselBlockProps['selectedItems']
	collection?: CarouselBlockProps['collection']
	enableLink?: CarouselBlockProps['enableLink']
	link?: CarouselBlockProps['link']
}

export default function Carousel({ selectedItems }: CarouselProps) {
	const [isMounted, setIsMounted] = React.useState(false)

	React.useEffect(() => {
		setIsMounted(true)
	}, [])

	if (!selectedItems || selectedItems.length === 0) return null

	if (!isMounted) {
		// Render just the first card as a static placeholder during SSR/hydration to prevent CLS and hydration mismatch
		const firstItem = selectedItems[0]
		if (!firstItem || typeof firstItem.value === 'number') return null

		return (
			<div className={styles.carouselContainer}>
				<div className={styles.mySwiper}>
					{firstItem.relationTo === 'testimonials' ? (
						<TestimonialCard testimonial={firstItem.value as Testimonial} />
					) : (
						<div className={styles.placeholderCard}>
							<h3>
								{(firstItem.value as { title?: string; author?: string }).title ||
									(firstItem.value as { title?: string; author?: string }).author}
							</h3>
						</div>
					)}
				</div>
			</div>
		)
	}

	return (
		<div className={styles.carouselContainer}>
			<Swiper
				modules={[Navigation, Autoplay, Pagination]}
				autoplay={{
					delay: 3000,
					disableOnInteraction: false,
				}}
				spaceBetween={30}
				slidesPerView={1}
				navigation={{
					nextEl: `.${styles.next}`,
					prevEl: `.${styles.prev}`,
				}}
				pagination={{ clickable: true }}
				breakpoints={{
					640: {
						slidesPerView: 1,
					},
					768: {
						slidesPerView: 2,
					},
					1024: {
						slidesPerView: 3,
					},
				}}
				className={styles.mySwiper}
			>
				{selectedItems.map((item, index) => {
					if (typeof item.value === 'number') return null

					return (
						<SwiperSlide key={index}>
							{item.relationTo === 'testimonials' ? (
								<TestimonialCard testimonial={item.value as Testimonial} />
							) : (
								<div className={styles.placeholderCard}>
									<h3>
										{(item.value as { title?: string; author?: string }).title ||
											(item.value as { title?: string; author?: string }).author}
									</h3>
								</div>
							)}
						</SwiperSlide>
					)
				})}
			</Swiper>

			{/* Custom Navigation Arrows */}
			<button className={`${styles.navButton} ${styles.prev}`}>
				<ChevronLeft />
			</button>
			<button className={`${styles.navButton} ${styles.next}`}>
				<ChevronRight />
			</button>
		</div>
	)
}
