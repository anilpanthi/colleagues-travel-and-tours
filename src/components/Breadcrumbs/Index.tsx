import Link from 'next/link'
import React from 'react'
import style from './Index.module.scss'
import Container from '../ui/Container'
import { Home } from 'lucide-react'

export interface BreadcrumbItem {
	label?: string | null
	url?: string | null
}

interface BreadcrumbsProps {
	items?: BreadcrumbItem[]
	className?: string
	hideContainer?: boolean
	hideBorder?: boolean
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ 
	items, 
	className, 
	hideContainer = false, 
	hideBorder = false 
}) => {
	if (!items || items.length === 0) return null

	const content = (
		<ul className={style.list}>
			<li className={style.item}>
				<Link href="/" className={style.link} aria-label="Home">
					<Home size={16} />
				</Link>
			</li>

			{items.map((item, index) => {
				const isLast = index === items.length - 1
				
				return (
					<li key={index} className={style.item}>
						<span className={style.separator}>/</span>
						{isLast || !item.url ? (
							<span className={style.current} aria-current="page">
								{item.label || 'Page'}
							</span>
						) : (
							<Link href={item.url} className={style.link}>
								{item.label || 'Page'}
							</Link>
						)}
					</li>
				)
			})}
		</ul>
	)

	return (
		<nav 
			className={`${style.breadcrumbs} ${hideBorder ? style.noBorder : ''} ${className || ''}`} 
			aria-label="Breadcrumb"
		>
			{hideContainer ? (
				content
			) : (
				<Container className={style.container}>
					{content}
				</Container>
			)}
		</nav>
	)
}
