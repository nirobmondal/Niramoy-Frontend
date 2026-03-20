"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { buildUpdatedQueryString } from "@/components/modules/medicine/search-param-utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SortOption } from "@/types/medicine";

type MedicineSortProps = {
  value?: SortOption;
  className?: string;
};

export function MedicineSort({
  value = "newest",
  className,
}: MedicineSortProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <div className={className}>
      <Select
        value={value}
        onValueChange={(nextValue) => {
          const nextQuery = buildUpdatedQueryString(searchParams, {
            sort: nextValue,
            page: 1,
          });
          router.push(nextQuery ? `${pathname}?${nextQuery}` : pathname);
        }}
      >
        <SelectTrigger
          aria-label="Sort medicines"
          className="h-11 min-w-[190px] rounded-xl border-[#d6e1e8] bg-white text-[#253947]"
        >
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="price_asc">Price: Low to High</SelectItem>
          <SelectItem value="price_desc">Price: High to Low</SelectItem>
          <SelectItem value="newest">Newest</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
