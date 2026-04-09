import clsx from 'clsx'
import React from 'react'
import RichText from '@/components/RichText'

import type { Post } from '@/payload-types'

import Cards from '@/components/ui/Card/Cards'
import { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

export type RelatedPostsProps = {
  className?: string
  docs?: Post[]
  introContent?: DefaultTypedEditorState
}

export const RelatedPosts: React.FC<RelatedPostsProps> = (props) => {
  const { className, docs, introContent } = props

  return (
    <div className={clsx('lg:container', className)}>
      {introContent && <RichText data={introContent} enableGutter={false} />}
      
      <Cards
        collection="posts"
        selectedItems={docs?.map((doc) => ({
          relationTo: 'posts' as const,
          value: doc,
        }))}
        variant="blogCard"
        columns="3"
      />
    </div>
  )
}
