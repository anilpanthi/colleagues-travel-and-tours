import React from 'react'
import type { Package } from '@/payload-types'
import Cards from '@/components/ui/Card/Cards'
import style from './index.module.scss'

type RelatedPackagesProps = {
  packages: Package[]
}

export function RelatedPackages({ packages }: RelatedPackagesProps) {
  if (!packages.length) return null

  const selectedItems = packages.map((pkg) => ({
    relationTo: 'packages' as const,
    value: pkg,
  }))

  return (
    <div className={style.relatedPackages}>
      <h2 className={style.relatedPackages__title}>Related packages</h2>
      <Cards
        collection="packages"
        selectedItems={selectedItems}
        variant="packagesCard"
        columns="3"
      />
    </div>
  )
}
