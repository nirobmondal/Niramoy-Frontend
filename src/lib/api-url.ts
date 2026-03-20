function requireEnv(name: string, value: string | undefined) {
  const resolved = value?.trim();

  if (!resolved) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return resolved;
}

export function getApiBaseUrl() {
  const rawBase = requireEnv(
    "NEXT_PUBLIC_API_URL",
    process.env.NEXT_PUBLIC_API_URL,
  ).replace(/\/+$/, "");

  return rawBase.endsWith("/api") ? rawBase : `${rawBase}/api`;
}

export function getBackendBaseUrl() {
  return getApiBaseUrl().replace(/\/api$/, "");
}

export function toApiUrl(path: string) {
  if (path.startsWith("http")) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getApiBaseUrl()}${normalizedPath}`;
}
