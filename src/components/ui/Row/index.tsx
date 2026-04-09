import rowStyle from './index.module.css'

type RowProps = React.HTMLAttributes<HTMLDivElement> & {
	children: React.ReactNode
}
export default function Row({ children }: RowProps) {
	return <div className={rowStyle.row}>{children}</div>
}
