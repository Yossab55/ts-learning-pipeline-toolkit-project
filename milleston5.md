### 📋 Requirements: Milestone 5 — Overloaded Event Dispatcher

**Target File**: `src/pipeline/dispatcher.ts`

In backend architectures (like NestJS, Express, or Kafka consumers), event dispatchers often allow emitting either a single event or a batch of events through the exact same function name, returning either a single receipt or an array of receipts.

---

#### 1. Define the Result Contract
Define and export the dispatch receipt shape:
```typescript
export type DispatchResult = {
  event: string;
  status: "dispatched";
};
```

---

#### 2. Declare Function Overload Signatures (`dispatchEvent`)

Define three public overload signatures followed by the implementation signature:

* **Overload 1 (Single Event)**:
  - Takes `event: string, payload: unknown`
  - Returns `DispatchResult`

* **Overload 2 (Batch Events)**:
  - Takes `events: string[], payloads: unknown[]`
  - Returns `DispatchResult[]`

* **Overload 3 (Union Acceptance)**:
  - Takes `events: string | string[], payloads: unknown | unknown[]`
  - Returns `DispatchResult | DispatchResult[]`

---

#### 3. Implement the Private Runtime Engine
Implement the function body:
- Use `Array.isArray(events)` to narrow at runtime.
- If `events` is an array:
  - Map each event to a `{ event: name, status: "dispatched" }` object.
  - Return the array of results.
- If `events` is a single string:
  - Return `{ event: events, status: "dispatched" }`.

---

### 💡 Socratic Hint: The "Invisible Implementation" Trap

Recall from our study of function overloads:
1. Overload signatures are the **only** signatures visible to consumers. The implementation signature is completely invisible at compile time.
2. If you only provide Overload 1 and Overload 2, what happens when a caller passes a variable of type `string | string[]`? TypeScript will throw `TS2769: No overload matches this call`! Overload 3 solves this union-propagation gap.
3. Order matters: Place specific signatures before general union signatures.
