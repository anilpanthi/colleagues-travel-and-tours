import React from 'react'

const defaultLabels = {
	plural: 'Docs',
	singular: 'Doc',
}

const defaultCollectionLabels = {
	posts: {
		plural: 'Posts',
		singular: 'Post',
	},
	activities: {
		plural: 'Activities',
		singular: 'Activity',
	},
	packages: {
		plural: 'Packages',
		singular: 'Package',
	},
}

export const PageRange: React.FC<{
	className?: string
	collection?: keyof typeof defaultCollectionLabels
	collectionLabels?: {
		plural?: string
		singular?: string
	}
	currentPage?: number
	limit?: number
	totalDocs?: number
}> = (props) => {
	const {
		className,
		collection,
		collectionLabels: collectionLabelsFromProps,
		currentPage,
		limit,
		totalDocs,
	} = props

	let indexStart = (currentPage ? currentPage - 1 : 1) * (limit || 1) + 1
	if (totalDocs && indexStart > totalDocs) indexStart = 0

	let indexEnd = (currentPage || 1) * (limit || 1)
	if (totalDocs && indexEnd > totalDocs) indexEnd = totalDocs

	const { plural, singular } =
		collectionLabelsFromProps ||
		(collection ? defaultCollectionLabels[collection] : undefined) ||
		defaultLabels ||
		{}

	return (
		<div className={[className, 'font-semibold'].filter(Boolean).join(' ')}>
			{(typeof totalDocs === 'undefined' || totalDocs === 0) && 'Search produced no results.'}
			{typeof totalDocs !== 'undefined' && totalDocs > 0 && (
				<>
					{totalDocs === 1
						? `Displaying 1 ${singular}`
						: indexStart === 1 && indexEnd === totalDocs
							? `Displaying all ${totalDocs} ${plural}`
							: `Displaying ${indexStart} - ${indexEnd} of ${totalDocs} ${plural}`}
				</>
			)}
		</div>
	)
}
