'use client'

import { cn } from '@/utilities/ui'
import React, { useEffect, useRef, useState } from 'react'

import type { Props as MediaProps } from '../types'

import { getMediaUrl } from '@/utilities/getMediaUrl'

export const VideoMedia: React.FC<MediaProps> = ({
  onClick,
  playAfterPageLoad,
  poster,
  resource,
  videoClassName,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [shouldLoadVideo, setShouldLoadVideo] = useState(!playAfterPageLoad)

  const videoUrl =
    resource && typeof resource === 'object'
      ? getMediaUrl(
          resource.url || (resource.filename ? `/media/${resource.filename}` : null),
          resource.updatedAt,
        )
      : null
  const posterUrl =
    poster ||
    (resource && typeof resource === 'object'
      ? getMediaUrl(resource.thumbnailURL || null, resource.updatedAt)
      : undefined)

  useEffect(() => {
    if (!playAfterPageLoad) return

    if (document.readyState === 'complete') {
      setShouldLoadVideo(true)
      return
    }

    const handlePageLoad = () => setShouldLoadVideo(true)

    window.addEventListener('load', handlePageLoad, { once: true })

    return () => {
      window.removeEventListener('load', handlePageLoad)
    }
  }, [playAfterPageLoad])

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
    <video
      autoPlay
      className={cn(videoClassName)}
      controls={false}
      key={videoUrl}
      loop
      muted
      onCanPlay={(event) => {
        void event.currentTarget.play().catch(() => {
          // Autoplay can be denied by user-agent preferences.
        })
      }}
      onClick={onClick}
      playsInline
      poster={posterUrl || undefined}
      preload={playAfterPageLoad ? 'none' : 'metadata'}
      ref={videoRef}
      src={shouldLoadVideo ? videoUrl : undefined}
    />
  )
}
