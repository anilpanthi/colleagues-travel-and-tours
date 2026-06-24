'use client'
import type { FormFieldBlock, Form as FormType } from '@payloadcms/plugin-form-builder/types'

import { useRouter } from 'next/navigation'
import React, { useCallback, useRef, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import RichText from '@/components/RichText'
import { Button } from '@/components/ui/Button'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

import { fields } from './fields'
import { getClientSideURL } from '@/utilities/getURL'
import classes from './index.module.scss'
import { cn } from '@/utilities/ui'
import { ReCaptcha } from '@/components/ReCaptcha'
import { isRecaptchaRequired } from '@/utilities/recaptchaConfig'

export type FormBlockType = {
  blockName?: string
  blockType?: 'formBlock'
  enableIntro: boolean
  form: FormType
  introContent?: DefaultTypedEditorState
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
  } = props

  const formMethods = useForm({
    defaultValues: formFromProps.fields,
  })
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
  } = formMethods

  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState<boolean>()
  const [error, setError] = useState<{ message: string; status?: string } | undefined>()
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null)
  const [recaptchaKey, setRecaptchaKey] = useState(0)
  const honeypotRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const onSubmit = useCallback(
    (data: FormFieldBlock[]) => {
      let loadingTimerID: ReturnType<typeof setTimeout>
      const submitForm = async () => {
        setError(undefined)

        if (recaptchaRequired && !recaptchaToken) {
          setError({ message: 'Please complete the security verification.', status: '400' })
          return
        }

        const dataToSend = Object.entries(data).map(([name, value]) => ({
          field: name,
          value,
        }))

        // delay loading indicator by 1s
        loadingTimerID = setTimeout(() => {
          setIsLoading(true)
        }, 1000)

        try {
          const req = await fetch(`${getClientSideURL()}/api/form-submit`, {
            body: JSON.stringify({
              form: formID,
              companyWebsite: honeypotRef.current?.value || '',
              submissionData: dataToSend,
              recaptchaToken,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
          })

          const res = await req.json()

          clearTimeout(loadingTimerID)

          if (req.status >= 400) {
            setIsLoading(false)

            setError({
              message: res.errors?.[0]?.message || 'Internal Server Error',
              status: res.status,
            })

            return
          }

          setIsLoading(false)
          setHasSubmitted(true)

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
        } finally {
          setRecaptchaToken(null)
          setRecaptchaKey((key) => key + 1)
        }
      }

      void submitForm()
    },
    [router, formID, redirect, confirmationType, recaptchaRequired, recaptchaToken],
  )

  return (
    <div className={cn(classes.formBlock, className)}>
      {enableIntro && introContent && !hasSubmitted && (
        <RichText className={classes.formBlock__intro} data={introContent} enableGutter={false} />
      )}
      <div className={classes.formBlock__container}>
        <FormProvider {...formMethods}>
          {!isLoading && hasSubmitted && confirmationType === 'message' && (
            <RichText data={confirmationMessage} />
          )}
          {isLoading && !hasSubmitted && (
            <p className={classes.formBlock__loading}>Loading, please wait...</p>
          )}
          {error && (
            <div
              className={classes.formBlock__errorMessage}
            >{`${error.status || '500'}: ${error.message || ''}`}</div>
          )}
          {!hasSubmitted && (
            <form id={formID} className={classes.formBlock__form} onSubmit={handleSubmit(onSubmit)}>
              <div aria-hidden="true" className={classes.formBlock__honeypot}>
                <label htmlFor={`${formID}-company-website`}>Leave this field blank</label>
                <input
                  autoComplete="off"
                  id={`${formID}-company-website`}
                  name="companyWebsite"
                  ref={honeypotRef}
                  tabIndex={-1}
                  type="text"
                />
              </div>

              <div className={classes.formBlock__fieldsGroup}>
                {formFromProps &&
                  formFromProps.fields &&
                  formFromProps.fields?.map((field, index) => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const Field: React.FC<any> = fields?.[field.blockType as keyof typeof fields]
                    if (Field) {
                      return (
                        <div className={classes.formBlock__field} key={index}>
                          <Field
                            form={formFromProps}
                            {...field}
                            {...formMethods}
                            control={control}
                            errors={errors}
                            register={register}
                          />
                        </div>
                      )
                    }
                    return null
                  })}
              </div>

              {recaptchaRequired && (
                <div className={classes.formBlock__recaptcha}>
                  <ReCaptcha key={recaptchaKey} onTokenChange={setRecaptchaToken} />
                </div>
              )}

              <div className={classes.formBlock__submit}>
                <Button disabled={recaptchaRequired && !recaptchaToken} form={formID} type="submit">
                  {submitButtonLabel}
                </Button>
              </div>
            </form>
          )}
        </FormProvider>
      </div>
    </div>
  )
}
