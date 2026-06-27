'use client'

import React, { useMemo, useState } from 'react'
import { Activity, Package } from '@/payload-types'
import { Filter, Search, SlidersHorizontal, X } from 'lucide-react'
import { cn } from '@/utilities/ui'
import Content from '@/components/ui/Content/Index'
import Cards from '@/components/ui/Card/Cards'
import { MultiSelect } from '@/components/ui/MultiSelect'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import containerStyles from '@/Styles/container.module.css'
import style from './ExplorePage.module.scss'

interface ExplorePageClientProps {
  initialPackages: Package[]
  activities: Activity[]
}

type TripGrade = NonNullable<Package['tripGrade']>
type BestSeason = NonNullable<Package['bestSeason']>[number]

const TRIP_GRADES: { label: string; value: TripGrade }[] = [
  { label: 'Easy', value: 'easy' },
  { label: 'Moderate', value: 'moderate' },
  { label: 'Difficult', value: 'difficult' },
  { label: 'Strenuous', value: 'strenuous' },
]

const SEASONS: { label: string; value: BestSeason }[] = [
  { label: 'January', value: 'january' },
  { label: 'February', value: 'february' },
  { label: 'March', value: 'march' },
  { label: 'April', value: 'april' },
  { label: 'May', value: 'may' },
  { label: 'June', value: 'june' },
  { label: 'July', value: 'july' },
  { label: 'August', value: 'august' },
  { label: 'September', value: 'september' },
  { label: 'October', value: 'october' },
  { label: 'November', value: 'november' },
  { label: 'December', value: 'december' },
]

export const ExplorePageClient: React.FC<ExplorePageClientProps> = ({
  initialPackages,
  activities,
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedActivities, setSelectedActivities] = useState<number[]>([])
  const [selectedGrades, setSelectedGrades] = useState<TripGrade[]>([])
  const [maxDuration, setMaxDuration] = useState<number | null>(null)
  const [maxElevation, setMaxElevation] = useState<number | null>(null)
  const [selectedSeasons, setSelectedSeasons] = useState<BestSeason[]>([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const ITEMS_PER_PAGE = 6

  // Extract unique durations and elevations
  const durations = useMemo(() => {
    const all = initialPackages.map((p) => p.tripDuration).filter(Boolean) as number[]
    return Array.from(new Set(all)).sort((a, b) => a - b)
  }, [initialPackages])

  const elevations = useMemo(() => {
    const all = initialPackages.map((p) => p.elevation).filter(Boolean) as number[]
    return Array.from(new Set(all)).sort((a, b) => a - b)
  }, [initialPackages])

  const maxTripDuration = durations[durations.length - 1]
  const maxTripElevation = elevations[elevations.length - 1]

  const filteredPackages = useMemo(() => {
    return initialPackages.filter((pkg) => {
      const matchesSearch = pkg.title.toLowerCase().includes(searchQuery.toLowerCase())
      const pkgActivityIds = pkg.Activity?.map((a) => (typeof a === 'object' ? a.id : a)) || []
      const matchesActivity =
        selectedActivities.length === 0 ||
        selectedActivities.some((id) => pkgActivityIds.includes(id))
      const matchesGrade =
        selectedGrades.length === 0 || (pkg.tripGrade && selectedGrades.includes(pkg.tripGrade))
      const matchesDuration =
        maxDuration === null ||
        (pkg.tripDuration !== undefined &&
          pkg.tripDuration !== null &&
          pkg.tripDuration <= maxDuration)
      const matchesElevation =
        maxElevation === null ||
        (pkg.elevation !== undefined && pkg.elevation !== null && pkg.elevation <= maxElevation)
      const matchesSeason =
        selectedSeasons.length === 0 ||
        (pkg.bestSeason && selectedSeasons.some((season) => pkg.bestSeason?.includes(season)))

      return (
        matchesSearch &&
        matchesActivity &&
        matchesGrade &&
        matchesDuration &&
        matchesElevation &&
        matchesSeason
      )
    })
  }, [
    initialPackages,
    searchQuery,
    selectedActivities,
    selectedGrades,
    maxDuration,
    maxElevation,
    selectedSeasons,
  ])

  const toggleFilter = <T,>(
    id: T,
    list: T[],
    setList: React.Dispatch<React.SetStateAction<T[]>>,
  ) => {
    setList(list.includes(id) ? list.filter((item) => item !== id) : [...list, id])
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setSelectedActivities([])
    setSelectedGrades([])
    setMaxDuration(null)
    setMaxElevation(null)
    setSelectedSeasons([])
    setSearchQuery('')
    setCurrentPage(1)
  }

  const selectedItems = filteredPackages.map((pkg) => ({
    relationTo: 'packages' as const,
    value: pkg,
  }))

  const totalPages = Math.ceil(selectedItems.length / ITEMS_PER_PAGE)
  const paginatedItems = selectedItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  )

  const activeFilterCount =
    (selectedActivities.length > 0 ? 1 : 0) +
    (selectedGrades.length > 0 ? 1 : 0) +
    (maxDuration !== null ? 1 : 0) +
    (maxElevation !== null ? 1 : 0) +
    (selectedSeasons.length > 0 ? 1 : 0) +
    (searchQuery ? 1 : 0)

  return (
    <div className={style.explore}>
      <Content>
        <div className={cn(containerStyles.container, style.layout)}>
          {/* Mobile Toggle */}
          <button className={style.mobileFilterBtn} onClick={() => setIsSidebarOpen(true)}>
            <Filter size={18} />
            Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </button>

          {/* Sidebar */}
          <aside className={cn(style.filterSidebar, isSidebarOpen && style.sidebarOpen)}>
            <div className={style.sidebarHeader}>
              <h2 className={style.sidebarTitle}>Filters</h2>
              <button onClick={() => setIsSidebarOpen(false)} className={style.closeBtn}>
                <X size={24} />
              </button>
            </div>

            <div className={style.filterForm}>
              <div className={style.filterHead}>
                <h3 className={style.filterTitle}>
                  <SlidersHorizontal size={18} />
                  Refine Search
                </h3>
              </div>

              {/* Search Group */}
              <div className={style.formGroup}>
                <p className={style.groupLabel}>Search</p>
                <div className={style.searchBar}>
                  <Search size={17} className={style.searchIcon} />
                  <input
                    type="text"
                    placeholder="Search trip name..."
                    className={style.searchInput}
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      setCurrentPage(1)
                    }}
                  />
                </div>
              </div>

              {/* Activities Group */}
              <div className={style.formGroup}>
                <p className={style.groupLabel}>Activities</p>
                <MultiSelect
                  options={activities.map((a) => ({ label: a.title, value: a.id }))}
                  selectedValues={selectedActivities}
                  onChange={(val) =>
                    toggleFilter(val as number, selectedActivities, setSelectedActivities)
                  }
                  placeholder="Select activities..."
                />
              </div>

              {/* Grade Group */}
              <div className={style.formGroup}>
                <p className={style.groupLabel}>Trip Grade</p>
                <div className={style.checkboxGroup}>
                  {TRIP_GRADES.map((grade) => (
                    <label key={grade.value} className={style.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={selectedGrades.includes(grade.value)}
                        onChange={() =>
                          toggleFilter(grade.value, selectedGrades, setSelectedGrades)
                        }
                      />
                      <span>{grade.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Season Group */}
              <div className={style.formGroup}>
                <p className={style.groupLabel}>Best Season</p>
                <MultiSelect
                  options={SEASONS}
                  selectedValues={selectedSeasons}
                  onChange={(val) =>
                    toggleFilter(val as BestSeason, selectedSeasons, setSelectedSeasons)
                  }
                  placeholder="Select seasons..."
                />
              </div>

              {/* Duration Group */}
              {durations.length > 0 && (
                <div className={style.formGroup}>
                  <div className={style.rangeHeader}>
                    <p className={style.groupLabel}>Max Duration</p>
                    <span className={style.rangeValue}>
                      {maxDuration === null ? 'Any' : `Up to ${maxDuration} days`}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={Math.max(2, maxTripDuration || 2)}
                    value={maxDuration === null ? maxTripDuration || 2 : maxDuration}
                    onChange={(e) => {
                      setMaxDuration(Number(e.target.value))
                      setCurrentPage(1)
                    }}
                    className={style.rangeSlider}
                  />
                </div>
              )}

              {/* Elevation Group */}
              {elevations.length > 0 && (
                <div className={style.formGroup}>
                  <div className={style.rangeHeader}>
                    <p className={style.groupLabel}>Max Elevation</p>
                    <span className={style.rangeValue}>
                      {maxElevation === null ? 'Any' : `Up to ${maxElevation}m`}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={Math.max(100, maxTripElevation || 100)}
                    step={100}
                    value={maxElevation === null ? maxTripElevation || 100 : maxElevation}
                    onChange={(e) => {
                      setMaxElevation(Number(e.target.value))
                      setCurrentPage(1)
                    }}
                    className={style.rangeSlider}
                  />
                </div>
              )}

              <div className={style.actionRow}>
                <button className={style.clearButton} onClick={clearFilters}>
                  Clear All Filters
                </button>
                <button className={style.showResultsButton} onClick={() => setIsSidebarOpen(false)}>
                  Show Results
                </button>
              </div>
            </div>
          </aside>

          {/* Results */}
          <div className={style.cardsSection}>
            <div className={style.resultsHeader}>
              <div>
                <h3 className={style.resultsTitle}>Available Packages</h3>
                <p className={style.resultsMeta}>
                  {filteredPackages.length} result{filteredPackages.length === 1 ? '' : 's'}
                </p>
              </div>
              {activeFilterCount > 0 && (
                <span className={style.activeFilterBadge}>
                  {activeFilterCount} active filter{activeFilterCount === 1 ? '' : 's'}
                </span>
              )}
            </div>

            {selectedItems.length > 0 ? (
              <>
                <Cards
                  collection="packages"
                  selectedItems={paginatedItems}
                  variant="packagesCard"
                  columns="3"
                />

                {totalPages > 1 && (
                  <Pagination className={style.paginationWrapper}>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                        />
                      </PaginationItem>

                      {Array.from({ length: totalPages }).map((_, i) => {
                        const page = i + 1
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <PaginationItem key={page}>
                              <PaginationLink
                                isActive={currentPage === page}
                                onClick={() => setCurrentPage(page)}
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          )
                        } else if (page === currentPage - 2 || page === currentPage + 2) {
                          return (
                            <PaginationItem key={page}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          )
                        }
                        return null
                      })}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </>
            ) : (
              <div className={style.emptyState}>
                <h4>No packages found</h4>
                <p>Try changing keywords or clearing one of the selected filters.</p>
              </div>
            )}
          </div>
        </div>
      </Content>
    </div>
  )
}
