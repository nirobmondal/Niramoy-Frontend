import type {
  Category,
  Medicine,
  ManufacturerOption,
  MedicinesListResponse,
  ShopQueryParams,
  SortOption,
} from "@/types/medicine";
import { getApiBaseUrl } from "@/lib/api-url";

const sortMap: Record<
  SortOption,
  { sortBy: string; sortOrder: "asc" | "desc" }
> = {
  price_asc: { sortBy: "price", sortOrder: "asc" },
  price_desc: { sortBy: "price", sortOrder: "desc" },
  newest: { sortBy: "createdAt", sortOrder: "desc" },
};

type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

function toNumber(value: unknown, fallback = 0) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : fallback;
  }

  if (typeof value === "string") {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  return fallback;
}

function normalizeMedicine(raw: Record<string, unknown>): Medicine {
  const rawManufacturer = raw.manufacturer as
    | Record<string, unknown>
    | undefined;
  return {
    id: String(raw.id ?? ""),
    name: String(raw.name ?? ""),
    description: (raw.description as string | null | undefined) ?? null,
    price: toNumber(raw.price),
    averageRating:
      raw.averageRating == null ? null : toNumber(raw.averageRating),
    stock: toNumber(raw.stock),
    manufacturerId: String(raw.manufacturerId ?? rawManufacturer?.id ?? ""),
    manufacturer:
      rawManufacturer && rawManufacturer.id
        ? {
            id: String(rawManufacturer.id),
            name: String(rawManufacturer.name ?? "Unknown"),
          }
        : null,
    imageUrl: (raw.imageUrl as string | null | undefined) ?? null,
    dosageForm: (raw.dosageForm as string | null | undefined) ?? null,
    strength: (raw.strength as string | null | undefined) ?? null,
    isAvailable: Boolean(raw.isAvailable),
    category: (raw.category as Medicine["category"]) ?? null,
    seller: (raw.seller as Medicine["seller"]) ?? null,
  };
}

export function buildMedicinesQuery(params: ShopQueryParams) {
  const query = new URLSearchParams();

  query.set("page", String(params.page ?? 1));
  query.set("limit", String(params.limit ?? 10));

  if (params.search) query.set("search", params.search);
  if (params.category) query.set("categoryId", params.category);
  if (params.manufacturerId) query.set("manufacturerId", params.manufacturerId);
  if (typeof params.minPrice === "number")
    query.set("minPrice", String(params.minPrice));
  if (typeof params.maxPrice === "number")
    query.set("maxPrice", String(params.maxPrice));

  const selectedSort = params.sort ? sortMap[params.sort] : undefined;
  if (selectedSort) {
    query.set("sortBy", selectedSort.sortBy);
    query.set("sortOrder", selectedSort.sortOrder);
  }

  return query.toString();
}

export async function getMedicines(
  params: ShopQueryParams,
): Promise<MedicinesListResponse> {
  const query = buildMedicinesQuery(params);
  const endpoint = `${getApiBaseUrl()}/medicines?${query}`;

  const response = await fetch(endpoint, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Failed to fetch medicines. Status: ${response.status}`);
  }

  const payload = (await response.json()) as ApiEnvelope<
    Record<string, unknown>[]
  >;
  const rawMedicines = Array.isArray(payload.data) ? payload.data : [];
  const resolvedPage = Math.max(1, payload.meta?.page ?? params.page ?? 1);
  const resolvedLimit = Math.max(1, payload.meta?.limit ?? params.limit ?? 10);
  const resolvedTotal = Math.max(0, payload.meta?.total ?? rawMedicines.length);
  const resolvedTotalPages =
    payload.meta?.totalPages && payload.meta.totalPages > 0
      ? payload.meta.totalPages
      : Math.max(1, Math.ceil(resolvedTotal / resolvedLimit));

  return {
    medicines: rawMedicines.map(normalizeMedicine),
    meta: {
      page: resolvedPage,
      limit: resolvedLimit,
      total: resolvedTotal,
      totalPages: resolvedTotalPages,
    },
  };
}

export async function getMedicineById(id: string): Promise<Medicine> {
  const endpoint = `${getApiBaseUrl()}/medicines/${id}`;
  const response = await fetch(endpoint, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch medicine details. Status: ${response.status}`,
    );
  }

  const payload = (await response.json()) as ApiEnvelope<
    Record<string, unknown>
  >;
  return normalizeMedicine(payload.data ?? {});
}

export async function getCategories(): Promise<Category[]> {
  const endpoint = `${getApiBaseUrl()}/categories`;
  const response = await fetch(endpoint, { cache: "no-store" });

  if (!response.ok) {
    return [];
  }

  const payload = (await response.json()) as ApiEnvelope<Category[]>;
  return Array.isArray(payload.data) ? payload.data : [];
}

export async function getManufacturers(): Promise<ManufacturerOption[]> {
  const endpoint = `${getApiBaseUrl()}/manufacturers`;
  const response = await fetch(endpoint, { cache: "no-store" });

  if (!response.ok) {
    return [];
  }

  const payload = (await response.json()) as ApiEnvelope<ManufacturerOption[]>;
  return Array.isArray(payload.data)
    ? payload.data
        .filter((manufacturer) => Boolean(manufacturer.id))
        .sort((a, b) => a.name.localeCompare(b.name))
    : [];
}
