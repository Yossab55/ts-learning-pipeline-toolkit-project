// In the name of Cross +
export type UserId = string & { readonly __brand: "UserId" };
export type UserRole = "admin" | "moderator" | "user";
export type User = {
  id: UserId;
  name: string;
  role: UserRole;
  email: string;
};

export type RequestId = string & { readonly __brand: "RequestId" };

export type PipelineContext = {
  requestId: RequestId;
  user?: User;
  metadata: Record<string, unknown>;
};

export function createUserId(row: string): UserId {
  return row as UserId;
}

export function createRequestId(row: string): RequestId {
  return row as RequestId;
}

export function pluck<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
