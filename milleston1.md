1. Branded Types:
   • Define nominal branded types for UserId and RequestId:
   type UserId = string & { readonly **brand: "UserId" };
   type RequestId = string & { readonly **brand: "RequestId" };

   • Implement constructor functions that cast raw strings to these branded types:
   • createUserId(raw: string): UserId
   • createRequestId(raw: string): RequestId

2. Core Domain Types:
   • UserRole: Union of "admin" | "moderator" | "user".
   • User: Object type with { id: UserId; name: string; role: UserRole; email: string }.
   • PipelineContext: Object type representing the request lifecycle:
   type PipelineContext = {
   requestId: RequestId;
   user?: User;
   metadata: Record<string, unknown>;
   };

3. Key Query Utility (keyof & T[K]):
   • Write a generic function pluck that safely extracts a property value from any object:
   function pluck<T, K extends keyof T>(obj: T, key: K): T[K]
