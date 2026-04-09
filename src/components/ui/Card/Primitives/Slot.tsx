type Props = {
	as?: React.ElementType
	children?: React.ReactNode
} & React.ComponentPropsWithoutRef<any>

export default function Slot({ as: Component = 'div', children, ...props }: Props) {
	return <Component {...props}>{children}</Component>
}
