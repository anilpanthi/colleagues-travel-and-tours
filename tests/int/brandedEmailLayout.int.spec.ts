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
  contactNumbers: ['+977 01-5910770', '+977 98510 00001', '+977 98010 00002'],
  emailAddress: 'info@colleaguestravel.com',
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
    expect(html).toContain('Explore more. Experience better.')
    expect(html).toContain('tel:+977015910770')
    expect(html).toContain('+977 98510 00001')
    expect(html).toContain('mailto:info@colleaguestravel.com')
    expect(html).toMatch(
      /href="https:\/\/colleaguestravel\.com"[^>]*target="_blank" rel="noopener noreferrer"/,
    )
    expect(html).not.toMatch(
      /href="tel:\+977015910770"[^>]*target="_blank" rel="noopener noreferrer"/,
    )
    expect(html).toContain('&copy; 2026 Colleagues Travel &amp; Tours')
  })

  it('opens web links from the message content in a new tab', () => {
    const html = buildBrandedEmailHTML(
      '<p><a href="https://example.com/package" target="_self">View package</a></p>',
      layoutOptions,
    )

    expect(html).toContain(
      'href="https://example.com/package" target="_blank" rel="noopener noreferrer"',
    )
    expect(html).not.toContain('target="_self"')
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
    expect(text).toContain('Explore more. Experience better.')
    expect(text).toContain('Your enquiry was received.')
    expect(text).toContain('Phone: +977 01-5910770 · +977 98510 00001 · +977 98010 00002')
    expect(text).toContain('Email: info@colleaguestravel.com')
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
