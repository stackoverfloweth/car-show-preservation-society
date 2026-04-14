export type SuccessResponse<T> = {
  data: T;
  statusCode: number;
};

export type ErrorResponse = {
  error: string;
  statusCode: number;
  details?: unknown;
};

export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};

export function success<T>(data: T, statusCode = 200): SuccessResponse<T> {
  return { data, statusCode };
}

export function error(message: string, statusCode: number, details?: unknown): ErrorResponse {
  return { error: message, statusCode, ...(details !== undefined ? { details } : {}) };
}

export function paginated<T>(
  items: T[],
  total: number,
  page: number,
  pageSize: number,
): PaginatedResponse<T> {
  return { items, total, page, pageSize };
}
