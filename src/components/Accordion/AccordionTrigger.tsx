// src/components/ui/accordion/AccordionTrigger.tsx
'use client'

import { memo } from 'react'
import { ChevronDown } from 'lucide-react'
import styles from './Accordion.module.scss'

interface Props {
	title: string
	heading: string
	isOpen?: boolean
	onClick: () => void
}

export const AccordionTrigger = memo(({ title, heading, isOpen, onClick }: Props) => {
	return (
		<button
			className={styles.trigger}
			onClick={onClick}
			type="button"
			data-state={isOpen ? 'open' : 'closed'}
		>
			<div className={styles.titleWrapper}>
				{title && (
					<span className={styles.day}>
						{title} {':'}
					</span>
				)}
				<span className={styles.heading}>{heading}</span>
			</div>
			<ChevronDown className={styles.chevron} size={20} />
		</button>
	)
})

AccordionTrigger.displayName = 'AccordionTrigger'
