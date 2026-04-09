import containerStyle from './index.module.css'

type ContainerProps = React.HTMLAttributes<HTMLDivElement> & {
	children: React.ReactNode
}

export default function Container({ children, ...props }: ContainerProps) {
	return (
		<div className={containerStyle.container} {...props}>
			{children}
		</div>
	)
}
