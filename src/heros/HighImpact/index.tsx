'use client'

import React from 'react'
import type { Page } from '@/payload-types'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import cssClass from './index.module.css'
import containerStyle from '@/Styles/container.module.css'
import { icons, MapPin, ArrowRight, Play } from 'lucide-react'
import { Button } from '@/components/ui/Button/Button'
import { generatePath } from '@/utilities/generatePath'

export const HighImpactHero: React.FC<Page['hero']> = ({
  backgroundVideo,
  description,
  features,
  links,
  subtitle,
  tagline,
  title,
}) => {
  return (
    <section className={cssClass.heroSection}>
      {/* Background Video */}
      {backgroundVideo && typeof backgroundVideo === 'object' && (
        <Media fill videoClassName={cssClass.heroVideo} priority resource={backgroundVideo} />
      )}
      <div className={cssClass.heroOverlayDark}></div>
      <div className={cssClass.heroOverlayGradient}></div>
      <div className={`${containerStyle.container} ${cssClass.heroContentWrapper}`}>
        <div className={cssClass.heroTextArea}>
          {tagline && (
            <div className={cssClass.heroTagline}>
              <MapPin className={cssClass.iconPin} />
              <span>{tagline}</span>
            </div>
          )}

          {title && (
            <h1 className={cssClass.heroTitle}>
              {title}
              {subtitle && <span className={cssClass.heroTitleGradient}>{subtitle}</span>}
            </h1>
          )}

          {description && (
            <div className={cssClass.heroSubtitle}>
              <RichText data={description} enableGutter={false} className={cssClass.heroDesc} />
            </div>
          )}

          {Array.isArray(links) && links.length > 0 && (
            <div className={cssClass.heroActions}>
              {links.map(({ link }, i) => {
                const appearance = link?.appearance === 'default' ? 'primary' : 'outline'
                const iconProps =
                  link?.appearance === 'default'
                    ? { iconRight: <ArrowRight className={cssClass.iconArrowRight} /> }
                    : { iconLeft: <Play className={cssClass.iconPlay} /> }

                let btnLink: string = ''
                if (link.type === 'reference') {
                  if (
                    typeof link?.reference?.value === 'object' &&
                    'slug' in link?.reference?.value
                  ) {
                    btnLink = generatePath(
                      link.reference.relationTo as string,
                      link.reference.value.slug,
                    )
                  }
                } else if (link.type === 'custom') {
                  btnLink = link?.url ? link.url : '#'
                } else {
                  btnLink = '#'
                }

                return (
                  <Button href={btnLink} appearance={appearance} size="lg" key={i} {...iconProps}>
                    {link?.label}
                  </Button>
                )
              })}
            </div>
          )}

          {Array.isArray(features) && features.length > 0 && (
            <div className={cssClass.heroFeatures}>
              {features.map((feature, i) => {
                const IconComponent =
                  typeof feature?.icon === 'string' ? (icons as any)[feature.icon] : null

                return (
                  <div key={i} className={cssClass.featureCard}>
                    <div className={cssClass.featureIconBg}>
                      {IconComponent ? (
                        <IconComponent className={cssClass.iconFeature} size={24} />
                      ) : (
                        feature?.icon &&
                        typeof feature?.icon === 'object' && (
                          <Media
                            htmlElement="div"
                            resource={feature.icon}
                            className={cssClass.iconFeature}
                          />
                        )
                      )}
                    </div>
                    <h3 className={cssClass.featureTitle}>{feature.title}</h3>
                    <p className={cssClass.featureSubtitle}>{feature.description}</p>
                  </div>
                )
              })}
            </div>
          )}
          <div className={cssClass.scrollIndicator}>
            <div className={cssClass.scrollIndicatorInner}>
              <div className={cssClass.scrollDot}></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
