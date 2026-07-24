'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Autoplay, Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import type { CarouselBlock as CarouselBlockProps, Testimonial } from '@/payload-types'
import TestimonialCard from '../Card/Variants/TestimonialCard'

import 'swiper/css'
import 'swiper/css/navigation'

import styles from './Carousel.module.scss'

type CarouselInteractiveProps = {
  selectedItems: NonNullable<CarouselBlockProps['selectedItems']>
}

export default function CarouselInteractive({ selectedItems }: CarouselInteractiveProps) {
  return (
    <>
      <Swiper
        modules={[Navigation, Autoplay]}
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
            <SwiperSlide key={`${item.relationTo}-${item.value.id ?? index}`}>
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

      <button
        aria-label="Previous testimonial"
        className={`${styles.navButton} ${styles.prev}`}
        type="button"
      >
        <ChevronLeft aria-hidden="true" focusable="false" />
        <span className={styles.srOnly}>Previous testimonial</span>
      </button>
      <button
        aria-label="Next testimonial"
        className={`${styles.navButton} ${styles.next}`}
        type="button"
      >
        <ChevronRight aria-hidden="true" focusable="false" />
        <span className={styles.srOnly}>Next testimonial</span>
      </button>
    </>
  )
}
