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
import { getMediaUrl } from '@/utilities/getMediaUrl'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Tag, User } from 'lucide-react'

// import styles from './page.module.css'
import styles from './singlePost.module.scss'
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

  const recentPosts = await queryRecentPosts({ currentSlug: decodedSlug })
  
  const currentCategoryId = post.categories?.[0] && typeof post.categories[0] === 'object' ? post.categories[0].id : null
  const relatedPosts = currentCategoryId ? await queryRelatedPostsByCategory({ categoryId: currentCategoryId, currentPostId: post.id }) : []

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
    <article className={styles.pd}>
      <PageClient heroType={post.hero?.type} />

      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <RenderHero {...post.hero} breadcrumbs={breadcrumbs} title={post.hero?.title || post.title} />

      <Content className={styles.pd__cont}>
        <div className={styles.pd__cont_gr}>
          <div className={styles.pd__cont_gr_left}>
            <h1 className={styles.pd__cont_gr_left_title}>{post.title}</h1>
            <div className={styles.pd__cont_gr_left_meta}>
              <p className={styles.pd__cont_gr_left_meta_date}>
                <Calendar size={14} />
                {post.publishedAt
                  ? formatDateTime(post.publishedAt)
                  : formatDateTime(post.createdAt)}
              </p>
              <p className={styles.pd__cont_gr_left_meta_author}>
                <User size={14} />
                {post.populatedAuthors && post.populatedAuthors.length > 0
                  ? formatAuthors(post.populatedAuthors)
                  : 'Admin'}
              </p>
              {categoryName && (
                <Link
                  className={styles.pd__cont_gr_left_meta_category}
                  href={`/categories/${categorySlug}`}
                >
                  <Tag size={14} />
                  {categoryName}
                </Link>
              )}
            </div>

            {/* display featured image  */}
            {/* {post.featuredImage && <div className={styles.pd__cont_gr_left_img}></div>} */}

            <RichText
              className={styles.pd__cont_gr_left_text}
              data={post.content}
              enableGutter={false}
            />
          </div>
          <div className={styles.pd__cont_gr_right}>
            <h3 className={styles.pd__cont_gr_right_title}>Recent Posts</h3>
            <div className={styles.pd__cont_gr_right_list}>
              {recentPosts.map((recentPost) => {
                return (
                  <Link
                    className={styles.pd__cont_gr_right_item}
                    href={`/posts/${recentPost.slug}`}
                    key={recentPost.id}
                  >
                    <div className={styles.pd__cont_gr_right_item_content}>
                      <h4 className={styles.pd__cont_gr_right_item_title}>{recentPost.title}</h4>
                      <div className={styles.pd__cont_gr_right_item_box}>
                        <p className={styles.pd__cont_gr_right_item_author}>
                          <User size={12} />
                          {recentPost.populatedAuthors && recentPost.populatedAuthors.length > 0
                            ? formatAuthors(recentPost.populatedAuthors)
                            : 'Admin'}
                        </p>
                        <p className={styles.pd__cont_gr_right_item_date}>
                          <Calendar size={12} />
                          {recentPost.publishedAt
                            ? formatDateTime(recentPost.publishedAt)
                            : formatDateTime(recentPost.createdAt)}
                        </p>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>


        {relatedPosts.length > 0 && (
          <RelatedPosts
            docs={relatedPosts}
            introContent={{
              root: {
                type: 'root',
                children: [
                  {
                    type: 'heading',
                    children: [
                      {
                        type: 'text',
                        detail: 0,
                        format: 0,
                        mode: 'normal',
                        style: '',
                        text: 'Related Posts',
                        version: 1,
                      },
                    ],
                    direction: 'ltr',
                    format: '',
                    indent: 0,
                    tag: 'h2',
                    version: 1,
                  },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                version: 1,
              },
            }}
          />
        )}
      </Content>
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
    depth: 1,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})

const queryRecentPosts = cache(async ({ currentSlug }: { currentSlug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    draft,
    limit: 20,
    overrideAccess: draft,
    pagination: false,
    sort: '-publishedAt',
    depth: 1,
    where: {
      slug: {
        not_equals: currentSlug,
      },
    },
  })

  return result.docs
})

const queryRelatedPostsByCategory = cache(
  async ({ categoryId, currentPostId }: { categoryId: number; currentPostId: number }) => {
    const { isEnabled: draft } = await draftMode()
    const payload = await getPayload({ config: configPromise })

    const result = await payload.find({
      collection: 'posts',
      depth: 1,
      draft,
      limit: 3,
      overrideAccess: draft,
      pagination: false,
      sort: '-publishedAt',
      where: {
        and: [
          {
            categories: {
              contains: categoryId,
            },
          },
          {
            id: {
              not_equals: currentPostId,
            },
          },
        ],
      },
    })

    return result.docs
  },
)
