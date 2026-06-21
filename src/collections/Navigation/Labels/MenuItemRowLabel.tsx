'use client'
import React from 'react'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

type MenuItemRow = {
  label?: string
}

const MenuItemRowLabel: React.FC<RowLabelProps> = () => {
  const { data, rowNumber } = useRowLabel<MenuItemRow>()
  const label = data?.label || `Menu Item ${String((rowNumber || 0) + 1).padStart(2, '0')}`
  return <div>{label}</div>
}

export default MenuItemRowLabel
