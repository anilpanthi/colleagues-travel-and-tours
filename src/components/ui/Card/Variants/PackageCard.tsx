import type { CardsBlock, Package, Media } from '@/payload-types'
import Card from '../Primitives/Card'
import styles from './PackageCard.module.scss'


import {  Camera, Mountain, Compass } from 'lucide-react'

import Link from 'next/link'

export interface PackageCardProps {
  data: CardsBlock['selectedItems']
  collection: string
}

export default function PackageCard({ data, collection }: PackageCardProps) {
  return (
    <>
      {data?.map((item, index) => {
        const doc = item?.value as Package
        if (!doc || typeof doc !== 'object') {
          console.warn('PackageCard: doc is not populated', item)
          return null
        }

        console.log(doc)

        const { id, title, slug, featuredImage, meta } = doc

        // Default to 'packages' if collection is not provided or 'none'
        const collectionSlug = collection && collection !== 'none' ? collection : 'packages'
        const href = slug ? `/${slug}` : `/${collectionSlug}/${id}`
        return (
          <Card key={index} className={styles.packageCard} as={Link} href={href}>
            {doc.tripDuration && (
              <Card.Span className={styles.packageCard__batch_duration}>
                {doc.tripDuration} Days
              </Card.Span>
            )}
            {doc.tripGrade && (
              <Card.Span className={styles.packageCard__batch_grade}>{doc.tripGrade}</Card.Span>
            )}

            <Card.Div className={styles.packageCard__image_wrapper}>
              {meta?.image || featuredImage ? (
                <Card.Image
                  resource={(meta?.image || featuredImage) as Media}
                  className={styles.packageCard__image}
                  imgClassName={styles.packageCard__image}
                  fill
                  loading="lazy"
                />
              ) : (
                <div className={styles.packageCard__placeholder}>
                  <Camera size={48} className={styles.packageCard__placeholder_icon} />
                </div>
              )}
            </Card.Div>
            {/* Dsiplaying title and facts */}
            <Card.Div className={styles.packageCard__content_top}>
              <Card.Title className={styles.packageCard__title}>
                {title}
              </Card.Title>
              <Card.Div className={styles.packageCard__content_top_facts}>
                {doc?.elevation && (
                  <Card.Div className={styles.packageCard__content_top_facts_elevation}>
                    <Mountain size={18} /> <Card.Span>{doc.elevation}m</Card.Span>
                  </Card.Div>
                )}
                {doc?.Activity &&
                  doc.Activity.length > 0 &&
                  typeof doc.Activity[0] === 'object' && (
                    <Card.Div className={styles.packageCard__content_top_facts_elevation}>
                      <Compass size={18} /> <Card.Span>{doc.Activity[0].title}</Card.Span>
                    </Card.Div>
                  )}

              </Card.Div>
            </Card.Div>
          </Card>
        )
      })}
    </>
  )
}
