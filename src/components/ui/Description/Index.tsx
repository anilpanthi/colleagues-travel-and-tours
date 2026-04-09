import descriptionStyle from './Index.module.scss'

type DescriptionProps = React.HTMLAttributes<HTMLParagraphElement> & {
	children: React.ReactNode
}
export default function Description({ children, ...props }: DescriptionProps) {
	return (
		<p className={descriptionStyle.description} {...props}>
			{children}
		</p>
	)
}
