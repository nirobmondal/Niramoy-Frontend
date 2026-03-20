import { serverApiFetch } from "@/services/api-client.service";
import type { ManufacturerOption } from "@/types/seller";

type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

export const manufacturerService = {
  async getAllManufacturers() {
    try {
      const response = await serverApiFetch("/manufacturers", {
        method: "GET",
      });

      if (!response.ok) {
        return [] as ManufacturerOption[];
      }

      const payload = (await response.json()) as ApiEnvelope<
        ManufacturerOption[]
      >;
      return Array.isArray(payload.data) ? payload.data : [];
    } catch {
      return [] as ManufacturerOption[];
    }
  },
};
