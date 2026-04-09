import type { CardsBlock, Post, Media, Category } from '@/payload-types'
import Card from '../Primitives/Card'
import Link from 'next/link'
import styles from './BlogCard.module.scss'
import { ArrowRight, Camera, Clock } from 'lucide-react'

export interface BlogCardProps {
	data: CardsBlock['selectedItems']
	collection: string
}

const extractTextFromLexical = (node: Record<string, any> | null | undefined): string => {
	if (!node) return ''
	if (typeof node.text === 'string') return node.text
	if (Array.isArray(node.children)) {
		return node.children.map((child: any) => extractTextFromLexical(child)).join(' ')
	}
	return ''
}

const calculateReadingTime = (content: any): number => {
	const text = extractTextFromLexical(content?.root)
	const words = text.split(/\s+/).filter((word) => word.length > 0).length
	return Math.ceil(words / 200) || 1
}

export default function BlogCard({ data, collection }: BlogCardProps) {
	return (
		<>
			{data?.map((item, index) => {
				const doc = item?.value as Post
				const {
					id,
					title,
					slug,
					meta,
					publishedAt,
					categories,
					featuredImage,
					hero,
					content,
				} = doc
				const href = slug ? `/${collection}/${slug}` : `/${collection}/${id}`
				const cardImage = meta?.image || featuredImage || (hero?.type === 'mediumImpact' ? hero?.media : null)

				const category = categories?.[0]
				const categoryName =
					category && typeof category === 'object' ? (category as Category).title : ''

				const formattedDate = publishedAt
					? new Date(publishedAt).toLocaleDateString('en-US', {
							year: 'numeric',
							month: 'long',
							day: 'numeric',
						})
					: null

				const readingTime = content ? calculateReadingTime(content) : null

				return (
					<Card key={index} className={styles.blogCard}>
						<Card.Div className={styles.blogCard__image_container}>
							{cardImage ? (
								<Card.Image
									fit
									resource={cardImage as Media}
									className={styles.blogCard__image}
									fill
								/>
							) : (
								<div className={styles.blogCard__placeholder}>
									<Camera size={48} className={styles.blogCard__placeholder_icon} />
								</div>
							)}
							{categoryName && (
								<Card.Span className={styles.blogCard__category}>{categoryName}</Card.Span>
							)}
						</Card.Div>
						<Card.Div className={styles.blogCard__content}>
							<div className={styles.blogCard__meta}>
								{formattedDate && (
									<Card.Span className={styles.blogCard__date}>
										<Clock size={14} className={styles.blogCard__meta_icon} />
										{formattedDate}
									</Card.Span>
								)}
								{readingTime && (
									<Card.Span className={styles.blogCard__reading_time}>
										{readingTime} min read
									</Card.Span>
								)}
							</div>
							<Card.Title as={Link} href={href} className={styles.blogCard__title}>
								{title}
							</Card.Title>
							{meta?.description && (
								<Card.text className={styles.blogCard__description}>{meta.description}</Card.text>
							)}
							<Link href={href} className={styles.blogCard__link}>
								Read More
								{/* <span className={styles.blogCard__arrow}> */}
								<ArrowRight size={16} />
								{/* </span> */}
							</Link>
						</Card.Div>
					</Card>
				)
			})}
		</>
	)
}
