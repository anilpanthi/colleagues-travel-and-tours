import { cn } from '@/utilities/ui'
import React from 'react'
import RichText from '@/components/RichText'

import type { ContentBlock as ContentBlockProps } from '@/payload-types'

import { CMSLink } from '../../components/Link'
import Content from '@/components/ui/Content/Index'
import style from './Component.module.scss'

export const ContentBlock: React.FC<ContentBlockProps> = (props) => {
	const { columns } = props

	return (
		<Content>
			<div className={style.grid}>
				{columns &&
					columns.length > 0 &&
					columns.map((col, index) => {
						const { enableLink, link, richText, size } = col

						return (
							<div
								className={cn(style.column, style[size!])}
								key={index}
							>
								{richText && (
									<RichText
										data={richText}
										enableGutter={false}
										enableProse={false}
										className={style.content}
										style={{
											color: '#4a5568',
											fontFamily: 'var(--font-jost)',
											fontSize: '1.8rem',
											lineHeight: '1.8',
										}}
									/>
								)}
								{enableLink && <CMSLink {...link} />}
							</div>
						)
					})}
			</div>
		</Content>
	)
}
