'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

interface BrandImageProps {
  alt?: string
  alternateSrc?: string | null
  className?: string
  fallbackSrc: string
  height?: number
  src: string | null
  width?: number
}

export function BrandImage({
  alt = 'Colleagues Travel and Tours',
  alternateSrc,
  className,
  fallbackSrc,
  height = 57,
  src,
  width = 100,
}: BrandImageProps) {
  const preferredSrc = src || fallbackSrc
  const [imageSrc, setImageSrc] = useState(preferredSrc)

  useEffect(() => {
    setImageSrc(preferredSrc)
  }, [preferredSrc])

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return

    const urls = Array.from(
      new Set([src, alternateSrc].filter((url): url is string => Boolean(url))),
    )
    if (urls.length === 0) return

    void navigator.serviceWorker.ready.then((registration) => {
      const worker = navigator.serviceWorker.controller || registration.active
      worker?.postMessage({ type: 'CACHE_PUBLIC_MEDIA', urls })
    })
  }, [alternateSrc, src])

  return (
    <Image
      alt={alt}
      className={className}
      height={height}
      loading="eager"
      onError={() => setImageSrc(fallbackSrc)}
      src={imageSrc}
      unoptimized
      width={width}
    />
  )
}
