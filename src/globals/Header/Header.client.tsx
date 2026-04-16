'use client'
import React, { useEffect, useLayoutEffect, useState } from 'react'
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
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ mainNavigation, logos }) => {
  const [theme, setTheme] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const { headerTheme, setHeaderTheme, hasHeroImage, setHasHeroImage } = useHeaderTheme()
  const pathname = usePathname()

  const [isScrolled, setIsScrolled] = useState<boolean>(false)
  const [isPastHero, setIsPastHero] = useState<boolean>(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false)

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
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
      const heroHeight = isFront ? window.innerHeight * 0.8 : window.innerHeight * 0.4

      setIsPastHero(window.scrollY > heroHeight)
    }

    const handleResize = () => {
      if (window.innerWidth >= 1100) {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleResize)

    // Initialize state on mount
    handleScroll()
    handleResize()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
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
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)

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
            <div className={cssClass.desktopOnly}>
              <Cta />
            </div>

            <button
              className={cn(cssClass.mobileMenuToggle, cssClass.mobileOnly)}
              onClick={toggleMobileMenu}
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile Navigation Drawer */}
      <div className={cn(cssClass.mobileOnly)}>
        <Navigation
          isMobile={true}
          isOpen={isMobileMenuOpen}
          menuItems={menuItems}
          onNavClick={() => setIsMobileMenuOpen(false)}
        />
      </div>
    </header>
  )
}
