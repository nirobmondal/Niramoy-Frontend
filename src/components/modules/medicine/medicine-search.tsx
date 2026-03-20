"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { buildUpdatedQueryString } from "@/components/modules/medicine/search-param-utils";
import { Input } from "@/components/ui/input";

const SEARCH_DEBOUNCE_MS = 300;

type MedicineSearchProps = {
  placeholder?: string;
};

export function MedicineSearch({
  placeholder = "Search medicines",
}: MedicineSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get("search") ?? "";
  const [value, setValue] = useState(currentSearch);

  useEffect(() => {
    setValue(currentSearch);
  }, [currentSearch]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (value === currentSearch) {
        return;
      }

      const nextQuery = buildUpdatedQueryString(searchParams, {
        search: value.trim() || null,
        page: 1,
      });

      router.push(nextQuery ? `${pathname}?${nextQuery}` : pathname);
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timeout);
  }, [value, currentSearch, pathname, router, searchParams]);

  return (
    <label htmlFor="medicine-search" className="relative block w-full max-w-xl">
      <Search
        className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[#7e909c]"
        aria-hidden="true"
      />
      <Input
        id="medicine-search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        aria-label="Search medicines by name"
        className="h-11 rounded-xl border-[#d6e1e8] bg-white pl-10 text-[#253947] placeholder:text-[#8ca0ad] focus-visible:ring-[#4f8898]/40"
      />
    </label>
  );
}
