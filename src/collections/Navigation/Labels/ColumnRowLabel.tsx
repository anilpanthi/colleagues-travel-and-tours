'use client'
import React from 'react'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

const ColumnRowLabel: React.FC<RowLabelProps> = () => {
  const { data, rowNumber } = useRowLabel<any>()
  const label = data?.title || `Column ${String((rowNumber || 0) + 1).padStart(2, '0')}`
  return <div>{label}</div>
}

export default ColumnRowLabel
