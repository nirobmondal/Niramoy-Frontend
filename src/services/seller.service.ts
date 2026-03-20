import type { SellerProfile } from "@/types/profile";
import type {
  SellerDashboardData,
  SellerMedicine,
  SellerMedicinePayload,
  SellerMedicinesResult,
  SellerOrder,
  SellerOrdersResult,
} from "@/types/seller";
import type { OrderStatus } from "@/types/order";
import { serverApiFetch } from "@/services/api-client.service";

type ServiceResult<T> = {
  data: T | null;
  error: { message: string } | null;
  details?: string;
};

type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

type SellerPayload = {
  storeName: string;
  storeLogo?: string;
  address: string;
  contactNumber: string;
  openingTime: string;
  closingTime: string;
  offDay: string;
};

export const sellerService = {
  getSellerProfile: async (): Promise<ServiceResult<SellerProfile>> => {
    try {
      const response = await serverApiFetch("/seller/profile", {
        method: "GET",
      });

      if (!response.ok) {
        return {
          data: null,
          error: { message: "Seller profile not found" },
        };
      }

      const payload = (await response.json()) as ApiEnvelope<SellerProfile>;
      return {
        data: payload.data,
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: { message: "Failed to fetch seller profile" },
        details: error instanceof Error ? error.message : String(error),
      };
    }
  },

  createSellerProfile: async (
    payload: SellerPayload,
  ): Promise<ServiceResult<SellerProfile>> => {
    try {
      const response = await serverApiFetch("/seller/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        return {
          data: null,
          error: { message: "Failed to become seller" },
        };
      }

      const body = (await response.json()) as ApiEnvelope<SellerProfile>;
      return {
        data: body.data,
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: { message: "Failed to become seller" },
        details: error instanceof Error ? error.message : String(error),
      };
    }
  },

  updateSellerProfile: async (
    payload: SellerPayload,
  ): Promise<ServiceResult<SellerProfile>> => {
    try {
      const response = await serverApiFetch("/seller/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        return {
          data: null,
          error: { message: "Failed to update seller profile" },
        };
      }

      const body = (await response.json()) as ApiEnvelope<SellerProfile>;
      return {
        data: body.data,
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: { message: "Failed to update seller profile" },
        details: error instanceof Error ? error.message : String(error),
      };
    }
  },

  getSellerDashboard: async (): Promise<ServiceResult<SellerDashboardData>> => {
    try {
      const response = await serverApiFetch("/seller/dashboard", {
        method: "GET",
      });

      if (!response.ok) {
        return {
          data: null,
          error: { message: "Failed to fetch seller dashboard" },
        };
      }

      const body = (await response.json()) as ApiEnvelope<SellerDashboardData>;
      return {
        data: body.data,
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: { message: "Failed to fetch seller dashboard" },
        details: error instanceof Error ? error.message : String(error),
      };
    }
  },

  getSellerMedicines: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<ServiceResult<SellerMedicinesResult>> => {
    try {
      const query = new URLSearchParams();
      query.set("page", String(params?.page ?? 1));
      query.set("limit", String(params?.limit ?? 10));
      if (params?.search) {
        query.set("search", params.search);
      }

      const response = await serverApiFetch(
        `/seller/medicines?${query.toString()}`,
        {
          method: "GET",
        },
      );

      if (!response.ok) {
        return {
          data: {
            medicines: [],
            meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
          },
          error: { message: "Failed to fetch seller medicines" },
        };
      }

      const body = (await response.json()) as ApiEnvelope<SellerMedicine[]> & {
        meta?: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
      };

      return {
        data: {
          medicines: Array.isArray(body.data) ? body.data : [],
          meta: {
            page: body.meta?.page ?? 1,
            limit: body.meta?.limit ?? 10,
            total: body.meta?.total ?? 0,
            totalPages: body.meta?.totalPages ?? 0,
          },
        },
        error: null,
      };
    } catch (error) {
      return {
        data: {
          medicines: [],
          meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
        },
        error: { message: "Failed to fetch seller medicines" },
        details: error instanceof Error ? error.message : String(error),
      };
    }
  },

  createMedicine: async (payload: SellerMedicinePayload) => {
    try {
      const response = await serverApiFetch("/seller/medicines", {
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
          message: err?.message ?? "Failed to create medicine",
        };
      }

      return { success: true, message: "Medicine created successfully" };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to create medicine",
      };
    }
  },

  updateMedicine: async (
    medicineId: string,
    payload: Partial<SellerMedicinePayload>,
  ) => {
    try {
      const response = await serverApiFetch(`/seller/medicines/${medicineId}`, {
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
          message: err?.message ?? "Failed to update medicine",
        };
      }

      return { success: true, message: "Medicine updated successfully" };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to update medicine",
      };
    }
  },

  deleteMedicine: async (medicineId: string) => {
    try {
      const response = await serverApiFetch(`/seller/medicines/${medicineId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const err = (await response.json().catch(() => null)) as {
          message?: string;
        } | null;
        return {
          success: false,
          message: err?.message ?? "Failed to delete medicine",
        };
      }

      return { success: true, message: "Medicine removed successfully" };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to delete medicine",
      };
    }
  },

  updateMedicineStock: async (medicineId: string, stock: number) => {
    try {
      const response = await serverApiFetch(
        `/seller/medicines/${medicineId}/stock`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stock }),
        },
      );

      if (!response.ok) {
        const err = (await response.json().catch(() => null)) as {
          message?: string;
        } | null;
        return {
          success: false,
          message: err?.message ?? "Failed to update stock",
        };
      }

      return { success: true, message: "Stock updated successfully" };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to update stock",
      };
    }
  },

  getSellerOrders: async (params?: {
    page?: number;
    limit?: number;
    status?: OrderStatus;
  }): Promise<ServiceResult<SellerOrdersResult>> => {
    try {
      const query = new URLSearchParams();
      query.set("page", String(params?.page ?? 1));
      query.set("limit", String(params?.limit ?? 10));
      if (params?.status) query.set("status", params.status);

      const response = await serverApiFetch(
        `/seller/orders?${query.toString()}`,
        {
          method: "GET",
        },
      );

      if (!response.ok) {
        return {
          data: {
            orders: [],
            meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
          },
          error: { message: "Failed to fetch seller orders" },
        };
      }

      const body = (await response.json()) as ApiEnvelope<SellerOrder[]> & {
        meta?: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
      };

      return {
        data: {
          orders: Array.isArray(body.data) ? body.data : [],
          meta: {
            page: body.meta?.page ?? 1,
            limit: body.meta?.limit ?? 10,
            total: body.meta?.total ?? 0,
            totalPages: body.meta?.totalPages ?? 0,
          },
        },
        error: null,
      };
    } catch (error) {
      return {
        data: {
          orders: [],
          meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
        },
        error: { message: "Failed to fetch seller orders" },
        details: error instanceof Error ? error.message : String(error),
      };
    }
  },

  getSellerOrderById: async (
    sellerOrderId: string,
  ): Promise<ServiceResult<SellerOrder>> => {
    try {
      const response = await serverApiFetch(`/seller/orders/${sellerOrderId}`, {
        method: "GET",
      });

      if (!response.ok) {
        return {
          data: null,
          error: { message: "Failed to fetch seller order" },
        };
      }

      const body = (await response.json()) as ApiEnvelope<SellerOrder>;
      return {
        data: body.data,
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: { message: "Failed to fetch seller order" },
        details: error instanceof Error ? error.message : String(error),
      };
    }
  },

  updateSellerOrderStatus: async (
    sellerOrderId: string,
    status: OrderStatus,
  ) => {
    try {
      const response = await serverApiFetch(
        `/seller/orders/${sellerOrderId}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        },
      );

      if (!response.ok) {
        const err = (await response.json().catch(() => null)) as {
          message?: string;
        } | null;
        return {
          success: false,
          message: err?.message ?? "Failed to update order status",
        };
      }

      return { success: true, message: "Order status updated" };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to update order status",
      };
    }
  },
};
