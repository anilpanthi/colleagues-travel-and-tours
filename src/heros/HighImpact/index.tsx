'use client'

import React, { useState } from 'react'
import type { Page } from '@/payload-types'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import cssClass from './index.module.css'
import containerStyle from '@/Styles/container.module.css'
import { icons, MapPin, ArrowRight, Play } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/Button/Button'
import { generatePath } from '@/utilities/generatePath'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import Modal from '@/components/ui/Modal/Modal'

type ActiveVideo = {
  embedUrl: string | null
  title: string
}

const getYouTubeEmbedUrl = (url: string): string | null => {
  try {
    const urlWithProtocol = /^https?:\/\//i.test(url) ? url : `https://${url}`
    const parsedUrl = new URL(urlWithProtocol)
    const hostname = parsedUrl.hostname.replace(/^www\./, '')
    let videoId = ''

    if (hostname === 'youtu.be') {
      videoId = parsedUrl.pathname.split('/').filter(Boolean)[0] ?? ''
    } else if (hostname === 'youtube.com' || hostname === 'm.youtube.com') {
      if (parsedUrl.pathname === '/watch') {
        videoId = parsedUrl.searchParams.get('v') ?? ''
      } else if (parsedUrl.pathname.startsWith('/embed/')) {
        videoId = parsedUrl.pathname.split('/').filter(Boolean)[1] ?? ''
      } else if (parsedUrl.pathname.startsWith('/shorts/')) {
        videoId = parsedUrl.pathname.split('/').filter(Boolean)[1] ?? ''
      }
    }

    if (!/^[A-Za-z0-9_-]{11}$/.test(videoId)) return null

    return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`
  } catch {
    return null
  }
}

export const HighImpactHero: React.FC<Page['hero']> = ({
  backgroundVideo,
  backgroundVideoPoster,
  description,
  features,
  links,
  subtitle,
  tagline,
  title,
}) => {
  const [activeVideo, setActiveVideo] = useState<ActiveVideo | null>(null)
  const mobilePosterUrl =
    backgroundVideoPoster && typeof backgroundVideoPoster === 'object'
      ? getMediaUrl(
          backgroundVideoPoster.sizes?.xlarge?.url ||
            backgroundVideoPoster.sizes?.large?.url ||
            backgroundVideoPoster.url ||
            (backgroundVideoPoster.filename ? `/media/${backgroundVideoPoster.filename}` : null),
          backgroundVideoPoster.updatedAt,
        )
      : null

  return (
    <section className={cssClass.heroSection}>
      {/* Background Video */}
      {backgroundVideo && typeof backgroundVideo === 'object' && (
        <Media
          fill
          playAfterPageLoad
          poster={mobilePosterUrl || undefined}
          posterOnlyOnMobile={Boolean(mobilePosterUrl)}
          videoClassName={cssClass.heroVideo}
          priority
          resource={backgroundVideo}
        />
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
                const isPrimary = link?.appearance === 'default'
                const appearance = isPrimary ? 'primary' : 'outline'
                const iconProps = isPrimary
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

                if (!isPrimary) {
                  const embedUrl = getYouTubeEmbedUrl(btnLink)

                  return (
                    <Button
                      appearance={appearance}
                      size="lg"
                      key={i}
                      type="button"
                      onClick={() =>
                        setActiveVideo({
                          embedUrl,
                          title: link?.label ?? 'Video',
                        })
                      }
                      {...iconProps}
                    >
                      {link?.label}
                    </Button>
                  )
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
                  typeof feature?.icon === 'string'
                    ? (icons as Record<string, LucideIcon>)[feature.icon]
                    : null

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
      <Modal
        isOpen={Boolean(activeVideo)}
        onClose={() => setActiveVideo(null)}
        size="xl"
        ariaLabel={activeVideo?.title ?? 'Video modal'}
        className={cssClass.videoModal}
        closeButtonClassName={cssClass.videoModalCloseButton}
      >
        {activeVideo && (
          <div className={cssClass.videoFrame}>
            {activeVideo.embedUrl ? (
              <iframe
                src={activeVideo.embedUrl}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <div className={cssClass.videoFallback}>
                Add a YouTube URL to this outline button in the hero links.
              </div>
            )}
          </div>
        )}
      </Modal>
    </section>
  )
}
