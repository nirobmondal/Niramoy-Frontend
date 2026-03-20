"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  deleteReviewAction,
  updateReviewAction,
} from "@/actions/reviews.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type AdminReviewRowActionsProps = {
  reviewId: string;
  medicineId: string;
  currentRating: number;
  currentComment?: string | null;
};

export function AdminReviewRowActions({
  reviewId,
  medicineId,
  currentRating,
  currentComment,
}: AdminReviewRowActionsProps) {
  const router = useRouter();
  const [rating, setRating] = useState(String(currentRating));
  const [comment, setComment] = useState(currentComment ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleUpdate() {
    const parsedRating = Number.parseInt(rating, 10);

    if (
      !Number.isInteger(parsedRating) ||
      parsedRating < 1 ||
      parsedRating > 5
    ) {
      toast.error("Rating must be between 1 and 5");
      return;
    }

    setIsSaving(true);

    const result = await updateReviewAction({
      medicineId,
      reviewId,
      rating: parsedRating,
      comment,
    });

    if (!result.success) {
      toast.error(result.message);
      setIsSaving(false);
      return;
    }

    toast.success(result.message);
    router.refresh();
    setIsSaving(false);
  }

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
    <div className="space-y-2 rounded-lg border border-border/70 p-3">
      <p className="text-xs font-medium text-muted-foreground">Admin Actions</p>

      <div className="grid gap-2 sm:grid-cols-[110px_1fr]">
        <Input
          value={rating}
          onChange={(event) => setRating(event.target.value)}
          placeholder="Rating"
          type="number"
          min={1}
          max={5}
        />
        <Input
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          placeholder="Update comment"
        />
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={handleUpdate}
          disabled={isSaving || isDeleting}
        >
          {isSaving ? "Updating..." : "Update"}
        </Button>
        <Button
          type="button"
          variant="destructive"
          onClick={handleDelete}
          disabled={isSaving || isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
      </div>
    </div>
  );
}
