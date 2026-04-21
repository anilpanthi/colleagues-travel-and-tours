import React from 'react'
import type { SimpleContentBlock as SimpleContentBlockProps } from '@/payload-types'
import RichText from '@/components/RichText'
import Content from '@/components/ui/Content/Index'
import blockstyles from './blockstyles.module.css'

export const SimpleContent: React.FC<SimpleContentBlockProps> = (props) => {
  const { content } = props

  if (!content) return null

  return (
    <Content>
    
      <RichText className={blockstyles.content} data={content} enableGutter={true} />
    </Content>
  )
}

export default SimpleContent
