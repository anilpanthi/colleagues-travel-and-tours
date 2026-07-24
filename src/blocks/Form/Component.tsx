'use client'
import type { Form as FormType } from '@/payload-types'

import { useRouter } from 'next/navigation'
import React, { useCallback, useRef, useState } from 'react'
import { useForm, FormProvider, type FieldValues } from 'react-hook-form'
import RichText from '@/components/RichText'
import { Button } from '@/components/ui/Button'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

import { fields } from './fields'
import { getClientSideURL } from '@/utilities/getURL'
import classes from './index.module.scss'
import { cn } from '@/utilities/ui'
import { executeRecaptcha, ReCaptchaScript } from '@/components/ReCaptcha'
import { isRecaptchaRequired } from '@/utilities/recaptchaConfig'

const RECAPTCHA_ACTION = 'form_submit'
type FormFieldBlock = NonNullable<FormType['fields']>[number]
type FormSubmissionResponse = {
  id: number
}
type FormErrorResponse = {
  errors?: {
    message?: string
  }[]
  status?: string
}

const isFormSubmissionResponse = (value: unknown): value is FormSubmissionResponse => {
  return Boolean(
    value &&
    typeof value === 'object' &&
    'id' in value &&
    typeof value.id === 'number' &&
    Number.isInteger(value.id),
  )
}

const isFormErrorResponse = (value: unknown): value is FormErrorResponse => {
  return Boolean(value && typeof value === 'object')
}

const getDefaultValues = (formFields?: FormType['fields'] | null): FieldValues => {
  const defaultValues: FieldValues = {}

  for (const field of formFields || []) {
    if ('name' in field && 'defaultValue' in field && field.defaultValue != null) {
      defaultValues[field.name] = field.defaultValue
    }
  }

  return defaultValues
}

export type FormBlockType = {
  blockName?: string
  blockType?: 'formBlock'
  enableIntro: boolean
  form: FormType
  introContent?: DefaultTypedEditorState
  onSubmissionSuccess?: () => void
  submissionContext?: {
    packageId: number
  }
}

export const FormBlock: React.FC<
  {
    id?: string
    className?: string
  } & FormBlockType
> = (props) => {
  const recaptchaRequired = isRecaptchaRequired()
  const {
    enableIntro,
    form: formFromProps,
    className,
    form: { id: formID, confirmationMessage, confirmationType, redirect, submitButtonLabel } = {},
    introContent,
    onSubmissionSuccess,
    submissionContext,
  } = props

  const formMethods = useForm<FieldValues>({
    defaultValues: getDefaultValues(formFromProps.fields),
  })
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
  } = formMethods

  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState<boolean>()
  const [shouldLoadRecaptcha, setShouldLoadRecaptcha] = useState(false)
  const [error, setError] = useState<{ message: string; status?: string } | undefined>()
  const honeypotRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const formElementID = formID ? `form-${formID}` : undefined
  const formFields = formFromProps?.fields || []
  const canRenderForm = Boolean(formID && formFields.length)

  const renderField = (field: FormFieldBlock, index: number) => {
    const key =
      'id' in field && typeof field.id === 'string' ? field.id : `${field.blockType}-${index}`

    switch (field.blockType) {
      case 'checkbox':
        return (
          <div className={classes.formBlock__field} key={key}>
            <fields.checkbox
              blockName={field.blockName ?? undefined}
              blockType={field.blockType}
              defaultValue={field.defaultValue ?? undefined}
              errors={errors}
              label={field.label ?? undefined}
              name={field.name}
              register={register}
              required={field.required ?? undefined}
              width={field.width ?? undefined}
            />
          </div>
        )
      case 'country':
        return (
          <div className={classes.formBlock__field} key={key}>
            <fields.country
              blockName={field.blockName ?? undefined}
              blockType={field.blockType}
              control={control}
              errors={errors}
              label={field.label ?? undefined}
              name={field.name}
              required={field.required ?? undefined}
              width={field.width ?? undefined}
            />
          </div>
        )
      case 'date':
        return (
          <div className={classes.formBlock__field} key={key}>
            <fields.date
              blockName={field.blockName ?? undefined}
              blockType={field.blockType}
              defaultValue={field.defaultValue ?? undefined}
              errors={errors}
              label={field.label ?? undefined}
              name={field.name}
              register={register}
              required={field.required ?? undefined}
              width={field.width ?? undefined}
            />
          </div>
        )
      case 'email':
        return (
          <div className={classes.formBlock__field} key={key}>
            <fields.email
              blockName={field.blockName ?? undefined}
              blockType={field.blockType}
              errors={errors}
              label={field.label ?? undefined}
              name={field.name}
              placeholder={field.placeholder ?? undefined}
              register={register}
              required={field.required ?? undefined}
              width={field.width ?? undefined}
            />
          </div>
        )
      case 'message':
        if (!field.message) return null

        return (
          <div className={classes.formBlock__field} key={key}>
            <fields.message message={field.message} />
          </div>
        )
      case 'number':
        return (
          <div className={classes.formBlock__field} key={key}>
            <fields.number
              blockName={field.blockName ?? undefined}
              blockType={field.blockType}
              defaultValue={field.defaultValue ?? undefined}
              errors={errors}
              label={field.label ?? undefined}
              name={field.name}
              placeholder={field.placeholder ?? undefined}
              register={register}
              required={field.required ?? undefined}
              width={field.width ?? undefined}
            />
          </div>
        )
      case 'select':
        return (
          <div className={classes.formBlock__field} key={key}>
            <fields.select
              blockName={field.blockName ?? undefined}
              blockType={field.blockType}
              control={control}
              defaultValue={field.defaultValue ?? undefined}
              errors={errors}
              label={field.label ?? undefined}
              name={field.name}
              options={field.options || []}
              placeholder={field.placeholder ?? undefined}
              required={field.required ?? undefined}
              width={field.width ?? undefined}
            />
          </div>
        )
      case 'state':
        return (
          <div className={classes.formBlock__field} key={key}>
            <fields.state
              blockName={field.blockName ?? undefined}
              blockType={field.blockType}
              control={control}
              errors={errors}
              label={field.label ?? undefined}
              name={field.name}
              required={field.required ?? undefined}
              width={field.width ?? undefined}
            />
          </div>
        )
      case 'text':
        return (
          <div className={classes.formBlock__field} key={key}>
            <fields.text
              blockName={field.blockName ?? undefined}
              blockType={field.blockType}
              defaultValue={field.defaultValue ?? undefined}
              errors={errors}
              label={field.label ?? undefined}
              name={field.name}
              placeholder={field.placeholder ?? undefined}
              register={register}
              required={field.required ?? undefined}
              width={field.width ?? undefined}
            />
          </div>
        )
      case 'textarea':
        return (
          <div className={classes.formBlock__field} key={key}>
            <fields.textarea
              blockName={field.blockName ?? undefined}
              blockType={field.blockType}
              defaultValue={field.defaultValue ?? undefined}
              errors={errors}
              label={field.label ?? undefined}
              name={field.name}
              placeholder={field.placeholder ?? undefined}
              register={register}
              required={field.required ?? undefined}
              width={field.width ?? undefined}
            />
          </div>
        )
      default:
        return null
    }
  }

  const onSubmit = useCallback(
    (data: FieldValues) => {
      const submitForm = async () => {
        setError(undefined)
        setIsLoading(true)

        const dataToSend = Object.entries(data).map(([name, value]) => ({
          field: name,
          value: value == null ? '' : String(value),
        }))

        try {
          const recaptchaToken = recaptchaRequired ? await executeRecaptcha(RECAPTCHA_ACTION) : null

          if (recaptchaRequired && !recaptchaToken) {
            setIsLoading(false)
            setError({ message: 'Security verification failed. Please try again.', status: '400' })
            return
          }

          const req = await fetch(`${getClientSideURL()}/api/form-submit`, {
            body: JSON.stringify({
              form: formID,
              botCheck: honeypotRef.current?.value || '',
              submissionData: dataToSend,
              submissionContext,
              recaptchaToken,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
          })

          const res: unknown = await req.json()

          if (req.status >= 400) {
            setIsLoading(false)

            setError({
              message: isFormErrorResponse(res)
                ? res.errors?.[0]?.message || 'Internal Server Error'
                : 'Internal Server Error',
              status: isFormErrorResponse(res) ? res.status : String(req.status),
            })

            return
          }

          if (!isFormSubmissionResponse(res)) {
            setIsLoading(false)
            setError({
              message: 'The form was not saved. Please try again.',
              status: '500',
            })

            return
          }

          setIsLoading(false)
          setHasSubmitted(true)
          onSubmissionSuccess?.()

          if (confirmationType === 'redirect' && redirect) {
            const { url } = redirect

            const redirectUrl = url

            if (redirectUrl) router.push(redirectUrl)
          }
        } catch (err) {
          console.warn(err)
          setIsLoading(false)
          setError({
            message: 'Something went wrong.',
          })
        }
      }

      void submitForm()
    },
    [
      router,
      formID,
      redirect,
      confirmationType,
      recaptchaRequired,
      submissionContext,
      onSubmissionSuccess,
    ],
  )

  const handleFormSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      void handleSubmit(onSubmit)(e)
    },
    [handleSubmit, onSubmit],
  )

  return (
    <div className={cn(classes.formBlock, className)}>
      {recaptchaRequired && shouldLoadRecaptcha && <ReCaptchaScript />}
      {enableIntro && introContent && !hasSubmitted && (
        <RichText className={classes.formBlock__intro} data={introContent} enableGutter={false} />
      )}
      <div className={classes.formBlock__container}>
        <FormProvider {...formMethods}>
          {!isLoading && hasSubmitted && confirmationType === 'message' && confirmationMessage && (
            <RichText data={confirmationMessage} />
          )}
          <p aria-live="polite" className={classes.formBlock__srOnly} role="status">
            {isLoading && !hasSubmitted ? 'Submitting your form. Please wait.' : ''}
          </p>
          {error && (
            <div
              className={classes.formBlock__errorMessage}
            >{`${error.status || '500'}: ${error.message || ''}`}</div>
          )}
          {!hasSubmitted && (
            <form
              id={formElementID}
              className={classes.formBlock__form}
              onFocusCapture={() => setShouldLoadRecaptcha(true)}
              onPointerDownCapture={() => setShouldLoadRecaptcha(true)}
              onSubmit={handleFormSubmit}
            >
              <div aria-hidden="true" className={classes.formBlock__honeypot}>
                <label htmlFor={`${formID}-bot-check`}>Leave this field blank</label>
                <input
                  autoComplete="off"
                  id={`${formID}-bot-check`}
                  name="reservation-confirmation"
                  readOnly
                  ref={honeypotRef}
                  tabIndex={-1}
                  type="text"
                  value=""
                />
              </div>

              <div className={classes.formBlock__fieldsGroup}>
                {canRenderForm ? (
                  formFields.map(renderField)
                ) : (
                  <div className={classes.formBlock__errorMessage}>
                    This form is not configured correctly.
                  </div>
                )}
              </div>

              <div className={classes.formBlock__submit}>
                <Button
                  aria-busy={isLoading}
                  disabled={!canRenderForm || isLoading}
                  form={formElementID}
                  iconLeft={isLoading ? <span className={classes.formBlock__spinner} /> : undefined}
                  type="submit"
                >
                  {isLoading ? 'Submitting...' : submitButtonLabel || 'Submit'}
                </Button>
              </div>
            </form>
          )}
        </FormProvider>
      </div>
    </div>
  )
}
