import RichText from '@/components/RichText'
import React from 'react'

import { Width } from '../Width'
import { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

import classes from '../index.module.scss'

export const Message: React.FC<{ message: DefaultTypedEditorState }> = ({ message }) => {
  return (
    <Width className={classes.formBlock__message} width="100">
      {message && <RichText data={message} />}
    </Width>
  )
}
