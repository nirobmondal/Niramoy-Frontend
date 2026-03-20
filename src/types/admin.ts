import type { AppRole } from "@/types/auth";
import type { OrderStatus } from "@/types/order";

export type AdminDashboardData = {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  totalMedicines: number;
  totalSellers: number;
};

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: AppRole;
  isBanned: boolean;
  createdAt?: string;
};

export type AdminUsersResult = {
  users: AdminUser[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type AdminOrder = {
  id: string;
  status?: OrderStatus;
  totalPrice?: number;
  createdAt?: string;
  customer?: { id: string; name?: string; email?: string } | null;
  sellerOrders?: Array<{
    id: string;
    status?: OrderStatus;
    seller?: { id: string; storeName?: string } | null;
  }>;
};

export type AdminOrdersResult = {
  orders: AdminOrder[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type AdminMedicine = {
  id: string;
  name: string;
  price: number;
  stock: number;
  isAvailable: boolean;
  category?: { id: string; name: string } | null;
  seller?: { id: string; storeName?: string } | null;
};

export type AdminMedicinesResult = {
  medicines: AdminMedicine[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type AdminCategory = {
  id: string;
  name: string;
  description?: string | null;
};

export type AdminManufacturer = {
  id: string;
  name: string;
};

export type AdminReview = {
  id: string;
  rating: number;
  comment?: string | null;
  createdAt?: string;
  user?: {
    id: string;
    name?: string;
    email?: string;
    image?: string | null;
  } | null;
  medicine?: {
    id: string;
    name?: string;
  } | null;
};

export type AdminReviewsResult = {
  reviews: AdminReview[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
