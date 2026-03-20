"use server";

import { revalidatePath } from "next/cache";
import { Roles } from "@/constants/role";
import { getAuthStateAction } from "@/actions/user.actions";
import { cartService } from "@/services/cart.service";

async function ensureCustomerAccess() {
  const authState = await getAuthStateAction();

  if (!authState.isAuthenticated) {
    return { ok: false, message: "Please login first" };
  }

  if (authState.role !== Roles.CUSTOMER) {
    return { ok: false, message: "Only customers can access cart" };
  }

  return { ok: true, message: "ok" };
}

export async function getNavbarCartCountAction() {
  const result = await cartService.getCartItemCount();
  return result.data ?? 0;
}

export async function getCartAction() {
  const access = await ensureCustomerAccess();
  if (!access.ok) {
    return null;
  }

  const result = await cartService.getCart();
  return result.data;
}

export async function updateCartItemQuantityAction(
  cartItemId: string,
  quantity: number,
) {
  const access = await ensureCustomerAccess();
  if (!access.ok) {
    return { success: false, message: access.message };
  }

  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
    return { success: false, message: "Quantity must be between 1 and 99" };
  }

  const result = await cartService.updateCartItemQuantity(cartItemId, quantity);
  if (result.success) {
    revalidatePath("/cart");
    revalidatePath("/checkout");
  }
  return result;
}

export async function removeCartItemAction(cartItemId: string) {
  const access = await ensureCustomerAccess();
  if (!access.ok) {
    return { success: false, message: access.message };
  }

  const result = await cartService.removeCartItem(cartItemId);
  if (result.success) {
    revalidatePath("/cart");
    revalidatePath("/checkout");
  }
  return result;
}

export async function clearCartAction() {
  const access = await ensureCustomerAccess();
  if (!access.ok) {
    return { success: false, message: access.message };
  }

  const result = await cartService.clearCart();
  if (result.success) {
    revalidatePath("/cart");
    revalidatePath("/checkout");
  }
  return result;
}
