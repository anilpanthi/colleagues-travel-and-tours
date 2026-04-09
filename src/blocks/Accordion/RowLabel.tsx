'use client'

import React from 'react'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

const AccordionRowLabel: React.FC<RowLabelProps> = () => {
	const { data, rowNumber } = useRowLabel<{ title?: string; heading?: string }>()
	
	const title = data?.title || `Item ${String((rowNumber || 0) + 1).padStart(2, '0')}`
	const heading = data?.heading ? `: ${data.heading}` : ''
	
	return <div>{`${title}${heading}`}</div>
}

export default AccordionRowLabel


