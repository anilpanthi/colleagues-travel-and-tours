import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { ExplorePageClient } from './ExplorePage.client'
import { Metadata } from 'next'
import { StaticHero } from '@/heros/StaticHero/StaticHero'
import { Sparkles } from 'lucide-react'

export const revalidate = 600

export const metadata: Metadata = {
  title: 'Explore Packages | Colleagues Travel And Tours',
  description: 'Search and filter our wide range of travel packages to find your next adventure.',
}

export default async function ExplorePage() {
  const payload = await getPayload({ config })

  const [packagesRes, activitiesRes] = await Promise.all([
    payload.find({
      collection: 'packages',
      limit: 100,
      depth: 1,
      select: {
        title: true,
        slug: true,
        featuredImage: true,
        meta: true,
        tripDuration: true,
        tripGrade: true,
        bestSeason: true,
        elevation: true,
        Activity: true,
        hero: true,
        updatedAt: true,
        createdAt: true,
      },
      where: {
        _status: {
          equals: 'published',
        },
      },
      overrideAccess: false,
    }),
    payload.find({
      collection: 'activities',
      limit: 100,
      depth: 0,
      overrideAccess: false,
      select: {
        title: true,
        slug: true,
        updatedAt: true,
        createdAt: true,
      },
    }),
  ])

  return (
    <>
      <StaticHero
        title="Explore Packages"
        tagline="Find Your Fit"
        subtitle="Choose the journey that matches your pace."
        scrollDot={false}
        icon={Sparkles}
      />
      <ExplorePageClient initialPackages={packagesRes.docs} activities={activitiesRes.docs} />
    </>
  )
}
