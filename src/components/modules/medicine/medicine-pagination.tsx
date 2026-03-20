"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { buildUpdatedQueryString } from "@/components/modules/medicine/search-param-utils";
import {
  buildAdminListHref,
  getVisiblePageNumbers,
} from "@/components/modules/admin/admin-list-utils";

type MedicinePaginationProps = {
  currentPage: number;
  totalPages: number;
};

export function MedicinePagination({
  currentPage,
  totalPages,
}: MedicinePaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const safeCurrentPage = Math.max(1, currentPage);
  const safeTotalPages = Math.max(1, totalPages);

  const pages = useMemo(() => {
    return getVisiblePageNumbers(safeCurrentPage, safeTotalPages);
  }, [safeCurrentPage, safeTotalPages]);

  const queryWithoutPage: Record<string, string | undefined> = {};
  Array.from(searchParams.entries()).forEach(([key, value]) => {
    if (key === "page") {
      return;
    }

    queryWithoutPage[key] = value;
  });

  const goToPage = (page: number) => {
    const nextQuery = buildUpdatedQueryString(searchParams, { page });
    router.push(nextQuery ? `${pathname}?${nextQuery}` : pathname);
  };

  return (
    <div
      className="flex items-center justify-end gap-2"
      aria-label="Medicines pagination"
    >
      <button
        type="button"
        onClick={() => safeCurrentPage > 1 && goToPage(safeCurrentPage - 1)}
        disabled={safeCurrentPage <= 1}
        className={`inline-flex h-9 items-center rounded-md border px-3 text-sm font-medium ${
          safeCurrentPage > 1
            ? "border-border bg-background text-foreground hover:bg-muted"
            : "pointer-events-none border-border bg-background text-muted-foreground opacity-50"
        }`}
      >
        Previous
      </button>

      {pages.map((page) => (
        <Link
          key={page}
          href={buildAdminListHref(pathname, page, queryWithoutPage)}
          className={`inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-3 text-sm font-medium ${
            page === safeCurrentPage
              ? "border-emerald-600 bg-emerald-600 text-white"
              : "border-border bg-background text-foreground hover:bg-muted"
          }`}
        >
          {page}
        </Link>
      ))}

      <button
        type="button"
        onClick={() =>
          safeCurrentPage < safeTotalPages && goToPage(safeCurrentPage + 1)
        }
        disabled={safeCurrentPage >= safeTotalPages}
        className={`inline-flex h-9 items-center rounded-md border px-3 text-sm font-medium ${
          safeCurrentPage < safeTotalPages
            ? "border-border bg-background text-foreground hover:bg-muted"
            : "pointer-events-none border-border bg-background text-muted-foreground opacity-50"
        }`}
      >
        Next
      </button>
    </div>
  );
}
