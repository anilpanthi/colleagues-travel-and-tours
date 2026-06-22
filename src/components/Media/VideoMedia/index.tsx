'use client'

import { cn } from '@/utilities/ui'
import React, { useEffect, useRef } from 'react'

import type { Props as MediaProps } from '../types'

import { getMediaUrl } from '@/utilities/getMediaUrl'

export const VideoMedia: React.FC<MediaProps> = ({ onClick, resource, videoClassName }) => {
  const videoRef = useRef<HTMLVideoElement>(null)

  const videoUrl =
    resource && typeof resource === 'object'
      ? getMediaUrl(
          resource.url || (resource.filename ? `/media/${resource.filename}` : null),
          resource.updatedAt,
        )
      : null

  useEffect(() => {
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
  }, [videoUrl])

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
      preload="auto"
      ref={videoRef}
      src={videoUrl}
    />
  )
}
