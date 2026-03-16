"use client"

import { useMemo, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { buildUpdatedQueryString } from "@/components/medicine/search-param-utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import type { Category, SortOption } from "@/types/medicine"

type MedicineFiltersProps = {
  categories: Category[]
  manufacturers: string[]
  selectedCategory?: string
  selectedManufacturer?: string
  selectedSort?: SortOption
  minPrice: number
  maxPrice: number
}

const PRICE_MIN = 0
const PRICE_MAX = 1000

export function MedicineFilters({
  categories,
  manufacturers,
  selectedCategory,
  selectedManufacturer,
  selectedSort,
  minPrice,
  maxPrice,
}: MedicineFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [priceRange, setPriceRange] = useState<[number, number]>([
    Math.max(PRICE_MIN, minPrice),
    Math.min(PRICE_MAX, maxPrice),
  ])

  const sortedManufacturers = useMemo(
    () => [...manufacturers].sort((a, b) => a.localeCompare(b)),
    [manufacturers]
  )

  const updateParams = (updates: Record<string, string | number | null>) => {
    const nextQuery = buildUpdatedQueryString(searchParams, {
      ...updates,
      page: 1,
    })
    router.push(nextQuery ? `${pathname}?${nextQuery}` : pathname)
  }

  return (
    <aside className="sticky top-20 rounded-xl border border-[#d6e0e7] bg-[#f2f6f9] p-4 shadow-none">
      <h2 className="text-base font-semibold text-[#233543]">Filters</h2>

      <Separator className="my-4" />

      <section className="space-y-4" aria-label="Price range filter">
        <h3 className="text-xs font-semibold tracking-wide text-[#607480] uppercase">Categories</h3>
        <div className="space-y-2">
          <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-[#24404f]">
            <Checkbox
              checked={!selectedCategory}
              onCheckedChange={() => updateParams({ category: null })}
              aria-label="Show all categories"
              className="border-[#bdd0dc] data-[checked=true]:border-[#0f8f8f] data-[checked=true]:bg-[#0f8f8f]"
            />
            All Categories
          </label>

          {categories.map((category) => {
            const checked = selectedCategory === category.id

            return (
              <label key={category.id} className="flex cursor-pointer items-center gap-2 text-xs text-[#385161]">
                <Checkbox
                  checked={checked}
                  onCheckedChange={() => updateParams({ category: checked ? null : category.id })}
                  aria-label={`Filter by ${category.name}`}
                  className="border-[#bdd0dc] data-[checked=true]:border-[#0f8f8f] data-[checked=true]:bg-[#0f8f8f]"
                />
                {category.name}
              </label>
            )
          })}
        </div>
      </section>

      <Separator className="my-4 bg-[#dbe5ec]" />

      <section className="space-y-4" aria-label="Price range filter">
        <h3 className="text-xs font-semibold tracking-wide text-[#607480] uppercase">Price Range</h3>
        <Slider
          aria-label="Select price range"
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={10}
          value={priceRange}
          onValueChange={(values) => setPriceRange([values[0] ?? PRICE_MIN, values[1] ?? PRICE_MAX])}
          onValueCommit={(values) => {
            updateParams({
              minPrice: values[0] ?? PRICE_MIN,
              maxPrice: values[1] ?? PRICE_MAX,
            })
          }}
          className="[&_[data-slot=slider-range]]:bg-[#0f8f8f]"
        />
        <div className="flex items-center justify-between text-[11px] text-[#6f8390]">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </section>

      <Separator className="my-4 bg-[#dbe5ec]" />

      <section className="space-y-3" aria-label="Sort options">
        <h3 className="text-xs font-semibold tracking-wide text-[#607480] uppercase">Sort</h3>
        <div className="grid grid-cols-1 gap-2">
          <Button
            type="button"
            variant={selectedSort === "price_asc" ? "default" : "outline"}
            className="justify-start border-[#cfdbe4] bg-white text-[#28404d] hover:bg-[#eaf1f5]"
            onClick={() => updateParams({ sort: "price_asc" })}
          >
            Price Low to High
          </Button>
          <Button
            type="button"
            variant={selectedSort === "price_desc" ? "default" : "outline"}
            className="justify-start border-[#cfdbe4] bg-white text-[#28404d] hover:bg-[#eaf1f5]"
            onClick={() => updateParams({ sort: "price_desc" })}
          >
            Price High to Low
          </Button>
        </div>
      </section>

      <Separator className="my-4 bg-[#dbe5ec]" />

      <section className="space-y-3" aria-label="Manufacturer filter">
        <h3 className="text-xs font-semibold tracking-wide text-[#607480] uppercase">Manufacturer</h3>
        <Select
          value={selectedManufacturer || "all"}
          onValueChange={(value) => updateParams({ manufacturer: value === "all" ? null : value })}
        >
          <SelectTrigger aria-label="Filter medicines by manufacturer" className="border-[#cfdbe4] bg-white text-[#2d4452]">
            <SelectValue placeholder="Select manufacturer" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Manufacturers</SelectItem>
            {sortedManufacturers.map((manufacturer) => (
              <SelectItem key={manufacturer} value={manufacturer}>
                {manufacturer}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </section>

      <Separator className="my-4 bg-[#dbe5ec]" />

      <Button
        type="button"
        className="w-full bg-[#d2e8ea] text-[#1f5d67] hover:bg-[#c0dde0]"
        onClick={() => {
          setPriceRange([PRICE_MIN, PRICE_MAX])
          router.push(pathname)
        }}
      >
        Clear All Filters
      </Button>
    </aside>
  )
}
