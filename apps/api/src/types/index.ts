export type HealthResponse = {
  status: 'ok';
  timestamp: string;
};

export type MeResponse = {
  userId: string;
  createdAt: string;
};

export type ApiResponse<T> = {
  data: T;
  statusCode: number;
};

export type ApiError = {
  error: string;
  statusCode: number;
  details?: unknown;
};
