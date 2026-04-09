import * as React from 'react'
import { cn } from '@/utilities/ui'
import classes from './Textarea.module.scss'

const Textarea: React.FC<
  {
    ref?: React.Ref<HTMLTextAreaElement>
  } & React.TextareaHTMLAttributes<HTMLTextAreaElement>
> = ({ className, ref, ...props }) => {
  return (
    <textarea
      className={cn(classes.textarea, className)}
      ref={ref}
      {...props}
    />
  )
}

export { Textarea }
