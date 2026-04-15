/**
 * Offset-based pagination helpers. Cursor pagination can come later when a
 * specific endpoint actually needs stable ordering under writes; for now
 * every list endpoint uses page/pageSize.
 */

export type PaginationInput = {
  page: number;
  pageSize: number;
};

export type PaginatedResult<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export function paginationToSql({ page, pageSize }: PaginationInput): {
  limit: number;
  offset: number;
} {
  return {
    limit: pageSize,
    offset: (page - 1) * pageSize,
  };
}

export function buildPaginatedResult<T>(
  items: T[],
  total: number,
  { page, pageSize }: PaginationInput,
): PaginatedResult<T> {
  return {
    items,
    total,
    page,
    pageSize,
    totalPages: pageSize > 0 ? Math.ceil(total / pageSize) : 0,
  };
}
