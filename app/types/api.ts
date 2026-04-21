// types/api.ts

/**
 * Standardized API Response Wrapper
 * @template T - The type of the data payload
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  message?: string;
  meta?: {
    nextToken?: string;
    totalCount?: number;
  };
}

export async function callapi<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(url, options);
  const json = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.error || "API Error");
  }

  return json.data;
}

// export type ApiResponse<T> = {
//   success: boolean;
//   data: T;
//   error?: string;
// };
