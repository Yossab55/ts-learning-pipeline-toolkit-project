import { Middleware } from "../middlewares";
import { PipelineContext } from "../types/domain";

export type PipelineStatus = "idle" | "running" | "completed" | "failed";

export function transitionStatus(
  current: PipelineStatus,
  next: PipelineStatus,
): PipelineStatus {
  switch (current) {
    case "idle":
      if (next == "running") return next;
      throw Error(
        "status idle can only be transitioned to be running, got: " + next,
      );

      break;
    case "running":
      if (next == "completed" || next == "failed") return next;
      throw Error(
        "status running can only be transitioned to be completed or failed, got: " +
          next,
      );
      break;

    case "completed":
    case "failed":
      throw Error(
        "status completed or failed can't be transitioned, case: " + next,
      );

    default: {
      const _exhaustive: never = current;
      throw new Error(`Unhandled pipeline state: ${_exhaustive}`);
    }
  }
}

export class PipelineRunner {
  private middlewares: Middleware[] = [];
  private status: PipelineStatus = "idle";

  public getStatus(): PipelineStatus {
    return this.status;
  }

  public use(middleware: Middleware): this {
    this.middlewares.push(middleware);
    return this;
  }

  public resetState(): void {
    this.status = "idle";
  }

  public async execute(ctx: PipelineContext): Promise<void> {
    // 1. Transition state from "idle" to "running"
    this.status = transitionStatus(this.status, "running");
    // 2. Execute middlewares sequentially (onion / chain pattern)
    try {
      let index = 0;
      const next = async (): Promise<void> => {
        if (index < this.middlewares.length) {
          const currentMiddleware = this.middlewares[index++];
          await currentMiddleware(ctx, next);
        }
      };
      await next();

      // 3. On success: Transition state to "completed"
      this.status = transitionStatus(this.status, "completed");
    } catch (error) {
      // 4. On error: Transition state to "failed" and rethrow / handle
      this.status = transitionStatus(this.status, "failed");

      throw error;
    }
  }
}
