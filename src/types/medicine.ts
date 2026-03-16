export type SortOption = "price_asc" | "price_desc" | "newest"

export type Category = {
  id: string
  name: string
  description?: string | null
}

export type SellerSummary = {
  id: string
  storeName?: string | null
}

export type Medicine = {
  id: string
  name: string
  description?: string | null
  price: number
  averageRating?: number | null
  stock: number
  manufacturer: string
  imageUrl?: string | null
  dosageForm?: string | null
  strength?: string | null
  isAvailable: boolean
  category?: Category | null
  seller?: SellerSummary | null
}

export type MedicinesMeta = {
  page: number
  limit: number
  total: number
  totalPages: number
}

export type MedicinesListResponse = {
  medicines: Medicine[]
  meta: MedicinesMeta
}

export type ShopQueryParams = {
  page?: number
  limit?: number
  search?: string
  category?: string
  manufacturer?: string
  minPrice?: number
  maxPrice?: number
  sort?: SortOption
}
