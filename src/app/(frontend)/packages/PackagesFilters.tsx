'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

type TripFactField =
  | 'tripDuration'
  | 'tripGrade'
  | 'bestSeason'
  | 'perDayHiking'
  | 'elevation'
  | 'accommodation'
  | 'transportation'

type ActivityOption = {
  id: string
  title: string
}

type PackagesFiltersProps = {
  selectedActivityIds: string[]
  selectedTripFacts: Record<TripFactField, string | undefined>
  activities: ActivityOption[]
  tripFactFields: TripFactField[]
  tripFactLabels: Record<TripFactField, string>
  tripFactOptions: Record<TripFactField, string[]>
  styles: Record<string, string>
}

export function PackagesFilters({
  selectedActivityIds,
  selectedTripFacts,
  activities,
  tripFactFields,
  tripFactLabels,
  tripFactOptions,
  styles,
}: PackagesFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const currentParams = useSearchParams()
  const isResettingRef = useRef(false)

  const [selectedActivities, setSelectedActivities] = useState<string[]>(selectedActivityIds)
  const [facts, setFacts] = useState<Record<TripFactField, string | undefined>>(selectedTripFacts)

  useEffect(() => {
    setSelectedActivities(selectedActivityIds)
  }, [selectedActivityIds])

  useEffect(() => {
    setFacts(selectedTripFacts)
  }, [selectedTripFacts])

  const buildUrl = useMemo(() => {
    return (nextActivities: string[], nextFacts: Record<TripFactField, string | undefined>) => {
      const params = new URLSearchParams(currentParams.toString())

      params.delete('page')
      params.delete('activity')
      nextActivities.forEach((id) => params.append('activity', id))

      tripFactFields.forEach((field) => {
        const value = nextFacts[field]
        if (value) params.set(field, value)
      })

      const queryString = params.toString()
      return queryString ? `${pathname}?${queryString}` : pathname
    }
  }, [currentParams, pathname, tripFactFields])

  useEffect(() => {
    if (isResettingRef.current) {
      isResettingRef.current = false
      return
    }

    const timeout = setTimeout(() => {
      const nextUrl = buildUrl(selectedActivities, facts)
      const currentQuery = currentParams.toString()
      const currentUrl = currentQuery ? `${pathname}?${currentQuery}` : pathname

      if (nextUrl !== currentUrl) {
        router.replace(nextUrl, { scroll: false })
      }
    }, 250)

    return () => clearTimeout(timeout)
  }, [buildUrl, currentParams, facts, pathname, router, selectedActivities])

  return (
    <form className={styles.filterForm} onSubmit={(event) => event.preventDefault()}>
      <div className={styles.filterHead}>
        <h3 className={styles.filterTitle}>Filter Packages</h3>
        <p className={styles.filterSubtitle}>Refine packages by activity and trip facts.</p>
      </div>

      <div className={styles.formGroup}>
        <p className={styles.groupLabel}>Activities</p>
        <div className={styles.checkboxGroup}>
          {activities.map((activity) => (
            <label key={activity.id} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                value={activity.id}
                checked={selectedActivities.includes(activity.id)}
                onChange={(event) => {
                  const checked = event.target.checked
                  setSelectedActivities((previous) => {
                    if (checked) return [...previous, activity.id]
                    return previous.filter((id) => id !== activity.id)
                  })
                }}
              />
              <span>{activity.title}</span>
            </label>
          ))}
        </div>
      </div>

      <div className={styles.formGroup}>
        <p className={styles.groupLabel}>Trip Facts</p>
        {tripFactFields.map((field) => (
          <label key={field} className={styles.selectLabel}>
            <span>{tripFactLabels[field]}</span>
            <select
              value={facts[field] ?? ''}
              onChange={(event) => {
                const value = event.target.value
                setFacts((previous) => ({
                  ...previous,
                  [field]: value || undefined,
                }))
              }}
              className={styles.select}
            >
              <option value="">All</option>
              {tripFactOptions[field].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>

      <div className={styles.actionRow}>
        <button
          type="button"
          className={styles.clearButton}
          onClick={() => {
            isResettingRef.current = true
            setSelectedActivities([])
            setFacts({
              tripDuration: undefined,
              tripGrade: undefined,
              bestSeason: undefined,
              perDayHiking: undefined,
              elevation: undefined,
              accommodation: undefined,
              transportation: undefined,
            })
            router.replace(pathname, { scroll: false })
          }}
        >
          Clear Filters
        </button>
      </div>
    </form>
  )
}
