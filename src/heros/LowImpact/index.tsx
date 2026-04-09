'use client'
import React, { useEffect } from 'react'
import type { Page } from '@/payload-types'
import { Breadcrumbs } from '@/components/Breadcrumbs/Index'
import type { BreadcrumbItem } from '@/components/Breadcrumbs/Index'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import style from './index.module.scss'
import Container from '@/components/ui/Container'

export type LowImpactHeroProps = Page['hero'] & {
	title?: string | null
	breadcrumbs?: BreadcrumbItem[] | null
}

export const LowImpactHero: React.FC<LowImpactHeroProps> = ({ breadcrumbs }) => {
	const { setHasHeroImage } = useHeaderTheme()

	useEffect(() => {
		setHasHeroImage(false)
	}, [setHasHeroImage])

	return (
		<section className={style.lowImpactHero}>
			<Container>
				{breadcrumbs && (
					<Breadcrumbs 
						items={breadcrumbs} 
						hideContainer 
						hideBorder 
						className={style.breadcrumbs_custom} 
					/>
				)}
				{/* {title && <h1 className={style.title}>{title}</h1>} */}
			</Container>
		</section>
	)
}
