import type { CardsBlock, Post, Media, Category } from '@/payload-types'
import Card from '../Primitives/Card'
import Link from 'next/link'
import styles from './BlogCard.module.scss'
import { ArrowRight, Camera, Clock } from 'lucide-react'

export interface BlogCardProps {
	data: CardsBlock['selectedItems']
	collection: string
}

type LexicalNode = {
	text?: unknown
	children?: unknown
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
	typeof value === 'object' && value !== null

const isMedia = (value: unknown): value is Media =>
	isRecord(value) && typeof value.url === 'string' && value.url.length > 0

const extractTextFromLexical = (node: unknown): string => {
	if (!isRecord(node)) return ''
	const lexicalNode = node as LexicalNode
	if (typeof node.text === 'string') return node.text
	if (Array.isArray(lexicalNode.children)) {
		return lexicalNode.children.map((child) => extractTextFromLexical(child)).join(' ')
	}
	return ''
}

const calculateReadingTime = (content: Post['content']): number => {
	const text = extractTextFromLexical(content?.root)
	const words = text.split(/\s+/).filter((word) => word.length > 0).length
	return Math.ceil(words / 200) || 1
}

export default function BlogCard({ data, collection }: BlogCardProps) {
	return (
		<>
			{data?.map((item, index) => {
				const doc = item?.value as Post
				if (!doc || typeof doc !== 'object') return null

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
				const collectionSlug = collection && collection !== 'none' ? collection : item.relationTo
				const href = slug ? `/${collectionSlug}/${slug}` : `/${collectionSlug}/${id}`
				const cardKey = `${collectionSlug}-${id ?? slug ?? index}`
				const heroMedia = hero?.type === 'mediumImpact' ? hero?.media : null
				const cardImage = [meta?.image, featuredImage, heroMedia].find(isMedia)

				const category = categories?.[0]
				const categoryName =
					category && typeof category === 'object' ? (category as Category).title : ''

				const getFormattedDate = (dateString: string) => {
					const date = new Date(dateString)
					const months = [
						'January',
						'February',
						'March',
						'April',
						'May',
						'June',
						'July',
						'August',
						'September',
						'October',
						'November',
						'December',
					]
					return `${months[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`
				}
				const formattedDate = publishedAt ? getFormattedDate(publishedAt) : null

				const readingTime = content ? calculateReadingTime(content) : null

				return (
					<Card key={cardKey} className={styles.blogCard}>
						<Card.Div className={styles.blogCard__image_container}>
							{cardImage ? (
								<Card.Image
									fit
									resource={cardImage as Media}
									pictureClassName={styles.blogCard__image}
									imgClassName={styles.blogCard__image}
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
