'use client'

import { useLayoutEffect } from 'react'

import styles from './MotionController.module.css'

type MotionKind = 'action' | 'card' | 'copy' | 'media' | 'text'
type RevealMode = 'animate' | 'catchUp' | 'instant'

type CardRow = {
  count: number
  top: number
}

const targetSelector = [
  '[data-motion-card]',
  '[data-motion-media]',
  '[data-motion-action]',
  // 'h1',
  // 'h2',
  // 'h3',
  // 'p',
  // '.payload-richtext',
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

    const reveal = (element: HTMLElement, mode: RevealMode = 'animate') => {
      if (mode === 'catchUp') element.classList.add(styles.catchUp)
      if (mode === 'instant') element.classList.add(styles.instant)
      element.classList.add(styles.visible)
      observer?.unobserve(element)
    }

    const observer =
      'IntersectionObserver' in window
        ? new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                const revealBoundary = entry.rootBounds?.bottom ?? window.innerHeight

                // A fast scroll can move an element beyond the observer's active area
                // before its callback runs. Content that reached or passed the reveal
                // boundary must never remain invisible.
                if (entry.isIntersecting || entry.boundingClientRect.top <= revealBoundary) {
                  const mode: RevealMode =
                    entry.boundingClientRect.bottom <= 0
                      ? 'instant'
                      : entry.boundingClientRect.top <= window.innerHeight
                        ? 'catchUp'
                        : 'animate'

                  reveal(entry.target as HTMLElement, mode)
                }
              })
            },
            {
              // Begin the reveal just before content enters the viewport so a section
              // is already readable when the user reaches it.
              rootMargin: '0px 0px 10% 0px',
              threshold: 0.01,
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
      const usesFastMotion = Boolean(element.closest('[data-motion-speed="fast"]'))
      const itemOrder = hasExplicitOrder
        ? explicitOrder
        : kind === 'card'
          ? getCardRowOrder(element)
          : groupCount
      const delayStep = usesFastMotion ? (kind === 'card' ? 50 : 35) : kind === 'card' ? 90 : 65
      const maximumOrder = 2
      const delay = Math.min(itemOrder, maximumOrder) * delayStep

      groupCounts.set(group, Math.max(groupCount + 1, itemOrder + 1))

      element.dataset.motionRegistered = 'true'
      element.style.setProperty('--motion-delay', `${delay}ms`)
      if (kind === 'card') {
        element.classList.add(styles.card)
      } else {
        element.classList.add(styles.reveal, kindClass[kind])
      }
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
          styles.catchUp,
          styles.copy,
          styles.instant,
          styles.media,
          styles.text,
        )
      })
    }
  }, [])

  return null
}
