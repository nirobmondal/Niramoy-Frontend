"use client";

import { cancelOrderAction } from "@/actions/orders.actions";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type OrderCancelButtonProps = {
  orderId: string;
  canCancel: boolean;
};

export function OrderCancelButton({
  orderId,
  canCancel,
}: OrderCancelButtonProps) {
  const router = useRouter();
  const [isCancelling, setIsCancelling] = useState(false);

  async function handleCancel() {
    if (!canCancel) {
      toast.error("Only PLACED orders can be cancelled");
      return;
    }

    const shouldCancel = window.confirm(
      "Are you sure you want to cancel this order? This action cannot be undone.",
    );

    if (!shouldCancel) {
      return;
    }

    setIsCancelling(true);
    const result = await cancelOrderAction(orderId);

    if (!result.success) {
      toast.error(result.message);
      setIsCancelling(false);
      return;
    }

    toast.success(result.message);
    router.refresh();
    setIsCancelling(false);
  }

  return (
    <Button
      type="button"
      variant="destructive"
      onClick={handleCancel}
      disabled={!canCancel || isCancelling}
    >
      {isCancelling ? "Cancelling..." : "Cancel Order"}
    </Button>
  );
}
