// src/components/ui/accordion/Accordion.tsx
'use client'

import { createContext, useContext, useState, useCallback, memo } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import styles from './Accordion.module.scss'
import { AccordionContextValue, AccordionBaseProps } from './types'

const accordionVariants = cva(styles.accordion, {
	variants: {
		variant: {
			default: '',
			ghost: styles.variantGhost,
			bordered: styles.variantBordered,
			minimal: styles.variantMinimal,
		},
	},
	defaultVariants: {
		variant: 'default',
	},
})

const AccordionContext = createContext<AccordionContextValue | undefined>(undefined)

export const Accordion = memo(
	({
		children,
		className,
		title,
		defaultOpenIds = [],
		allowMultiple = false,
		onToggle,
		variant = 'default',
	}: AccordionBaseProps & VariantProps<typeof accordionVariants>) => {
		const [openIds, setOpenIds] = useState<Set<string>>(new Set(defaultOpenIds))

		const toggle = useCallback(
			(id: string) => {
				setOpenIds((prev) => {
					const next = new Set(prev)
					if (next.has(id)) {
						next.delete(id)
					} else {
						if (!allowMultiple) next.clear()
						next.add(id)
					}
					onToggle?.(Array.from(next))
					return next
				})
			},
			[allowMultiple, onToggle],
		)

		return (
			<AccordionContext.Provider
				value={{ openIds, toggle, allowMultiple, variant: variant ?? 'default' }}
			>
				<div className={accordionVariants({ variant, className })}>
					{title && <h2 className={styles.title}>{title}</h2>}
					{children}
				</div>
			</AccordionContext.Provider>
		)
	},
)

Accordion.displayName = 'Accordion'

export const useAccordion = (): AccordionContextValue => {
	const ctx = useContext(AccordionContext)
	if (!ctx) throw new Error('useAccordion must be used within Accordion')
	return ctx
}

// Compound exports
export { AccordionItem } from './AccordionItem'
export { AccordionTrigger } from './AccordionTrigger'
export { AccordionContent } from './AccordionContent'
