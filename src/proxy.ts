import { NextResponse, type NextRequest } from "next/server";
import { getApiBaseUrl } from "@/lib/api-url";

const authPages = ["/login", "/register"];
const protectedPrefixes = [
  "/dashboard",
  "/cart",
  "/checkout",
  "/orders",
  "/profile",
  "/seller",
  "/admin",
];

function normalizeRole(role?: string | null) {
  const normalized = role?.trim().toUpperCase();

  if (normalized === "ADMIN" || normalized === "ROLE_ADMIN") {
    return "ADMIN";
  }

  if (normalized === "SELLER" || normalized === "ROLE_SELLER") {
    return "SELLER";
  }

  return "CUSTOMER";
}

async function getSessionFromBackend(request: NextRequest): Promise<{
  isAuthenticated: boolean;
  role: "ADMIN" | "SELLER" | "CUSTOMER" | null;
}> {
  try {
    const cookie = request.headers.get("cookie") ?? "";

    if (!cookie) {
      return { isAuthenticated: false, role: null };
    }

    const response = await fetch(`${getApiBaseUrl()}/auth/get-session`, {
      method: "GET",
      headers: { cookie },
      cache: "no-store",
    });

    if (!response.ok) {
      return { isAuthenticated: false, role: null };
    }

    const payload = (await response.json()) as {
      user?: { role?: string };
      data?: { user?: { role?: string } };
    };

    const user = payload.user ?? payload.data?.user;

    if (!user) {
      return { isAuthenticated: false, role: null };
    }

    return {
      isAuthenticated: true,
      role: normalizeRole(user.role),
    };
  } catch {
    return { isAuthenticated: false, role: null };
  }
}

function isProtectedPath(pathname: string) {
  return protectedPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function getSafeNextPath(rawNextPath: string | null) {
  if (!rawNextPath) {
    return null;
  }

  if (!rawNextPath.startsWith("/") || rawNextPath.startsWith("//")) {
    return null;
  }

  return rawNextPath;
}

function canAccessPathByRole(
  path: string,
  role: "ADMIN" | "SELLER" | "CUSTOMER" | null,
) {
  if (!path.startsWith("/admin")) {
    if (!path.startsWith("/seller")) {
      return true;
    }

    return role === "SELLER";
  }

  return role === "ADMIN";
}

function buildLoginRedirect(request: NextRequest) {
  const loginUrl = new URL("/login", request.url);
  const nextPath = `${request.nextUrl.pathname}${request.nextUrl.search}`;

  if (nextPath && nextPath !== "/login") {
    loginUrl.searchParams.set("next", nextPath);
  }

  return NextResponse.redirect(loginUrl);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAuthPage = authPages.includes(pathname);
  const needsAuth = isProtectedPath(pathname);

  if (!isAuthPage && !needsAuth) {
    return NextResponse.next();
  }

  const session = await getSessionFromBackend(request);

  if (isAuthPage && session.isAuthenticated) {
    const requestedNext = getSafeNextPath(
      request.nextUrl.searchParams.get("next"),
    );

    if (requestedNext && canAccessPathByRole(requestedNext, session.role)) {
      return NextResponse.redirect(new URL(requestedNext, request.url));
    }

    if (session.role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }

    if (session.role === "SELLER") {
      return NextResponse.redirect(new URL("/seller/dashboard", request.url));
    }

    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!needsAuth) {
    return NextResponse.next();
  }

  if (!session.isAuthenticated) {
    return buildLoginRedirect(request);
  }

  if (pathname === "/dashboard") {
    if (session.role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }

    if (session.role === "SELLER") {
      return NextResponse.redirect(new URL("/seller/dashboard", request.url));
    }

    return NextResponse.redirect(new URL("/", request.url));
  }

  if (pathname.startsWith("/admin") && session.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (pathname.startsWith("/seller") && session.role !== "SELLER") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/dashboard/:path*",
    "/cart/:path*",
    "/checkout/:path*",
    "/orders/:path*",
    "/profile/:path*",
    "/seller/:path*",
    "/admin/:path*",
  ],
};
