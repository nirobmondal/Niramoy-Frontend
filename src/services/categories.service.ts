import { serverApiFetch } from "@/services/api-client.service";
import type { Category } from "@/types/medicine";

type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

export const categoriesService = {
  async getAllCategories() {
    try {
      const response = await serverApiFetch("/categories", {
        method: "GET",
      });

      if (!response.ok) {
        return [] as Category[];
      }

      const payload = (await response.json()) as ApiEnvelope<Category[]>;
      return Array.isArray(payload.data) ? payload.data : [];
    } catch {
      return [] as Category[];
    }
  },
};
