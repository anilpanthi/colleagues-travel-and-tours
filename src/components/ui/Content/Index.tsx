'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Container from '../Container'
import Row from '../Row'
import style from './Index.module.scss'
import { cn } from '@/utilities/ui'

type ContentProps = React.HTMLAttributes<HTMLSpanElement> & {
	children: React.ReactNode
}
export default function Content({ children, className, ...props }: ContentProps) {
	const { hasHeroImage } = useHeaderTheme()

	return (
		<main
			className={cn(style.content, !hasHeroImage && style.noHero, className)}
			{...props}
		>
			<Container>
				<Row>{children}</Row>
			</Container>
		</main>
	)
}
