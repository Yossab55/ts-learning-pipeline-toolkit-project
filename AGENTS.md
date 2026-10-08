# 🛡️ Backend Pipeline Toolkit (`1-backend-pipeline-toolkit`)

> **Project Tracking & Mentorship Guide for Yossab & AI Mentors**

---

## 👤 Learner & Project Profile
* **Developer**: Yossab
* **Current Skill Milestone**: Intermediate TS (Composition, `keyof`, `T[K]`, Type Narrowing, Guards, Function Typing, Overloads, HOFs).
* **Goal**: Build a production-grade, lightweight, type-safe backend middleware, validation, and event-processing toolkit for Node.js from scratch.
* **Workflow**:
  1. Yossab implements one milestone at a time.
  2. After completing each milestone, Yossab prompts the mentor (`my-mentor`) to review the code, test edge cases, and discuss architectural decisions.
  3. The mentor updates the milestone checklist below before proceeding to the next step.

---

## 📊 Milestone Roadmap & Status Tracker

| Milestone | Description | Skills Exercised | Status |
| :--- | :--- | :--- | :--- |
| **Milestone 1** | **Domain Modeling & Branded Types** | Branded types, `keyof`, `T[K]`, Type aliases | ✅ **Completed** |
| **Milestone 2** | **Error Hierarchy & Narrowing** | `instanceof`, Custom classes, `unknown` handling, CFA | ✅ **Completed** |
| **Milestone 3** | **Type Predicates & Payload Guards** | `param is Type`, `typeof`, `in`, array narrowing | ✅ **Completed** |
| **Milestone 4** | **Higher-Order Middleware Factories** | Closures, function-returning-functions, Contextual typing | ⏳ **In Progress (Next)** |
| **Milestone 5** | **Overloaded Event Dispatcher** | Function overloads, top-to-bottom resolution, exact return inference | ⚪ Pending |
| **Milestone 6** | **Pipeline State Machine** | Discriminated states, `never` exhaustiveness, integration test | ⚪ Pending |

---

## 🗺️ Milestone Specifications

### 📍 Milestone 1: Domain Modeling & Branded Types (Starting Point)
* **Target File**: `src/types/domain.ts`
* **Requirements**:
  1. Create branded primitive types to prevent mixing raw IDs:
     - `type UserId = string & { readonly __brand: "UserId" };`
     - `type RequestId = string & { readonly __brand: "RequestId" };`
  2. Write brand constructor helper functions:
     - `function createUserId(raw: string): UserId`
     - `function createRequestId(raw: string): RequestId`
  3. Define standard API domain types:
     - `UserRole`: `"admin" | "moderator" | "user"`
     - `User`: `{ id: UserId; name: string; role: UserRole; email: string }`
     - `PipelineContext`: Context object passing through middlewares containing `requestId`, optional `user`, and `metadata`.
  4. Write a generic property plucker using `keyof` and indexed access (`T[K]`):
     - `function pluck<T, K extends keyof T>(obj: T, key: K): T[K]`

---

### 📍 Milestone 2: Error Hierarchy & Global Narrowing
* **Target File**: `src/errors/index.ts`
* **Requirements**:
  1. Base `AppError` class extending JavaScript's built-in `Error`.
  2. Specific derived error classes:
     - `ValidationError` (stores invalid fields record: `fields: Record<string, string>`).
     - `UnauthorizedError` (stores required role: `requiredRole: UserRole`).
     - `NotFoundError` (stores resource name: `resource: string`).
  3. A global error formatter function `formatError(err: unknown)`:
     - Takes `err: unknown`.
     - Uses `instanceof` narrowing to extract specific fields safely.
     - Never leaks unhandled internal errors (returns a sanitized 500 response for non-AppError objects).

---

### 📍 Milestone 3: Runtime Payload Validation & Type Predicates
* **Target File**: `src/guards/index.ts`
* **Requirements**:
  1. Write a custom type predicate function `isRecord(val: unknown): val is Record<string, unknown>` guarding against `null`, primitives, and arrays.
  2. Write an airtight type predicate `isValidUserPayload(val: unknown): val is Omit<User, "id">` verifying properties (`name`, `role`, `email`) and their types using `typeof` and `"in"`.
  3. Write a reusable array non-null filtering predicate:
     - `function isDefined<T>(val: T | null | undefined): val is T`

---

### 📍 Milestone 4: Higher-Order Middleware Factories
* **Target File**: `src/middleware/index.ts`
* **Requirements**:
  1. Define the `Middleware` function type alias:
     - `type Middleware = (ctx: PipelineContext, next: () => Promise<void> | void) => Promise<void> | void;`
  2. Implement configurable middleware factories:
     - `createRoleGuard(allowedRoles: UserRole[]): Middleware`: Returns an inner middleware checking `ctx.user?.role`.
     - `createLogger(prefix: string): Middleware`: Logs pipeline entry and exit.

---

### 📍 Milestone 5: Event Dispatcher with Function Overloads
* **Target File**: `src/pipeline/dispatcher.ts`
* **Requirements**:
  1. Implement an event dispatcher with overloaded signatures:
     - Overload 1 (Single event): accepts `event: string`, `payload: unknown` $\rightarrow$ returns `{ event: string; status: "dispatched" }`.
     - Overload 2 (Batch events): accepts `events: string[]`, `payloads: unknown[]` $\rightarrow$ returns `{ event: string; status: "dispatched" }[]`.
     - Overload 3 (Union handling): accepts `string | string[]`.
  2. Single implementation function handling both branches using `Array.isArray()`.

---

### 📍 Milestone 6: Pipeline Runner & State Machine
* **Target File**: `src/pipeline/runner.ts` & `src/index.ts`
* **Requirements**:
  1. Define a pipeline status union: `type PipelineStatus = "idle" | "running" | "completed" | "failed"`.
  2. Implement a state transition handler using a `switch (status)` statement with an exhaustive `never` check (`const _exhaustive: never = status`).
  3. Build the `PipelineRunner` that executes registered middlewares in sequence.
  4. Create an end-to-end integration demo in `src/index.ts`.

---

## 🧭 Instructions for Mentors

When Yossab completes a milestone:
1. Review his code for type correctness, strict compiler compatibility, and edge cases.
2. Ask 1–2 diagnostic review questions to solidify the concepts.
3. Update the status table in this file (mark completed with ✅).
4. Outline the exact starting prompt for the next milestone.
