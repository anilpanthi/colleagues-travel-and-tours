'use client'

import { ChevronDown, ExternalLink, Search, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'

import type { FormSubmission } from '@/payload-types'

import { reservationStatusChangedEvent } from '../FormDataNav'

type ReservationStatus = NonNullable<FormSubmission['status']>
type StatusFilter = ReservationStatus | 'all'

const statusLabels: Record<ReservationStatus, string> = {
  cancelled: 'Cancelled',
  confirmed: 'Confirmed',
  'in-progress': 'In progress',
  new: 'New',
}

const statuses: ReservationStatus[] = ['new', 'in-progress', 'confirmed', 'cancelled']
const statusPriority: Record<ReservationStatus, number> = {
  new: 0,
  'in-progress': 1,
  confirmed: 2,
  cancelled: 3,
}
const reservationsPerPage = 15

const getFields = (reservation: FormSubmission) =>
  Object.fromEntries(
    (reservation.submissionData ?? []).map(({ field, value }) => [
      field.trim().toLowerCase(),
      value,
    ]),
  )

const findField = (reservation: FormSubmission, candidates: string[]) => {
  const fields = getFields(reservation)
  const exactMatch = candidates.find((candidate) => fields[candidate])
  if (exactMatch) return fields[exactMatch]

  const partialMatch = Object.entries(fields).find(([field]) =>
    candidates.some((candidate) => field.includes(candidate)),
  )
  return partialMatch?.[1] ?? '—'
}

const getStatus = (reservation: FormSubmission): ReservationStatus => reservation.status ?? 'new'

const formatDate = (date: string) =>
  new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeZone: 'Asia/Kathmandu',
    timeStyle: 'short',
  }).format(new Date(date))

interface Props {
  adminRoute: string
  initialReservations: FormSubmission[]
}

export default function FlightReservationManager({ adminRoute, initialReservations }: Props) {
  const [reservations, setReservations] = useState(initialReservations)
  const [expandedID, setExpandedID] = useState<number | null>(null)
  const [filter, setFilter] = useState<StatusFilter>('all')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [savingID, setSavingID] = useState<number | null>(null)
  const [deletingID, setDeletingID] = useState<number | null>(null)
  const [selectedIDs, setSelectedIDs] = useState<Set<number>>(new Set())
  const [bulkStatus, setBulkStatus] = useState<ReservationStatus>('in-progress')
  const [bulkBusy, setBulkBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const counts = useMemo(
    () =>
      reservations.reduce<Record<ReservationStatus, number>>(
        (result, reservation) => {
          result[getStatus(reservation)] += 1
          return result
        },
        { cancelled: 0, confirmed: 0, 'in-progress': 0, new: 0 },
      ),
    [reservations],
  )

  const filteredReservations = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return reservations
      .filter((reservation) => {
        if (filter !== 'all' && getStatus(reservation) !== filter) return false
        if (!normalizedQuery) return true

        return (
          String(reservation.id).includes(normalizedQuery) ||
          reservation.submissionData?.some(
            ({ field, value }) =>
              field.toLowerCase().includes(normalizedQuery) ||
              value.toLowerCase().includes(normalizedQuery),
          )
        )
      })
      .sort((first, second) => {
        const priorityDifference =
          statusPriority[getStatus(first)] - statusPriority[getStatus(second)]

        if (priorityDifference !== 0) return priorityDifference
        return new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime()
      })
  }, [filter, query, reservations])
  const totalPages = Math.max(1, Math.ceil(filteredReservations.length / reservationsPerPage))
  const currentPage = Math.min(page, totalPages)
  const pageStart = (currentPage - 1) * reservationsPerPage
  const paginatedReservations = filteredReservations.slice(
    pageStart,
    pageStart + reservationsPerPage,
  )

  const updateStatus = async (id: number, status: ReservationStatus) => {
    const previousReservations = reservations
    setError(null)
    setSavingID(id)
    setReservations((current) =>
      current.map((reservation) => (reservation.id === id ? { ...reservation, status } : reservation)),
    )

    try {
      const response = await fetch(`/api/form-submissions/${id}`, {
        body: JSON.stringify({ status }),
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        method: 'PATCH',
      })

      if (!response.ok) {
        const result: unknown = await response.json().catch(() => null)
        const message =
          result &&
          typeof result === 'object' &&
          'errors' in result &&
          Array.isArray(result.errors) &&
          result.errors[0] &&
          typeof result.errors[0] === 'object' &&
          'message' in result.errors[0] &&
          typeof result.errors[0].message === 'string'
            ? result.errors[0].message
            : 'Status update failed'

        throw new Error(message)
      }

      window.dispatchEvent(new Event(reservationStatusChangedEvent))
    } catch (updateError) {
      setReservations(previousReservations)
      setError(
        updateError instanceof Error
          ? `The reservation status could not be updated: ${updateError.message}`
          : 'The reservation status could not be updated. Please try again.',
      )
    } finally {
      setSavingID(null)
    }
  }

  const deleteReservation = async (reservation: FormSubmission) => {
    const passenger = findField(reservation, ['full name', 'name', 'passenger'])
    if (!window.confirm(`Delete flight reservation #${reservation.id} for ${passenger}?`)) return

    setError(null)
    setDeletingID(reservation.id)

    try {
      const response = await fetch(`/api/form-submissions/${reservation.id}`, {
        credentials: 'same-origin',
        method: 'DELETE',
      })

      if (!response.ok) {
        const result: unknown = await response.json().catch(() => null)
        const message =
          result &&
          typeof result === 'object' &&
          'errors' in result &&
          Array.isArray(result.errors) &&
          result.errors[0] &&
          typeof result.errors[0] === 'object' &&
          'message' in result.errors[0] &&
          typeof result.errors[0].message === 'string'
            ? result.errors[0].message
            : 'Delete failed'

        throw new Error(message)
      }

      setReservations((current) => current.filter(({ id }) => id !== reservation.id))
      setExpandedID((current) => (current === reservation.id ? null : current))
      window.dispatchEvent(new Event(reservationStatusChangedEvent))
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? `The reservation could not be deleted: ${deleteError.message}`
          : 'The reservation could not be deleted. Please try again.',
      )
    } finally {
      setDeletingID(null)
    }
  }

  const toggleSelection = (id: number) => {
    setSelectedIDs((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleCurrentPage = () => {
    const pageIDs = paginatedReservations.map(({ id }) => id)
    const allSelected = pageIDs.every((id) => selectedIDs.has(id))

    setSelectedIDs((current) => {
      const next = new Set(current)
      pageIDs.forEach((id) => {
        if (allSelected) next.delete(id)
        else next.add(id)
      })
      return next
    })
  }

  const bulkUpdateStatus = async () => {
    const ids = [...selectedIDs]
    if (ids.length === 0) return

    setBulkBusy(true)
    setError(null)
    const results = await Promise.allSettled(
      ids.map(async (id) => {
        const response = await fetch(`/api/form-submissions/${id}`, {
          body: JSON.stringify({ status: bulkStatus }),
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json' },
          method: 'PATCH',
        })
        if (!response.ok) throw new Error(`Unable to update reservation #${id}`)
        return id
      }),
    )
    const updatedIDs = new Set(
      results.flatMap((result) => (result.status === 'fulfilled' ? [result.value] : [])),
    )

    setReservations((current) =>
      current.map((reservation) =>
        updatedIDs.has(reservation.id) ? { ...reservation, status: bulkStatus } : reservation,
      ),
    )
    setSelectedIDs((current) => new Set([...current].filter((id) => !updatedIDs.has(id))))
    if (updatedIDs.size !== ids.length) {
      setError(`${ids.length - updatedIDs.size} selected reservations could not be updated.`)
    }
    window.dispatchEvent(new Event(reservationStatusChangedEvent))
    setBulkBusy(false)
  }

  const bulkDelete = async () => {
    const ids = [...selectedIDs]
    if (
      ids.length === 0 ||
      !window.confirm(
        `Permanently delete ${ids.length} selected flight ${
          ids.length === 1 ? 'reservation' : 'reservations'
        }?`,
      )
    ) {
      return
    }

    setBulkBusy(true)
    setError(null)
    const results = await Promise.allSettled(
      ids.map(async (id) => {
        const response = await fetch(`/api/form-submissions/${id}`, {
          credentials: 'same-origin',
          method: 'DELETE',
        })
        if (!response.ok) throw new Error(`Unable to delete reservation #${id}`)
        return id
      }),
    )
    const deletedIDs = new Set(
      results.flatMap((result) => (result.status === 'fulfilled' ? [result.value] : [])),
    )

    setReservations((current) => current.filter(({ id }) => !deletedIDs.has(id)))
    setSelectedIDs((current) => new Set([...current].filter((id) => !deletedIDs.has(id))))
    if (deletedIDs.size !== ids.length) {
      setError(`${ids.length - deletedIDs.size} selected reservations could not be deleted.`)
    }
    window.dispatchEvent(new Event(reservationStatusChangedEvent))
    setBulkBusy(false)
  }

  return (
    <main className="flight-reservation-view">
      <div className="flight-reservation-view__heading">
        <div>
          <p className="flight-reservation-view__eyebrow">Form Data</p>
          <h1>Flight reservations</h1>
          <p className="flight-reservation-view__intro">
            Review passenger requests and keep every booking moving.
          </p>
        </div>
        <span className="flight-reservation-view__total">{reservations.length} total</span>
      </div>

      <section className="flight-reservation-view__stats" aria-label="Flight reservation summary">
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => {
              setFilter(status)
              setPage(1)
            }}
            type="button"
          >
            <span>{statusLabels[status]}</span>
            <strong>{counts[status]}</strong>
          </button>
        ))}
      </section>

      <section className="flight-reservation-view__panel">
        <div className="flight-reservation-view__toolbar">
          <div className="flight-reservation-view__search">
            <Search aria-hidden size={18} />
            <input
              aria-label="Search reservations"
              onChange={(event) => {
                setQuery(event.target.value)
                setPage(1)
              }}
              placeholder="Search passenger, email, route…"
              type="search"
              value={query}
            />
          </div>
          <select
            aria-label="Filter by status"
            onChange={(event) => {
              setFilter(event.target.value as StatusFilter)
              setPage(1)
            }}
            value={filter}
          >
            <option value="all">All statuses</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {statusLabels[status]} ({counts[status]})
              </option>
            ))}
          </select>
        </div>

        {error && <p className="flight-reservation-view__error">{error}</p>}

        {selectedIDs.size > 0 && (
          <div className="flight-reservation-view__bulk-actions">
            <strong>{selectedIDs.size} selected</strong>
            <select
              aria-label="Bulk reservation status"
              disabled={bulkBusy}
              onChange={(event) => setBulkStatus(event.target.value as ReservationStatus)}
              value={bulkStatus}
            >
              {statuses.map((status) => (
                <option key={status} value={status}>{statusLabels[status]}</option>
              ))}
            </select>
            <button disabled={bulkBusy} onClick={() => void bulkUpdateStatus()} type="button">
              Change status
            </button>
            <button
              className="flight-reservation-view__bulk-delete"
              disabled={bulkBusy}
              onClick={() => void bulkDelete()}
              type="button"
            >
              <Trash2 aria-hidden size={15} />
              Delete selected
            </button>
          </div>
        )}

        {filteredReservations.length === 0 ? (
          <div className="flight-reservation-view__empty">
            <h2>No reservations found</h2>
            <p>{reservations.length ? 'Try changing the search or status filter.' : 'New flight requests will appear here.'}</p>
          </div>
        ) : (
          <div className="flight-reservation-view__table-wrap">
            <table>
              <thead>
                <tr>
                  <th className="flight-reservation-view__selection">
                    <input
                      aria-label="Select all reservations on this page"
                      checked={
                        paginatedReservations.length > 0 &&
                        paginatedReservations.every(({ id }) => selectedIDs.has(id))
                      }
                      onChange={toggleCurrentPage}
                      type="checkbox"
                    />
                    <span>SN</span>
                  </th>
                  <th>Passenger</th>
                  <th>Route</th>
                  <th>Travel date</th>
                  <th>Submitted</th>
                  <th>Status</th>
                  <th><span className="visually-hidden">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {paginatedReservations.map((reservation, index) => {
                  const isExpanded = expandedID === reservation.id
                  return (
                    <ReservationRows
                      adminRoute={adminRoute}
                      isExpanded={isExpanded}
                      key={reservation.id}
                      onStatusChange={(status) => void updateStatus(reservation.id, status)}
                      onDelete={() => void deleteReservation(reservation)}
                      onSelect={() => toggleSelection(reservation.id)}
                      onToggle={() => setExpandedID(isExpanded ? null : reservation.id)}
                      reservation={reservation}
                      selected={selectedIDs.has(reservation.id)}
                      serialNumber={pageStart + index + 1}
                      deleting={deletingID === reservation.id}
                      saving={savingID === reservation.id}
                    />
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {filteredReservations.length > 0 && (
          <div className="flight-reservation-view__pagination">
            <p>
              Showing {pageStart + 1}–
              {Math.min(pageStart + reservationsPerPage, filteredReservations.length)} of{' '}
              {filteredReservations.length}
            </p>
            <div aria-label="Reservation pagination" role="navigation">
              <button
                disabled={currentPage === 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                type="button"
              >
                Previous
              </button>
              {getVisiblePages(currentPage, totalPages).map((pageNumber) => (
                <button
                  aria-current={pageNumber === currentPage ? 'page' : undefined}
                  className={pageNumber === currentPage ? 'is-current' : undefined}
                  key={pageNumber}
                  onClick={() => setPage(pageNumber)}
                  type="button"
                >
                  {pageNumber}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                type="button"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  )
}

function getVisiblePages(currentPage: number, totalPages: number) {
  const firstPage = Math.max(1, Math.min(currentPage - 2, totalPages - 4))
  const lastPage = Math.min(totalPages, firstPage + 4)

  return Array.from({ length: lastPage - firstPage + 1 }, (_, index) => firstPage + index)
}

interface ReservationRowsProps {
  adminRoute: string
  deleting: boolean
  isExpanded: boolean
  onDelete: () => void
  onSelect: () => void
  onStatusChange: (status: ReservationStatus) => void
  onToggle: () => void
  reservation: FormSubmission
  selected: boolean
  serialNumber: number
  saving: boolean
}

function ReservationRows({
  adminRoute,
  deleting,
  isExpanded,
  onDelete,
  onSelect,
  onStatusChange,
  onToggle,
  reservation,
  selected,
  serialNumber,
  saving,
}: ReservationRowsProps) {
  const passenger = findField(reservation, ['full name', 'name', 'passenger'])
  const origin = findField(reservation, ['departure city', 'from', 'origin'])
  const destination = findField(reservation, ['arrival city', 'to', 'destination'])
  const travelDate = findField(reservation, ['departure date', 'travel date', 'date'])

  return (
    <>
      <tr className={isExpanded ? 'is-expanded' : undefined}>
        <td className="flight-reservation-view__selection">
          <input
            aria-label={`Select reservation ${reservation.id}`}
            checked={selected}
            onChange={onSelect}
            type="checkbox"
          />
          <span>{serialNumber}</span>
        </td>
        <td>
          <strong>{passenger}</strong>
          <small>#{reservation.id} · {findField(reservation, ['email'])}</small>
        </td>
        <td>{origin} <span aria-hidden>→</span> {destination}</td>
        <td>{travelDate}</td>
        <td>{formatDate(reservation.createdAt)}</td>
        <td>
          <select
            aria-label={`Status for reservation ${reservation.id}`}
            className={`status-select status-select--${getStatus(reservation)}`}
            disabled={saving}
            onChange={(event) => onStatusChange(event.target.value as ReservationStatus)}
            value={getStatus(reservation)}
          >
            {statuses.map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}
          </select>
        </td>
        <td>
          <div className="flight-reservation-view__actions">
            <a
              aria-label={`Edit reservation ${reservation.id}`}
              href={`${adminRoute}/collections/form-submissions/${reservation.id}`}
            >
              Edit <ExternalLink aria-hidden size={14} />
            </a>
            <button aria-expanded={isExpanded} onClick={onToggle} type="button">
              View <ChevronDown aria-hidden className={isExpanded ? 'is-rotated' : undefined} size={16} />
            </button>
            <button
              aria-label={`Delete reservation ${reservation.id}`}
              className="flight-reservation-view__delete"
              disabled={deleting}
              onClick={onDelete}
              type="button"
            >
              <Trash2 aria-hidden size={14} />
              {deleting ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        </td>
      </tr>
      {isExpanded && (
        <tr className="flight-reservation-view__details-row">
          <td colSpan={7}>
            <div className="flight-reservation-view__details">
              {(reservation.submissionData ?? []).map(({ field, id, value }) => (
                <div key={id ?? field}>
                  <span>{field}</span>
                  <strong>{value || '—'}</strong>
                </div>
              ))}
            </div>
          </td>
        </tr>
      )}
    </>
  )
}
