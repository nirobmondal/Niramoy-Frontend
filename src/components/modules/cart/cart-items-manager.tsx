"use client";

import {
  clearCartAction,
  removeCartItemAction,
  updateCartItemQuantityAction,
} from "@/actions/cart.actions";
import { QuantitySelector } from "@/components/modules/medicine/quantity-selector";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { CartData } from "@/types/cart";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type CartItemsManagerProps = {
  cart: CartData;
};

function toCurrencyNumber(value: unknown) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  if (typeof value === "string") {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
}

export function CartItemsManager({ cart }: CartItemsManagerProps) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isClearing, setIsClearing] = useState(false);

  async function handleUpdate(itemId: string, quantity: number) {
    setPendingId(itemId);
    const result = await updateCartItemQuantityAction(itemId, quantity);
    if (!result.success) {
      toast.error(result.message);
      setPendingId(null);
      return;
    }

    router.refresh();
    setPendingId(null);
  }

  async function handleRemove(itemId: string) {
    setPendingId(itemId);
    const result = await removeCartItemAction(itemId);
    if (!result.success) {
      toast.error(result.message);
      setPendingId(null);
      return;
    }

    toast.success(result.message);
    router.refresh();
    setPendingId(null);
  }

  async function handleClear() {
    setIsClearing(true);
    const result = await clearCartAction();
    if (!result.success) {
      toast.error(result.message);
      setIsClearing(false);
      return;
    }

    toast.success(result.message);
    router.refresh();
    setIsClearing(false);
  }

  return (
    <div className="space-y-3">
      {cart.items.map((item) => {
        const itemPrice = toCurrencyNumber(item.medicine.price);
        const itemQuantity = Math.max(1, toCurrencyNumber(item.quantity));
        const itemTotal = itemPrice * itemQuantity;

        return (
          <Card key={item.id}>
            <CardContent className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium">{item.medicine.name}</p>
                <p className="text-sm text-muted-foreground">
                  Item total: ৳{itemTotal.toFixed(2)}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <QuantitySelector
                  value={item.quantity}
                  min={1}
                  max={99}
                  disabled={pendingId === item.id}
                  onChange={(value) => handleUpdate(item.id, value)}
                />

                <Button
                  type="button"
                  variant="destructive"
                  size="icon-sm"
                  onClick={() => handleRemove(item.id)}
                  disabled={pendingId === item.id}
                  aria-label="Remove item"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}

      <Card>
        <CardContent className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="font-semibold">Subtotal</p>
            <Badge variant="outline">{cart.items.length} items</Badge>
          </div>
          <p className="text-xl font-semibold text-emerald-700">
            ৳{toCurrencyNumber(cart.total).toFixed(2)}
          </p>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2">
        <Link
          href="/checkout"
          className="inline-flex rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800"
        >
          Proceed to Checkout
        </Link>
        <Button
          type="button"
          variant="outline"
          onClick={handleClear}
          disabled={isClearing}
        >
          {isClearing ? "Clearing..." : "Clear Cart"}
        </Button>
      </div>
    </div>
  );
}
