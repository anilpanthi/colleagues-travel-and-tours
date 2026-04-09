import type { CardsBlock, Package, Media } from '@/payload-types'
import Card from '../Primitives/Card'
import styles from './PackageCard.module.scss'

import { Button } from '@/components/ui/Button/Button'
import { ChevronRight, Camera } from 'lucide-react'

import Link from 'next/link'

export interface PackageCardProps {
	data: CardsBlock['selectedItems']
	collection: string
}

export default function PackageCard({ data, collection }: PackageCardProps) {
	return (
		<>
			{data?.map((item, index) => {
				const doc = item?.value as Package
				const { id, title, slug, featuredImage, meta, price } = doc
				const href = slug ? `/${slug}` : `/${collection}/${id}`

				return (
					<Card key={index} className={styles.packageCard}>
						<Card.Div className={styles.packageCard__image_wrapper}>
							{meta?.image || featuredImage ? (
								<Card.Image
									resource={(meta?.image || featuredImage) as Media}
									className={styles.packageCard__image}
									fill
									loading="lazy"
								/>
							) : (
								<div className={styles.packageCard__placeholder}>
									<Camera size={48} className={styles.packageCard__placeholder_icon} />
								</div>
							)}
						</Card.Div>
						<Card.Div className={styles.packageCard__content_top}>
							<Card.Title as={Link} href={href} className={styles.packageCard__title}>
								{title}
							</Card.Title>
							<Card.text className={styles.packageCard__description}>{meta?.description}</Card.text>
						</Card.Div>
						<Card.Div className={styles.packageCard__content_bottom}>
							<Card.Div className={styles.packageCard__price_details}>
								<Card.Span className={styles.packageCard__price_description}>
									Starting From
								</Card.Span>
								<Card.Span className={styles.packageCard__price}>${price || 'N/A'}</Card.Span>
								<Card.Span className={styles.packageCard__price_tax}>TAXES INCL/PERS</Card.Span>
							</Card.Div>
							<Card.Div className={styles.packageCard__button}>
								<Button
									appearance="blackBtn"
									size="sm"
									href={href}
									iconRight={<ChevronRight size={16} />}
								>
									Book Now
								</Button>
							</Card.Div>
						</Card.Div>
					</Card>
				)
			})}
		</>
	)
}
