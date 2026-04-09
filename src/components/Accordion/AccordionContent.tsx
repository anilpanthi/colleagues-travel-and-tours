// src/components/ui/accordion/AccordionContent.tsx
'use client'

import { memo, ReactNode } from 'react'
import { motion } from 'framer-motion'
import styles from './Accordion.module.scss'

interface Props {
	children: ReactNode
}

export const AccordionContent = memo(({ children }: Props) => {
	return (
		<motion.div
			initial={{ height: 0, opacity: 0 }}
			animate={{ height: 'auto', opacity: 1 }}
			exit={{ height: 0, opacity: 0 }}
			transition={{ 
				duration: 0.35, 
				ease: [0.04, 0.62, 0.23, 0.98] 
			}}
			className={styles.content}
		>
			<div className={styles.contentInner}>{children}</div>
		</motion.div>
	)
})

AccordionContent.displayName = 'AccordionContent'
