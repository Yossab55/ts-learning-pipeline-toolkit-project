### 📋 Requirements:

#### 1. Base Class: AppError

• Create and export an abstract or concrete base class AppError extending JavaScript's built-in Error:
export class AppError extends Error {
constructor(
message: string,
public statusCode: number = 500
) {
super(message);
}
}

#### 2. Specialized Error Classes (Subclasses of AppError)

Create and export 3 specific domain error classes:

1. ValidationError (HTTP 400):
   • Accepts and stores public fields: Record<string, string>.
   • Sets message to "Validation Failed".
2. UnauthorizedError (HTTP 401):
   • Accepts and stores public requiredRole: UserRole (import UserRole from ../types/domain.js).
   • Sets message to "Unauthorized Access".
3. NotFoundError (HTTP 404):
   • Accepts and stores public resource: string.
   • Sets message to ${resource} not found.

#### 3. Standard API Error Response Shape

Define the return contract for formatted errors:

    export type ErrorResponse = {
      success: false;
      statusCode: number;
      error: string;
      details?: unknown;
    };

#### 4. The Global Error Formatter Function

Implement the central error-handling function that guards against unknown:

    export function formatError(err: unknown): ErrorResponse

Inside formatError:

• Use instanceof checks to narrow err: unknown:
• If err instanceof ValidationError: return status 400 and details: err.fields.
• If err instanceof UnauthorizedError: return status 401 and details: { requiredRole: err.requiredRole }.
• If err instanceof NotFoundError: return status 404 and details: { resource: err.resource }.
• If err instanceof AppError: return err.statusCode and error: err.message.
• If err instanceof Error (e.g. an unexpected runtime TypeError or SyntaxError): return status 500 with a safe generic error message "Internal Server Error" (never leak internal crash details!).
• In the final fallback (if someone did throw "string" or throw null): return status 500 with "Unknown Server Error".

──────

### 💡 Socratic Hint:

Notice the order of your instanceof checks! Remember what we learned about class inheritance: ValidationError is an instance of AppError, and AppError is an instance of Error.

Create src/errors/index.ts, write your code, and ping me when you're ready for review! 🛠
