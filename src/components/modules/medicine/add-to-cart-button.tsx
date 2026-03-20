"use client";

import { ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { getApiBaseUrl } from "@/lib/api-url";

type AddToCartButtonProps = {
  medicineId: string;
  quantity: number;
  disabled?: boolean;
};

export function AddToCartButton({
  medicineId,
  quantity,
  disabled = false,
}: AddToCartButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async () => {
    if (disabled || quantity < 1) {
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch(`${getApiBaseUrl()}/cart/items`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          medicineId,
          quantity,
        }),
      });

      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        toast.error(payload.message ?? "Failed to add medicine to cart");
        return;
      }

      toast.success(payload.message ?? "Medicine added to cart");
      router.refresh();
    } catch {
      toast.error("Could not connect to the cart service");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="button"
      onClick={handleAddToCart}
      disabled={disabled || isLoading}
      className="h-11 w-full rounded-xl bg-[#0f8f8f] text-white hover:bg-[#0d7d7d]"
      aria-label="Add selected medicine quantity to cart"
    >
      <ShoppingCart className="size-4" />
      {isLoading ? "Adding..." : "Add to Cart"}
    </Button>
  );
}
