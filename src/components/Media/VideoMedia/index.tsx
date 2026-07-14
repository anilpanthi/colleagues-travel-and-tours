'use client'

import { cn } from '@/utilities/ui'
import NextImage from 'next/image'
import React, { useEffect, useRef, useState } from 'react'

import type { Props as MediaProps } from '../types'

import { getMediaUrl } from '@/utilities/getMediaUrl'

export const VideoMedia: React.FC<MediaProps> = ({
  fetchPriority,
  fill,
  onClick,
  playAfterPageLoad,
  poster,
  posterOnlyOnMobile,
  priority,
  resource,
  size,
  videoClassName,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isMobile, setIsMobile] = useState<boolean | null>(posterOnlyOnMobile ? null : false)
  const [shouldLoadVideo, setShouldLoadVideo] = useState(!playAfterPageLoad && !posterOnlyOnMobile)
  const [isVideoReady, setIsVideoReady] = useState(false)

  const videoUrl =
    resource && typeof resource === 'object'
      ? getMediaUrl(
          resource.url || (resource.filename ? `/media/${resource.filename}` : null),
          resource.updatedAt,
        )
      : null
  const posterUrl = (() => {
    if (poster) return poster
    if (!resource || typeof resource !== 'object') return undefined

    const posterPath =
      resource.thumbnailURL ||
      resource.sizes?.xlarge?.url ||
      resource.sizes?.large?.url ||
      resource.sizes?.thumbnail?.url ||
      null

    return getMediaUrl(posterPath, resource.updatedAt)
  })()

  useEffect(() => {
    if (!posterOnlyOnMobile) return

    const mediaQuery = window.matchMedia('(max-width: 640px)')
    const handleChange = () => {
      setIsMobile(mediaQuery.matches)
      if (mediaQuery.matches) setIsVideoReady(false)
    }

    handleChange()
    mediaQuery.addEventListener('change', handleChange)

    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [posterOnlyOnMobile])

  useEffect(() => {
    if (isMobile === null || isMobile) return

    if (!playAfterPageLoad) {
      const animationFrame = window.requestAnimationFrame(() => setShouldLoadVideo(true))
      return () => window.cancelAnimationFrame(animationFrame)
    }

    if (document.readyState === 'complete') {
      const animationFrame = window.requestAnimationFrame(() => setShouldLoadVideo(true))
      return () => window.cancelAnimationFrame(animationFrame)
    }

    const handlePageLoad = () => setShouldLoadVideo(true)

    window.addEventListener('load', handlePageLoad, { once: true })

    return () => {
      window.removeEventListener('load', handlePageLoad)
    }
  }, [isMobile, playAfterPageLoad])

  useEffect(() => {
    if (!shouldLoadVideo) return

    const video = videoRef.current
    if (!video || !videoUrl) return

    const playVideo = () => {
      void video.play().catch(() => {
        // Browsers may still block autoplay in data-saver or low-power modes.
      })
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') playVideo()
    }

    video.load()
    playVideo()
    window.addEventListener('pageshow', playVideo)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('pageshow', playVideo)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [shouldLoadVideo, videoUrl])

  if (!videoUrl || !resource || typeof resource !== 'object') return null

  return (
    <>
      {posterUrl &&
        (fill ? (
          <NextImage
            alt=""
            aria-hidden="true"
            className={cn(videoClassName)}
            decoding="async"
            fetchPriority={fetchPriority ?? (priority ? 'high' : undefined)}
            fill
            priority={priority}
            quality={75}
            sizes={size || '100vw'}
            src={posterUrl}
            style={{
              opacity: isVideoReady ? 0 : 1,
              pointerEvents: 'none',
              transition: 'opacity 300ms ease',
            }}
          />
        ) : (
          // A raw image is retained for non-fill callers because a standalone poster URL has no
          // reliable intrinsic dimensions. The full-viewport hero uses the optimized path above.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            alt=""
            aria-hidden="true"
            className={cn(videoClassName)}
            decoding="async"
            fetchPriority={fetchPriority ?? (priority ? 'high' : undefined)}
            src={posterUrl}
            style={{
              opacity: isVideoReady ? 0 : 1,
              pointerEvents: 'none',
              transition: 'opacity 300ms ease',
            }}
          />
        ))}
      {isMobile !== true && (
        <video
          autoPlay
          className={cn(videoClassName)}
          controls={false}
          key={videoUrl}
          loop
          muted
          onCanPlay={(event) => {
            setIsVideoReady(true)
            void event.currentTarget.play().catch(() => {
              // Autoplay can be denied by user-agent preferences.
            })
          }}
          onClick={onClick}
          playsInline
          preload={playAfterPageLoad ? 'none' : 'metadata'}
          ref={videoRef}
          src={shouldLoadVideo && isMobile === false ? videoUrl : undefined}
          style={{
            opacity: posterUrl && !isVideoReady ? 0 : 1,
            transition: 'opacity 300ms ease',
          }}
        />
      )}
    </>
  )
}
