export type UpdatableQueryValue = string | number | null | undefined;

type ReadonlyURLSearchParams = {
  toString: () => string;
};

export function buildUpdatedQueryString(
  currentParams: URLSearchParams | ReadonlyURLSearchParams,
  updates: Record<string, UpdatableQueryValue>,
) {
  const params = new URLSearchParams(currentParams.toString());

  Object.entries(updates).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "") {
      params.delete(key);
      return;
    }

    params.set(key, String(value));
  });

  return params.toString();
}
