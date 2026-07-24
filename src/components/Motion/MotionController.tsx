'use client'

import { useLayoutEffect } from 'react'

import styles from './MotionController.module.css'

type MotionKind = 'action' | 'card' | 'copy' | 'hero' | 'media' | 'text'

const targetSelector = [
  '[data-motion-card]',
  '[data-motion-media]',
  '[data-motion-action]',
  '[data-motion-hero-item]',
  'h1',
  'h2',
  'h3',
  'p',
  '.payload-richtext',
].join(',')

const kindClass: Record<MotionKind, string> = {
  action: styles.action,
  card: styles.card,
  copy: styles.copy,
  hero: styles.hero,
  media: styles.media,
  text: styles.text,
}

const getMotionKind = (element: HTMLElement): MotionKind => {
  if (element.matches('[data-motion-hero-item]')) return 'hero'
  if (element.matches('[data-motion-card]')) return 'card'
  if (element.matches('[data-motion-media]')) return 'media'
  if (element.matches('[data-motion-action]')) return 'action'
  if (element.matches('.payload-richtext')) return 'copy'
  return 'text'
}

const hasNativeAnimation = (element: HTMLElement, root: HTMLElement): boolean => {
  let current: HTMLElement | null = element

  while (current && current !== root) {
    if (window.getComputedStyle(current).animationName !== 'none') return true
    current = current.parentElement
  }

  return false
}

const shouldSkip = (element: HTMLElement, root: HTMLElement, kind: MotionKind): boolean => {
  if (element.dataset.motionRegistered === 'true') return true
  if (element.closest('[data-motion-skip], [data-mobile-booking-bar], dialog, [role="dialog"]')) {
    return true
  }

  const card = element.closest<HTMLElement>('[data-motion-card]')
  if (card && card !== element) return true

  const heroItem = element.closest<HTMLElement>('[data-motion-hero-item]')
  if (heroItem && heroItem !== element) return true

  const richText = element.closest<HTMLElement>('.payload-richtext')
  if (kind === 'text' && richText && richText !== element) return true

  return hasNativeAnimation(element, root)
}

export function MotionController() {
  useLayoutEffect(() => {
    const root = document.querySelector<HTMLElement>('.main-content')
    if (!root) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) return

    const registered = new Set<HTMLElement>()
    const groupCounts = new Map<HTMLElement, number>()

    const reveal = (element: HTMLElement) => {
      element.classList.add(styles.visible)
      observer?.unobserve(element)
    }

    const observer =
      'IntersectionObserver' in window
        ? new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting) reveal(entry.target as HTMLElement)
              })
            },
            {
              rootMargin: '0px 0px -14% 0px',
              threshold: 0.08,
            },
          )
        : null

    const register = (element: HTMLElement) => {
      const kind = getMotionKind(element)
      if (shouldSkip(element, root, kind)) return

      const group = element.closest<HTMLElement>('section, article, [data-motion-section]') ?? root
      const groupCount = groupCounts.get(group) ?? 0
      const explicitOrder = Number.parseInt(element.dataset.motionOrder ?? '', 10)
      const hasExplicitOrder = Number.isFinite(explicitOrder)
      const itemOrder = hasExplicitOrder ? explicitOrder : groupCount
      const delayStep = kind === 'hero' ? 180 : kind === 'card' ? 120 : 160
      const baseDelay = kind === 'hero' ? 120 : 0
      const delay = baseDelay + Math.min(itemOrder, 5) * delayStep

      groupCounts.set(group, Math.max(groupCount + 1, itemOrder + 1))

      element.dataset.motionRegistered = 'true'
      element.style.setProperty('--motion-delay', `${delay}ms`)
      element.classList.add(styles.reveal, kindClass[kind])
      registered.add(element)

      if (observer) {
        observer.observe(element)
      } else {
        reveal(element)
      }
    }

    const registerTree = (node: ParentNode) => {
      if (node instanceof HTMLElement && node.matches(targetSelector)) register(node)
      node.querySelectorAll<HTMLElement>(targetSelector).forEach(register)
    }

    registerTree(root)

    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) registerTree(node)
        })
      })
    })

    mutationObserver.observe(root, {
      childList: true,
      subtree: true,
    })

    return () => {
      mutationObserver.disconnect()
      observer?.disconnect()

      registered.forEach((element) => {
        delete element.dataset.motionRegistered
        element.style.removeProperty('--motion-delay')
        element.classList.remove(
          styles.reveal,
          styles.visible,
          styles.action,
          styles.card,
          styles.copy,
          styles.hero,
          styles.media,
          styles.text,
        )
      })
    }
  }, [])

  return null
}
