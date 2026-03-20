"use client";

import { updateSellerOrderStatusAction } from "@/actions/seller.actions";
import { Button } from "@/components/ui/button";
import type { OrderStatus } from "@/types/order";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const statusFlow: OrderStatus[] = [
  "PLACED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

type SellerOrderStatusUpdaterProps = {
  sellerOrderId: string;
  currentStatus: OrderStatus;
};

export function SellerOrderStatusUpdater({
  sellerOrderId,
  currentStatus,
}: SellerOrderStatusUpdaterProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  async function updateStatus(status: OrderStatus) {
    setIsUpdating(true);
    const result = await updateSellerOrderStatusAction(sellerOrderId, status);

    if (!result.success) {
      toast.error(result.message);
      setIsUpdating(false);
      return;
    }

    toast.success(result.message);
    router.refresh();
    setIsUpdating(false);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {statusFlow.map((status) => (
        <Button
          key={status}
          type="button"
          variant={status === currentStatus ? "default" : "outline"}
          disabled={isUpdating || status === currentStatus}
          onClick={() => updateStatus(status)}
          className={
            status === currentStatus
              ? "bg-emerald-700 hover:bg-emerald-800"
              : ""
          }
        >
          {status}
        </Button>
      ))}
    </div>
  );
}
