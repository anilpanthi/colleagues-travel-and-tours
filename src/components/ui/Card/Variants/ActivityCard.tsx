import type { CardsBlock, Activity, Media } from '@/payload-types'

import Card from '../Primitives/Card'
import Link from 'next/link'
import styles from './ActivityCard.module.scss'
import { Camera } from 'lucide-react'


export interface ActivityCardProps {
	data: CardsBlock['selectedItems']
	collection: string
}

export default function ActivityCard({ data, collection }: ActivityCardProps) {
	return (
		<>
			{data?.map((item, index) => {
				const doc = item?.value as Activity
				const { id, title, slug, meta, packageCount, featuredIcon } = doc
				const href = slug ? `/${collection}/${slug}` : `/${collection}/${id}`
				const cardImage = meta?.image || featuredIcon

				return (
					<Card as={Link} href={href} key={index} className={styles.activityCard}>
						{cardImage ? (
							<Card.Image
								resource={cardImage as Media}
								className={styles.activityCard__image}
								fill
							/>
						) : (
							<div className={styles.activityCard__placeholder}>
								<Camera size={48} className={styles.activityCard__placeholder_icon} />
							</div>
						)}
						{packageCount != null && (
							<Card.Div className={styles.activityCard__badge}>
								{packageCount} {packageCount === 1 ? 'Tour' : 'Tours'}
							</Card.Div>
						)}
						<Card.Div className={styles.activityCard__content}>
							<Card.Title className={styles.activityCard__title}>{title}</Card.Title>
							<Card.text className={styles.activityCard__description}>
								{meta?.description}
							</Card.text>
						</Card.Div>
					</Card>
				)
			})}
		</>
	)
}

