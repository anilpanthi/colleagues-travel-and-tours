import * as React from 'react'
import { cn } from '@/utilities/ui'
import classes from './Input.module.scss'

const Input: React.FC<
  {
    ref?: React.Ref<HTMLInputElement>
  } & React.InputHTMLAttributes<HTMLInputElement>
> = ({ type, className, ref, ...props }) => {
  return (
    <input
      className={cn(classes.input, className)}
      ref={ref}
      type={type}
      {...props}
    />
  )
}

export { Input }
