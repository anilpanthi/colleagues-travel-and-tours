'use client'

import { useLayoutEffect } from 'react'

import styles from './MotionController.module.css'

type MotionKind = 'action' | 'card' | 'copy' | 'media' | 'text'

type CardRow = {
  count: number
  top: number
}

const targetSelector = [
  '[data-motion-card]',
  '[data-motion-media]',
  '[data-motion-action]',
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
  media: styles.media,
  text: styles.text,
}

const getMotionKind = (element: HTMLElement): MotionKind => {
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
    const groupCounts = new WeakMap<HTMLElement, number>()
    const cardRows = new WeakMap<HTMLElement, CardRow[]>()

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

    const getCardRowOrder = (element: HTMLElement): number => {
      const container = element.parentElement ?? root
      const rows = cardRows.get(container) ?? []
      const top = element.offsetTop
      const currentRow = rows.find((row) => Math.abs(row.top - top) <= 4)

      if (currentRow) {
        const order = currentRow.count
        currentRow.count += 1
        return order
      }

      rows.push({ count: 1, top })
      cardRows.set(container, rows)
      return 0
    }

    const register = (element: HTMLElement) => {
      const kind = getMotionKind(element)
      if (shouldSkip(element, root, kind)) return

      const group = element.closest<HTMLElement>('section, article, [data-motion-section]') ?? root
      const groupCount = groupCounts.get(group) ?? 0
      const explicitOrder = Number.parseInt(element.dataset.motionOrder ?? '', 10)
      const hasExplicitOrder = Number.isFinite(explicitOrder)
      const itemOrder = hasExplicitOrder
        ? explicitOrder
        : kind === 'card'
          ? getCardRowOrder(element)
          : groupCount
      const delayStep = kind === 'card' ? 180 : 160
      const maximumOrder = kind === 'card' ? 3 : 5
      const delay = Math.min(itemOrder, maximumOrder) * delayStep

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
          styles.media,
          styles.text,
        )
      })
    }
  }, [])

  return null
}
