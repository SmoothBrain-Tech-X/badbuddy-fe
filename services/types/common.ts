export interface ApiResponse<T> {
  data: T;
  error?: string;
  message?: string;
  status: number;
}

export interface PaginationParams {
  limit?: number;
  offset?: number;
}

export interface SearchParams extends PaginationParams {
  q?: string;
}

export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}
