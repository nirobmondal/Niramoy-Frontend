"use server";

import { Roles, type RoleValue } from "@/constants/role";
import { userService } from "@/services/user.service";

type NavbarUser = {
  name: string;
  email: string;
  image: string;
  role: RoleValue;
};

function normalizeRole(role?: string): RoleValue {
  const normalized = role?.trim().toUpperCase();

  if (normalized === Roles.ADMIN || normalized === "ROLE_ADMIN") {
    return Roles.ADMIN;
  }

  if (normalized === Roles.SELLER || normalized === "ROLE_SELLER") {
    return Roles.SELLER;
  }

  return Roles.CUSTOMER;
}

export async function getAuthStateAction() {
  const result = await userService.getSession();
  const payload = result.data as Record<string, unknown> | null;

  const directUser = (payload?.user ?? null) as {
    id?: string;
    name?: string;
    email?: string;
    image?: string;
    role?: string;
  } | null;
  const wrappedUser = (payload?.data as Record<string, unknown> | undefined)
    ?.user as
    | {
        id?: string;
        name?: string;
        email?: string;
        image?: string;
        role?: string;
      }
    | undefined;

  const user = directUser ?? wrappedUser ?? null;

  if (!user) {
    return {
      isAuthenticated: false,
      role: null as RoleValue | null,
      user: null,
    };
  }

  return {
    isAuthenticated: true,
    role: normalizeRole(user.role),
    user: {
      id: user.id ?? "",
      name: user.name ?? "User",
      email: user.email ?? "",
      image: user.image ?? "",
    },
  };
}

export async function getNavbarUserAction() {
  const authState = await getAuthStateAction();
  const user = authState.user;

  if (!user) {
    return {
      isLoggedIn: false,
      user: null as NavbarUser | null,
    };
  }

  return {
    isLoggedIn: true,
    user: {
      name: user.name ?? "User",
      email: user.email ?? "",
      image: user.image ?? "",
      role: authState.role ?? Roles.CUSTOMER,
    },
  };
}
