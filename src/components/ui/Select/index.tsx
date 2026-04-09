'use client'

import * as SelectPrimitive from '@radix-ui/react-select'
import { Check, ChevronDown, ChevronUp } from 'lucide-react'
import * as React from 'react'
import { cn } from '@/utilities/ui'
import classes from './Select.module.scss'

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const SelectTrigger: React.FC<
  { ref?: React.Ref<HTMLButtonElement> } & React.ComponentProps<typeof SelectPrimitive.Trigger>
> = ({ children, className, ref, ...props }) => (
  <SelectPrimitive.Trigger
    className={cn(classes.select__trigger, className)}
    ref={ref}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className={classes.select__icon} />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
)

const SelectScrollUpButton: React.FC<
  { ref?: React.Ref<HTMLDivElement> } & React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>
> = ({ className, ref, ...props }) => (
  <SelectPrimitive.ScrollUpButton
    className={cn(classes.select__scrollButton, className)}
    ref={ref}
    {...props}
  >
    <ChevronUp className={classes.select__icon} />
  </SelectPrimitive.ScrollUpButton>
)

const SelectScrollDownButton: React.FC<
  { ref?: React.Ref<HTMLDivElement> } & React.ComponentProps<
    typeof SelectPrimitive.ScrollDownButton
  >
> = ({ className, ref, ...props }) => (
  <SelectPrimitive.ScrollDownButton
    className={cn(classes.select__scrollButton, className)}
    ref={ref}
    {...props}
  >
    <ChevronDown className={classes.select__icon} />
  </SelectPrimitive.ScrollDownButton>
)

const SelectContent: React.FC<
  {
    ref?: React.Ref<HTMLDivElement>
  } & React.ComponentProps<typeof SelectPrimitive.Content>
> = ({ children, className, position = 'popper', ref, ...props }) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      className={cn(classes.select__content, className)}
      position={position}
      ref={ref}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          classes.select__viewport,
          position === 'popper' && classes['select__viewport--popper'],
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
)

const SelectLabel: React.FC<
  { ref?: React.Ref<HTMLDivElement> } & React.ComponentProps<typeof SelectPrimitive.Label>
> = ({ className, ref, ...props }) => (
  <SelectPrimitive.Label
    className={cn(classes.select__label, className)}
    ref={ref}
    {...props}
  />
)

const SelectItem: React.FC<
  { ref?: React.Ref<HTMLDivElement>; value: string } & React.ComponentProps<
    typeof SelectPrimitive.Item
  >
> = ({ children, className, ref, ...props }) => (
  <SelectPrimitive.Item
    className={cn(classes.select__item, className)}
    ref={ref}
    {...props}
  >
    <span className={classes.select__itemIndicator}>
      <SelectPrimitive.ItemIndicator>
        <Check className={classes.select__icon} />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
)

const SelectSeparator: React.FC<
  { ref?: React.Ref<HTMLDivElement> } & React.ComponentProps<typeof SelectPrimitive.Separator>
> = ({ className, ref, ...props }) => (
  <SelectPrimitive.Separator
    className={cn(classes.select__separator, className)}
    ref={ref}
    {...props}
  />
)

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
