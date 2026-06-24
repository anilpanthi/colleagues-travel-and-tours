export const isRecaptchaRequired = (): boolean => process.env.NODE_ENV === 'production'
