import { cleanup, fireEvent, render } from '@testing-library/react'
import Link from 'next/link'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { ProgressBar } from '@/components/ProgressBar'

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

describe('route progress bar', () => {
  afterEach(() => {
    cleanup()
  })

  it('does not start when a touch begins over a link during mobile scrolling', () => {
    const { getByRole } = render(
      <>
        <ProgressBar />
        <Link href="/packages">
          <span>Packages</span>
        </Link>
      </>,
    )

    fireEvent.pointerDown(getByRole('link', { name: 'Packages' }))

    expect(document.getElementById('route-progress-bar')).toBeNull()
  })
})
