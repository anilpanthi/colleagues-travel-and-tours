import type { CSSProperties } from 'react'

const visuallyHiddenStyle: CSSProperties = {
  border: 0,
  clip: 'rect(0 0 0 0)',
  height: 1,
  margin: -1,
  overflow: 'hidden',
  padding: 0,
  position: 'absolute',
  whiteSpace: 'nowrap',
  width: 1,
}

type DeferredDialogStatusProps = {
  label: string
}

export const DeferredDialogStatus = ({ label }: DeferredDialogStatusProps) => (
  <span aria-live="polite" role="status" style={visuallyHiddenStyle}>
    {label}
  </span>
)
