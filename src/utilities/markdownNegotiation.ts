export const acceptsMarkdown = (acceptHeader: string | null) => {
  if (!acceptHeader) return false

  return acceptHeader.split(',').some((range) => {
    const [mediaType, ...parameters] = range.split(';').map((part) => part.trim())

    if (mediaType?.toLowerCase() !== 'text/markdown') return false

    const qualityParameter = parameters.find((parameter) => /^q\s*=/i.test(parameter))

    if (!qualityParameter) return true

    const quality = Number(qualityParameter.replace(/^q\s*=\s*/i, ''))

    return Number.isFinite(quality) && quality > 0
  })
}

export const isHTMLPath = (pathname: string) => {
  if (
    pathname.startsWith('/agent-markdown-internal') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/media/')
  ) {
    return false
  }

  return !/\/[^/]+\.[a-z0-9]+$/i.test(pathname)
}

export const mergeVaryHeader = (currentValue: string | null, requiredValue: string) => {
  const values = (currentValue || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)

  if (!values.some((value) => value.toLowerCase() === requiredValue.toLowerCase())) {
    values.push(requiredValue)
  }

  return values.join(', ')
}
