import Slot from './Slot'
import { createCardSlot } from './createCardSlot'
import styles from './Card.module.scss'
import { Media } from '@/components/Media'

type CardProps = {
	as?: React.ElementType
	children: React.ReactNode
} & React.ComponentPropsWithoutRef<any>

const Card = ({ as = 'div', children, ...props }: CardProps) => {
	return (
		<Slot as={as} className={styles.card} {...props}>
			{children}
		</Slot>
	)
}

/* slots */

Card.Image = createCardSlot(Media, styles.cardImage)
Card.Title = createCardSlot('h3', styles.cardTitle)
Card.text = createCardSlot('p', styles.cardDescription)
Card.Div = createCardSlot('div', styles.DivContainer)
Card.Span = createCardSlot('span', styles.cardSpan)
Card.Price = createCardSlot('div', styles.cardPrice)

export default Card
