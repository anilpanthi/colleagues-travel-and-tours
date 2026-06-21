import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { ExplorePageClient } from './ExplorePage.client'
import { Metadata } from 'next'
import { StaticHero } from '@/heros/StaticHero/StaticHero'

export const dynamic = 'force-dynamic'

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
    }),
  ])

  return (
    <>
      <StaticHero
        title="Explore Packages"
        tagline="Unforgettable Journeys"
        subtitle="Search and filter our curated travel packages to find your next adventure."
        scrollDot={false}
      />
      <ExplorePageClient 
        initialPackages={packagesRes.docs} 
        activities={activitiesRes.docs} 
      />
    </>
  )
}
