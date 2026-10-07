import { AppError } from "./AppError";
import { UserRole } from "../types/domain";

export class UnauthorizedError extends AppError {
  constructor(public requiredRole: UserRole) {
    super("Unauthorized Access", 401);
  }
}
