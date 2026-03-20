import type { SessionData } from "@/types/auth";
import type { UserProfile } from "@/types/profile";
import { getApiBaseUrl } from "@/lib/api-url";
import {
  serverApiFetch,
  getServerCookieHeader,
} from "@/services/api-client.service";

type ServiceResult<T> = {
  data: T | null;
  error: { message: string } | null;
  details?: string;
};

type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

function getAuthBaseUrl() {
  const authUrl = process.env.AUTH_URL?.trim();
  if (authUrl) {
    return authUrl.replace(/\/+$/, "");
  }
  return `${getApiBaseUrl()}/auth`;
}

export const userService = {
  getSession: async (): Promise<ServiceResult<SessionData>> => {
    try {
      const cookieHeader = await getServerCookieHeader();
      const res = await fetch(`${getAuthBaseUrl()}/get-session`, {
        headers: {
          Cookie: cookieHeader,
        },
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      if (!res.ok) {
        return {
          data: null,
          error: { message: "No active session" },
        };
      }

      const session = await res.json();
      if (session === null) {
        return {
          data: null,
          error: { message: "No active session" },
        };
      }
      return {
        data: session,
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: { message: "Failed to fetch session" },
        details: error instanceof Error ? error.message : String(error),
      };
    }
  },

  getMyProfile: async (): Promise<ServiceResult<UserProfile>> => {
    try {
      const response = await serverApiFetch("/users/me", {
        method: "GET",
      });

      if (!response.ok) {
        return {
          data: null,
          error: { message: "Failed to fetch profile" },
        };
      }

      const payload = (await response.json()) as ApiEnvelope<UserProfile>;
      return {
        data: payload.data,
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: { message: "Failed to fetch profile" },
        details: error instanceof Error ? error.message : String(error),
      };
    }
  },

  updateMyProfile: async (payload: {
    name: string;
    phone?: string;
    address?: string;
    image?: string;
  }): Promise<ServiceResult<UserProfile>> => {
    try {
      const response = await serverApiFetch("/users/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        return {
          data: null,
          error: { message: "Failed to update profile" },
        };
      }

      const body = (await response.json()) as ApiEnvelope<UserProfile>;
      return {
        data: body.data,
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: { message: "Failed to update profile" },
        details: error instanceof Error ? error.message : String(error),
      };
    }
  },
};
