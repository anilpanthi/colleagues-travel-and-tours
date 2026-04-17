'use client'
import React, { useEffect } from 'react'
import { RenderHero } from '@/heros/RenderHero'
import RichText from '@/components/RichText'
import Content from '@/components/ui/Content/Index'
import { Accordion, AccordionItem } from '@/components/Accordion/Index'
import type { Package } from '@/payload-types'
import Gallery from '@/components/Gallery'
import { Breadcrumbs } from '@/components/Breadcrumbs/Index'
import { ReadMore } from '@/components/ui/ReadMore'
import { useHeaderTheme } from '@/providers/HeaderTheme'

import style from './index.module.scss'

interface PackageDetailsProps {
  pkg: Package
}

export const PackageDetails: React.FC<PackageDetailsProps> = ({ pkg }) => {
  const { setHeaderTheme, setHasHeroImage } = useHeaderTheme()
  const hasHeroImage = Boolean(
    pkg?.hero?.type && pkg?.hero?.type !== 'none' && pkg?.hero?.type !== 'lowImpact',
  )

  useEffect(() => {
    if (!hasHeroImage) {
      setHeaderTheme('light')
      setHasHeroImage(false)
    } else {
      setHasHeroImage(true)
    }
  }, [setHeaderTheme, setHasHeroImage, hasHeroImage])

  // Construct custom breadcrumbs: Home -> Activities -> [Activity Name] -> Package Name
  const activity =
    pkg.Activity && pkg.Activity.length > 0 && typeof pkg.Activity[0] === 'object'
      ? pkg.Activity[0]
      : null

  const customBreadcrumbs = [
    { label: 'Activities', url: '/activities' },
    ...(activity ? [{ label: activity.title, url: `/activities/${activity.slug}` }] : []),
    { label: pkg.title },
  ]

  return (
    <>
      <RenderHero {...pkg?.hero} title={pkg.title} breadcrumbs={customBreadcrumbs} />

      {(!pkg?.hero || pkg?.hero?.type === 'none') && (
        <div className={style.packageHeader}>
          <Content>
            <h1 className={style.mainTitle}>{pkg.title}</h1>
            <Breadcrumbs items={customBreadcrumbs} />
          </Content>
        </div>
      )}

      <Content className={style.packageWrap}>
        <div className={style.singlePackage}>
          <div className={style.singlePackage__left}>
            {pkg.gallery && pkg.gallery.length > 0 && (
              <div className={style.gallerySection}>
                <Gallery images={pkg.gallery} />
              </div>
            )}
            {pkg.overview && (
              <div className={style.overviewSection}>
                <h2 className={style.title}>{'Overview of ' + pkg.title}</h2>
                <ReadMore lines={10}>
                  <RichText className={style.textDesc} data={pkg.overview} enableGutter={false} />
                </ReadMore>
              </div>
            )}

            {pkg?.packageFacts && (
              <div className={style.highlightsSection}>
                <h2 className={style.title}>Trip Highlights</h2>
                <RichText
                  className={style.hightlights_content}
                  data={pkg.packageFacts}
                  enableGutter={false}
                />
              </div>
            )}

            {pkg?.detailedItinerary && pkg.detailedItinerary.length > 0 && (
              <div className={style.detailedItinerary}>
                <Accordion
                  title="Detailed Itinerary"
                  variant="minimal"
                  allowMultiple={false}
                  defaultOpenIds={
                    (pkg?.detailedItinerary?.[0]?.id
                      ? [pkg.detailedItinerary[0].id]
                      : []) as string[]
                  }
                >
                  {pkg?.detailedItinerary?.map((item) => {
                    if (!item?.id) return null
                    return <AccordionItem key={item.id} value={item.id} data={item} />
                  })}
                </Accordion>
              </div>
            )}

            {pkg.includes && (
              <div className={style.includeExcludeSection}>
                <h2 className={style.title}>Cost Includes</h2>
                <RichText className={style.includesList} data={pkg.includes} enableGutter={false} />
              </div>
            )}

            {pkg.excludes && (
              <div className={style.includeExcludeSection}>
                <h2 className={style.title}>Cost Excludes</h2>
                <RichText className={style.excludesList} data={pkg.excludes} enableGutter={false} />
              </div>
            )}

            {pkg.mapIframe && (
              <div className={style.mapSection}>
                <h2 className={style.title}>Map</h2>
                <div className={style.mapIframeRichText}>
                  <RichText data={pkg.mapIframe} enableGutter={false} />
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className={style.singlePackage__right}>
            {pkg.price && (
              <div className={style.priceCard}>
                <span className={style.priceLabel}>From</span>
                <span className={style.priceValue}>${pkg.price}</span>
                <span className={style.priceNote}>per person</span>
              </div>
            )}
            {(pkg.tripDuration ||
              pkg.tripGrade ||
              pkg.bestSeason ||
              pkg.perDayHiking ||
              pkg.elevation ||
              pkg.accommodation ||
              pkg.transportation ||
              (pkg.customFacts && pkg.customFacts.length > 0)) && (
              <div className={style.tripFacts}>
                <h3 className={style.sidebarTitle}>Trip Facts</h3>
                <div className={style.tripFacts__body}>
                  <table className={style.tripFacts__table}>
                    <tbody>
                      {pkg.tripDuration && (
                        <tr>
                          <th>Trip Duration:</th>
                          <td>{pkg.tripDuration}</td>
                        </tr>
                      )}
                      {pkg.tripGrade && (
                        <tr>
                          <th>Trip Grade:</th>
                          <td className={style.capitalize}>{pkg.tripGrade}</td>
                        </tr>
                      )}
                      {pkg.bestSeason && (
                        <tr>
                          <th>Best Season:</th>
                          <td>{pkg.bestSeason}</td>
                        </tr>
                      )}
                      {pkg.perDayHiking && (
                        <tr>
                          <th>Per Day Hiking:</th>
                          <td>{pkg.perDayHiking}</td>
                        </tr>
                      )}
                      {pkg.elevation && (
                        <tr>
                          <th>Elevation:</th>
                          <td>{pkg.elevation}</td>
                        </tr>
                      )}
                      {pkg.accommodation && (
                        <tr>
                          <th>Accommodation:</th>
                          <td>{pkg.accommodation}</td>
                        </tr>
                      )}
                      {pkg.transportation && (
                        <tr>
                          <th>Transportation:</th>
                          <td>{pkg.transportation}</td>
                        </tr>
                      )}
                      {pkg.customFacts?.map((fact, index) => (
                        <tr key={index}>
                          <th>{fact.label}:</th>
                          <td>{fact.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </aside>
        </div>
      </Content>
    </>
  )
}
