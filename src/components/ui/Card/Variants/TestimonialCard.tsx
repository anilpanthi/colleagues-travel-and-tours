'use client'
import React from 'react'
import type { Testimonial, Media as MediaType } from '@/payload-types'
import Card from '../Primitives/Card'
import styles from './TestimonialCard.module.scss'
import { Star } from 'lucide-react'
import RichText from '@/components/RichText'

export interface TestimonialCardProps {
	testimonial: Testimonial
}

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
	const { author, quote, avatar, rating, createdAt } = testimonial

	const formattedDate = createdAt
		? new Date(createdAt).toLocaleDateString('en-US', {
				month: 'short',
				day: 'numeric',
				year: 'numeric',
			})
		: ''

	return (
		<Card className={styles.testimonialCard}>
			<Card.Div className={styles.testimonialCard__bubble}>
				<Card.Div className={styles.testimonialCard__quote}>
					{quote && <RichText data={quote} enableGutter={false} enableProse={false} />}
				</Card.Div>

				<Card.Div className={styles.testimonialCard__footer}>
					<Card.Div className={styles.testimonialCard__stars}>
						{[...Array(5)].map((_, i) => (
							<Star
								key={i}
								size={16}
								className={styles.testimonialCard__starIcon}
								fill={i < (rating || 0) ? '#ffc107' : 'transparent'}
								color={i < (rating || 0) ? '#ffc107' : '#e0e0e0'}
							/>
						))}
					</Card.Div>

					<div className={styles.testimonialCard__bgQuote}>”</div>

					<Card.Div className={styles.testimonialCard__dateTime}>
						<span className={styles.testimonialCard__date}>{formattedDate}</span>
					</Card.Div>
				</Card.Div>
			</Card.Div>

			<Card.Div className={styles.testimonialCard__authorInfo}>
				{avatar && typeof avatar === 'object' && (
					<Card.Div className={styles.testimonialCard__avatar}>
						<Card.Image resource={avatar as MediaType} alt={author} />
					</Card.Div>
				)}
				<Card.Div className={styles.testimonialCard__authorDetails}>
					<Card.Title className={styles.testimonialCard__authorName}>{author}</Card.Title>
				</Card.Div>
			</Card.Div>
		</Card>
	)
}
