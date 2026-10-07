import { AppError } from "./AppError";

export class NotFoundError extends AppError {
  constructor(public resource: string) {
    super(`${resource} not found`, 404);
  }
}
