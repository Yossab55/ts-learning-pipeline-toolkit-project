import { AppError } from "../errors/AppError";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { PipelineContext, UserRole } from "../types/domain";
import { pluck } from "../types/domain";
import { dispatchEvent } from "../pipeline/dispatcher";

export type Middleware = (
  ctx: PipelineContext,
  next: () => Promise<void> | void,
) => Promise<void> | void;

export function createRulerGuard(allowedRoles: UserRole[]): Middleware {
  return function auth(ctx, next) {
    if (!ctx.user) {
      throw new AppError("user doesn't exists", 400);
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

const handleUserAction: Middleware = async (ctx, next) => {
  if (ctx.user) {
    // 1. Read property safely using your pluck helper
    const userEmail = pluck(ctx.user, "email");
    console.log(`Processing action for user: ${userEmail}`);

    // 2. Dispatch an event using your dispatcher
    dispatchEvent("USER_PROCESSED", { email: userEmail });
  }

  await next();
};

export { handleUserAction };
