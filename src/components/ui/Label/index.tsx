'use client'

import * as LabelPrimitive from '@radix-ui/react-label'
import * as React from 'react'
import { cn } from '@/utilities/ui'
import classes from './Label.module.scss'

const Label: React.FC<
  { ref?: React.Ref<HTMLLabelElement> } & React.ComponentProps<typeof LabelPrimitive.Root>
> = ({ className, ref, ...props }) => (
  <LabelPrimitive.Root className={cn(classes.label, className)} ref={ref} {...props} />
)

export { Label }
