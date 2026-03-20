import { serverApiFetch } from "@/services/api-client.service";
import type {
  AdminCategory,
  AdminDashboardData,
  AdminManufacturer,
  AdminMedicine,
  AdminMedicinesResult,
  AdminOrder,
  AdminOrdersResult,
  AdminReview,
  AdminReviewsResult,
  AdminUser,
  AdminUsersResult,
} from "@/types/admin";
import type { AppRole } from "@/types/auth";

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

type RawAdminOrderStatus =
  | "PLACED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

type RawAdminOrder = {
  id?: string;
  status?: RawAdminOrderStatus;
  totalPrice?: number | string;
  createdAt?: string;
  customer?: { id?: string; name?: string; email?: string } | null;
  user?: { id?: string; name?: string; email?: string } | null;
  sellerOrders?: Array<{
    id?: string;
    status?: RawAdminOrderStatus;
    seller?: { id?: string; storeName?: string } | null;
  }>;
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

function deriveAdminOrderStatus(raw: RawAdminOrder): RawAdminOrderStatus {
  if (raw.status) {
    return raw.status;
  }

  const statuses = (raw.sellerOrders ?? [])
    .map((order) => order.status)
    .filter(Boolean) as RawAdminOrderStatus[];

  if (statuses.length === 0) {
    return "PLACED";
  }

  if (statuses.every((status) => status === "CANCELLED")) {
    return "CANCELLED";
  }

  const rank: Record<RawAdminOrderStatus, number> = {
    PLACED: 1,
    PROCESSING: 2,
    SHIPPED: 3,
    DELIVERED: 4,
    CANCELLED: 0,
  };

  return statuses.reduce(
    (best, current) => (rank[current] > rank[best] ? current : best),
    "PLACED",
  );
}

function normalizeAdminOrder(raw: RawAdminOrder): AdminOrder {
  const customer = raw.customer ?? raw.user ?? null;

  return {
    id: String(raw.id ?? ""),
    status: deriveAdminOrderStatus(raw),
    totalPrice: toNumber(raw.totalPrice, 0),
    createdAt: raw.createdAt,
    customer: customer?.id
      ? {
          id: String(customer.id),
          name: customer.name,
          email: customer.email,
        }
      : null,
    sellerOrders: Array.isArray(raw.sellerOrders)
      ? raw.sellerOrders.map((sellerOrder) => ({
          id: String(sellerOrder.id ?? ""),
          status: sellerOrder.status,
          seller: sellerOrder.seller?.id
            ? {
                id: String(sellerOrder.seller.id),
                storeName: sellerOrder.seller.storeName,
              }
            : null,
        }))
      : [],
  };
}

export const adminService = {
  async getDashboard() {
    try {
      const response = await serverApiFetch("/admin/dashboard", {
        method: "GET",
      });
      if (!response.ok) return null;
      const payload =
        (await response.json()) as ApiEnvelope<AdminDashboardData>;
      return payload.data;
    } catch {
      return null;
    }
  },

  async getUsers(params?: {
    page?: number;
    limit?: number;
    role?: AppRole;
    search?: string;
  }): Promise<AdminUsersResult> {
    try {
      const query = new URLSearchParams();
      query.set("page", String(params?.page ?? 1));
      query.set("limit", String(params?.limit ?? 10));
      if (params?.role) query.set("role", params.role);
      if (params?.search) query.set("search", params.search);

      const response = await serverApiFetch(
        `/admin/users?${query.toString()}`,
        {
          method: "GET",
        },
      );

      if (!response.ok) {
        return {
          users: [],
          meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
        };
      }

      const payload = (await response.json()) as ApiEnvelope<AdminUser[]>;
      return {
        users: Array.isArray(payload.data) ? payload.data : [],
        meta: {
          page: payload.meta?.page ?? 1,
          limit: payload.meta?.limit ?? 10,
          total: payload.meta?.total ?? 0,
          totalPages: payload.meta?.totalPages ?? 0,
        },
      };
    } catch {
      return {
        users: [],
        meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
      };
    }
  },

  async updateUserBan(userId: string, isBanned: boolean) {
    try {
      const response = await serverApiFetch(`/admin/users/${userId}/ban`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isBanned }),
      });

      if (!response.ok) {
        const err = (await response.json().catch(() => null)) as {
          message?: string;
        } | null;
        return {
          success: false,
          message: err?.message ?? "Failed to update user status",
        };
      }

      return { success: true, message: "User status updated" };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to update user status",
      };
    }
  },

  async getOrders(params?: {
    page?: number;
    limit?: number;
    date?: string;
    seller?: string;
    customer?: string;
  }): Promise<AdminOrdersResult> {
    try {
      const query = new URLSearchParams();
      query.set("page", String(params?.page ?? 1));
      query.set("limit", String(params?.limit ?? 10));
      if (params?.date) query.set("date", params.date);
      if (params?.seller) query.set("seller", params.seller);
      if (params?.customer) query.set("customer", params.customer);

      const response = await serverApiFetch(
        `/admin/orders?${query.toString()}`,
        {
          method: "GET",
        },
      );

      if (!response.ok) {
        return {
          orders: [],
          meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
        };
      }

      const payload = (await response.json()) as ApiEnvelope<RawAdminOrder[]>;
      return {
        orders: Array.isArray(payload.data)
          ? payload.data.map(normalizeAdminOrder)
          : [],
        meta: {
          page: payload.meta?.page ?? 1,
          limit: payload.meta?.limit ?? 10,
          total: payload.meta?.total ?? 0,
          totalPages: payload.meta?.totalPages ?? 0,
        },
      };
    } catch {
      return {
        orders: [],
        meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
      };
    }
  },

  async getMedicines(params?: {
    page?: number;
    limit?: number;
    search?: string;
    seller?: string;
    category?: string;
  }): Promise<AdminMedicinesResult> {
    try {
      const query = new URLSearchParams();
      query.set("page", String(params?.page ?? 1));
      query.set("limit", String(params?.limit ?? 10));
      if (params?.search) query.set("search", params.search);
      if (params?.seller) query.set("seller", params.seller);
      if (params?.category) query.set("category", params.category);

      const response = await serverApiFetch(
        `/admin/medicines?${query.toString()}`,
        {
          method: "GET",
        },
      );

      if (!response.ok) {
        return {
          medicines: [],
          meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
        };
      }

      const payload = (await response.json()) as ApiEnvelope<AdminMedicine[]>;
      return {
        medicines: Array.isArray(payload.data) ? payload.data : [],
        meta: {
          page: payload.meta?.page ?? 1,
          limit: payload.meta?.limit ?? 10,
          total: payload.meta?.total ?? 0,
          totalPages: payload.meta?.totalPages ?? 0,
        },
      };
    } catch {
      return {
        medicines: [],
        meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
      };
    }
  },

  async getCategories(): Promise<AdminCategory[]> {
    try {
      const response = await serverApiFetch("/categories", { method: "GET" });
      if (!response.ok) return [];
      const payload = (await response.json()) as ApiEnvelope<AdminCategory[]>;
      return Array.isArray(payload.data) ? payload.data : [];
    } catch {
      return [];
    }
  },

  async getReviews(params?: {
    page?: number;
    limit?: number;
    search?: string;
    rating?: number;
  }): Promise<AdminReviewsResult> {
    try {
      const query = new URLSearchParams();
      query.set("page", String(params?.page ?? 1));
      query.set("limit", String(params?.limit ?? 10));
      if (params?.search) query.set("search", params.search);
      if (typeof params?.rating === "number") {
        query.set("rating", String(params.rating));
      }

      const response = await serverApiFetch(`/reviews?${query.toString()}`, {
        method: "GET",
      });

      if (!response.ok) {
        return {
          reviews: [],
          meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
        };
      }

      const payload = (await response.json()) as ApiEnvelope<AdminReview[]>;

      return {
        reviews: Array.isArray(payload.data) ? payload.data : [],
        meta: {
          page: payload.meta?.page ?? 1,
          limit: payload.meta?.limit ?? 10,
          total: payload.meta?.total ?? 0,
          totalPages: payload.meta?.totalPages ?? 0,
        },
      };
    } catch {
      return {
        reviews: [],
        meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
      };
    }
  },

  async createCategory(payload: { name: string; description?: string }) {
    try {
      const response = await serverApiFetch("/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = (await response.json().catch(() => null)) as {
          message?: string;
        } | null;
        return {
          success: false,
          message: err?.message ?? "Failed to create category",
        };
      }

      return { success: true, message: "Category created successfully" };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to create category",
      };
    }
  },

  async updateCategory(
    categoryId: string,
    payload: { name?: string; description?: string },
  ) {
    try {
      const response = await serverApiFetch(`/categories/${categoryId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = (await response.json().catch(() => null)) as {
          message?: string;
        } | null;
        return {
          success: false,
          message: err?.message ?? "Failed to update category",
        };
      }

      return { success: true, message: "Category updated successfully" };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to update category",
      };
    }
  },

  async deleteCategory(categoryId: string) {
    try {
      const response = await serverApiFetch(`/categories/${categoryId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const err = (await response.json().catch(() => null)) as {
          message?: string;
        } | null;
        return {
          success: false,
          message: err?.message ?? "Failed to delete category",
        };
      }

      return { success: true, message: "Category deleted successfully" };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to delete category",
      };
    }
  },

  async getManufacturers(): Promise<AdminManufacturer[]> {
    try {
      const response = await serverApiFetch("/manufacturers", {
        method: "GET",
      });
      if (!response.ok) return [];
      const payload = (await response.json()) as ApiEnvelope<
        AdminManufacturer[]
      >;
      return Array.isArray(payload.data) ? payload.data : [];
    } catch {
      return [];
    }
  },

  async createManufacturer(payload: { name: string }) {
    try {
      const response = await serverApiFetch("/admin/manufacturers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = (await response.json().catch(() => null)) as {
          message?: string;
        } | null;
        return {
          success: false,
          message: err?.message ?? "Failed to create manufacturer",
        };
      }

      return { success: true, message: "Manufacturer created successfully" };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to create manufacturer",
      };
    }
  },
};
