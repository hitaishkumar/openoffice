// types/api.ts

/**
 * Standardized API Response Wrapper
 * @template T - The type of the data payload
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    nextToken?: string;
    totalCount?: number;
  };
}
