"use server";

import { revalidatePath } from "next/cache";

import { getAuthStateAction } from "@/actions/user.actions";
import { Roles } from "@/constants/role";
import { reviewsService } from "@/services/reviews.service";

function sanitizeReviewPayload(input: { rating: number; comment?: string }) {
  const rating = Number(input.rating);

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return {
      ok: false,
      message: "Rating must be an integer between 1 and 5",
      payload: null,
    };
  }

  const comment = input.comment?.trim();

  return {
    ok: true,
    message: "ok",
    payload: {
      rating,
      comment: comment ? comment : undefined,
    },
  };
}

export async function createReviewAction(input: {
  medicineId: string;
  rating: number;
  comment?: string;
}) {
  const authState = await getAuthStateAction();

  if (!authState.isAuthenticated) {
    return { success: false, message: "Please login first" };
  }

  if (authState.role !== Roles.CUSTOMER) {
    return { success: false, message: "Only customers can submit reviews" };
  }

  const parsed = sanitizeReviewPayload({
    rating: input.rating,
    comment: input.comment,
  });

  if (!parsed.ok || !parsed.payload) {
    return { success: false, message: parsed.message };
  }

  const result = await reviewsService.createReview(
    input.medicineId,
    parsed.payload,
  );

  if (result.success) {
    revalidatePath(`/shop/${input.medicineId}`);
    revalidatePath("/shop");
  }

  return result;
}

export async function updateReviewAction(input: {
  medicineId: string;
  reviewId: string;
  rating: number;
  comment?: string;
}) {
  const authState = await getAuthStateAction();

  if (!authState.isAuthenticated) {
    return { success: false, message: "Please login first" };
  }

  if (authState.role !== Roles.CUSTOMER && authState.role !== Roles.ADMIN) {
    return {
      success: false,
      message: "Only customers or admins can update reviews",
    };
  }

  const parsed = sanitizeReviewPayload({
    rating: input.rating,
    comment: input.comment,
  });

  if (!parsed.ok || !parsed.payload) {
    return { success: false, message: parsed.message };
  }

  const result = await reviewsService.updateReview(
    input.reviewId,
    parsed.payload,
  );

  if (result.success) {
    revalidatePath(`/shop/${input.medicineId}`);
    revalidatePath("/admin/reviews");
    revalidatePath(`/admin/medicines/${input.medicineId}/reviews`);
  }

  return result;
}

export async function deleteReviewAction(input: {
  medicineId: string;
  reviewId: string;
}) {
  const authState = await getAuthStateAction();

  if (!authState.isAuthenticated) {
    return { success: false, message: "Please login first" };
  }

  if (authState.role !== Roles.CUSTOMER && authState.role !== Roles.ADMIN) {
    return {
      success: false,
      message: "Only customers or admins can delete reviews",
    };
  }

  const result = await reviewsService.deleteReview(input.reviewId);

  if (result.success) {
    revalidatePath(`/shop/${input.medicineId}`);
    revalidatePath("/admin/reviews");
    revalidatePath(`/admin/medicines/${input.medicineId}/reviews`);
  }

  return result;
}
