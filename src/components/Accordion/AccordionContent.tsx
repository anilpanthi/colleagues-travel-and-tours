// src/components/ui/accordion/AccordionContent.tsx
'use client'

import { memo, ReactNode } from 'react'
import styles from './Accordion.module.scss'

interface Props {
  children: ReactNode
}

export const AccordionContent = memo(({ children }: Props) => {
  return (
    <div className={styles.content}>
      <div className={styles.contentInner}>{children}</div>
    </div>
  )
})

AccordionContent.displayName = 'AccordionContent'
