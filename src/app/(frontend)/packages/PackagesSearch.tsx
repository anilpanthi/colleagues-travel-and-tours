'use client'

import { useEffect, useMemo, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

type PackagesSearchProps = {
  searchQuery?: string
  styles: Record<string, string>
}

export function PackagesSearch({ searchQuery, styles }: PackagesSearchProps) {
  const router = useRouter()
  const pathname = usePathname()
  const currentParams = useSearchParams()
  const [query, setQuery] = useState(searchQuery ?? '')

  useEffect(() => {
    setQuery(searchQuery ?? '')
  }, [searchQuery])

  const buildUrl = useMemo(() => {
    return (nextQuery: string) => {
      const params = new URLSearchParams(currentParams.toString())
      params.delete('page')

      if (nextQuery.trim()) params.set('q', nextQuery.trim())
      else params.delete('q')

      const queryString = params.toString()
      return queryString ? `${pathname}?${queryString}` : pathname
    }
  }, [currentParams, pathname])

  useEffect(() => {
    const timeout = setTimeout(() => {
      const nextUrl = buildUrl(query)
      const currentQuery = currentParams.toString()
      const currentUrl = currentQuery ? `${pathname}?${currentQuery}` : pathname

      if (nextUrl !== currentUrl) {
        router.replace(nextUrl, { scroll: false })
      }
    }, 250)

    return () => clearTimeout(timeout)
  }, [buildUrl, currentParams, pathname, query, router])

  return (
    <div className={styles.searchBar}>
      <label htmlFor="packages-top-search" className={styles.searchLabel}>
        Search packages
      </label>
      <input
        id="packages-top-search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search by package title or description..."
        className={styles.searchInput}
      />
    </div>
  )
}
