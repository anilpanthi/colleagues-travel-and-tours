'use client'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import { usePathname } from 'next/navigation'
import type { SiteSetting } from '@/payload-types'
import { cn } from '@/utilities/ui'
import cssClass from './Header.module.scss'
import Container from '@/components/ui/Container'
import { BrandClient } from '../Brand/Brand.client'
import { Menu, X } from 'lucide-react'
import Navigation from '@/components/Navigation/Navigation'
import Cta from '../Cta/Cta'

interface HeaderClientProps {
  mainNavigation: SiteSetting['mainNavigation']
  logos: SiteSetting['logos']
  flightBookingForm: SiteSetting['flightBookingForm']
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ mainNavigation, logos, flightBookingForm }) => {
  const [theme, setTheme] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const { headerTheme, setHeaderTheme, hasHeroImage, setHasHeroImage } = useHeaderTheme()
  const pathname = usePathname()

  const [isScrolled, setIsScrolled] = useState<boolean>(false)
  const [isPastHero, setIsPastHero] = useState<boolean>(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false)
  const mobileMenuToggleRef = useRef<HTMLButtonElement>(null)

  const [isFront, setIsFront] = useState<boolean>(true)



  useEffect(() => {
    setIsMounted(true)
  }, [])

  useLayoutEffect(() => {
    setHeaderTheme(null)
    setHasHeroImage(true)
    setIsMobileMenuOpen(false)

    setIsFront(pathname === '/')
  }, [pathname, setHeaderTheme, setHasHeroImage])

  useEffect(() => {
    let scrollFrame: number | null = null

    const updateScrollState = () => {
      scrollFrame = null
      const nextIsScrolled = window.scrollY > 20
      const heroHeight = isFront ? window.innerHeight * 0.8 : window.innerHeight * 0.4
      const nextIsPastHero = window.scrollY > heroHeight

      setIsScrolled((current) => (current === nextIsScrolled ? current : nextIsScrolled))
      setIsPastHero((current) => (current === nextIsPastHero ? current : nextIsPastHero))
    }

    const handleScroll = () => {
      if (scrollFrame !== null) return
      scrollFrame = window.requestAnimationFrame(updateScrollState)
    }

    const handleResize = () => {
      if (window.innerWidth >= 1100) {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize)

    // Initialize state on mount
    updateScrollState()
    handleResize()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
      if (scrollFrame !== null) window.cancelAnimationFrame(scrollFrame)
    }
  }, [isFront])

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add('no-scroll')
    } else {
      document.body.classList.remove('no-scroll')
    }

    return () => {
      document.body.classList.remove('no-scroll')
    }
  }, [isMobileMenuOpen])

  useEffect(() => {
    if (!isMobileMenuOpen) return

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return

      setIsMobileMenuOpen(false)
      window.requestAnimationFrame(() => mobileMenuToggleRef.current?.focus())
    }

    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [isMobileMenuOpen])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  const toggleMobileMenu = () => setIsMobileMenuOpen((isOpen) => !isOpen)
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
    window.requestAnimationFrame(() => mobileMenuToggleRef.current?.focus())
  }

  const menuItems =
    mainNavigation && typeof mainNavigation === 'object' ? mainNavigation.items : null

  return (
    <header
      className={cn(
        cssClass.header,
        isMounted && isScrolled && 'scrolled',
        isMounted && (isFront ? cssClass.primary : cssClass.secondary),
        isMounted && (isPastHero || !hasHeroImage) && 'past-hero',
        isMobileMenuOpen && cssClass.mobileMenuOpen,
        isMounted && !hasHeroImage && 'noHero',
      )}
      {...(isMounted && theme ? { 'data-theme': theme } : {})}
    >
      <Container>
        <div className={cssClass.header__content}>
          <BrandClient logos={logos} theme={theme} isScrolled={isPastHero || !hasHeroImage} />

          <div className={cssClass.desktopOnly}>
            <Navigation menuItems={menuItems} />
          </div>

          <div className={cssClass.header__right}>
            <div className={cssClass.ctaContainer}>
              <Cta flightBookingForm={flightBookingForm} />
            </div>

            <button
              aria-controls="mobile-navigation"
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className={cn(cssClass.mobileMenuToggle, cssClass.mobileOnly)}
              onClick={toggleMobileMenu}
              ref={mobileMenuToggleRef}
              type="button"
            >
              {isMobileMenuOpen ? (
                <X aria-hidden="true" focusable="false" />
              ) : (
                <Menu aria-hidden="true" focusable="false" />
              )}
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile Navigation Drawer */}
      <div className={cn(cssClass.mobileOnly)}>
        <Navigation
          id="mobile-navigation"
          isMobile={true}
          isOpen={isMobileMenuOpen}
          menuItems={menuItems}
          onNavClick={closeMobileMenu}
        />
      </div>
    </header>
  )
}
