import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import * as React from 'react'
import Link from 'next/link'
import styles from './pagination.module.scss'

const Pagination = ({ className, ...props }: React.ComponentProps<'nav'>) => (
  <nav
    aria-label="pagination"
    className={`${styles.pagination} ${className || ''}`}
    role="navigation"
    {...props}
  />
)

const PaginationContent: React.FC<
  { ref?: React.Ref<HTMLUListElement> } & React.HTMLAttributes<HTMLUListElement>
> = ({ className, ref, ...props }) => (
  <ul className={`${styles.content} ${className || ''}`} ref={ref} {...props} />
)

const PaginationItem: React.FC<
  { ref?: React.Ref<HTMLLIElement> } & React.HTMLAttributes<HTMLLIElement>
> = ({ className, ref, ...props }) => <li className={`${styles.item} ${className || ''}`} ref={ref} {...props} />

type PaginationLinkProps = {
  isActive?: boolean
  size?: 'default' | 'icon'
  href?: string
  disabled?: boolean
} & React.ComponentProps<'button'>

const PaginationLink = ({ className, isActive, size = 'icon', href, disabled, ...props }: PaginationLinkProps) => {
  const ariaCurrent = isActive ? ('page' as const) : undefined
  const combinedClassName = `${styles.link} ${isActive ? styles.active : ''} ${size === 'icon' ? styles.icon : ''} ${className || ''}`

  if (href && !disabled) {
    return (
      <Link 
        href={href} 
        aria-current={ariaCurrent} 
        className={combinedClassName}
        {...(props as React.ComponentPropsWithoutRef<'button'> as any)} 
      />
    )
  }

  return (
    <button 
      disabled={disabled} 
      aria-current={ariaCurrent} 
      className={combinedClassName} 
      {...props} 
    />
  )
}

const PaginationPrevious = ({
  className,
  href,
  disabled,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to previous page"
    className={`${styles.previous} ${className || ''}`}
    size="default"
    href={href}
    disabled={disabled}
    {...props}
  >
    <ChevronLeft size={16} />
    <span>Previous</span>
  </PaginationLink>
)

const PaginationNext = ({ 
  className, 
  href,
  disabled,
  ...props 
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to next page"
    className={`${styles.next} ${className || ''}`}
    size="default"
    href={href}
    disabled={disabled}
    {...props}
  >
    <span>Next</span>
    <ChevronRight size={16} />
  </PaginationLink>
)

const PaginationEllipsis = ({ className, ...props }: React.ComponentProps<'span'>) => (
  <span
    aria-hidden
    className={`${styles.ellipsis} ${className || ''}`}
    {...props}
  >
    <MoreHorizontal size={16} />
    <span className="sr-only">More pages</span>
  </span>
)

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
