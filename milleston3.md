### 📋 Requirements

#### 1. General Record Guard: isRecord

    export function isRecord(val: unknown): val is Record<string, unknown>

• Safely check that val is a non-null object and not an array or primitive.
• Why? Remember the classic JavaScript trap: typeof null === "object" and typeof [] === "object".
──────

#### 2. Domain Payload Guard: isValidUserPayload

When clients send data to create a user (e.g. POST /api/users), the payload doesn't have an id yet (the database assigns that).

    import { User, UserRole } from "../types/domain";

    export function isValidUserPayload(val: unknown): val is Omit<User, "id">

• Leverage isRecord(val) first.
• Verify that:
• "name" exists in val and is a string.
• "email" exists in val and is a string.
• "role" exists in val and is one of the valid literal roles ("admin" | "moderator" | "user").
• If any check fails, return false.
──────

#### 3. Reusable Array Filter Guard: isDefined

    export function isDefined<T>(val: T | null | undefined): val is T

• A generic predicate that filters out both null and undefined.
• Allows .filter(isDefined) to narrow an array of (User | null | undefined)[] down to User[] without losing type safety.
──────

### 💡 Socratic Hint

Remember: TypeScript has "Blind Trust" in type predicates. If you write val is Omit<User, "id">, the compiler trusts your function 100% and will not verify that your return expression actually checked
every field. Ensure your runtime validation checks every property before returning true.
