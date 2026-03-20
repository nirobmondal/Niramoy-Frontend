"use client";

import { authClient } from "@/lib/auth-clinet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  Cross,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Pill,
  ShoppingCart,
  Tag,
  User,
  UserCog,
  Factory,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ModeToggle } from "./modeToggle";
import { toast } from "sonner";
import { Roles, type RoleValue } from "@/constants/role";

type NavbarClientProps = {
  isLoggedIn: boolean;
  user: {
    name: string;
    email: string;
    image: string;
    role: RoleValue;
  } | null;
  cartCount: number;
};

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Medicines", href: "/shop" },
];

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

export function NavbarClient({
  isLoggedIn,
  user,
  cartCount,
}: NavbarClientProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: sessionData } = authClient.useSession();
  const sessionUser = sessionData?.user as { role?: string } | undefined;
  const sessionRole = normalizeRole(sessionUser?.role);

  const resolvedUser = sessionData?.user
    ? {
        name: sessionData.user.name ?? "User",
        email: sessionData.user.email ?? "",
        image: sessionData.user.image ?? "",
        role: sessionRole ?? user?.role ?? Roles.CUSTOMER,
      }
    : user;

  const resolvedIsLoggedIn = Boolean(sessionData?.user) || isLoggedIn;
  const resolvedRole = resolvedUser?.role ?? Roles.CUSTOMER;
  const isAdmin = resolvedRole === Roles.ADMIN;
  const isSeller = resolvedRole === Roles.SELLER;
  const isCustomer = resolvedRole === Roles.CUSTOMER;

  const initials =
    resolvedUser?.name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "U";

  async function handleLogout() {
    const toastId = toast.loading("Loggout in...");
    try {
      const { error } = await authClient.signOut();

      if (error) {
        toast.error(error.message, { id: toastId });
        return;
      }

      toast.success("User logged out Successfully", { id: toastId });
      // redirect to home page.
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Something went wrong, please try again.", { id: toastId });
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur">
      <div className="container mx-auto w-full max-w-[1280px] px-4 md:px-6 lg:px-8">
        <nav className="flex h-16 items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-10">
            <Link href="/" className="flex shrink-0 items-center gap-3">
              <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <span className="relative inline-flex items-center justify-center">
                  <Cross className="size-5" />
                  <Pill className="absolute -right-2 -bottom-2 size-3.5" />
                </span>
              </span>
              <span className="text-3xl font-extrabold tracking-tight text-foreground">
                Niramoy
              </span>
            </Link>

            <div className="hidden md:flex">
              <NavigationMenu viewport={false}>
                <NavigationMenuList className="gap-1.5">
                  {navLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <NavigationMenuItem key={link.href}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={link.href}
                            className={cn(
                              "rounded-md px-3 py-2 text-xl font-semibold transition-colors",
                              isActive
                                ? "bg-muted text-foreground"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground",
                            )}
                          >
                            {link.label}
                          </Link>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    );
                  })}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>

          <div className="hidden items-center gap-5 md:flex">
            <Button asChild variant="ghost" size="icon" className="relative">
              <Link href="/cart" aria-label="Cart">
                <ShoppingCart className="size-7" />
                <span className="absolute -top-1 -right-1 inline-flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[14px] font-semibold leading-5 text-primary-foreground">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              </Link>
            </Button>
            <ModeToggle />

            {!resolvedIsLoggedIn ? (
              <>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="text-lg px-5"
                >
                  <Link href="/login">Login</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  className="bg-primary text-primary-foreground hover:opacity-95 px-8 text-lg"
                >
                  <Link href="/register">Register</Link>
                </Button>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-auto rounded-full p-0">
                    <Avatar size="default">
                      <AvatarImage
                        src={resolvedUser?.image || undefined}
                        alt={resolvedUser?.name || "User"}
                      />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuLabel>
                    <p className="truncate text-sm font-semibold">
                      {resolvedUser?.name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {resolvedUser?.email}
                    </p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {isAdmin && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/admin/dashboard">
                          <LayoutDashboard className="mr-2 size-4" />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/admin/orders">
                          <Package className="mr-2 size-4" />
                          See All Orders
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/admin/users">
                          <UserCog className="mr-2 size-4" />
                          Manage Users
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/admin/categories">
                          <Tag className="mr-2 size-4" />
                          Manage Categories
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/admin/manufacturers">
                          <Factory className="mr-2 size-4" />
                          Create Manufacturer
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/admin/reviews">
                          <Pill className="mr-2 size-4" />
                          Manage Reviews
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  {isSeller && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/seller/dashboard">
                          <LayoutDashboard className="mr-2 size-4" />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/seller/medicines">
                          <Pill className="mr-2 size-4" />
                          Manage Medicines
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/seller/orders">
                          <Package className="mr-2 size-4" />
                          Update Order Status
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  {isCustomer && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/profile/become-seller">
                          <UserCog className="mr-2 size-4" />
                          Become Seller
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/orders">
                          <Package className="mr-2 size-4" />
                          My Orders
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User className="mr-2 size-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 size-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <Button asChild variant="ghost" size="icon" className="relative">
              <Link href="/cart" aria-label="Cart">
                <ShoppingCart className="size-5" />
                <span className="absolute -top-1 -right-1 inline-flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-semibold leading-5 text-primary-foreground">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              </Link>
            </Button>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Menu">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[85vw] max-w-sm">
                <SheetHeader>
                  <SheetTitle>
                    <Link href="/" className="flex items-center gap-2">
                      <span className="inline-flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <Cross className="size-4" />
                      </span>
                      <span className="text-base font-semibold text-foreground">
                        Niramoy
                      </span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>

                <div className="space-y-6 p-4">
                  <div className="space-y-2">
                    {navLinks.map((link) => {
                      const isActive = pathname === link.href;
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          className={cn(
                            "block rounded-md px-3 py-2 text-sm font-medium",
                            isActive
                              ? "bg-muted text-foreground"
                              : "text-muted-foreground hover:bg-muted",
                          )}
                        >
                          {link.label}
                        </Link>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <span className="text-sm text-muted-foreground">Theme</span>
                    <ModeToggle />
                  </div>

                  {!resolvedIsLoggedIn ? (
                    <div className="flex flex-col gap-2">
                      <Button asChild variant="outline" className="w-full">
                        <Link href="/login">Login</Link>
                      </Button>
                      <Button
                        asChild
                        className="w-full bg-primary text-primary-foreground hover:opacity-95"
                      >
                        <Link href="/register">Register</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {isAdmin && (
                        <>
                          <Link
                            href="/admin/dashboard"
                            className="block rounded-md border px-3 py-2 text-sm"
                          >
                            Dashboard
                          </Link>
                          <Link
                            href="/admin/orders"
                            className="block rounded-md border px-3 py-2 text-sm"
                          >
                            See All Orders
                          </Link>
                          <Link
                            href="/admin/users"
                            className="block rounded-md border px-3 py-2 text-sm"
                          >
                            Manage Users
                          </Link>
                          <Link
                            href="/admin/categories"
                            className="block rounded-md border px-3 py-2 text-sm"
                          >
                            Manage Categories
                          </Link>
                          <Link
                            href="/admin/manufacturers"
                            className="block rounded-md border px-3 py-2 text-sm"
                          >
                            Create Manufacturer
                          </Link>
                          <Link
                            href="/admin/reviews"
                            className="block rounded-md border px-3 py-2 text-sm"
                          >
                            Manage Reviews
                          </Link>
                        </>
                      )}
                      {isSeller && (
                        <>
                          <Link
                            href="/seller/dashboard"
                            className="block rounded-md border px-3 py-2 text-sm"
                          >
                            Dashboard
                          </Link>
                          <Link
                            href="/seller/medicines"
                            className="block rounded-md border px-3 py-2 text-sm"
                          >
                            Manage Medicines
                          </Link>
                          <Link
                            href="/seller/orders"
                            className="block rounded-md border px-3 py-2 text-sm"
                          >
                            Update Order Status
                          </Link>
                        </>
                      )}
                      {isCustomer && (
                        <>
                          <Link
                            href="/profile/become-seller"
                            className="block rounded-md border px-3 py-2 text-sm"
                          >
                            Become Seller
                          </Link>
                          <Link
                            href="/orders"
                            className="block rounded-md border px-3 py-2 text-sm"
                          >
                            My Orders
                          </Link>
                        </>
                      )}
                      <Link
                        href="/profile"
                        className="block rounded-md border px-3 py-2 text-sm"
                      >
                        Profile
                      </Link>
                      <Button
                        variant="destructive"
                        className="w-full"
                        onClick={handleLogout}
                      >
                        Logout
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </header>
  );
}
