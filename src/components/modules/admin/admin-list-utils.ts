export function buildAdminListHref(
  basePath: string,
  page: number,
  query: Record<string, string | undefined>,
) {
  const params = new URLSearchParams();
  params.set("page", String(page));

  Object.entries(query).forEach(([key, value]) => {
    if (!value) return;
    params.set(key, value);
  });

  return `${basePath}?${params.toString()}`;
}

export function getVisiblePageNumbers(
  currentPage: number,
  totalPages: number,
  windowSize = 2,
) {
  const safeCurrentPage = Math.max(1, currentPage);
  const safeTotalPages = Math.max(1, totalPages);
  const start = Math.max(1, safeCurrentPage - windowSize);
  const end = Math.min(safeTotalPages, safeCurrentPage + windowSize);

  return Array.from(
    { length: Math.max(0, end - start + 1) },
    (_, index) => start + index,
  );
}
