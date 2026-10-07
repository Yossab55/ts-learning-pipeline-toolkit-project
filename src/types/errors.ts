export type ErrorResponse = {
  success: false;
  statusCode: number;
  error: string;
  details?: unknown;
};
