'use client'

import React, { useState, useRef, useEffect } from 'react'

interface Props {
	children: React.ReactNode
	className?: string
	lines?: number
}

export const ReadMore: React.FC<Props> = ({ children, className, lines = 10 }) => {
	const clampedHeight = `${lines * 3.2}rem` // 3.2rem is the standard line-height for textDesc

	const [isExpanded, setIsExpanded] = useState(false)
	const [isOverflowing, setIsOverflowing] = useState(false)
	const [height, setHeight] = useState<string | undefined>(clampedHeight)
	const contentRef = useRef<HTMLDivElement>(null)

	// Measure overflow only when content changes
	useEffect(() => {
		const el = contentRef.current
		if (el) {
			setIsOverflowing(el.scrollHeight > el.clientHeight)
		}
	}, [children])

	// Animate height when expanded state toggles
	useEffect(() => {
		const el = contentRef.current
		if (el) {
			setHeight(isExpanded ? `${el.scrollHeight}px` : clampedHeight)
		}
	}, [isExpanded, clampedHeight])

	return (
		<div className={`read-more-wrapper ${className || ''}`} style={{ position: 'relative' }}>
			<div
				ref={contentRef}
				style={{
					overflow: 'hidden',
					maxHeight: height,
					transition: 'max-height 0.4s ease-in-out',
				}}
			>
				{children}
			</div>

			{isOverflowing && !isExpanded && (
				<button
					onClick={() => setIsExpanded(true)}
					style={{
						// position: 'absolute',
						// bottom: '0',
						// right: '0',
						// padding: '0 0 0 0rem',
						color: 'var(--color-primary)',
						fontWeight: 600,
						background: 'linear-gradient(to right, transparent, white 30%)',
						border: 'none',
						cursor: 'pointer',
						textDecoration: 'underline',
						fontSize: '1.6rem',
						lineHeight: '3.2rem', // Match text line-height
					}}
				>
					Read More &raquo;
				</button>
			)}

			{isExpanded && (
				<button
					onClick={() => setIsExpanded(false)}
					style={{
						display: 'inline-block',
						marginTop: '1rem',
						color: 'var(--color-primary)',
						fontWeight: 600,
						background: 'none',
						border: 'none',
						padding: 0,
						cursor: 'pointer',
						textDecoration: 'underline',
						fontSize: '1.6rem',
					}}
				>
					Read Less &laquo;
				</button>
			)}
		</div>
	)
}
