### 📋 Requirements

#### 1. Define the Middleware Contract

A middleware is an asynchronous or synchronous function that receives the pipeline context and
a next callback:

    import { PipelineContext, UserRole } from "../types/domain";
    import { UnauthorizedError } from "../errors/UnauthorizedError";

    export type Middleware = (
      ctx: PipelineContext,
      next: () => Promise<void> | void
    ) => Promise<void> | void;

──────

#### 2. Factory 1: createRoleGuard

A factory function returning a closure that enforces RBAC (Role-Based Access Control):

    export function createRoleGuard(allowedRoles: UserRole[]): Middleware

• Inner Closure Behavior: 1. Check if ctx.user exists and if allowedRoles.includes(ctx.user.role). 2. If unauthorized or missing, throw new UnauthorizedError(allowedRoles[0]) (reusing our
custom error hierarchy from Milestone 2!). 3. If authorized, proceed by calling await next().

──────

#### 3. Factory 2: createLogger

A factory function that returns an onion-style logger:

    export function createLogger(prefix: string): Middleware

• Inner Closure Behavior: 1. Log entry with prefix and request ID: console.log([${prefix}] Request ${ctx.requestId}
      started).
      2. Call and await await next().
      3. Log exit: console.log([${prefix}] Request ${ctx.requestId} completed).

──────

### 💡 Socratic Hint: Contextual Typing & Closures

Notice how returning : Middleware allows TypeScript's Contextual Typing to infer (ctx, next)
automatically:

    export function createLogger(prefix: string): Middleware {
      return async (ctx, next) => {
        // TypeScript already knows `ctx` is PipelineContext and `next` is () => Promise<void> |

void!
};
}

You don't need to manually annotate (ctx: PipelineContext, next: ...) inside the closure.
