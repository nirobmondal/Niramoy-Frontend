"use client";

import { deleteReviewAction } from "@/actions/reviews.actions";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type AdminReviewDeleteButtonProps = {
  medicineId: string;
  reviewId: string;
};

export function AdminReviewDeleteButton({
  medicineId,
  reviewId,
}: AdminReviewDeleteButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    const shouldDelete = window.confirm(
      "Delete this review? This action cannot be undone.",
    );

    if (!shouldDelete) {
      return;
    }

    setIsDeleting(true);

    const result = await deleteReviewAction({
      medicineId,
      reviewId,
    });

    if (!result.success) {
      toast.error(result.message);
      setIsDeleting(false);
      return;
    }

    toast.success(result.message);
    router.refresh();
    setIsDeleting(false);
  }

  return (
    <Button
      type="button"
      variant="destructive"
      size="sm"
      disabled={isDeleting}
      onClick={handleDelete}
    >
      {isDeleting ? "Deleting..." : "Delete Review"}
    </Button>
  );
}
