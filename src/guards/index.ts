import { User, UserRole } from "../types/domain";

export function isRecord(val: unknown): val is Record<string, unknown> {
  return typeof val === "object" && val !== null && !Array.isArray(val);
}

export function isValidUserPayload(val: unknown): val is Omit<User, "id"> {
  if (!isRecord(val)) return false;

  if (
    "name" in val &&
    "email" in val &&
    "role" in val &&
    typeof val.name == "string" &&
    typeof val.email == "string" &&
    isUserRole(val.role)
  ) {
    return true;
  }

  return false;
}

function isUserRole(val: unknown): val is UserRole {
  return val === "admin" || val === "moderator" || val === "user";
}

export function isDefined<T>(val: T | null | undefined): val is T {
  return val !== null && val !== undefined;
}

// const mixedUsers: (User | null | undefined)[] = [
//   {
//     id: createUserId("1"),
//     name: "yossab",
//     email: "yos@gmail.com",
//     role: "user",
//   },
//   null,
//   undefined,

//   {
//     id: createUserId("2"),
//     name: "yossab2",
//     email: "yos2@gmail.com",
//     role: "user",
//   },
// ];

// const users: User[] = mixedUsers.filter(function (u) {
//   return isDefined(u);
// });
