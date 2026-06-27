import React from 'react'
import style from './StaticHero.module.scss'
import { MapPin } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import bannerImage from './banner-image.webp'
import Image, { type StaticImageData } from 'next/image'

interface StaticHeroProps {
	title?: string
	subtitle?: string | null
	tagline?: string | boolean
	imageSrc?: string
	scrollDot?: boolean
	icon?: LucideIcon
}

export const StaticHero: React.FC<StaticHeroProps> = ({
	title = 'Activities',
	subtitle = 'Discover the hidden gems and breathtaking adventures.',
	tagline = 'Explore Nepal',
	imageSrc,
	scrollDot = true,
	icon,
}) => {
	const heroImage: string | StaticImageData = imageSrc || bannerImage
	const Icon = icon || MapPin

	return (
		<section className={style.staticHero}>
			<Image
				alt=""
				className={style.staticHero__image}
				fill
				priority
				quality={2}
				sizes="100vw"
				src={heroImage}
			/>
			<div className={style.heroOverlayDark}></div>
			<div className={style.heroOverlayGradient}></div>

			<div className={style.staticHero__contentWrap}>
				{tagline && (
					<div className={style.heroTagline}>
						<Icon className={style.iconPin} size={16} />
						<span>{tagline}</span>
					</div>
				)}

				<h1 className={style.title}>{title}</h1>
				{subtitle && <p className={style.description}>{subtitle}</p>}
			</div>

			{scrollDot && (
				<div className={style.scrollIndicator}>
					<div className={style.scrollIndicatorInner}>
						<div className={style.scrollDot}></div>
					</div>
				</div>
			)}
		</section>
	)
}
