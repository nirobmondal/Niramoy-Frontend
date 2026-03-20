import "server-only";

import { cookies } from "next/headers";
import { getApiBaseUrl } from "@/lib/api-url";

export async function getServerCookieHeader() {
  const cookieStore = await cookies();
  return cookieStore.toString();
}

export async function serverApiFetch(
  path: string,
  init?: Omit<RequestInit, "headers"> & {
    headers?: HeadersInit;
  },
) {
  const cookieHeader = await getServerCookieHeader();
  const target = path.startsWith("http") ? path : `${getApiBaseUrl()}${path}`;

  const headers: HeadersInit = {
    ...(init?.headers ?? {}),
    Cookie: cookieHeader,
  };

  return fetch(target, {
    ...init,
    headers,
    credentials: "include",
    cache: "no-store",
  });
}
