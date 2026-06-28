'use client'

import { Play } from 'lucide-react'
import React, { useState } from 'react'

import styles from './index.module.css'

type LazyEmbedProps = {
  allow?: string
  className?: string
  referrerPolicy?: React.IframeHTMLAttributes<HTMLIFrameElement>['referrerPolicy']
  src: string
  title: string
}

const getEmbedSrc = (value: string): string | null => {
  const iframeSrcMatch = value.match(/<iframe[^>]+src=["']([^"']+)["']/i)
  const rawSrc = iframeSrcMatch?.[1] || value

  try {
    return new URL(rawSrc.replaceAll('&amp;', '&')).toString()
  } catch {
    return null
  }
}

export const LazyEmbed: React.FC<LazyEmbedProps> = ({
  allow,
  className,
  referrerPolicy,
  src,
  title,
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const embedSrc = getEmbedSrc(src)

  if (!embedSrc) {
    return null
  }

  return (
    <div className={[styles.embed, className].filter(Boolean).join(' ')}>
      {isLoaded ? (
        <iframe
          allow={allow}
          allowFullScreen
          className={styles.iframe}
          loading="lazy"
          referrerPolicy={referrerPolicy}
          src={embedSrc}
          title={title}
        />
      ) : (
        <button
          aria-label={`Load ${title}`}
          className={styles.placeholder}
          onClick={() => setIsLoaded(true)}
          type="button"
        >
          <span className={styles.playIcon} aria-hidden="true">
            <Play size={26} fill="currentColor" />
          </span>
          <span className={styles.title}>{title}</span>
          <span className={styles.hint}>Tap to load interactive content</span>
        </button>
      )}
    </div>
  )
}
