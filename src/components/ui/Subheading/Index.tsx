import subheadingStyle from './Index.module.scss'

type SubHeadingProps = React.HTMLAttributes<HTMLSpanElement> & {
	children: React.ReactNode
}
export default function SubHeading({ children, ...props }: SubHeadingProps) {
	return (
		<span className={subheadingStyle.subheading} {...props}>
			{children}
		</span>
	)
}
