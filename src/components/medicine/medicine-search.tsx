"use client"

import { Search } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useRef } from "react"

import { buildUpdatedQueryString } from "@/components/medicine/search-param-utils"
import { Input } from "@/components/ui/input"

const SEARCH_DEBOUNCE_MS = 300

export function MedicineSearch() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const currentSearch = searchParams.get("search") ?? ""

  return (
    <label htmlFor="medicine-search" className="relative block w-full max-w-md">
      <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-[#8ba0ad]" />
      <Input
        key={currentSearch}
        id="medicine-search"
        aria-label="Search medicines by name"
        placeholder="Search medicine by name"
        className="h-9 rounded-lg border-[#d8e3ea] bg-[#f8fbfd] pl-8 text-[#2b4352] placeholder:text-[#8ba0ad]"
        defaultValue={currentSearch}
        onChange={(event) => {
          if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current)
          }

          const nextValue = event.target.value
          debounceTimeoutRef.current = setTimeout(() => {
            const nextQuery = buildUpdatedQueryString(searchParams, {
              search: nextValue.trim() || null,
              page: 1,
            })
            router.push(nextQuery ? `${pathname}?${nextQuery}` : pathname)
          }, SEARCH_DEBOUNCE_MS)
        }}
      />
    </label>
  )
}
