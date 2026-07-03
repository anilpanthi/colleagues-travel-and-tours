import type { Form } from '@/payload-types'
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import React from 'react'

import { Error } from '../Error'
import { Width } from '../Width'
import classes from '../index.module.scss'

type NumberField = Extract<NonNullable<Form['fields']>[number], { blockType: 'number' }>

export const Number: React.FC<
  NumberField & {
    errors: Partial<FieldErrorsImpl>
    register: UseFormRegister<FieldValues>
    placeholder?: string
  }
> = ({ name, defaultValue, errors, label, register, required, width, placeholder }) => {
  return (
    <Width width={width ?? undefined}>
      <Label className={classes.formBlock__label} htmlFor={name}>
        {label}

        {required && (
          <span className={classes.formBlock__required}>
            * <span className={classes.formBlock__srOnly}>(required)</span>
          </span>
        )}
      </Label>
      <Input
        defaultValue={defaultValue ?? undefined}
        id={name}
        type="number"
        placeholder={placeholder ?? undefined}
        {...register(name, { required: required ?? undefined })}
      />
      {errors[name] && <Error name={name} />}
    </Width>
  )
}
