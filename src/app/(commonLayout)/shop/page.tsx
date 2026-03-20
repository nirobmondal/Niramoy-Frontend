import {
  MedicineFiltersDrawer,
  MedicineFiltersSidebar,
} from "@/components/modules/medicine/medicine-filters-sidebar";
import { MedicineGrid } from "@/components/modules/medicine/medicine-grid";
import { MedicinePagination } from "@/components/modules/medicine/medicine-pagination";
import { MedicineSearch } from "@/components/modules/medicine/medicine-search";
import { MedicineSort } from "@/components/modules/medicine/medicine-sort";
import {
  getCategories,
  getManufacturers,
  getMedicines,
} from "@/services/medicines.service";
import type { ShopQueryParams, SortOption } from "@/types/medicine";

type PageSearchParams = Record<string, string | string[] | undefined>;

type ShopPageProps = {
  searchParams?: PageSearchParams | Promise<PageSearchParams>;
};

const DEFAULT_LIMIT = 10;

function firstValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0];
  return value;
}

function parseNumber(value: string | undefined, fallback: number) {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseSort(value?: string): SortOption {
  if (value === "price_asc" || value === "price_desc" || value === "newest") {
    return value;
  }
  return "newest";
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};

  const page = Math.max(
    1,
    parseNumber(firstValue(resolvedSearchParams.page), 1),
  );
  const limit = Math.max(
    1,
    parseNumber(firstValue(resolvedSearchParams.limit), DEFAULT_LIMIT),
  );
  const minPrice = Math.max(
    0,
    parseNumber(firstValue(resolvedSearchParams.minPrice), 0),
  );
  const maxPrice = Math.max(
    minPrice,
    parseNumber(firstValue(resolvedSearchParams.maxPrice), 1000),
  );
  const sort = parseSort(firstValue(resolvedSearchParams.sort));

  const requestedCategory =
    firstValue(resolvedSearchParams.categoryId) ??
    firstValue(resolvedSearchParams.category);
  const requestedManufacturerId =
    firstValue(resolvedSearchParams.manufacturerId) ??
    firstValue(resolvedSearchParams.manufacturer);

  const [categoriesResult, manufacturersResult] = await Promise.allSettled([
    getCategories(),
    getManufacturers(),
  ]);

  const categories =
    categoriesResult.status === "fulfilled" ? categoriesResult.value : [];
  const manufacturers =
    manufacturersResult.status === "fulfilled" ? manufacturersResult.value : [];

  const validCategory = categories.some(
    (category) => category.id === requestedCategory,
  )
    ? requestedCategory
    : undefined;

  const validManufacturerId = manufacturers.some(
    (manufacturer) => manufacturer.id === requestedManufacturerId,
  )
    ? requestedManufacturerId
    : undefined;

  const query: ShopQueryParams = {
    page,
    limit,
    search: firstValue(resolvedSearchParams.search),
    category: validCategory,
    manufacturerId: validManufacturerId,
    minPrice,
    maxPrice,
    sort,
  };

  const selectedSort: SortOption = query.sort ?? "newest";

  const { medicines, meta } = await getMedicines(query);
  const computedTotalPages = Math.max(
    1,
    Math.ceil(Math.max(meta.total, 0) / Math.max(meta.limit, 1)),
  );
  const resolvedTotalPages = Math.max(meta.totalPages, computedTotalPages);

  const startIndex = meta.total === 0 ? 0 : (meta.page - 1) * meta.limit + 1;
  const endIndex =
    meta.total === 0 ? 0 : Math.min(meta.page * meta.limit, meta.total);

  return (
    <main className="min-h-[80vh] bg-background py-6">
      <div className="mx-auto w-full max-w-[1280px] px-4 md:px-6 lg:px-8">
        <div className="mb-5 rounded-2xl border border-border bg-card px-5 py-4">
          <h1 className="text-xl font-semibold tracking-tight text-[#193140] md:text-2xl">
            Shop Medicines
          </h1>
          <p className="mt-1 text-sm text-[#607584]">
            Browse trusted OTC medicines from verified Niramoy sellers.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-6">
          <MedicineFiltersSidebar
            categories={categories}
            manufacturers={manufacturers}
            selectedCategory={validCategory}
            selectedManufacturer={validManufacturerId}
            selectedSort={selectedSort}
            minPrice={minPrice}
            maxPrice={maxPrice}
          />

          <section className="space-y-4">
            <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex w-full items-center gap-2">
                <MedicineFiltersDrawer
                  categories={categories}
                  manufacturers={manufacturers}
                  selectedCategory={validCategory}
                  selectedManufacturer={validManufacturerId}
                  selectedSort={selectedSort}
                  minPrice={minPrice}
                  maxPrice={maxPrice}
                />
                <MedicineSearch placeholder="Search by medicine name" />
              </div>
              <MedicineSort value={selectedSort} />
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
              <p className="text-xs md:text-sm">
                Showing{" "}
                <span className="font-semibold text-foreground">
                  {startIndex}
                </span>
                -
                <span className="font-semibold text-foreground">
                  {endIndex}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-foreground">
                  {meta.total}
                </span>{" "}
                products
              </p>
              <p className="text-xs">Page {meta.page}</p>
            </div>

            <MedicineGrid medicines={medicines} />

            <div className="rounded-2xl border border-border bg-card px-3 py-3">
              <MedicinePagination
                currentPage={meta.page}
                totalPages={resolvedTotalPages}
              />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
