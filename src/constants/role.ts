export const Roles = {
  ADMIN: "ADMIN",
  CUSTOMER: "CUSTOMER",
  SELLER: "SELLER",
} as const;

export type RoleValue = (typeof Roles)[keyof typeof Roles];
