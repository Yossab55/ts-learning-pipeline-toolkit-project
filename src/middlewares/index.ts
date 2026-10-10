import { AppError } from "../errors/AppError";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { PipelineContext, UserRole } from "../types/domain";

export type Middleware = (
  ctx: PipelineContext,
  next: () => Promise<void> | void,
) => Promise<void> | void;

export function createRulerGuard(allowedRoles: UserRole[]): Middleware {
  return function auth(ctx, next) {
    if (!ctx.user) {
      throw new AppError("user doesn't exisets", 400);
    }

    if (!allowedRoles.includes(ctx.user?.role))
      throw new UnauthorizedError(allowedRoles[0]);

    return next();
  };
}

export function createLogger(prefix: string): Middleware {
  return async function logging(ctx, next) {
    console.log(`${prefix} Request ${ctx.requestId} started`);
    await next();
    console.log(`${prefix} Request ${ctx.requestId} completed`);
  };
}
