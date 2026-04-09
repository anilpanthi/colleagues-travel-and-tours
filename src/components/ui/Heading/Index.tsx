import headingStyle from './Index.module.scss'

type HeadingProps = React.HTMLAttributes<HTMLHeadingElement> & {
	children: React.ReactNode
}
export default function Heading({ children, ...props }: HeadingProps) {
	return (
		<h2 className={headingStyle.heading} {...props}>
			{children}
		</h2>
	)
}
