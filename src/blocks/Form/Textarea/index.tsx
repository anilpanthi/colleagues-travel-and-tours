import type { Form } from '@/payload-types'
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import { Label } from '@/components/ui/Label'
import { Textarea as TextAreaComponent } from '@/components/ui/Textarea'
import React from 'react'

import { Error } from '../Error'
import { Width } from '../Width'
import classes from '../index.module.scss'

type TextareaField = Extract<NonNullable<Form['fields']>[number], { blockType: 'textarea' }>

export const Textarea: React.FC<
  TextareaField & {
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

      <TextAreaComponent
        defaultValue={defaultValue ?? undefined}
        id={name}
        placeholder={placeholder ?? undefined}
        rows={3}
        {...register(name, { required: required ?? undefined })}
      />

      {errors[name] && <Error name={name} />}
    </Width>
  )
}
