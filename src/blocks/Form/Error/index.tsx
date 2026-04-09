import * as React from 'react'
import { useFormContext } from 'react-hook-form'
import classes from '../index.module.scss'

export const Error = ({ name }: { name: string }) => {
  const {
    formState: { errors },
  } = useFormContext()
  return (
    <div className={classes.formBlock__error}>
      {(errors[name]?.message as string) || 'This field is required'}
    </div>
  )
}
