import type { OrderStatus } from "@/types/order";

export type ManufacturerOption = {
  id: string;
  name: string;
};

export type SellerDashboardData = {
  totalMedicines: number;
  totalSales: number;
  totalRevenue: number;
  pendingOrders: number;
};

export type SellerMedicine = {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  stock: number;
  manufacturerId: string;
  imageUrl?: string | null;
  dosageForm?: string | null;
  strength?: string | null;
  isAvailable: boolean;
  categoryId: string;
  category?: { id: string; name: string } | null;
  manufacturer?: { id: string; name: string } | null;
};

export type SellerMedicinesResult = {
  medicines: SellerMedicine[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type SellerMedicinePayload = {
  name: string;
  description: string;
  price: number;
  stock: number;
  manufacturerId: string;
  imageUrl?: string;
  dosageForm: string;
  strength?: string;
  categoryId: string;
  isAvailable?: boolean;
};

export type SellerOrder = {
  id: string;
  status: OrderStatus;
  subtotal?: number;
  createdAt?: string;
  customer?: {
    id: string;
    name?: string;
    email?: string;
  } | null;
  order?: {
    id: string;
    shippingAddress?: string;
    shippingCity?: string;
    phone?: string;
    notes?: string;
    customer?: {
      id: string;
      name?: string;
      email?: string;
    } | null;
  } | null;
  items?: Array<{
    id: string;
    quantity: number;
    price: number;
    medicine?: { id: string; name: string } | null;
  }>;
};

export type SellerOrdersResult = {
  orders: SellerOrder[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
