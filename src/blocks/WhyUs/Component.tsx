import React from 'react'
import type { WhyUsBlock as WhyUsBlockType } from '@/payload-types'
import * as LucideIcons from 'lucide-react'
import styles from './WhyUs.module.scss'

export const WhyUsBlock: React.FC<WhyUsBlockType> = (props) => {
	const { features } = props

	return (
		<ul className={styles.whyus__content_list}>
			{features?.map((feature, index) => {
				const { icon, title, description, id } = feature

				// Dynamic Icon component
				const IconComponent =
					icon && (LucideIcons as any)[icon] ? (LucideIcons as any)[icon] : LucideIcons.HelpCircle

				return (
					<li key={id || index} className={styles.whyus__content_list_item}>
						<div className={styles.whyus__content_list_item_icon}>
							<IconComponent strokeWidth={1.5} />
						</div>
						<div className={styles.whyus__content_list_item_title}>{title}</div>
						<div className={styles.whyus__content_list_item_description}>{description}</div>
					</li>
				)
			})}
		</ul>
	)
}

export default WhyUsBlock
