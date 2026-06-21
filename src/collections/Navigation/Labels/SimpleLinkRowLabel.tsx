'use client'
import React from 'react'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

type SimpleLinkRow = {
  label?: string
}

const SimpleLinkRowLabel: React.FC<RowLabelProps> = () => {
  const { data, rowNumber } = useRowLabel<SimpleLinkRow>()
  const label = data?.label || `Simple Link ${String((rowNumber || 0) + 1).padStart(2, '0')}`
  return <div>{label}</div>
}

export default SimpleLinkRowLabel
