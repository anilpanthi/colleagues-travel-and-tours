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
  } = props

  let href = url
  if (type === 'reference' && reference?.value) {
    if (typeof reference.value === 'object' && 'slug' in reference.value) {
      href = generatePath(reference.relationTo as string, reference.value.slug)
    } else if (typeof reference.value === 'string' || typeof reference.value === 'number') {
      href = generatePath(reference.relationTo as string, String(reference.value))
    }
  }

  if (!href) return null

  const size = appearance === 'inline' ? 'md' : (sizeFromProps === 'clear' ? 'md' : sizeFromProps)
  const newTabProps = newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}

  /* Ensure we don't break any styles set by richText */
  if (appearance === 'inline') {
    return (
      <Link className={cn(className)} href={href || url || ''} {...newTabProps} onClick={onClick}>
        {label && label}
        {children && children}
      </Link>
    )
  }

  return (
    <Button 
        className={className} 
        size={size as ButtonSize} 
        appearance={(appearance === 'default' ? 'primary' : appearance) as ButtonAppearance}
        href={href || url || ''}
        onClick={onClick}
        {...(newTabProps)}
    >
        {label && label}
        {children && children}
    </Button>
  )
}
