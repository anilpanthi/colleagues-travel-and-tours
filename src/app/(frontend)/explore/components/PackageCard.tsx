'use client'

import React from 'react'
import Link from 'next/link'
import { Media } from '@/components/Media'
import { Package } from '@/payload-types'
import { Clock, BarChart } from 'lucide-react'
import { cn } from '@/utilities/ui'
import { generatePath } from '@/utilities/generatePath'
import style from './PackageCard.module.scss'

interface PackageCardProps {
  packageDoc: Package
}

export const PackageCard: React.FC<PackageCardProps> = ({ packageDoc }) => {
  const { title, slug, featuredImage, price, salePrice, tripDuration, tripGrade } = packageDoc

  const href = generatePath('packages', slug)

  return (
    <div className={style.card}>
      <Link href={href} className={style.imageWrapper}>
        {featuredImage && typeof featuredImage !== 'string' ? (
          <Media resource={featuredImage} className={style.image} />
        ) : (
          <div className={style.noImage}>No Image</div>
        )}

        {salePrice && <div className={style.badge}>Sale</div>}

        <div className={style.overlay}>
          <span>View Details</span>
        </div>
      </Link>

      <div className={style.content}>
        <div className={style.meta}>
          {tripGrade && <span className={cn(style.grade, style[tripGrade])}>{tripGrade}</span>}
        </div>

        <h3 className={style.title}>
          <Link href={href}>{title}</Link>
        </h3>

        <div className={style.infoGrid}>
          <div className={style.infoItem}>
            <Clock size={16} className={style.icon} />
            <span>{tripDuration || 'N/A'}</span>
          </div>
          <div className={style.infoItem}>
            <BarChart size={16} className={style.icon} />
            <span className="capitalize">{tripGrade || 'N/A'}</span>
          </div>
        </div>

        <div className={style.footer}>
          <div className={style.priceWrapper}>
            {salePrice ? (
              <>
                <span className={style.oldPrice}>${price}</span>
                <span className={style.currentPrice}>${salePrice}</span>
              </>
            ) : (
              <span className={style.currentPrice}>{price ? `$${price}` : 'Contact Us'}</span>
            )}
          </div>

          <Link href={href} className={style.btn}>
            Explore
          </Link>
        </div>
      </div>
    </div>
  )
}
