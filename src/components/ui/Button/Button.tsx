import React from 'react'
import Link from 'next/link'
import styles from './Button.module.css'

export type ButtonAppearance =
	| 'primary'
	| 'secondary'
	| 'outline'
	| 'ghost'
	| 'outlineBlack'
	| 'simpleLinkbtn'
	| 'blackBtn'

export type ButtonSize = 'sm' | 'md' | 'lg'

interface BaseProps { 
	label?: string
	children?: React.ReactNode
	iconLeft?: React.ReactNode
	iconRight?: React.ReactNode
	appearance?: ButtonAppearance
	size?: ButtonSize
	fullWidth?: boolean
	className?: string
}

/* ---------- Button ---------- */
interface NativeButtonProps extends BaseProps, React.ButtonHTMLAttributes<HTMLButtonElement> {
	href?: never
}

/* ---------- Link Button ---------- */
interface LinkButtonProps extends BaseProps, React.AnchorHTMLAttributes<HTMLAnchorElement> {
	href: string
	target?: string
}

type ButtonProps = NativeButtonProps | LinkButtonProps

export const Button: React.FC<ButtonProps> = ({
	label,
	children,
	iconLeft,
	iconRight,
	appearance = 'primary',
	size = 'md',
	fullWidth = false,
	className = '',
	href,
	...rest
}) => {
	const classes = [
		styles.button,
		styles[appearance],
		styles[size],
		fullWidth ? styles.fullWidth : '',
		className,
	]
		.filter(Boolean)
		.join(' ')

	const content = (
		<>
			{iconLeft && <span className={styles.icon}>{iconLeft}</span>}
			<span className={styles.text}>{label || children}</span>
			{iconRight && <span className={styles.icon}>{iconRight}</span>}
		</>
	)

	if (href) {
		return (
			<Link href={href} prefetch className={classes} {...(rest as any)}>
				{content}
			</Link>
		)
	}

	return (
		<button className={classes} {...(rest as any)}>
			{content}
		</button>
	)
}
