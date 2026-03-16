import { MedicineFilters } from "@/components/medicine/medicine-filters"
import { MedicineGrid } from "@/components/medicine/medicine-grid"
import { MedicinePagination } from "@/components/medicine/medicine-pagination"
import { MedicineSearch } from "@/components/medicine/medicine-search"
import { MedicineSort } from "@/components/medicine/medicine-sort"
import { getCategories, getManufacturers, getMedicines } from "@/services/medicine"
import type { ShopQueryParams, SortOption } from "@/types/medicine"

type PageSearchParams = Record<string, string | string[] | undefined>

type ShopPageProps = {
  searchParams?: PageSearchParams | Promise<PageSearchParams>
}

const DEFAULT_LIMIT = 10

function firstValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0]
  return value
}

function parseNumber(value: string | undefined, fallback: number) {
  const parsed = Number.parseInt(value ?? "", 10)
  return Number.isFinite(parsed) ? parsed : fallback
}

function parseSort(value?: string): SortOption {
  if (value === "price_asc" || value === "price_desc" || value === "newest") {
    return value
  }
  return "newest"
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {}

  const page = Math.max(1, parseNumber(firstValue(resolvedSearchParams.page), 1))
  const limit = Math.max(1, parseNumber(firstValue(resolvedSearchParams.limit), DEFAULT_LIMIT))
  const minPrice = Math.max(0, parseNumber(firstValue(resolvedSearchParams.minPrice), 0))
  const maxPrice = Math.max(minPrice, parseNumber(firstValue(resolvedSearchParams.maxPrice), 1000))
  const sort = parseSort(firstValue(resolvedSearchParams.sort))

  const requestedCategory = firstValue(resolvedSearchParams.category)
  const requestedManufacturer = firstValue(resolvedSearchParams.manufacturer)

  const [categoriesResult, manufacturersResult] = await Promise.allSettled([
    getCategories(),
    getManufacturers(),
  ])

  const categories = categoriesResult.status === "fulfilled" ? categoriesResult.value : []
  const manufacturers = manufacturersResult.status === "fulfilled" ? manufacturersResult.value : []

  const validCategory = categories.some((category) => category.id === requestedCategory)
    ? requestedCategory
    : undefined

  const validManufacturer = manufacturers.some(
    (manufacturer) => manufacturer.toLowerCase() === (requestedManufacturer ?? "").toLowerCase()
  )
    ? requestedManufacturer
    : undefined

  const query: ShopQueryParams = {
    page,
    limit,
    search: firstValue(resolvedSearchParams.search),
    category: validCategory,
    manufacturer: validManufacturer,
    minPrice,
    maxPrice,
    sort,
  }

  const { medicines, meta } = await getMedicines(query)

  const startIndex = meta.total === 0 ? 0 : (meta.page - 1) * meta.limit + 1
  const endIndex = meta.total === 0 ? 0 : Math.min(meta.page * meta.limit, meta.total)

  return (
    <main className="min-h-[80vh] bg-[#edf3f7] py-6">
      <div className="mx-auto w-full max-w-[1280px] px-4 md:px-6 lg:px-8">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold tracking-tight text-[#193140] md:text-xl">Medicines</h1>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
        <MedicineFilters
          categories={categories}
          manufacturers={manufacturers}
          selectedCategory={validCategory}
          selectedManufacturer={validManufacturer}
          selectedSort={query.sort}
          minPrice={minPrice}
          maxPrice={maxPrice}
        />

        <section className="space-y-4">
          <div className="flex flex-col gap-3 rounded-xl border border-[#dbe5eb] bg-white p-3 sm:flex-row sm:items-center sm:justify-between">
            <MedicineSearch />
            <MedicineSort value={query.sort} />
          </div>

          <div className="flex items-center justify-between rounded-xl border border-[#dbe5eb] bg-white px-4 py-3 text-sm text-[#607584]">
            <p className="text-xs md:text-sm">
              Showing <span className="font-semibold text-[#233543]">{startIndex}</span>-<span className="font-semibold text-[#233543]">{endIndex}</span> of <span className="font-semibold text-[#233543]">{meta.total}</span> products
            </p>
            <p className="text-xs">Page {meta.page}</p>
          </div>

          <MedicineGrid medicines={medicines} />

          <MedicinePagination currentPage={meta.page} totalPages={meta.totalPages} />
        </section>
      </div>
      </div>
    </main>
  )
}