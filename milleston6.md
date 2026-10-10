### 📋 Requirements: Milestone 6 — Pipeline State Machine & Integration

**Target Files**: `src/pipeline/runner.ts` and `src/index.ts`

In this final milestone, you will assemble all the components you've built across the project (Branded IDs, Custom Error Hierarchy, Type Predicates, Middleware Factories, and the Overloaded Event Dispatcher) into a complete, type-safe execution engine.

---

#### 1. Define the Pipeline State & Transition Function

Inside `src/pipeline/runner.ts`:

1. Define and export the pipeline state union:
   ```typescript
   export type PipelineStatus = "idle" | "running" | "completed" | "failed";
   ```

2. Implement a transition validator function:
   ```typescript
   export function transitionStatus(
     current: PipelineStatus,
     next: PipelineStatus,
   ): PipelineStatus
   ```
   * **Allowed Transitions**:
     - `"idle"` $\rightarrow$ can only transition to `"running"`
     - `"running"` $\rightarrow$ can transition to `"completed"` or `"failed"`
     - `"completed"` $\rightarrow$ terminal state (no transitions allowed, throw error)
     - `"failed"` $\rightarrow$ terminal state (no transitions allowed, throw error)
   * Use a `switch (current)` statement to handle every state.
   * If a transition is invalid, throw a descriptive `Error`.
   * In the `default:` branch, implement an **Exhaustiveness Check with `never`**:
     ```typescript
     default: {
       const _exhaustive: never = current;
       throw new Error(`Unhandled pipeline state: ${_exhaustive}`);
     }
     ```

---

#### 2. Implement the `PipelineRunner` Class

Inside `src/pipeline/runner.ts`, build the execution engine:

```typescript
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

  public async execute(ctx: PipelineContext): Promise<void> {
    // 1. Transition state from "idle" to "running"
    // 2. Execute middlewares sequentially (onion / chain pattern)
    // 3. On success: Transition state to "completed"
    // 4. On error: Transition state to "failed" and rethrow / handle
  }
}
```

> **Sequential Execution Hint**:
> To execute middlewares in sequence:
> ```typescript
> let index = 0;
> const next = async (): Promise<void> => {
>   if (index < this.middlewares.length) {
>     const currentMiddleware = this.middlewares[index++];
>     await currentMiddleware(ctx, next);
>   }
> };
> await next();
> ```

---

#### 3. Wire the End-to-End Demo in `src/index.ts`

In `src/index.ts`, put the whole toolkit into action:

1. Create a `PipelineRunner` instance.
2. Register:
   - Logger: `createLogger("[PIPELINE]")`
   - Role Guard: `createRoleGuard(["admin", "moderator"])`
   - Business Logic Middleware:
     - Dispatches a single or batch event using `dispatchEvent`
     - Uses `pluck(user, "email")` to read properties safely
3. Run two test simulations:
   - **Simulation A (Happy Path)**: Run with an admin user (`ctx.user.role = "admin"`). Should complete successfully and log events.
   - **Simulation B (Error Path)**: Run with a regular user or no user. Catch the error and pass it to `formatError(err)` to verify our `instanceof` narrowing from Milestone 2!

---

### 💡 Socratic Hint: The Power of Exhaustiveness with `never`

Why do we write `const _exhaustive: never = current` in the `default:` case?

TypeScript's Control Flow Analysis (CFA) narrows the type of `current` inside each `case` branch:
* In `case "idle":`, `current` is narrowed to `"idle"`.
* In `case "running":`, `current` is narrowed to `"running"`.
* In `case "completed":`, `current` is narrowed to `"completed"`.
* In `case "failed":`, `current` is narrowed to `"failed"`.

When every union member is handled, the leftover type in `default:` is empty $\rightarrow$ `never`!
If tomorrow you or a teammate adds `"paused"` to `PipelineStatus`, TypeScript will refuse to compile `const _exhaustive: never = current` because `"paused"` is not assignable to `never`. The compiler forces you to handle the new state before the code can ever ship!
