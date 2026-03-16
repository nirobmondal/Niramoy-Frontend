"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { buildUpdatedQueryString } from "@/components/medicine/search-param-utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { SortOption } from "@/types/medicine"

type MedicineSortProps = {
  value?: SortOption
}

export function MedicineSort({ value }: MedicineSortProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium text-[#6f8390]">Sort by:</span>
      <Select
        value={value ?? "newest"}
        onValueChange={(nextValue) => {
          const nextQuery = buildUpdatedQueryString(searchParams, {
            sort: nextValue,
            page: 1,
          })
          router.push(nextQuery ? `${pathname}?${nextQuery}` : pathname)
        }}
      >
        <SelectTrigger aria-label="Sort medicines" className="h-9 w-[180px] border-[#d8e3ea] bg-[#f8fbfd] text-[#2b4352]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="price_asc">Price: Low to High</SelectItem>
          <SelectItem value="price_desc">Price: High to Low</SelectItem>
          <SelectItem value="newest">Newest Arrivals</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
