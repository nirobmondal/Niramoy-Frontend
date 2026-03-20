"use server";

import { revalidatePath } from "next/cache";
import { Roles } from "@/constants/role";
import { checkoutSchema } from "@/components/modules/checkout/checkout.schemas";
import { getAuthStateAction } from "@/actions/user.actions";
import { ordersService } from "@/services/orders.service";

async function ensureCustomerAccess() {
  const authState = await getAuthStateAction();

  if (!authState.isAuthenticated) {
    return { ok: false, message: "Please login first" };
  }

  if (authState.role !== Roles.CUSTOMER) {
    return { ok: false, message: "Only customers can access orders" };
  }

  return { ok: true, message: "ok" };
}

export async function getMyOrdersAction(params?: {
  page?: number;
  limit?: number;
  status?: string;
}) {
  const access = await ensureCustomerAccess();
  if (!access.ok) {
    return {
      orders: [],
      meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
    };
  }

  const result = await ordersService.getMyOrders(params);
  return result.data;
}

export async function getOrderByIdAction(orderId: string) {
  const access = await ensureCustomerAccess();
  if (!access.ok) {
    return null;
  }

  const result = await ordersService.getOrderById(orderId);
  return result.data;
}

export async function placeOrderAction(payload: {
  shippingAddress: string;
  shippingCity: string;
  phone: string;
  notes?: string;
}) {
  const access = await ensureCustomerAccess();
  if (!access.ok) {
    return { success: false, message: access.message };
  }

  const parsed = checkoutSchema.safeParse(payload);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Invalid checkout data",
    };
  }

  const result = await ordersService.placeOrder(parsed.data);
  if (result.success) {
    revalidatePath("/orders");
    revalidatePath("/cart");
    revalidatePath("/checkout");
  }
  return result;
}

export async function cancelOrderAction(orderId: string) {
  const access = await ensureCustomerAccess();
  if (!access.ok) {
    return { success: false, message: access.message };
  }

  const result = await ordersService.cancelOrder(orderId);
  if (result.success) {
    revalidatePath("/orders");
    revalidatePath(`/orders/${orderId}`);
  }
  return result;
}
