"use server";

import { getAuthStateAction } from "@/actions/user.actions";
import { Roles } from "@/constants/role";
import { revalidatePath } from "next/cache";
import { adminService } from "@/services/admin.service";
import * as z from "zod";

const createCategorySchema = z.object({
  name: z.string().min(2, "Category name is required"),
  description: z.string().optional(),
});

const updateCategorySchema = z.object({
  categoryId: z.string().min(1),
  name: z.string().optional(),
  description: z.string().optional(),
});

const createManufacturerSchema = z.object({
  name: z.string().min(2, "Manufacturer name is required"),
});

const updateUserBanSchema = z.object({
  userId: z.string().min(1),
  isBanned: z.boolean(),
});

async function ensureAdminAccess() {
  const authState = await getAuthStateAction();

  if (!authState.isAuthenticated) {
    return { ok: false, message: "Please login first" };
  }

  if (authState.role !== Roles.ADMIN) {
    return { ok: false, message: "Only admins can access this feature" };
  }

  return { ok: true, message: "ok" };
}

export async function getAdminDashboardAction() {
  const access = await ensureAdminAccess();
  if (!access.ok) return null;

  return adminService.getDashboard();
}

export async function getAdminUsersAction(params?: {
  page?: number;
  limit?: number;
  role?: "CUSTOMER" | "SELLER" | "ADMIN";
  search?: string;
}) {
  const access = await ensureAdminAccess();
  if (!access.ok) {
    return { users: [], meta: { page: 1, limit: 10, total: 0, totalPages: 0 } };
  }

  return adminService.getUsers(params);
}

export async function updateAdminUserBanAction(input: {
  userId: string;
  isBanned: boolean;
}) {
  const access = await ensureAdminAccess();
  if (!access.ok) return { success: false, message: access.message };

  const parsed = updateUserBanSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: "Invalid user ban payload" };
  }

  const result = await adminService.updateUserBan(
    parsed.data.userId,
    parsed.data.isBanned,
  );
  if (result.success) {
    revalidatePath("/admin/users");
  }
  return result;
}

export async function getAdminOrdersAction(params?: {
  page?: number;
  limit?: number;
  date?: string;
  seller?: string;
  customer?: string;
}) {
  const access = await ensureAdminAccess();
  if (!access.ok) {
    return {
      orders: [],
      meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
    };
  }

  return adminService.getOrders(params);
}

export async function getAdminMedicinesAction(params?: {
  page?: number;
  limit?: number;
  search?: string;
  seller?: string;
  category?: string;
}) {
  const access = await ensureAdminAccess();
  if (!access.ok) {
    return {
      medicines: [],
      meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
    };
  }

  return adminService.getMedicines(params);
}

export async function getAdminCategoriesAction() {
  const access = await ensureAdminAccess();
  if (!access.ok) return [];

  return adminService.getCategories();
}

export async function getAdminReviewsAction(params?: {
  page?: number;
  limit?: number;
  search?: string;
  rating?: number;
}) {
  const access = await ensureAdminAccess();
  if (!access.ok) {
    return {
      reviews: [],
      meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
    };
  }

  return adminService.getReviews(params);
}

export async function createAdminCategoryAction(input: {
  name: string;
  description?: string;
}) {
  const access = await ensureAdminAccess();
  if (!access.ok) return { success: false, message: access.message };

  const parsed = createCategorySchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Invalid category data",
    };
  }

  const result = await adminService.createCategory(parsed.data);
  if (result.success) {
    revalidatePath("/admin/categories");
    revalidatePath("/shop");
  }
  return result;
}

export async function updateAdminCategoryAction(input: {
  categoryId: string;
  name?: string;
  description?: string;
}) {
  const access = await ensureAdminAccess();
  if (!access.ok) return { success: false, message: access.message };

  const parsed = updateCategorySchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: "Invalid category update data" };
  }

  const result = await adminService.updateCategory(parsed.data.categoryId, {
    name: parsed.data.name,
    description: parsed.data.description,
  });

  if (result.success) {
    revalidatePath("/admin/categories");
    revalidatePath("/shop");
  }

  return result;
}

export async function deleteAdminCategoryAction(categoryId: string) {
  const access = await ensureAdminAccess();
  if (!access.ok) return { success: false, message: access.message };

  const result = await adminService.deleteCategory(categoryId);
  if (result.success) {
    revalidatePath("/admin/categories");
    revalidatePath("/shop");
  }
  return result;
}

export async function getAdminManufacturersAction() {
  const access = await ensureAdminAccess();
  if (!access.ok) return [];

  return adminService.getManufacturers();
}

export async function createAdminManufacturerAction(input: { name: string }) {
  const access = await ensureAdminAccess();
  if (!access.ok) return { success: false, message: access.message };

  const parsed = createManufacturerSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Invalid manufacturer data",
    };
  }

  const result = await adminService.createManufacturer(parsed.data);
  if (result.success) {
    revalidatePath("/admin/manufacturers");
    revalidatePath("/seller/medicines");
    revalidatePath("/shop");
  }
  return result;
}
