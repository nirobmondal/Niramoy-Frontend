"use client"

import { useMemo } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { buildUpdatedQueryString } from "@/components/medicine/search-param-utils"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

type MedicinePaginationProps = {
  currentPage: number
  totalPages: number
}

export function MedicinePagination({ currentPage, totalPages }: MedicinePaginationProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const pages = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, index) => index + 1)
    }

    const visible = new Set<number>([1, totalPages, currentPage - 1, currentPage, currentPage + 1])
    return Array.from(visible)
      .filter((page) => page >= 1 && page <= totalPages)
      .sort((a, b) => a - b)
  }, [currentPage, totalPages])

  if (totalPages <= 1) {
    return null
  }

  const goToPage = (page: number) => {
    const nextQuery = buildUpdatedQueryString(searchParams, { page })
    router.push(nextQuery ? `${pathname}?${nextQuery}` : pathname)
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            disabled={currentPage <= 1}
            onClick={() => currentPage > 1 && goToPage(currentPage - 1)}
          />
        </PaginationItem>

        {pages.map((page, index) => {
          const previous = pages[index - 1]
          const hasGap = previous && page - previous > 1

          return [
            hasGap ? (
              <PaginationItem key={`gap-${page}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : null,
            <PaginationItem key={page}>
              <PaginationLink
                isActive={page === currentPage}
                onClick={() => goToPage(page)}
                className={
                  page === currentPage
                    ? "bg-[#0f8f8f] text-white hover:bg-[#0b7c7c]"
                    : "border-[#d8e3ea] bg-white text-[#2d4351] hover:bg-[#ecf3f7]"
                }
              >
                {page}
              </PaginationLink>
            </PaginationItem>,
          ]
        })}

        <PaginationItem>
          <PaginationNext
            disabled={currentPage >= totalPages}
            onClick={() => currentPage < totalPages && goToPage(currentPage + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
