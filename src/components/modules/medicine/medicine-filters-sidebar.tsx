"use client";

import { Filter } from "lucide-react";
import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { buildUpdatedQueryString } from "@/components/modules/medicine/search-param-utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import type {
  Category,
  ManufacturerOption,
  SortOption,
} from "@/types/medicine";

type MedicineFiltersSidebarProps = {
  categories: Category[];
  manufacturers: ManufacturerOption[];
  selectedCategory?: string;
  selectedManufacturer?: string;
  selectedSort: SortOption;
  minPrice: number;
  maxPrice: number;
};

const PRICE_MIN = 0;
const PRICE_MAX = 1000;

function FiltersPanel({
  categories,
  manufacturers,
  selectedCategory,
  selectedManufacturer,
  selectedSort,
  minPrice,
  maxPrice,
  onClose,
}: MedicineFiltersSidebarProps & { onClose?: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [draftPriceRange, setDraftPriceRange] = useState<
    [number, number] | null
  >(null);
  const priceRange = draftPriceRange ?? [
    Math.max(PRICE_MIN, minPrice),
    Math.min(PRICE_MAX, maxPrice),
  ];

  const sortedManufacturers = useMemo(
    () => [...manufacturers].sort((a, b) => a.name.localeCompare(b.name)),
    [manufacturers],
  );

  const updateParams = (updates: Record<string, string | number | null>) => {
    const nextQuery = buildUpdatedQueryString(searchParams, {
      ...updates,
      page: 1,
    });

    router.push(nextQuery ? `${pathname}?${nextQuery}` : pathname);
    onClose?.();
  };

  const clearAll = () => {
    setDraftPriceRange(null);
    router.push(pathname);
    onClose?.();
  };

  return (
    <div className="rounded-2xl border border-[#d3e0e8] bg-white p-4 shadow-[0_15px_45px_-30px_rgba(15,76,117,0.35)]">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-semibold tracking-tight text-[#203542]">
          Filters
        </h2>
        <Button
          type="button"
          variant="ghost"
          className="h-8 px-2 text-xs text-[#577182] hover:bg-[#eff5f8]"
          onClick={clearAll}
          aria-label="Clear all filters"
        >
          Clear All Filters
        </Button>
      </div>

      <Separator className="mb-1" />

      <Accordion
        type="multiple"
        defaultValue={["price", "sort", "category", "manufacturer"]}
        className="w-full"
      >
        <AccordionItem value="price" className="border-b border-[#e4edf2]">
          <AccordionTrigger className="py-3 text-sm font-semibold text-[#2b4452] hover:no-underline">
            Price Range
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <Slider
                min={PRICE_MIN}
                max={PRICE_MAX}
                step={10}
                value={priceRange}
                onValueChange={(values) =>
                  setDraftPriceRange([
                    values[0] ?? PRICE_MIN,
                    values[1] ?? PRICE_MAX,
                  ])
                }
                onValueCommit={(values) => {
                  setDraftPriceRange(null);
                  updateParams({
                    minPrice: values[0] ?? PRICE_MIN,
                    maxPrice: values[1] ?? PRICE_MAX,
                  });
                }}
                aria-label="Price range"
                className="[&_[data-slot=slider-range]]:bg-[#0f8f8f]"
              />
              <p className="text-xs font-medium text-[#607584]">
                ৳{priceRange[0]} - ৳{priceRange[1]}
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="sort" className="border-b border-[#e4edf2]">
          <AccordionTrigger className="py-3 text-sm font-semibold text-[#2b4452] hover:no-underline">
            Sort Options
          </AccordionTrigger>
          <AccordionContent>
            <RadioGroup
              value={selectedSort}
              onValueChange={(value) => updateParams({ sort: value })}
              className="space-y-2 pt-1"
              aria-label="Sort medicines"
            >
              <label className="flex cursor-pointer items-center gap-2 rounded-lg px-1 py-1 text-sm text-[#445d6a] hover:bg-[#f3f8fb]">
                <RadioGroupItem value="price_asc" id="sort-price-asc" />
                Price Low to High
              </label>
              <label className="flex cursor-pointer items-center gap-2 rounded-lg px-1 py-1 text-sm text-[#445d6a] hover:bg-[#f3f8fb]">
                <RadioGroupItem value="price_desc" id="sort-price-desc" />
                Price High to Low
              </label>
              <label className="flex cursor-pointer items-center gap-2 rounded-lg px-1 py-1 text-sm text-[#445d6a] hover:bg-[#f3f8fb]">
                <RadioGroupItem value="newest" id="sort-newest" />
                Newest
              </label>
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="category" className="border-b border-[#e4edf2]">
          <AccordionTrigger className="py-3 text-sm font-semibold text-[#2b4452] hover:no-underline">
            Categories
          </AccordionTrigger>
          <AccordionContent>
            <div className="max-h-48 space-y-2 overflow-y-auto pr-1">
              <label className="flex cursor-pointer items-center gap-2 rounded-lg px-1 py-1 text-sm text-[#445d6a] hover:bg-[#f3f8fb]">
                <Checkbox
                  checked={!selectedCategory}
                  onCheckedChange={() =>
                    updateParams({ categoryId: null, category: null })
                  }
                  aria-label="All categories"
                  className="border-[#c4d4de] data-[checked=true]:border-[#0f8f8f] data-[checked=true]:bg-[#0f8f8f]"
                />
                All Categories
              </label>
              {categories.map((category) => {
                const checked = selectedCategory === category.id;
                return (
                  <label
                    key={category.id}
                    className="flex cursor-pointer items-center gap-2 rounded-lg px-1 py-1 text-sm text-[#445d6a] hover:bg-[#f3f8fb]"
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={() =>
                        updateParams({
                          categoryId: checked ? null : category.id,
                          category: null,
                        })
                      }
                      aria-label={`Filter by ${category.name}`}
                      className="border-[#c4d4de] data-[checked=true]:border-[#0f8f8f] data-[checked=true]:bg-[#0f8f8f]"
                    />
                    {category.name}
                  </label>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="manufacturer" className="border-b-0">
          <AccordionTrigger className="py-3 text-sm font-semibold text-[#2b4452] hover:no-underline">
            Manufacturer
          </AccordionTrigger>
          <AccordionContent>
            <div className="max-h-52 space-y-2 overflow-y-auto pr-1">
              <label className="flex cursor-pointer items-center gap-2 rounded-lg px-1 py-1 text-sm text-[#445d6a] hover:bg-[#f3f8fb]">
                <Checkbox
                  checked={!selectedManufacturer}
                  onCheckedChange={() =>
                    updateParams({ manufacturerId: null, manufacturer: null })
                  }
                  aria-label="All manufacturers"
                  className="border-[#c4d4de] data-[checked=true]:border-[#0f8f8f] data-[checked=true]:bg-[#0f8f8f]"
                />
                All Manufacturers
              </label>
              {sortedManufacturers.map((manufacturer) => {
                const checked = selectedManufacturer === manufacturer.id;
                return (
                  <label
                    key={manufacturer.id}
                    className="flex cursor-pointer items-center gap-2 rounded-lg px-1 py-1 text-sm text-[#445d6a] hover:bg-[#f3f8fb]"
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={() =>
                        updateParams({
                          manufacturerId: checked ? null : manufacturer.id,
                          manufacturer: null,
                        })
                      }
                      aria-label={`Filter by ${manufacturer.name}`}
                      className="border-[#c4d4de] data-[checked=true]:border-[#0f8f8f] data-[checked=true]:bg-[#0f8f8f]"
                    />
                    {manufacturer.name}
                  </label>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export function MedicineFiltersSidebar(props: MedicineFiltersSidebarProps) {
  return (
    <aside
      className="sticky top-24 hidden h-fit lg:block"
      aria-label="Medicine filters sidebar"
    >
      <FiltersPanel {...props} />
    </aside>
  );
}

export function MedicineFiltersDrawer(props: MedicineFiltersSidebarProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="h-11 rounded-xl border-[#d6e1e8] bg-white text-[#284453] hover:bg-[#eff4f7] lg:hidden"
          aria-label="Open filter drawer"
        >
          <Filter className="size-4" />
          Filters
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-full max-w-sm overflow-y-auto bg-[#f2f7fa] p-0"
      >
        <SheetHeader className="border-b border-[#d6e1e8] bg-white">
          <SheetTitle>Filter Medicines</SheetTitle>
        </SheetHeader>
        <div className="p-4">
          <FiltersPanel {...props} onClose={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
