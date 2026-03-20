import { createAuthClient } from "better-auth/react";

import { getBackendBaseUrl } from "@/lib/api-url";

export const authClient = createAuthClient({
  baseURL: getBackendBaseUrl(),
  fetchOptions: {
    credentials: "include",
  },
});
