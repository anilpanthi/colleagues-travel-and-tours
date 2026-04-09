import type { SelectField } from '@payloadcms/plugin-form-builder/types'
import type { Control, FieldErrorsImpl } from 'react-hook-form'

import { Label } from '@/components/ui/Label'
import {
  Select as SelectComponent,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select'
import React from 'react'
import { Controller } from 'react-hook-form'

import { Error } from '../Error'
import { Width } from '../Width'
import classes from '../index.module.scss'

export const Select: React.FC<
  SelectField & {
    control: Control
    errors: Partial<FieldErrorsImpl>
    placeholder?: string
  }
> = ({ name, control, errors, label, options, required, width, defaultValue, placeholder }) => {
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
      <Controller
        control={control}
        defaultValue={defaultValue}
        name={name}
        render={({ field: { onChange, value } }) => {
          const controlledValue = options.find((t) => t.value === value)

          return (
            <SelectComponent onValueChange={(val: string) => onChange(val)} value={controlledValue?.value}>
              <SelectTrigger className={classes.formBlock__fullWidth} id={name}>
                <SelectValue placeholder={placeholder || label} />
              </SelectTrigger>
              <SelectContent>
                {options.map(({ label, value }) => {
                  return (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </SelectComponent>
          )
        }}
        rules={{ required }}
      />
      {errors[name] && <Error name={name} />}
    </Width>
  )
}
