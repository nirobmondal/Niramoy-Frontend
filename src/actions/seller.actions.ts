"use server";

import { getAuthStateAction } from "@/actions/user.actions";
import { Roles } from "@/constants/role";
import { revalidatePath } from "next/cache";
import { sellerService } from "@/services/seller.service";
import { categoriesService } from "@/services/categories.service";
import { manufacturerService } from "@/services/manufacturer.service";
import type { OrderStatus } from "@/types/order";
import * as z from "zod";

const sellerMedicineSchema = z.object({
  name: z.string().min(2, "Medicine name is required"),
  description: z.string().min(5, "Description is required"),
  price: z.number().positive("Price must be greater than 0"),
  stock: z.number().int().min(0, "Stock cannot be negative"),
  manufacturerId: z.string().min(1, "Manufacturer is required"),
  imageUrl: z
    .string()
    .url("Image URL must be valid")
    .optional()
    .or(z.literal("")),
  dosageForm: z.string().min(1, "Dosage form is required"),
  strength: z.string().min(1, "Strength is required"),
  categoryId: z.string().min(1, "Category is required"),
  isAvailable: z.boolean().optional(),
});

const updateStatusSchema = z.object({
  status: z.enum(["PLACED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]),
});

async function ensureSellerAccess() {
  const authState = await getAuthStateAction();
  if (!authState.isAuthenticated) {
    return { ok: false, message: "Please login first" };
  }

  if (authState.role !== Roles.SELLER) {
    return { ok: false, message: "Only sellers can access this feature" };
  }

  return { ok: true, message: "ok" };
}

export async function getSellerDashboardAction() {
  const access = await ensureSellerAccess();
  if (!access.ok) return null;

  const result = await sellerService.getSellerDashboard();
  return result.data;
}

export async function getSellerProfileAction() {
  const access = await ensureSellerAccess();
  if (!access.ok) return null;

  const result = await sellerService.getSellerProfile();
  return result.data;
}

export async function getSellerMedicinesAction(params?: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  const access = await ensureSellerAccess();
  if (!access.ok) {
    return {
      medicines: [],
      meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
    };
  }

  const result = await sellerService.getSellerMedicines(params);
  return (
    result.data ?? {
      medicines: [],
      meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
    }
  );
}

export async function getSellerMedicineFormOptionsAction() {
  const access = await ensureSellerAccess();
  if (!access.ok) {
    return { categories: [], manufacturers: [] };
  }

  const [categories, manufacturers] = await Promise.all([
    categoriesService.getAllCategories(),
    manufacturerService.getAllManufacturers(),
  ]);

  return { categories, manufacturers };
}

export async function createSellerMedicineAction(input: {
  name: string;
  description: string;
  price: number;
  stock: number;
  manufacturerId: string;
  imageUrl?: string;
  dosageForm: string;
  strength: string;
  categoryId: string;
  isAvailable?: boolean;
}) {
  const access = await ensureSellerAccess();
  if (!access.ok) {
    return { success: false, message: access.message };
  }

  const parsed = sellerMedicineSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Invalid medicine data",
    };
  }

  const payload = {
    ...parsed.data,
    imageUrl: parsed.data.imageUrl || undefined,
  };

  const result = await sellerService.createMedicine(payload);

  if (result.success) {
    revalidatePath("/seller/medicines");
    revalidatePath("/shop");
  }

  return result;
}

export async function updateSellerMedicineAction(
  medicineId: string,
  input: Partial<{
    name: string;
    description: string;
    price: number;
    stock: number;
    manufacturerId: string;
    imageUrl?: string;
    dosageForm?: string;
    strength?: string;
    categoryId: string;
    isAvailable?: boolean;
  }>,
) {
  const access = await ensureSellerAccess();
  if (!access.ok) {
    return { success: false, message: access.message };
  }

  const result = await sellerService.updateMedicine(medicineId, input);
  if (result.success) {
    revalidatePath("/seller/medicines");
    revalidatePath("/shop");
  }

  return result;
}

export async function deleteSellerMedicineAction(medicineId: string) {
  const access = await ensureSellerAccess();
  if (!access.ok) {
    return { success: false, message: access.message };
  }

  const result = await sellerService.deleteMedicine(medicineId);
  if (result.success) {
    revalidatePath("/seller/medicines");
    revalidatePath("/shop");
  }

  return result;
}

export async function updateSellerMedicineStockAction(
  medicineId: string,
  stock: number,
) {
  const access = await ensureSellerAccess();
  if (!access.ok) {
    return { success: false, message: access.message };
  }

  if (!Number.isInteger(stock) || stock < 0) {
    return { success: false, message: "Stock must be a non-negative integer" };
  }

  const result = await sellerService.updateMedicineStock(medicineId, stock);
  if (result.success) {
    revalidatePath("/seller/medicines");
    revalidatePath("/shop");
  }

  return result;
}

export async function getSellerOrdersAction(params?: {
  page?: number;
  limit?: number;
  status?: OrderStatus;
}) {
  const access = await ensureSellerAccess();
  if (!access.ok) {
    return {
      orders: [],
      meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
    };
  }

  const result = await sellerService.getSellerOrders(params);
  return (
    result.data ?? {
      orders: [],
      meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
    }
  );
}

export async function getSellerOrderByIdAction(sellerOrderId: string) {
  const access = await ensureSellerAccess();
  if (!access.ok) {
    return null;
  }

  const result = await sellerService.getSellerOrderById(sellerOrderId);
  return result.data;
}

export async function updateSellerOrderStatusAction(
  sellerOrderId: string,
  status: OrderStatus,
) {
  const access = await ensureSellerAccess();
  if (!access.ok) {
    return { success: false, message: access.message };
  }

  const parsed = updateStatusSchema.safeParse({ status });
  if (!parsed.success) {
    return { success: false, message: "Invalid order status" };
  }

  const result = await sellerService.updateSellerOrderStatus(
    sellerOrderId,
    parsed.data.status,
  );

  if (result.success) {
    revalidatePath("/seller/orders");
    revalidatePath(`/seller/orders/${sellerOrderId}`);
  }

  return result;
}
