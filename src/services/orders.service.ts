import { serverApiFetch } from "@/services/api-client.service";
import type { OrdersListResult, OrderSummary } from "@/types/order";

type SellerOrderStatus =
  | "PLACED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

type RawOrderItem = {
  id?: string;
  quantity?: number | string;
  price?: number | string;
  medicine?: {
    id?: string;
    name?: string;
  };
};

type RawSellerOrder = {
  id?: string;
  status?: SellerOrderStatus;
  items?: RawOrderItem[];
  seller?: {
    id?: string;
    storeName?: string;
  };
};

type RawOrder = {
  id?: string;
  totalPrice?: number | string;
  shippingAddress?: string;
  status?: SellerOrderStatus;
  createdAt?: string;
  items?: RawOrderItem[];
  sellerOrders?: RawSellerOrder[];
};

type ApiOrdersEnvelope = {
  success: boolean;
  message: string;
  data: RawOrder[];
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

function deriveStatus(
  order: RawOrder,
): "PLACED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" {
  const statuses = (order.sellerOrders ?? [])
    .map((sellerOrder) => sellerOrder.status)
    .filter(Boolean) as SellerOrderStatus[];

  if (order.status) {
    return order.status;
  }

  if (statuses.length === 0) {
    return "PLACED";
  }

  if (statuses.every((status) => status === "CANCELLED")) {
    return "CANCELLED";
  }

  const rank: Record<SellerOrderStatus, number> = {
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

function normalizeOrderItems(order: RawOrder) {
  const directItems = Array.isArray(order.items) ? order.items : [];

  if (directItems.length > 0) {
    return directItems.map((item) => ({
      id: String(item.id ?? ""),
      quantity: Math.max(1, Math.floor(toNumber(item.quantity, 1))),
      price: toNumber(item.price, 0),
      medicine: item.medicine?.id
        ? {
            id: String(item.medicine.id),
            name: String(item.medicine.name ?? "Medicine"),
          }
        : undefined,
    }));
  }

  const nestedItems = (order.sellerOrders ?? []).flatMap((sellerOrder) =>
    Array.isArray(sellerOrder.items) ? sellerOrder.items : [],
  );

  return nestedItems.map((item) => ({
    id: String(item.id ?? ""),
    quantity: Math.max(1, Math.floor(toNumber(item.quantity, 1))),
    price: toNumber(item.price, 0),
    medicine: item.medicine?.id
      ? {
          id: String(item.medicine.id),
          name: String(item.medicine.name ?? "Medicine"),
        }
      : undefined,
  }));
}

function normalizeOrder(raw: RawOrder): OrderSummary {
  return {
    id: String(raw.id ?? ""),
    totalPrice: toNumber(raw.totalPrice, 0),
    shippingAddress: raw.shippingAddress,
    status: deriveStatus(raw),
    createdAt: raw.createdAt,
    items: normalizeOrderItems(raw),
    sellerOrders: Array.isArray(raw.sellerOrders)
      ? raw.sellerOrders.map((sellerOrder) => ({
          id: String(sellerOrder.id ?? ""),
          status: sellerOrder.status,
          seller: sellerOrder.seller?.id
            ? {
                id: String(sellerOrder.seller.id),
                storeName: sellerOrder.seller.storeName,
              }
            : undefined,
        }))
      : [],
  };
}

export const ordersService = {
  async getMyOrders(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) {
    try {
      const query = new URLSearchParams();
      query.set("page", String(params?.page ?? 1));
      query.set("limit", String(params?.limit ?? 10));
      if (params?.status) {
        query.set("status", params.status);
      }

      const response = await serverApiFetch(`/orders?${query.toString()}`, {
        method: "GET",
      });

      if (!response.ok) {
        return {
          data: {
            orders: [],
            meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
          } as OrdersListResult,
          error: { message: "Failed to fetch orders" },
        };
      }

      const payload = (await response.json()) as ApiOrdersEnvelope;
      return {
        data: {
          orders: Array.isArray(payload.data)
            ? payload.data.map(normalizeOrder)
            : [],
          meta: {
            page: payload.meta?.page ?? 1,
            limit: payload.meta?.limit ?? 10,
            total: payload.meta?.total ?? 0,
            totalPages: payload.meta?.totalPages ?? 0,
          },
        } as OrdersListResult,
        error: null,
      };
    } catch (error) {
      return {
        data: {
          orders: [],
          meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
        } as OrdersListResult,
        error: {
          message:
            error instanceof Error ? error.message : "Failed to fetch orders",
        },
      };
    }
  },

  async getOrderById(orderId: string) {
    try {
      const response = await serverApiFetch(`/orders/${orderId}`, {
        method: "GET",
      });

      if (!response.ok) {
        return {
          data: null as OrderSummary | null,
          error: { message: "Failed to fetch order" },
        };
      }

      const payload = (await response.json()) as {
        success: boolean;
        message: string;
        data: RawOrder;
      };

      return {
        data: normalizeOrder(payload.data ?? {}),
        error: null,
      };
    } catch (error) {
      return {
        data: null as OrderSummary | null,
        error: {
          message:
            error instanceof Error ? error.message : "Failed to fetch order",
        },
      };
    }
  },

  async placeOrder(payload: {
    shippingAddress: string;
    shippingCity: string;
    phone: string;
    notes?: string;
  }) {
    try {
      const response = await serverApiFetch(`/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as {
          message?: string;
        } | null;
        return {
          success: false,
          message: body?.message ?? "Failed to place order",
        };
      }

      return {
        success: true,
        message: "Order placed successfully",
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to place order",
      };
    }
  },

  async cancelOrder(orderId: string) {
    try {
      const response = await serverApiFetch(`/orders/${orderId}/cancel`, {
        method: "PATCH",
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as {
          message?: string;
        } | null;
        return {
          success: false,
          message: body?.message ?? "Failed to cancel order",
        };
      }

      return {
        success: true,
        message: "Order cancelled successfully",
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to cancel order",
      };
    }
  },
};
