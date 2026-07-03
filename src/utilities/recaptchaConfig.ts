export const isRecaptchaRequired = (): boolean =>
  process.env.NODE_ENV === 'production' &&
  Boolean(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) &&
  (typeof window !== 'undefined' || Boolean(process.env.RECAPTCHA_SECRET_KEY))
