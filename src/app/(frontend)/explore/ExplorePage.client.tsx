'use client'

import React, { useState, useMemo } from 'react'
import { Activity, Package } from '@/payload-types'
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react'
import { cn } from '@/utilities/ui'
import Content from '@/components/ui/Content/Index'
import Cards from '@/components/ui/Card/Cards'
import containerStyles from '@/Styles/container.module.css'
import style from './ExplorePage.module.scss'

interface ExplorePageClientProps {
  initialPackages: Package[]
  activities: Activity[]
}

const TRIP_GRADES = [
  { label: 'Easy', value: 'easy' },
  { label: 'Moderate', value: 'moderate' },
  { label: 'Difficult', value: 'difficult' },
  { label: 'Strenuous', value: 'strenuous' },
]

export const ExplorePageClient: React.FC<ExplorePageClientProps> = ({ 
  initialPackages, 
  activities 
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedActivities, setSelectedActivities] = useState<number[]>([])
  const [selectedGrades, setSelectedGrades] = useState<string[]>([])
  const [selectedDurations, setSelectedDurations] = useState<string[]>([])
  const [selectedElevations, setSelectedElevations] = useState<string[]>([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Extract unique durations and elevations
  const durations = useMemo(() => {
    const all = initialPackages.map(p => p.tripDuration).filter(Boolean) as string[]
    return Array.from(new Set(all)).sort()
  }, [initialPackages])

  const elevations = useMemo(() => {
    const all = initialPackages.map(p => p.elevation).filter(Boolean) as string[]
    return Array.from(new Set(all)).sort()
  }, [initialPackages])

  const filteredPackages = useMemo(() => {
    return initialPackages.filter(pkg => {
      const matchesSearch = pkg.title.toLowerCase().includes(searchQuery.toLowerCase())
      const pkgActivityIds = pkg.Activity?.map(a => typeof a === 'object' ? a.id : a) || []
      const matchesActivity = selectedActivities.length === 0 || 
        selectedActivities.some(id => pkgActivityIds.includes(id))
      const matchesGrade = selectedGrades.length === 0 || 
        (pkg.tripGrade && selectedGrades.includes(pkg.tripGrade))
      const matchesDuration = selectedDurations.length === 0 || 
        (pkg.tripDuration && selectedDurations.includes(pkg.tripDuration))
      const matchesElevation = selectedElevations.length === 0 || 
        (pkg.elevation && selectedElevations.includes(pkg.elevation))

      return matchesSearch && matchesActivity && matchesGrade && matchesDuration && matchesElevation
    })
  }, [initialPackages, searchQuery, selectedActivities, selectedGrades, selectedDurations, selectedElevations])

  const toggleFilter = <T,>(id: T, list: T[], setList: React.Dispatch<React.SetStateAction<T[]>>) => {
    setList(list.includes(id) ? list.filter((item) => item !== id) : [...list, id])
  }

  const clearFilters = () => {
    setSelectedActivities([])
    setSelectedGrades([])
    setSelectedDurations([])
    setSelectedElevations([])
    setSearchQuery('')
  }

  const selectedItems = filteredPackages.map(pkg => ({
    relationTo: 'packages' as const,
    value: pkg,
  }))

  const activeFilterCount = 
    (selectedActivities.length > 0 ? 1 : 0) + 
    (selectedGrades.length > 0 ? 1 : 0) + 
    (selectedDurations.length > 0 ? 1 : 0) + 
    (selectedElevations.length > 0 ? 1 : 0) + 
    (searchQuery ? 1 : 0)

  return (
    <div className={style.explore}>
      <Content>
        <div className={cn(containerStyles.container, style.layout)}>
          {/* Mobile Toggle */}
          <button 
            className={style.mobileFilterBtn}
            onClick={() => setIsSidebarOpen(true)}
          >
            <Filter size={18} />
            Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </button>

          {/* Sidebar */}
          <aside className={cn(style.filterSidebar, isSidebarOpen && style.sidebarOpen)}>
            <div className={style.sidebarHeader}>
              <h2 className={style.sidebarTitle}>Filters</h2>
              <button onClick={() => setIsSidebarOpen(false)} className={style.closeBtn}><X size={24} /></button>
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
                  <input
                    type="text"
                    placeholder="Search trip name..."
                    className={style.searchInput}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Activities Group */}
              <div className={style.formGroup}>
                <p className={style.groupLabel}>Activities</p>
                <div className={style.checkboxGroup}>
                  {activities.map(activity => (
                    <label key={activity.id} className={style.checkboxLabel}>
                      <input 
                        type="checkbox" 
                        checked={selectedActivities.includes(activity.id)}
                        onChange={() => toggleFilter(activity.id, selectedActivities, setSelectedActivities)}
                      />
                      <span>{activity.title}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Grade Group */}
              <div className={style.formGroup}>
                <p className={style.groupLabel}>Trip Grade</p>
                <div className={style.checkboxGroup}>
                  {TRIP_GRADES.map(grade => (
                    <label key={grade.value} className={style.checkboxLabel}>
                      <input 
                        type="checkbox" 
                        checked={selectedGrades.includes(grade.value)}
                        onChange={() => toggleFilter(grade.value, selectedGrades, setSelectedGrades)}
                      />
                      <span>{grade.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Duration Group */}
              {durations.length > 0 && (
                <div className={style.formGroup}>
                  <p className={style.groupLabel}>Duration</p>
                  <div className={style.checkboxGroup}>
                    {durations.map(duration => (
                      <label key={duration} className={style.checkboxLabel}>
                        <input 
                          type="checkbox" 
                          checked={selectedDurations.includes(duration)}
                          onChange={() => toggleFilter(duration, selectedDurations, setSelectedDurations)}
                        />
                        <span>{duration}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Elevation Group */}
              {elevations.length > 0 && (
                <div className={style.formGroup}>
                  <p className={style.groupLabel}>Elevation</p>
                  <div className={style.checkboxGroup}>
                    {elevations.map(elevation => (
                      <label key={elevation} className={style.checkboxLabel}>
                        <input 
                          type="checkbox" 
                          checked={selectedElevations.includes(elevation)}
                          onChange={() => toggleFilter(elevation, selectedElevations, setSelectedElevations)}
                        />
                        <span>{elevation}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className={style.actionRow}>
                <button className={style.clearButton} onClick={clearFilters}>
                  Clear All Filters
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
              <Cards
                collection="packages"
                selectedItems={selectedItems}
                variant="packagesCard"
                columns="3"
              />
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
