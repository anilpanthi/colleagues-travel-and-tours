import type { Metadata } from 'next'

import { RelatedPosts } from '@/blocks/RelatedPosts/Component'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import RichText from '@/components/RichText'

import type { Post } from '@/payload-types'

import { RenderHero } from '@/heros/RenderHero'
import { Breadcrumbs } from '@/components/Breadcrumbs/Index'
import Container from '@/components/ui/Container'
import { formatAuthors } from '@/utilities/formatAuthors'
import { formatDateTime } from '@/utilities/formatDateTime'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'

import styles from './page.module.css'
import Content from '@/components/ui/Content/Index'

export async function generateStaticParams() {
  try {
    const payload = await getPayload({ config: configPromise })
    const posts = await payload.find({
      collection: 'posts',
      draft: false,
      limit: 1000,
      overrideAccess: false,
      pagination: false,
      select: {
        slug: true,
      },
    })

    const params = posts.docs.map(({ slug }) => {
      return { slug }
    })

    return params
  } catch (error) {
    console.error('Error generating static params for posts:', error)
    return []
  }
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Post({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const url = '/posts/' + decodedSlug
  const post = await queryPostBySlug({ slug: decodedSlug })
  if (!post) return <PayloadRedirects url={url} />

  console.log(post.hero)

  const category = post.categories?.[0]
  const categoryName = category && typeof category === 'object' ? category.title : null
  const categorySlug = category && typeof category === 'object' ? category.slug : null

  const breadcrumbs = [
    {
      label: 'Blog',
      url: '/posts',
    },
    ...(categoryName && categorySlug
      ? [
          {
            label: categoryName,
            url: `/categories/${categorySlug}`,
          },
        ]
      : []),
    {
      label: post.title,
    },
  ]

  return (
    <article className={styles.postsDetail}>
      <PageClient heroType={post.hero?.type} />

      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <RenderHero {...post.hero} breadcrumbs={breadcrumbs} title={post.hero?.title || post.title} />

      <div className={styles.postContent}>
        <div className={styles.container}>
          <div className={styles.article}>
            <h2>{post.title}</h2>
            <div className={styles.postMeta}>
              {post.categories && post.categories.length > 0 && (
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Categories</span>
                  <div className={styles.categories}>
                    {post.categories.map((category, index) => {
                      if (typeof category === 'object' && category !== null) {
                        return (
                          <span key={index} className={styles.categoryTag}>
                            {category.title || 'Untitled'}
                          </span>
                        )
                      }
                      return null
                    })}
                  </div>
                </div>
              )}
            </div>

            <RichText className={styles.richText} data={post.content} enableGutter={false} />
            {post.populatedAuthors && post.populatedAuthors.length > 0 && (
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Written By</span>
                <span className={styles.metaValue}>{formatAuthors(post.populatedAuthors)}</span>
              </div>
            )}
            {post.publishedAt && (
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Published on</span>
                <time className={styles.metaValue} dateTime={post.publishedAt}>
                  {formatDateTime(post.publishedAt)}
                </time>
              </div>
            )}
          </div>
          {post.relatedPosts && post.relatedPosts.length > 0 && (
            <div className={styles.relatedSection}>
              <h3 className={styles.relatedTitle}>Related Articles</h3>
              <RelatedPosts
                className={styles.relatedGrid}
                docs={post.relatedPosts.filter((post): post is Post => typeof post === 'object')}
              />
            </div>
          )}
        </div>
      </div>
      <Content>hjhjh</Content>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const post = await queryPostBySlug({ slug: decodedSlug })

  return generateMeta({ doc: post })
}

const queryPostBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  console.log(result.docs?.[0])

  return result.docs?.[0] || null
})
