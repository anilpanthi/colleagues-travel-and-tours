import type { CardsBlock, Package, Media } from '@/payload-types'
import Card from '../Primitives/Card'
import styles from './PackageCard.module.scss'

import { Button } from '@/components/ui/Button/Button'
import { ChevronRight, Camera, CalendarHeart, ArrowRight, Mountain } from 'lucide-react'

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
          <Card key={index} className={styles.packageCard}>
            {doc.tripDuration && (
              <Card.Span className={styles.packageCard__batch_duration}>
                {doc.tripDuration}
              </Card.Span>
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
              <Card.Title as={Link} href={href} className={styles.packageCard__title}>
                {title}
              </Card.Title>
              {/* <Card.Span className={styles.packageCard__content_top_grade}>
                {doc?.tripGrade}
              </Card.Span> */}
              {/* <Card.text>{meta?.description}</Card.text> */}

              <Card.Div className={styles.packageCard__content_top_facts}>
                {/* {doc?.elevation && (
                  <Card.Div className={styles.packageCard__content_top_facts_elevation}>
                    <Mountain size={18} /> <Card.Span>{doc.elevation}</Card.Span>
                  </Card.Div>
                )} */}
                <Button
                  appearance="simpleLinkbtn"
                  className={styles.packageCard__content_top_facts_btn}
                  size="md"
                  href={href}
                  iconRight={<ArrowRight size={16} />}
                >
                  More Details
                </Button>
              </Card.Div>
            </Card.Div>
            {/* <Card.Div className={styles.packageCard__content_bottom}>
              <Card.Div className={styles.packageCard__content_bottom_facts}>
                {doc?.elevation && (
                  <Card.Div className={styles.packageCard__content_bottom_facts_elevation}>
                    <Mountain size={18} /> <Card.Span>{doc.elevation}</Card.Span>
                  </Card.Div>
                )}
                <Button
                  appearance="simpleLinkbtn"
                  className={styles.packageCard__content_top_facts_btn}
                  size="md"
                  href={href}
                  iconRight={<ArrowRight size={16} />}
                >
                  More Details
                </Button>
              </Card.Div>
            </Card.Div> */}
          </Card>
        )
      })}
    </>
  )
}
