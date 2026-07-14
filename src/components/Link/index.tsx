import { Button, type ButtonAppearance, type ButtonSize } from '@/components/ui/Button'
import { cn } from '@/utilities/ui'
import Link from 'next/link'
import React from 'react'
import { generatePath } from '@/utilities/generatePath'

import type { Page, Post, Package, Activity, Testimonial, Category } from '@/payload-types'

type CMSLinkType = {
  appearance?: 'inline' | ButtonAppearance | 'default' | null
  children?: React.ReactNode
  className?: string
  label?: string | null
  newTab?: boolean | null
  reference?: {
    relationTo: 'pages' | 'posts' | 'packages' | 'activities' | 'testimonials' | 'categories'
    value: Page | Post | Package | Activity | Testimonial | Category | string | number
  } | null
  size?: ButtonSize | 'clear' | null
  type?: 'custom' | 'reference' | null
  url?: string | null
  onClick?: (e: React.MouseEvent) => void
  ariaCurrent?: React.AriaAttributes['aria-current']
}

const genericLinkLabels = new Set([
  'click here',
  'here',
  'information',
  'learn more',
  'more',
  'read more',
])

const visuallyHiddenStyle: React.CSSProperties = {
  border: 0,
  clip: 'rect(0 0 0 0)',
  height: 1,
  margin: -1,
  overflow: 'hidden',
  padding: 0,
  position: 'absolute',
  whiteSpace: 'nowrap',
  width: 1,
}

const getDestinationSubject = (href: string): string | null => {
  const path = href.split(/[?#]/, 1)[0]
  const segment = path.split('/').filter(Boolean).at(-1)
  if (!segment) return null

  try {
    return decodeURIComponent(segment)
      .replace(/[-_]+/g, ' ')
      .replace(/\b\w/g, (character) => character.toUpperCase())
  } catch {
    return segment.replace(/[-_]+/g, ' ')
  }
}

export const CMSLink: React.FC<CMSLinkType> = (props) => {
  const {
    type,
    appearance = 'inline',
    children,
    className,
    label,
    newTab,
    reference,
    size: sizeFromProps,
    url,
    onClick,
    ariaCurrent,
  } = props

  let href = url
  if (type === 'reference' && reference?.value) {
    if (typeof reference.value === 'object' && 'slug' in reference.value) {
      href = generatePath(reference.relationTo as string, reference.value.slug)
    } else if (typeof reference.value === 'string' || typeof reference.value === 'number') {
      href = generatePath(reference.relationTo as string, String(reference.value))
    }
  }

  if (!href && label) {
    href = `/${label.toLowerCase().replace(/\s+/g, '-')}`
  }

  if (!href) {
    console.warn('CMSLink: No href resolved', props)
    return null
  }

  const size = appearance === 'inline' ? 'md' : sizeFromProps === 'clear' ? 'md' : sizeFromProps
  const newTabProps = newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}
  // Do not synthesize an event handler for ordinary links. CMSLink can render on the server,
  // and functions cannot cross the Server Component -> next/link client boundary. Explicit
  // handlers still work when CMSLink is consumed from an existing Client Component tree.
  const clickProps = onClick ? { onClick } : {}
  const destinationSubject = getDestinationSubject(href)
  const descriptiveSuffix =
    label && genericLinkLabels.has(label.trim().toLowerCase()) && destinationSubject
      ? ` about ${destinationSubject}`
      : null
  const descriptiveLabel = label && descriptiveSuffix ? `${label}${descriptiveSuffix}` : undefined
  const content = (
    <>
      {label && label}
      {descriptiveSuffix && <span style={visuallyHiddenStyle}>{descriptiveSuffix}</span>}
      {children && children}
    </>
  )

  /* Ensure we don't break any styles set by richText */
  if (appearance === 'inline') {
    return (
      <Link
        aria-current={ariaCurrent}
        aria-label={descriptiveLabel}
        className={cn(className)}
        href={href || url || ''}
        {...newTabProps}
        {...clickProps}
      >
        {content}
      </Link>
    )
  }

  return (
    <Button
      className={className}
      size={size as ButtonSize}
      appearance={(appearance === 'default' ? 'primary' : appearance) as ButtonAppearance}
      href={href || url || ''}
      aria-current={ariaCurrent}
      aria-label={descriptiveLabel}
      {...newTabProps}
      {...clickProps}
    >
      {content}
    </Button>
  )
}
