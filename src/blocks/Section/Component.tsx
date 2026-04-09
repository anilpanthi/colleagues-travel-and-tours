import React from 'react'
import type { SectionBlock as SectionBlockProps } from '@/payload-types'
import Section from '@/components/ui/Section/Section'

export const SectionBlock: React.FC<SectionBlockProps> = (props) => {
	const { blocks } = props

	if (!blocks || blocks.length === 0) return null

	return <Section sectionData={props} />
}

export default SectionBlock
