import type {
  Category,
  Medicine,
  MedicinesListResponse,
  ShopQueryParams,
  SortOption,
} from "@/types/medicine"

const FALLBACK_API_BASE = "http://localhost:5000/api"

const sortMap: Record<SortOption, { sortBy: string; sortOrder: "asc" | "desc" }> = {
  price_asc: { sortBy: "price", sortOrder: "asc" },
  price_desc: { sortBy: "price", sortOrder: "desc" },
  newest: { sortBy: "createdAt", sortOrder: "desc" },
}

type ApiEnvelope<T> = {
  success: boolean
  message: string
  data: T
  meta?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

function getApiBaseUrl() {
  const rawBase = (process.env.NEXT_PUBLIC_API_URL ?? FALLBACK_API_BASE).replace(/\/+$/, "")

  if (rawBase.endsWith("/api")) {
    return rawBase
  }

  return `${rawBase}/api`
}

function toNumber(value: unknown, fallback = 0) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : fallback
  }

  if (typeof value === "string") {
    const parsed = Number.parseFloat(value)
    return Number.isFinite(parsed) ? parsed : fallback
  }

  return fallback
}

function normalizeMedicine(raw: Record<string, unknown>): Medicine {
  return {
    id: String(raw.id ?? ""),
    name: String(raw.name ?? ""),
    description: (raw.description as string | null | undefined) ?? null,
    price: toNumber(raw.price),
    averageRating: raw.averageRating == null ? null : toNumber(raw.averageRating),
    stock: toNumber(raw.stock),
    manufacturer: String(raw.manufacturer ?? ""),
    imageUrl: (raw.imageUrl as string | null | undefined) ?? null,
    dosageForm: (raw.dosageForm as string | null | undefined) ?? null,
    strength: (raw.strength as string | null | undefined) ?? null,
    isAvailable: Boolean(raw.isAvailable),
    category: (raw.category as Medicine["category"]) ?? null,
    seller: (raw.seller as Medicine["seller"]) ?? null,
  }
}

export function buildMedicinesQuery(params: ShopQueryParams) {
  const query = new URLSearchParams()

  query.set("page", String(params.page ?? 1))
  query.set("limit", String(params.limit ?? 10))

  if (params.search) query.set("search", params.search)
  if (params.category) query.set("category", params.category)
  if (params.manufacturer) query.set("manufacturer", params.manufacturer)
  if (typeof params.minPrice === "number") query.set("minPrice", String(params.minPrice))
  if (typeof params.maxPrice === "number") query.set("maxPrice", String(params.maxPrice))

  const selectedSort = params.sort ? sortMap[params.sort] : undefined
  if (selectedSort) {
    query.set("sortBy", selectedSort.sortBy)
    query.set("sortOrder", selectedSort.sortOrder)
  }

  return query.toString()
}

export async function getMedicines(params: ShopQueryParams): Promise<MedicinesListResponse> {
  const query = buildMedicinesQuery(params)
  const endpoint = `${getApiBaseUrl()}/medicines?${query}`

  const response = await fetch(endpoint, { cache: "no-store" })

  if (!response.ok) {
    throw new Error(`Failed to fetch medicines. Status: ${response.status}`)
  }

  const payload = (await response.json()) as ApiEnvelope<Record<string, unknown>[]>
  const rawMedicines = Array.isArray(payload.data) ? payload.data : []

  return {
    medicines: rawMedicines.map(normalizeMedicine),
    meta: {
      page: payload.meta?.page ?? params.page ?? 1,
      limit: payload.meta?.limit ?? params.limit ?? 10,
      total: payload.meta?.total ?? rawMedicines.length,
      totalPages: payload.meta?.totalPages ?? 1,
    },
  }
}

export async function getMedicineById(id: string): Promise<Medicine> {
  const endpoint = `${getApiBaseUrl()}/medicines/${id}`
  const response = await fetch(endpoint, { cache: "no-store" })

  if (!response.ok) {
    throw new Error(`Failed to fetch medicine details. Status: ${response.status}`)
  }

  const payload = (await response.json()) as ApiEnvelope<Record<string, unknown>>
  return normalizeMedicine(payload.data ?? {})
}

export async function getCategories(): Promise<Category[]> {
  const endpoint = `${getApiBaseUrl()}/categories`
  const response = await fetch(endpoint, { cache: "no-store" })

  if (!response.ok) {
    return []
  }

  const payload = (await response.json()) as ApiEnvelope<Category[]>
  return Array.isArray(payload.data) ? payload.data : []
}

export async function getManufacturers(): Promise<string[]> {
  const query = new URLSearchParams({ page: "1", limit: "200", sortBy: "name", sortOrder: "asc" })
  const endpoint = `${getApiBaseUrl()}/medicines?${query.toString()}`
  const response = await fetch(endpoint, { cache: "no-store" })

  if (!response.ok) {
    return []
  }

  const payload = (await response.json()) as ApiEnvelope<Record<string, unknown>[]>
  const rawMedicines = Array.isArray(payload.data) ? payload.data : []

  const manufacturers = new Set<string>()
  for (const medicine of rawMedicines) {
    const manufacturer = String(medicine.manufacturer ?? "").trim()
    if (manufacturer) {
      manufacturers.add(manufacturer)
    }
  }

  return Array.from(manufacturers).sort((a, b) => a.localeCompare(b))
}
