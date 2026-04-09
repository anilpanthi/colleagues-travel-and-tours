import { CardRegistry } from './Registry/cardRegistry'
import styles from './Cards.module.scss'
import type { CardsBlock as CardBlockProps } from '@/payload-types'

import { Button } from '@/components/ui/Button/Button'
import { ArrowRight } from 'lucide-react'

type CardSectionProps = Omit<CardBlockProps, 'blockType' | 'id' | 'blockName'> & {
	variant?: CardBlockProps['cards']
}

export default function Cards({
	collection,
	selectedItems,
	variant,
	enableLink,
	link,
	columns = '3',
}: CardSectionProps) {
	if (!variant) return null

	const CardComponent = CardRegistry[variant as string]
	if (!CardComponent) return null
	return (
		<div className={styles.container}>
			<div className={styles.cards} style={{ '--grid-columns': columns } as React.CSSProperties}>
				<CardComponent collection={collection} data={selectedItems} />
			</div>
			{enableLink && link && selectedItems && selectedItems.length > 0 && (
				<div className={styles.linkContainer}>
					<Button
						appearance="outlineBlack"
						size="md"
						href={link.url ?? undefined}
						iconRight={<ArrowRight size={16} />}
					>
						{link.label}
					</Button>
				</div>
			)}
		</div>
	)
}
