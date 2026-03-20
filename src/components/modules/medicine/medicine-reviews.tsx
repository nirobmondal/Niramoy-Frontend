"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { toast } from "sonner";

import {
  createReviewAction,
  deleteReviewAction,
  updateReviewAction,
} from "@/actions/reviews.actions";
import { Roles, type RoleValue } from "@/constants/role";
import type { MedicineReviewsData } from "@/types/review";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type MedicineReviewsProps = {
  medicineId: string;
  reviewsData: MedicineReviewsData;
  currentUserId?: string | null;
  currentUserRole?: RoleValue | null;
};

function renderStars(value: number) {
  return Array.from({ length: 5 }, (_, index) => {
    const filled = index < value;
    return (
      <Star
        key={`star-${index}`}
        className={`size-4 ${filled ? "fill-amber-500 text-amber-500" : "text-slate-300"}`}
      />
    );
  });
}

export function MedicineReviews({
  medicineId,
  reviewsData,
  currentUserId,
  currentUserRole,
}: MedicineReviewsProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const ownReview = useMemo(
    () =>
      reviewsData.reviews.find(
        (review) =>
          review.user?.id === currentUserId || review.userId === currentUserId,
      ) ?? null,
    [reviewsData.reviews, currentUserId],
  );

  const [rating, setRating] = useState<number>(ownReview?.rating ?? 5);
  const [comment, setComment] = useState<string>(ownReview?.comment ?? "");

  const canWriteReview = currentUserRole === Roles.CUSTOMER;
  const canDeleteAny = currentUserRole === Roles.ADMIN;

  async function handleSaveReview() {
    if (!canWriteReview) {
      toast.error("Only customers can submit reviews");
      return;
    }

    setIsSubmitting(true);

    const result = ownReview
      ? await updateReviewAction({
          medicineId,
          reviewId: ownReview.id,
          rating,
          comment,
        })
      : await createReviewAction({
          medicineId,
          rating,
          comment,
        });

    if (!result.success) {
      toast.error(result.message);
      setIsSubmitting(false);
      return;
    }

    toast.success(result.message);
    router.refresh();
    setIsSubmitting(false);
  }

  async function handleDeleteReview(reviewId: string) {
    if (!currentUserId) {
      toast.error("Please login first");
      return;
    }

    const shouldDelete = window.confirm(
      "Are you sure you want to delete this review?",
    );

    if (!shouldDelete) {
      return;
    }

    setIsSubmitting(true);
    const result = await deleteReviewAction({
      medicineId,
      reviewId,
    });

    if (!result.success) {
      toast.error(result.message);
      setIsSubmitting(false);
      return;
    }

    toast.success(result.message);
    router.refresh();
    setIsSubmitting(false);
  }

  return (
    <Card className="rounded-2xl border-[#d8e5ec] bg-white shadow-[0_18px_42px_-28px_rgba(15,76,117,0.25)]">
      <CardContent className="space-y-6 p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xl font-semibold tracking-tight text-[#1d3340]">
            Reviews
          </h2>
          <div className="text-sm text-[#5f7784]">
            <span className="font-semibold text-[#1f3543]">
              {reviewsData.averageRating.toFixed(1)}
            </span>{" "}
            average from {reviewsData.totalReviews} review
            {reviewsData.totalReviews === 1 ? "" : "s"}
          </div>
        </div>

        {!currentUserId ? (
          <div className="rounded-xl border border-dashed border-[#d8e5ec] bg-[#f8fbfd] p-4 text-sm text-[#5f7784]">
            Please{" "}
            <Link
              href="/login"
              className="font-semibold text-[#0f8f8f] hover:underline"
            >
              login
            </Link>{" "}
            as a customer to leave a review.
          </div>
        ) : canWriteReview ? (
          <div className="space-y-3 rounded-xl border border-[#d8e5ec] bg-[#f8fbfd] p-4">
            <p className="text-sm font-semibold text-[#1f3543]">
              {ownReview ? "Update your review" : "Write a review"}
            </p>

            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 5 }, (_, index) => index + 1).map(
                (value) => (
                  <Button
                    key={`rate-${value}`}
                    type="button"
                    variant={rating === value ? "default" : "outline"}
                    className={
                      rating === value
                        ? "bg-emerald-700 hover:bg-emerald-800"
                        : ""
                    }
                    onClick={() => setRating(value)}
                    disabled={isSubmitting}
                  >
                    {value} Star
                  </Button>
                ),
              )}
            </div>

            <textarea
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              rows={3}
              placeholder="Share your experience with this medicine"
              disabled={isSubmitting}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />

            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                onClick={handleSaveReview}
                disabled={isSubmitting}
                className="bg-emerald-700 hover:bg-emerald-800"
              >
                {isSubmitting
                  ? ownReview
                    ? "Updating..."
                    : "Submitting..."
                  : ownReview
                    ? "Update Review"
                    : "Submit Review"}
              </Button>

              {ownReview ? (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => handleDeleteReview(ownReview.id)}
                  disabled={isSubmitting}
                >
                  Delete My Review
                </Button>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-[#d8e5ec] bg-[#f8fbfd] p-4 text-sm text-[#5f7784]">
            Reviews can be submitted only from customer accounts.
          </div>
        )}

        {reviewsData.reviews.length === 0 ? (
          <p className="text-sm text-[#5f7784]">
            No reviews yet. Be the first to share your feedback.
          </p>
        ) : (
          <div className="space-y-3">
            {reviewsData.reviews.map((review) => {
              const canDelete =
                canDeleteAny ||
                review.user?.id === currentUserId ||
                review.userId === currentUserId;

              const createdAtLabel = review.createdAt
                ? new Date(review.createdAt).toLocaleDateString()
                : null;

              return (
                <article
                  key={review.id}
                  className="rounded-xl border border-[#d8e5ec] bg-[#fbfdff] p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-[#1f3543]">
                      {review.user?.name ?? "Anonymous Customer"}
                    </p>
                    <div className="flex items-center gap-1">
                      {renderStars(review.rating)}
                    </div>
                  </div>

                  {review.comment ? (
                    <p className="mt-2 text-sm text-[#4f6876]">
                      {review.comment}
                    </p>
                  ) : null}

                  <div className="mt-2 flex items-center justify-between gap-2">
                    <p className="text-xs text-[#6f8792]">
                      {createdAtLabel ? `Reviewed on ${createdAtLabel}` : ""}
                    </p>

                    {canDelete ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-rose-700 hover:bg-rose-50 hover:text-rose-700"
                        onClick={() => handleDeleteReview(review.id)}
                        disabled={isSubmitting}
                      >
                        Delete
                      </Button>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
