import { getApiBaseUrl } from "@/lib/api-url";
import { serverApiFetch } from "@/services/api-client.service";
import type { MedicineReview, MedicineReviewsData } from "@/types/review";

type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

type ReviewsApiData = {
  reviews?: Array<Record<string, unknown>>;
  averageRating?: number;
  totalReviews?: number;
};

type MutationResult = {
  success: boolean;
  message: string;
};

function toNumber(value: unknown, fallback = 0) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : fallback;
  }

  if (typeof value === "string") {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  return fallback;
}

function normalizeReview(raw: Record<string, unknown>): MedicineReview {
  const rawUser = raw.user as Record<string, unknown> | undefined;

  return {
    id: String(raw.id ?? ""),
    rating: toNumber(raw.rating),
    comment: (raw.comment as string | null | undefined) ?? null,
    createdAt: (raw.createdAt as string | undefined) ?? undefined,
    userId: (raw.userId as string | undefined) ?? undefined,
    user: rawUser
      ? {
          id: String(rawUser.id ?? ""),
          name: String(rawUser.name ?? "Anonymous"),
          image: (rawUser.image as string | null | undefined) ?? null,
        }
      : null,
  };
}

async function getErrorMessage(response: Response, fallback: string) {
  const body = (await response.json().catch(() => null)) as {
    message?: string;
  } | null;

  return body?.message ?? fallback;
}

export const reviewsService = {
  async getMedicineReviews(medicineId: string): Promise<MedicineReviewsData> {
    const endpoint = `${getApiBaseUrl()}/medicines/${medicineId}/reviews`;
    const response = await fetch(endpoint, { cache: "no-store" });

    if (!response.ok) {
      return {
        reviews: [],
        averageRating: 0,
        totalReviews: 0,
      };
    }

    const payload = (await response.json()) as ApiEnvelope<ReviewsApiData>;
    const rawReviews = Array.isArray(payload.data?.reviews)
      ? payload.data.reviews
      : [];

    return {
      reviews: rawReviews.map((review) => normalizeReview(review)),
      averageRating: toNumber(payload.data?.averageRating),
      totalReviews: toNumber(payload.data?.totalReviews),
    };
  },

  async createReview(
    medicineId: string,
    payload: { rating: number; comment?: string },
  ): Promise<MutationResult> {
    const response = await serverApiFetch(`/medicines/${medicineId}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return {
        success: false,
        message: await getErrorMessage(response, "Failed to create review"),
      };
    }

    return {
      success: true,
      message: "Review submitted successfully",
    };
  },

  async updateReview(
    reviewId: string,
    payload: { rating: number; comment?: string },
  ): Promise<MutationResult> {
    const response = await serverApiFetch(`/reviews/${reviewId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return {
        success: false,
        message: await getErrorMessage(response, "Failed to update review"),
      };
    }

    return {
      success: true,
      message: "Review updated successfully",
    };
  },

  async deleteReview(reviewId: string): Promise<MutationResult> {
    const response = await serverApiFetch(`/reviews/${reviewId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      return {
        success: false,
        message: await getErrorMessage(response, "Failed to delete review"),
      };
    }

    return {
      success: true,
      message: "Review deleted successfully",
    };
  },
};
