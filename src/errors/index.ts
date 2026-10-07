import { ErrorResponse } from "../types/errors";
import { ValidationError } from "./ValidationError";
import { NotFoundError } from "./NotFoundError";
import { UnauthorizedError } from "./UnauthorizedError";
import { AppError } from "./AppError";

export function formatError(err: unknown): ErrorResponse {
  if (err instanceof ValidationError) {
    return {
      success: false,
      statusCode: err.statusCode,
      error: err.message,
      details: err.fields,
    };
  }

  if (err instanceof UnauthorizedError) {
    return {
      success: false,
      statusCode: err.statusCode,
      error: err.message,
      details: `user role is ${err.requiredRole} and it isn't allowed to use this content`,
    };
  }

  if (err instanceof NotFoundError) {
    return {
      success: false,
      statusCode: err.statusCode,
      error: err.message,
      details: undefined,
    };
  }

  if (err instanceof AppError) {
    return {
      success: false,
      statusCode: err.statusCode,
      error: err.message,
      details: undefined,
    };
  }

  if (err instanceof Error) {
    return {
      success: false,
      statusCode: 500,
      error: "Internal Server Error",
      details: undefined,
    };
  }

  return {
    success: false,
    statusCode: 500,
    error: "Unknown Server Error",
  };
}
