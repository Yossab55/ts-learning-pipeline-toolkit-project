import { AppError } from "./AppError";

export class ValidationError extends AppError {
  constructor(public fields: Record<string, string>) {
    const message = "Validation Failed";
    super(message, 400);
  }
}
