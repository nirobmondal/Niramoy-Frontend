import { serverApiFetch } from "@/services/api-client.service";
import type { CartData, CartResponse } from "@/types/cart";

type RawCartItem = {
  id?: string;
  quantity?: number | string;
  medicine?: {
    id?: string;
    name?: string;
    price?: number | string;
    imageUrl?: string | null;
  };
};

type RawCartData = {
  id?: string;
  items?: RawCartItem[];
  total?: number | string;
  totalPrice?: number | string;
};

type CartPayload = {
  data?: RawCartData;
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

function normalizeCart(raw: RawCartData | undefined): CartData {
  const items = Array.isArray(raw?.items)
    ? raw.items.map((item) => ({
        id: String(item.id ?? ""),
        quantity: Math.max(1, Math.floor(toNumber(item.quantity, 1))),
        medicine: {
          id: String(item.medicine?.id ?? ""),
          name: String(item.medicine?.name ?? "Unknown medicine"),
          price: toNumber(item.medicine?.price, 0),
          imageUrl: item.medicine?.imageUrl ?? null,
        },
      }))
    : [];

  return {
    id: String(raw?.id ?? ""),
    items,
    total: toNumber(raw?.total ?? raw?.totalPrice, 0),
  };
}

export const cartService = {
  async getCartItemCount() {
    try {
      const response = await serverApiFetch("/cart", {
        method: "GET",
      });

      if (!response.ok) {
        return { data: 0, error: { message: "Failed to fetch cart" } };
      }

      const payload = (await response.json()) as CartPayload;
      const items = Array.isArray(payload?.data?.items)
        ? payload.data.items
        : [];

      const count = items.reduce((total, item) => {
        const quantity = Math.max(0, Math.floor(toNumber(item.quantity, 0)));
        return total + quantity;
      }, 0);

      return { data: count, error: null };
    } catch (error) {
      return {
        data: 0,
        error: {
          message:
            error instanceof Error ? error.message : "Failed to fetch cart",
        },
      };
    }
  },

  async getCart() {
    try {
      const response = await serverApiFetch("/cart", {
        method: "GET",
      });

      if (!response.ok) {
        return {
          data: null as CartData | null,
          error: { message: "Failed to fetch cart" },
        };
      }

      const payload = (await response.json()) as CartResponse;
      return {
        data: normalizeCart(payload.data as RawCartData | undefined),
        error: null,
      };
    } catch (error) {
      return {
        data: null as CartData | null,
        error: {
          message:
            error instanceof Error ? error.message : "Failed to fetch cart",
        },
      };
    }
  },

  async updateCartItemQuantity(cartItemId: string, quantity: number) {
    try {
      const response = await serverApiFetch(`/cart/items/${cartItemId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity }),
      });

      if (!response.ok) {
        return {
          success: false,
          message: "Failed to update cart item",
        };
      }

      return {
        success: true,
        message: "Cart updated",
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to update cart item",
      };
    }
  },

  async removeCartItem(cartItemId: string) {
    try {
      const response = await serverApiFetch(`/cart/items/${cartItemId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        return {
          success: false,
          message: "Failed to remove cart item",
        };
      }

      return {
        success: true,
        message: "Item removed from cart",
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to remove cart item",
      };
    }
  },

  async clearCart() {
    try {
      const response = await serverApiFetch(`/cart`, {
        method: "DELETE",
      });

      if (!response.ok) {
        return {
          success: false,
          message: "Failed to clear cart",
        };
      }

      return {
        success: true,
        message: "Cart cleared",
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to clear cart",
      };
    }
  },
};
