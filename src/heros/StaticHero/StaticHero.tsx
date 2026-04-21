import React from 'react'
import style from './StaticHero.module.scss'
import { MapPin } from 'lucide-react'
import bannerImage from './banner-image.webp'

interface StaticHeroProps {
	title?: string
	subtitle?: string | null
	tagline?: string | boolean
	imageSrc?: string
	scrollDot?: boolean
}

export const StaticHero: React.FC<StaticHeroProps> = ({
	title = 'Activities',
	subtitle = 'Discover the hidden gems and breathtaking adventures.',
	tagline = 'Explore Nepal',
	scrollDot = true,
}) => {
	return (
		<section
			className={style.staticHero}
			style={{ backgroundImage: `url(${bannerImage.src})` } as React.CSSProperties}
		>
			<div className={style.heroOverlayDark}></div>
			<div className={style.heroOverlayGradient}></div>

			<div className={style.staticHero__contentWrap}>
				{tagline && (
					<div className={style.heroTagline}>
						<MapPin className={style.iconPin} size={16} />
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
