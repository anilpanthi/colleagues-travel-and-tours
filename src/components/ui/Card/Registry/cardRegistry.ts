import ActivityCard from '../Variants/ActivityCard'
import BlogCard from '../Variants/BlogCard'
import PackageCard from '../Variants/PackageCard'
import TestimonialCard from '../Variants/TestimonialCard'

export const CardRegistry: Record<string, React.ComponentType<any>> = {
	activitiesCard: ActivityCard,
	packagesCard: PackageCard,
	blogCard: BlogCard,
	testimonialCard: TestimonialCard,
}

// { label: 'None', value: 'none' },
// { label: 'Normal', value: 'normal' },
// { label: 'ActivitiesCard', value: 'activitiesCard' },
// { label: 'TrekkingsCard', value: 'trekkingsCard' },
// { label: 'PackagesCard', value: 'packagesCard' },
// { label: 'TestimonialCard', value: 'testimonialCard' },
// { label: 'BlogCard', value: 'blogCard' },
