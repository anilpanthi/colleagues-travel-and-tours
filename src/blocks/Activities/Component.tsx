import type { ActivitiesBlock as ActivitiesBlockProps } from '@/payload-types'
import { ThingsTodo } from './ThingsToDo'
type Props = {
	className?: string
} & ActivitiesBlockProps

export const ActivitiesBlock: React.FC<Props> = ({
	subHeading,
	heading,
	description,
	selectedActivities,
}) => {
	if (!selectedActivities?.length) {
		return null
	}
	return (
		
			<ThingsTodo
				subheading={subHeading}
				heading={heading}
				description={description}
				activities={selectedActivities}
			/>
	)
}
