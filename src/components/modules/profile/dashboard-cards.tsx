import { Roles, type RoleValue } from "@/constants/role";
import {
  LayoutDashboard,
  Package,
  Pill,
  Settings,
  Shield,
  Store,
  Tag,
  Users,
} from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type DashboardCardsProps = {
  role: RoleValue;
};

export function DashboardCards({ role }: DashboardCardsProps) {
  if (role === Roles.CUSTOMER) {
    return null;
  }

  if (role === Roles.SELLER) {
    return (
      <Card className="border-emerald-100 dark:border-emerald-900/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="size-5 text-emerald-700" />
            Seller Dashboard Card
          </CardTitle>
          <CardDescription>
            Seller functionality you can perform from your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/seller/medicines"
            className="rounded-xl border border-border bg-background p-4 transition-colors hover:bg-muted"
          >
            <div className="flex items-center gap-2">
              <Pill className="size-4 text-emerald-700" />
              <p className="font-medium">Add Product</p>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Create new medicine listings.
            </p>
          </Link>
          <Link
            href="/seller/medicines"
            className="rounded-xl border border-border bg-background p-4 transition-colors hover:bg-muted"
          >
            <div className="flex items-center gap-2">
              <LayoutDashboard className="size-4 text-emerald-700" />
              <p className="font-medium">Manage Products</p>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Edit stock, price.
            </p>
          </Link>
          <Link
            href="/seller/orders"
            className="rounded-xl border border-border bg-background p-4 transition-colors hover:bg-muted"
          >
            <div className="flex items-center gap-2">
              <Package className="size-4 text-emerald-700" />
              <p className="font-medium">View Orders</p>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Track and update order status.
            </p>
          </Link>
          <Link
            href="/seller/dashboard"
            className="rounded-xl border border-border bg-background p-4 transition-colors hover:bg-muted"
          >
            <div className="flex items-center gap-2">
              <LayoutDashboard className="size-4 text-emerald-700" />
              <p className="font-medium">Sales Analytics</p>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Monitor sales and revenue trends.
            </p>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-emerald-100 dark:border-emerald-900/60">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="size-5 text-emerald-700" />
          Admin Dashboard Card
        </CardTitle>
        <CardDescription>
          Admin controls available for platform management.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/admin/users"
          className="rounded-xl border border-border bg-background p-4 transition-colors hover:bg-muted"
        >
          <div className="flex items-center gap-2">
            <Users className="size-4 text-emerald-700" />
            <p className="font-medium">Manage Users</p>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Review, update, and control user access.
          </p>
        </Link>
        <Link
          href="/admin/medicines"
          className="rounded-xl border border-border bg-background p-4 transition-colors hover:bg-muted"
        >
          <div className="flex items-center gap-2">
            <Tag className="size-4 text-emerald-700" />
            <p className="font-medium">Manage Products</p>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Oversee medicines, categories, and reviews.
          </p>
        </Link>
        <Link
          href="/admin/dashboard"
          className="rounded-xl border border-border bg-background p-4 transition-colors hover:bg-muted"
        >
          <div className="flex items-center gap-2">
            <Settings className="size-4 text-emerald-700" />
            <p className="font-medium">System Settings</p>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Access core dashboard and platform controls.
          </p>
        </Link>
      </CardContent>
    </Card>
  );
}
