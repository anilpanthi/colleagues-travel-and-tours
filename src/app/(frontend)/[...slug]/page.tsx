import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import { type RequiredDataFromCollectionSlug } from 'payload'
import { draftMode } from 'next/headers'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { PackageDetails } from '@/components/PackageDetails'
import { notFound, permanentRedirect } from 'next/navigation'
import {
  queryPages,
  queryPackages,
  queryPageBySlug,
  queryPackageBySlug,
  queryRelatedPackages,
} from './queries'
import { RelatedPackages } from '@/components/PackageDetails/RelatedPackages'

export const dynamic = 'force-static'
export const revalidate = 600

export async function generateStaticParams() {
  const pages = await queryPages()
  const packages = await queryPackages()

  const pageParams = pages
    ?.filter((doc) => {
      return doc.slug !== 'home'
    })
    .map(({ slug }) => {
      return { slug: slug?.split('/') }
    })

  const packageParams = packages.map(({ slug }) => {
    return { slug: slug?.split('/') }
  })

  return [...pageParams, ...packageParams]
}

type Args = {
  params: Promise<{
    slug?: string[]
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug } = await paramsPromise

  if (slug && slug.length === 1 && slug[0] === 'home') {
    permanentRedirect('/')
  }

  const currentSlug = slug ? slug.join('/') : 'home'

  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(currentSlug)
  const url = '/' + decodedSlug

  // Try querying package first
  const pkg = await queryPackageBySlug({ slug: decodedSlug })

  if (pkg) {
    const relatedDocs = await queryRelatedPackages({ pkg })
    return (
      <>
        <PayloadRedirects disableNotFound url={url} />
        {draft && <LivePreviewListener />}
        <PackageDetails pkg={pkg}>
          {relatedDocs.length > 0 ? <RelatedPackages packages={relatedDocs} /> : null}
        </PackageDetails>
      </>
    )
  }

  // Then try querying page
  const page: RequiredDataFromCollectionSlug<'pages'> | null = await queryPageBySlug({
    slug: decodedSlug,
  })

  if (!page) {
    // Use notFound() to trigger the custom not-found.tsx in the (frontend) layout
    return notFound()
  }

  const { hero, layout } = page

  return (
    <>
      <PageClient />
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <RenderHero
        {...hero}
        breadcrumbs={page.breadcrumbs || undefined}
        title={hero.title || page.title}
      />

      <RenderBlocks blocks={layout} />
    </>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug } = await paramsPromise

  if (slug && slug.length === 1 && slug[0] === 'home') {
    permanentRedirect('/')
  }

  const decodedSlug = decodeURIComponent(slug ? slug.join('/') : 'home')

  const pkg = await queryPackageBySlug({ slug: decodedSlug })
  if (pkg) {
    return generateMeta({ doc: pkg })
  }

  const page = await queryPageBySlug({ slug: decodedSlug })
  return generateMeta({ doc: page })
}
