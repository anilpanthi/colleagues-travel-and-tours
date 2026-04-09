// src/components/ui/accordion/AccordionItem.tsx
'use client'

import { memo, ReactNode } from 'react'
import { AnimatePresence } from 'framer-motion'
import { AccordionTrigger } from './AccordionTrigger'
import { AccordionContent } from './AccordionContent'
import RichText from '@/components/RichText'
import styles from './Accordion.module.scss'
import { AccordionItemData } from './types'
import { useAccordion } from './Accordion'

interface AccordionItemProps {
	value: string // usually item.id
	title?: string
	heading?: string
	children?: ReactNode
	className?: string
	renderTrigger?: (props: { isOpen: boolean; toggle: () => void }) => ReactNode
	renderContent?: (props: { isOpen: boolean }) => ReactNode
	data?: AccordionItemData // optional – if using data-driven mode
}

export const AccordionItem = memo(
	({
		value,
		title,
		heading,
		children,
		className,
		renderTrigger,
		renderContent,
		data,
	}: AccordionItemProps) => {
		const { openIds, toggle } = useAccordion()
		const isOpen = openIds.has(value)

		const effectiveTitle = title ?? data?.title ?? ''
		const effectiveHeading = heading ?? data?.heading ?? ''

		return (
			<div className={`${styles.item} ${className || ''}`} data-state={isOpen ? 'open' : 'closed'}>
				{renderTrigger ? (
					renderTrigger({ isOpen, toggle: () => toggle(value) })
				) : (
					<AccordionTrigger
						title={effectiveTitle}
						heading={effectiveHeading}
						isOpen={isOpen}
						onClick={() => toggle(value)}
					/>
				)}

				<AnimatePresence initial={false}>
					{isOpen && (
						<>
							{renderContent ? (
								renderContent({ isOpen })
							) : children ? (
								<AccordionContent>{children}</AccordionContent>
							) : data && data.details ? (
								<AccordionContent>
									<RichText data={data.details} />
								</AccordionContent>
							) : null}
						</>
					)}
				</AnimatePresence>
			</div>
		)
	},
)

AccordionItem.displayName = 'AccordionItem'
