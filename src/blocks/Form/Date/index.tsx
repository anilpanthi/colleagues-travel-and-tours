import type { DateField } from '@payloadcms/plugin-form-builder/types'
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import React from 'react'

import { Error } from '../Error'
import { Width } from '../Width'
import classes from '../index.module.scss'

const getDateInputValue = (value?: string): string | undefined => {
  if (!value) return undefined

  return /^\d{4}-\d{2}-\d{2}/.exec(value)?.[0]
}

const getLocalToday = (): string => {
  const today = new Date()
  const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60_000)

  return localToday.toISOString().slice(0, 10)
}

export const DatePicker: React.FC<
  DateField & {
    errors: Partial<FieldErrorsImpl>
    register: UseFormRegister<FieldValues>
  }
> = ({ name, defaultValue, errors, label, register, required, width }) => {
  const { ref, ...dateInputProps } = register(name, {
    required,
    validate: (value) => {
      if (!value) return !required || 'This field is required'

      return (
        (typeof value === 'string' && value >= getLocalToday()) ||
        'Please select today or a future date'
      )
    },
  })

  return (
    <Width width={width}>
      <Label className={classes.formBlock__label} htmlFor={name}>
        {label}

        {required && (
          <span className={classes.formBlock__required}>
            * <span className={classes.formBlock__srOnly}>(required)</span>
          </span>
        )}
      </Label>
      <Input
        defaultValue={getDateInputValue(defaultValue)}
        id={name}
        ref={(element) => {
          if (element) {
            const today = getLocalToday()
            element.min = today

            if (element.value && element.value < today) {
              element.value = ''
            }
          }

          ref(element)
        }}
        type="date"
        {...dateInputProps}
      />
      {errors[name] && <Error name={name} />}
    </Width>
  )
}
