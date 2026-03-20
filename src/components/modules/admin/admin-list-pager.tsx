import Link from "next/link";
import {
  buildAdminListHref,
  getVisiblePageNumbers,
} from "@/components/modules/admin/admin-list-utils";

type AdminListPagerProps = {
  basePath: string;
  currentPage: number;
  totalPages: number;
  query: Record<string, string | undefined>;
};

export function AdminListPager({
  basePath,
  currentPage,
  totalPages,
  query,
}: AdminListPagerProps) {
  const safeCurrentPage = Math.max(1, currentPage);
  const safeTotalPages = Math.max(1, totalPages);
  const visiblePages = getVisiblePageNumbers(safeCurrentPage, safeTotalPages);

  return (
    <div className="flex items-center justify-end gap-2">
      <Link
        href={
          safeCurrentPage > 1
            ? buildAdminListHref(basePath, safeCurrentPage - 1, query)
            : "#"
        }
        className={`inline-flex h-9 items-center rounded-md border px-3 text-sm font-medium ${
          safeCurrentPage > 1
            ? "hover:bg-muted"
            : "pointer-events-none opacity-50"
        }`}
      >
        Previous
      </Link>

      {visiblePages.map((pageNumber) => (
        <Link
          key={pageNumber}
          href={buildAdminListHref(basePath, pageNumber, query)}
          className={`inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-3 text-sm font-medium ${
            pageNumber === safeCurrentPage
              ? "border-emerald-600 bg-emerald-600 text-white"
              : "hover:bg-muted"
          }`}
        >
          {pageNumber}
        </Link>
      ))}

      <Link
        href={
          safeCurrentPage < safeTotalPages
            ? buildAdminListHref(basePath, safeCurrentPage + 1, query)
            : "#"
        }
        className={`inline-flex h-9 items-center rounded-md border px-3 text-sm font-medium ${
          safeCurrentPage < safeTotalPages
            ? "hover:bg-muted"
            : "pointer-events-none opacity-50"
        }`}
      >
        Next
      </Link>
    </div>
  );
}
