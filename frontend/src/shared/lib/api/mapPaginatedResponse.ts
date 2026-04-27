import type { PaginatedMeta, PaginatedResponse } from '../../types/api';

interface LaravelPaginatedMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
}

interface LaravelPaginatedResponse<T> {
  data: T[];
  meta: LaravelPaginatedMeta;
}

export const mapPaginatedResponse = <T>(payload: LaravelPaginatedResponse<T>): PaginatedResponse<T> => ({
  data: payload.data,
  meta: {
    currentPage: payload.meta.current_page,
    lastPage: payload.meta.last_page,
    perPage: payload.meta.per_page,
    total: payload.meta.total,
    from: payload.meta.from,
    to: payload.meta.to,
  } satisfies PaginatedMeta,
});
