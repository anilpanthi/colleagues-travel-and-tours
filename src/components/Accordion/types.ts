import { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import { ReactNode } from 'react'

export interface AccordionItemData {
	id?: string | null
	title?: string | null
	heading?: string | null
	details?: DefaultTypedEditorState | null
}

export interface AccordionBaseProps {
	children?: ReactNode
	className?: string
	title?: string
	defaultOpenIds?: string[]
	allowMultiple?: boolean
	onToggle?: (openIds: string[]) => void
}

export type AccordionVariant = 'default' | 'ghost' | 'bordered' | 'minimal'

export interface AccordionContextValue {
	openIds: Set<string>
	toggle: (id: string) => void
	allowMultiple: boolean
	variant: AccordionVariant
}
