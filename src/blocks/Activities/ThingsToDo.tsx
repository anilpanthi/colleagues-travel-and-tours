'use client'
import { Activity } from 'src/payload-types'
import Container from '@/components/ui/Container'
import Row from '@/components/ui/Row'
import { Media } from '@/components/Media'
import SvgComponent from './Icon'
import style from './ThingsToDo.module.scss'

type ActivityProps = {
	subheading?: string | null
	heading?: string | null
	description?: string | null
	activities?: (number | Activity)[]
}

export const ThingsTodo: React.FC<ActivityProps> = ({
	subheading,
	heading,
	description,
	activities = [],
}) => {
	return (
		<section className={style.thingstodo}>
			<Container>
				<div className={style.thingstodoWrapper}>
					<Row>
						<div className={style.thingstodo__header}>
							{subheading && (
								<span className={style.thingstodo__header_subheading}>{subheading}</span>
							)}
							{heading && <h2 className={style.thingstodo__header_heading}>{heading}</h2>}
							{description && <p className={style.thingstodo__header_description}>{description}</p>}
						</div>
						<div className={style.thingstodo__content}>
							<ul className={style.thingstodo__content_list}>
								{activities.map((activity) => {
									if (typeof activity === 'number') return null
									const { id, title, featuredIcon, meta } = activity
									const activityDescription =
										meta?.description ||
										'Explore unique local experiences, curated just for you to make your journey unforgettable.'
									return (
										<li key={id} className={style.thingstodo__content_list_item}>
											<div className={style.thingstodo__content_list_item_icon}>
												<SvgComponent />
											</div>
											<div className={style.thingstodo__content_list_item_title}>
												{title}
											</div>
											<div className={style.thingstodo__content_list_item_description}>
												{activityDescription}
											</div>
											<a
												href="#"
												className={`${style.thingstodo__content_list_item_link} ${style['btn-link']} ${style['hidden']}`}
											>
												Explore →
											</a>
										</li>
									)
								})}
							</ul>
						</div>
					</Row>
				</div>
			</Container>
		</section>
	)
}
