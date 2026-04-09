'use client'

import React, { useState, useMemo } from 'react'
import { useField } from '@payloadcms/ui'
import { icons } from 'lucide-react'

import './index.scss'

type IconName = keyof typeof icons

const LucideIconPicker: React.FC<{ path: string; label?: string; required?: boolean }> = ({
	path,
	label,
	required,
}) => {
	const { value, setValue } = useField<string>({ path })
	const [search, setSearch] = useState('')
	const [isExpanded, setIsExpanded] = useState(false)

	// Memoize the filtered icons list to prevent expensive re-calculations
	const filteredIcons = useMemo(() => {
		const iconNames = Object.keys(icons) as IconName[]
		if (!search) return iconNames

		const searchLower = search.toLowerCase()
		return iconNames.filter((name) => name.toLowerCase().includes(searchLower))
	}, [search])

	// Get the actual icon component for the selected value
	// Safe casting to avoid any types
	const SelectedIcon =
		value && (icons as Record<string, React.ComponentType<{ size?: number }>>)[value]
			? (icons as Record<string, React.ComponentType<{ size?: number }>>)[value]
			: null

	return (
		<div className="lucide-icon-picker-field">
			{label && (
				<label className="field-label">
					{label}
					{required && <span className="required">*</span>}
				</label>
			)}

			<div className="lucide-icon-picker__controls">
				<div
					className="lucide-icon-picker__selected-display"
					onClick={() => setIsExpanded(!isExpanded)}
					role="button"
					tabIndex={0}
					onKeyDown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') {
							setIsExpanded(!isExpanded)
						}
					}}
				>
					{SelectedIcon ? (
						<SelectedIcon size={24} />
					) : (
						<span className="placeholder">Select an icon...</span>
					)}
				</div>

				{value && (
					<button
						type="button"
						className="lucide-icon-picker__clear-btn"
						onClick={() => setValue(null)}
						aria-label="Clear icon"
					>
						Clear
					</button>
				)}
			</div>

			{isExpanded && (
				<div className="lucide-icon-picker__dropdown">
					<input
						type="text"
						className="lucide-icon-picker__search"
						placeholder="Search icons..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						autoFocus
					/>

					<div className="lucide-icon-picker__grid">
						{filteredIcons.slice(0, 100).map((iconName) => {
							// Limiting display for performance
							const Icon = icons[iconName]
							return (
								<button
									type="button"
									key={iconName}
									className={`lucide-icon-picker__option ${value === iconName ? 'selected' : ''}`}
									onClick={() => {
										setValue(iconName)
										setIsExpanded(false)
									}}
									title={iconName}
								>
									<Icon size={20} />
								</button>
							)
						})}
						{filteredIcons.length > 100 && (
							<div className="lucide-icon-picker__more">Type to search more...</div>
						)}
					</div>
				</div>
			)}
		</div>
	)
}

export default LucideIconPicker
