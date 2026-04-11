'use client'

import React, { useState, useRef, useEffect, useLayoutEffect } from 'react'

interface Props {
  children: React.ReactNode
  className?: string
  lines?: number
}

export const ReadMore: React.FC<Props> = ({ children, className, lines = 10 }) => {
  const clampedHeight = `${lines * 3.2}rem` // 3.2rem is the standard line-height for textDesc

  const [isExpanded, setIsExpanded] = useState(false)
  const [isOverflowing, setIsOverflowing] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  // Use ResizeObserver for overflow detection (Async callback avoids cascading render lint)
  useEffect(() => {
    const el = contentRef.current
    if (!el) return

    const observer = new ResizeObserver(() => {
      setIsOverflowing(el.scrollHeight > el.clientHeight)
    })

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Direct DOM manipulation for height (Avoids React state cascading render lint)
  useLayoutEffect(() => {
    const el = contentRef.current
    if (el) {
      el.style.maxHeight = isExpanded ? `${el.scrollHeight}px` : clampedHeight
    }
  }, [isExpanded, clampedHeight])

  return (
    <div className={`read-more-wrapper ${className || ''}`} style={{ position: 'relative' }}>
      <div
        ref={contentRef}
        style={{
          overflow: 'hidden',
          maxHeight: clampedHeight, // Initial state
          transition: 'max-height 0.4s ease-in-out',
        }}
      >
        {children}
      </div>

      {isOverflowing && !isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          style={{
            // position: 'absolute',
            // bottom: '0',
            // right: '0',
            // padding: '0 0 0 0rem',
            color: 'var(--color-primary)',
            fontWeight: 600,
            background: 'linear-gradient(to right, transparent, white 30%)',
            border: 'none',
            cursor: 'pointer',
            textDecoration: 'underline',
            fontSize: '1.6rem',
            lineHeight: '3.2rem', // Match text line-height
          }}
        >
          Read More &raquo;
        </button>
      )}

      {isExpanded && (
        <button
          onClick={() => setIsExpanded(false)}
          style={{
            display: 'inline-block',
            marginTop: '1rem',
            color: 'var(--color-primary)',
            fontWeight: 600,
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            textDecoration: 'underline',
            fontSize: '1.6rem',
          }}
        >
          Read Less &laquo;
        </button>
      )}
    </div>
  )
}
