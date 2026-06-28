'use client'
import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React, { Fragment } from 'react'

import type { Activity, Package, Post } from '@/payload-types'

import { Media } from '@/components/Media'
import type { Media as MediaType } from '@/payload-types'

export type CardPostData = {
	slug?: string | null
	title?: string | null
	meta?: (Post | Activity | Package)['meta']
	categories?: Post['categories']
	featuredImage?: Post['featuredImage'] | Package['featuredImage']
}

const isMedia = (value: unknown): value is MediaType =>
	typeof value === 'object' &&
	value !== null &&
	'url' in value &&
	typeof value.url === 'string' &&
	value.url.length > 0

export const Card: React.FC<{
	alignItems?: 'center'
	className?: string
	doc?: CardPostData
	relationTo?: 'posts' | 'activities' | 'packages'
	showCategories?: boolean
	title?: string
}> = (props) => {
	const { card, link } = useClickableCard({})
	const { className, doc, relationTo, showCategories, title: titleFromProps } = props

	const { slug, categories, featuredImage, meta, title } = doc || {}
	const { description, image: metaImage } = meta || {}
	const cardImage = [metaImage, featuredImage].find(isMedia)

	const hasCategories = categories && Array.isArray(categories) && categories.length > 0
	const titleToUse = titleFromProps || title
	const sanitizedDescription = description?.replace(/\s/g, ' ') // replace non-breaking space with white space
	const href = `/${relationTo}/${slug}`

	return (
		<article
			className={cn(
				'border border-border rounded-lg overflow-hidden bg-card hover:cursor-pointer',
				className,
			)}
			ref={card.ref}
		>
			<div className="relative w-full ">
				{!cardImage && <div className="">No image</div>}
				{cardImage && <Media resource={cardImage} size="33vw" />}
			</div>
			<div className="p-4">
				{showCategories && hasCategories && (
					<div className="uppercase text-sm mb-4">
						{showCategories && hasCategories && (
							<div>
								{categories?.map((category, index) => {
									if (typeof category === 'object') {
										const { title: titleFromCategory } = category

										const categoryTitle = titleFromCategory || 'Untitled category'

										const isLast = index === categories.length - 1

										return (
											<Fragment key={index}>
												{categoryTitle}
												{!isLast && <Fragment>, &nbsp;</Fragment>}
											</Fragment>
										)
									}

									return null
								})}
							</div>
						)}
					</div>
				)}
				{titleToUse && (
					<div className="prose">
						<h3>
							<Link className="not-prose" href={href} ref={link.ref}>
								{titleToUse}
							</Link>
						</h3>
					</div>
				)}
				{description && <div className="mt-2">{description && <p>{sanitizedDescription}</p>}</div>}
			</div>
		</article>
	)
}
