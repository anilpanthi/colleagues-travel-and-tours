import { describe, expect, it } from 'vitest'

import {
  buildBrandedEmailHTML,
  buildBrandedEmailText,
  plainTextToEmailHTML,
} from '@/email/brandedEmailLayout'
import {
  emailHTMLToPlainText,
  improveEmailMessage,
  sanitizeEmailHTML,
} from '@/email/deliverableNodemailerAdapter'

const layoutOptions = {
  websiteURL: 'https://colleaguestravel.com',
  year: 2026,
}

describe('branded email layout', () => {
  it('wraps application email content in a consistent header and footer', () => {
    const html = buildBrandedEmailHTML('<h1>Your booking</h1><p>We received it.</p>', layoutOptions)

    expect(html).toContain('data-colleagues-email="true"')
    expect(html).toContain('/email/colleagues-logo-white.png')
    expect(html).toContain('/email/colleagues-logo-colored.png')
    expect(html).not.toContain('letter-spacing: 2.4px')
    expect(html).toContain('<h1>Your booking</h1><p>We received it.</p>')
    expect(html).toContain('https://colleaguestravel.com')
    expect(html).toContain('&copy; 2026 Colleagues Travel &amp; Tours')
  })

  it('preserves styles and body content from complete HTML documents', () => {
    const html = buildBrandedEmailHTML(
      '<!doctype html><html><head><style>.notice { color: red; }</style></head><body><p class="notice">Important</p></body></html>',
      layoutOptions,
    )

    expect(html).toContain('<style>.notice { color: red; }</style>')
    expect(html).toContain('<p class="notice">Important</p>')
    expect(html.match(/<!doctype html>/gi)).toHaveLength(1)
  })

  it('adds a matching plain-text header and footer only once', () => {
    const text = buildBrandedEmailText('Your enquiry was received.', layoutOptions)

    expect(text).toContain('COLLEAGUES TRAVEL & TOURS')
    expect(text).toContain('Your enquiry was received.')
    expect(text).toContain('© 2026 Colleagues Travel & Tours')
    expect(buildBrandedEmailText(text, layoutOptions)).toBe(text)
  })

  it('escapes text-only messages before creating their HTML version', () => {
    expect(plainTextToEmailHTML('<Booking>\nConfirmed')).toBe('&lt;Booking&gt;<br />Confirmed')
  })

  it('sanitizes Payload placeholders and produces branded multipart email content', () => {
    const message = improveEmailMessage({
      html: '<p>Hello <span>unknown node</span>traveller.</p>',
      subject: 'Hello',
      to: 'traveller@example.com',
    })

    expect(message.html).toContain('data-colleagues-email="true"')
    expect(message.html).not.toContain('unknown node')
    expect(message.text).toContain('Hello traveller.')
    expect(message.text).toContain('COLLEAGUES TRAVEL & TOURS')
    expect(sanitizeEmailHTML('<span>unknown node</span>Welcome')).toBe('Welcome')
    expect(emailHTMLToPlainText('<p>One</p><p>Two &amp; three</p>')).toBe('One\nTwo & three')
  })

  it('creates a branded HTML alternative for text-only emails', () => {
    const message = improveEmailMessage({
      subject: 'Plain message',
      text: '<Your booking>\nConfirmed',
      to: 'traveller@example.com',
    })

    expect(message.html).toContain('data-colleagues-email="true"')
    expect(message.html).toContain('&lt;Your booking&gt;<br />Confirmed')
    expect(message.text).toContain('<Your booking>\nConfirmed')
  })
})
