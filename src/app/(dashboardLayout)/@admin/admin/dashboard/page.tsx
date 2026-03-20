import { getAuthStateAction } from "@/actions/user.actions";
import { getAdminDashboardAction } from "@/actions/admin.actions";
import { EmptyState } from "@/components/shared/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Roles } from "@/constants/role";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  const authState = await getAuthStateAction();

  if (!authState.isAuthenticated) {
    redirect("/login");
  }

  if (authState.role !== Roles.ADMIN) {
    redirect("/");
  }

  const dashboard = await getAdminDashboardAction();

  if (!dashboard) {
    return (
      <main className="min-h-[75vh] py-8">
        <div className="container">
          <EmptyState
            title="Dashboard Data Unavailable"
            description="We could not load admin metrics right now. Please refresh and try again."
            actionLabel="Reload Dashboard"
            actionHref="/admin/dashboard"
            className="bg-card"
          />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[75vh] py-8">
      <div className="container space-y-4 w-full mx-auto max-w-[1280px] px-4 md:px-6 lg:px-8">
        <div>
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Platform-level overview and management controls.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{dashboard.totalUsers}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{dashboard.totalOrders}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Medicines</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">
                {dashboard.totalMedicines}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Sellers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{dashboard.totalSellers}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">
                ৳{Number(dashboard.totalRevenue).toFixed(2)}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Management</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Link
              href="/admin/users"
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              Users
            </Link>
            <Link
              href="/admin/manufacturers"
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              Manufacturers
            </Link>
            <Link
              href="/admin/categories"
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              Categories
            </Link>
            <Link
              href="/admin/orders"
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              Orders
            </Link>
            <Link
              href="/admin/medicines"
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              Medicines
            </Link>
            <Link
              href="/admin/reviews"
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              Reviews
            </Link>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
