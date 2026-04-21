import React from 'react'

import type { Page } from '@/payload-types'

import { HighImpactHero } from '@/heros/HighImpact'
import { LowImpactHero } from '@/heros/LowImpact'
import { MediumImpactHero } from '@/heros/MediumImpact'
import { StaticHero } from './StaticHero/StaticHero'

const heroes = {
  highImpact: HighImpactHero,
  lowImpact: LowImpactHero,
  mediumImpact: MediumImpactHero,
  staticHero: StaticHero,
}

import { BreadcrumbItem } from '@/components/Breadcrumbs/Index'

type RenderHeroProps = Page['hero'] & {
  title?: string | null
  breadcrumbs?: BreadcrumbItem[] | null
}

export const RenderHero: React.FC<RenderHeroProps> = (props) => {
  const { type } = props || {}

  if (!type || type === 'none') return null

  const HeroToRender = heroes[type]

  if (!HeroToRender) return null

  return <HeroToRender {...props} />
}
