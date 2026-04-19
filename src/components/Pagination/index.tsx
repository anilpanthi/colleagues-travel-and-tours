'use client'
import {
  Pagination as PaginationComponent,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import styles from '@/components/ui/pagination.module.scss'
export const Pagination: React.FC<{
  className?: string
  page: number
  totalPages: number
  basePath?: string
  queryParams?: Record<string, string | string[] | undefined>
}> = (props) => {
  const { className, page, totalPages, basePath = '/posts', queryParams } = props
  const hasNextPage = page < totalPages
  const hasPrevPage = page > 1

  const hasExtraPrevPages = page - 1 > 1
  const hasExtraNextPages = page + 1 < totalPages

  const getPageHref = (pageNumber: number) => {
    const params = new URLSearchParams()

    Object.entries(queryParams ?? {}).forEach(([key, value]) => {
      if (key === 'page' || value === undefined) return

      if (Array.isArray(value)) {
        value.forEach((item) => {
          if (item) params.append(key, item)
        })
        return
      }

      if (value) {
        params.set(key, value)
      }
    })

    if (pageNumber > 1) {
      params.set('page', String(pageNumber))
    }

    const queryString = params.toString()
    return queryString ? `${basePath}?${queryString}` : basePath
  }

  return (
    <div className={`${styles.wrapper} ${className || ''}`}>
      <PaginationComponent>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              disabled={!hasPrevPage}
              href={hasPrevPage ? getPageHref(page - 1) : undefined}
            />
          </PaginationItem>

          {hasExtraPrevPages && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {hasPrevPage && (
            <PaginationItem>
              <PaginationLink href={getPageHref(page - 1)}>
                {page - 1}
              </PaginationLink>
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationLink
              isActive
              href={getPageHref(page)}
            >
              {page}
            </PaginationLink>
          </PaginationItem>

          {hasNextPage && (
            <PaginationItem>
              <PaginationLink href={getPageHref(page + 1)}>
                {page + 1}
              </PaginationLink>
            </PaginationItem>
          )}

          {hasExtraNextPages && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationNext
              disabled={!hasNextPage}
              href={hasNextPage ? getPageHref(page + 1) : undefined}
            />
          </PaginationItem>
        </PaginationContent>
      </PaginationComponent>
    </div>
  )
}
