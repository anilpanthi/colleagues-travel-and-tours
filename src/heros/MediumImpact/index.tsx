import React from 'react'

import type { Page } from '@/payload-types'


import { Media } from '@/components/Media'

import style from './index.module.scss'
import { Breadcrumbs } from '@/components/Breadcrumbs/Index'
import type { BreadcrumbItem } from '@/components/Breadcrumbs/Index'

export const MediumImpactHero: React.FC<
	Page['hero'] & { title?: string | null; breadcrumbs?: BreadcrumbItem[] | null }
> = ({ media, title, breadcrumbs }) => {
	return (
		<section className={style.staticHero}>
			{media && typeof media === 'object' && (
				<div className={style.mediumImpactHero__media}>
					<Media
						className={style.mediumImpactHero__mediaImage}
						imgClassName={style.mediumImpactHero__mediaImageInner}
						priority
						resource={media}
					/>
				</div>
			)}
			<div className={style.heroOverlayDark}></div>

			<div className={style.contentWrap}>
				<div className="container">
					{title && <h1 className={style.heroTitle}>{title}</h1>}

					{breadcrumbs && (
						<div className={style.heroBreadcrumbs}>
							<Breadcrumbs
								items={breadcrumbs}
								hideContainer
								hideBorder
								className={style.customBreadcrumbs}
							/>
						</div>
					)}
				</div>
			</div>
		</section>
	)
}
