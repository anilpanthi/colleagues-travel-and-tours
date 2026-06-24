'use client'
import React, { useEffect, useState } from 'react'
import { RenderHero } from '@/heros/RenderHero'
import RichText from '@/components/RichText'
import Content from '@/components/ui/Content/Index'
import { Accordion, AccordionItem } from '@/components/Accordion/Index'
import type { Package, SiteSetting } from '@/payload-types'
import Gallery from '@/components/Gallery'
import { Breadcrumbs } from '@/components/Breadcrumbs/Index'
import { ReadMore } from '@/components/ui/ReadMore'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import { Media } from '@/components/Media'
import Modal from '@/components/ui/Modal/Modal'
import { FormBlock } from '@/blocks/Form/Component'
import type { Form as FormType } from '@payloadcms/plugin-form-builder/types'

import style from './index.module.scss'
import { Button } from '../ui/Button'

interface PackageDetailsProps {
  pkg: Package
  bookingForm: SiteSetting['bookingForm']
  enquiryForm: SiteSetting['enquiryForm']
  children?: React.ReactNode
}

export const PackageDetails: React.FC<PackageDetailsProps> = ({
  pkg,
  bookingForm,
  enquiryForm,
  children,
}) => {
  const { setHeaderTheme, setHasHeroImage } = useHeaderTheme()
  const [showModal, setShowModal] = useState(false)
  const [activeFormType, setActiveFormType] = useState<'book' | 'enquiry' | null>(null)

  const packageHasHeroImage = Boolean(
    pkg?.hero?.type && pkg?.hero?.type !== 'none' && pkg?.hero?.type !== 'lowImpact',
  )

  useEffect(() => {
    if (!packageHasHeroImage) {
      setHeaderTheme('light')
      setHasHeroImage(false)
    } else {
      setHasHeroImage(true)
    }
  }, [setHeaderTheme, setHasHeroImage, packageHasHeroImage])

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

  const handleCloseModal = () => {
    setShowModal(false)
    setActiveFormType(null)
  }

  const openPopUp = (type: 'book' | 'enquiry') => {
    setActiveFormType(type)
    setShowModal(true)
  }

  const activeForm =
    activeFormType === 'book' ? bookingForm : activeFormType === 'enquiry' ? enquiryForm : null
  const formToDisplay =
    activeForm && typeof activeForm === 'object' ? (activeForm as unknown as FormType) : null

  const renderContactButtons = () => (
    <React.Fragment>
      <Button appearance="primary" size="lg" onClick={() => openPopUp('book')}>
        Book this package
      </Button>
      <Button appearance="outlineBlack" size="lg" onClick={() => openPopUp('enquiry')}>
        Make an Enquiry
      </Button>
    </React.Fragment>
  )

  const tripFactsContent = (pkg.tripDuration ||
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
                <td>{pkg.tripDuration} Days</td>
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
                <td>
                  {Array.isArray(pkg.bestSeason)
                    ? pkg.bestSeason.map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(', ')
                    : pkg.bestSeason}
                </td>
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
                <td>{pkg.elevation} Meters</td>
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
  )

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

            <div className={style.tripFactsMobile}>{tripFactsContent}</div>

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

            {(pkg.mapType === 'embedMap' ? pkg.mapIframe : pkg.mapImage) && (
              <div className={style.mapSection}>
                <h2 className={style.title}>Map</h2>
                {pkg.mapType === 'embedMap' && pkg.mapIframe && (
                  <div className={style.mapIframeRichText}>
                    {typeof pkg.mapIframe === 'string' ? (
                      <div dangerouslySetInnerHTML={{ __html: pkg.mapIframe }} />
                    ) : (
                      <RichText data={pkg.mapIframe} enableGutter={false} />
                    )}
                  </div>
                )}
                {pkg.mapType === 'imageUpload' &&
                  pkg.mapImage &&
                  typeof pkg.mapImage === 'object' && (
                    <div className={style.mapImageWrapper}>
                      <Media resource={pkg.mapImage} />
                    </div>
                  )}
              </div>
            )}

            {/* Faqs */}
            {pkg?.faqs && pkg.faqs.length > 0 && (
              <div className={style.detailedItinerary}>
                <Accordion
                  title="Faqs"
                  variant="ghost"
                  allowMultiple={false}
                  defaultOpenIds={(pkg?.faqs?.[0]?.id ? [pkg.faqs[0].id] : []) as string[]}
                >
                  {pkg?.faqs?.map((item) => {
                    if (!item?.id) return null
                    return (
                      <AccordionItem key={item.id} value={item.id} heading={item.question ?? ''}>
                        {item.answer && <RichText data={item.answer} enableGutter={false} />}
                      </AccordionItem>
                    )
                  })}
                </Accordion>
              </div>
            )}

            {pkg?.miscellaneous && (
              <div className="msc">
                <RichText data={pkg.miscellaneous} enableGutter={false} />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className={style.singlePackage__right}>
            <div className={style.tripFactsDesktop}>{tripFactsContent}</div>
            <div className={`${style.contactGroup} ${style.contactGroupDesktop}`}>
              {renderContactButtons()}
            </div>
          </aside>
        </div>
        {children}
      </Content>

      <div className={`${style.contactGroup} ${style.contactGroupMobile}`}>
        {renderContactButtons()}
      </div>

      {showModal && (
        <Modal
          isOpen={showModal}
          onClose={handleCloseModal}
          title={activeFormType === 'book' ? `Book ${pkg.title}` : `Enquire about ${pkg.title}`}
          size={activeFormType === 'enquiry' ? 'md' : 'lg'}
        >
          {formToDisplay ? (
            <FormBlock
              form={formToDisplay}
              enableIntro={false}
              className={activeFormType === 'book' ? style.bookingForm : style.enquiryForm}
            />
          ) : (
            <p>Form is not available at the moment.</p>
          )}
        </Modal>
      )}
    </>
  )
}
