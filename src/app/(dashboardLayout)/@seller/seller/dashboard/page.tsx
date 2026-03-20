import { getAuthStateAction } from "@/actions/user.actions";
import {
  getSellerDashboardAction,
  getSellerProfileAction,
} from "@/actions/seller.actions";
import { EmptyState } from "@/components/shared/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Roles } from "@/constants/role";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function SellerDashboard() {
  const authState = await getAuthStateAction();

  if (!authState.isAuthenticated) {
    redirect("/login");
  }

  if (authState.role !== Roles.SELLER) {
    redirect("/");
  }

  const [dashboard, profile] = await Promise.all([
    getSellerDashboardAction(),
    getSellerProfileAction(),
  ]);

  if (!dashboard) {
    return (
      <main className="min-h-[75vh] py-8">
        <div className="container">
          <EmptyState
            title="Dashboard Data Unavailable"
            description="We could not load seller metrics right now. Please refresh and try again."
            actionLabel="Reload Dashboard"
            actionHref="/seller/dashboard"
            className="bg-card"
          />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[75vh] py-8">
      <div className="container space-y-4 mx-auto w-full max-w-[1280px] px-4 md:px-6 lg:px-8">
        <div>
          <h1 className="text-2xl font-semibold">Seller Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Welcome back, {profile?.storeName ?? "Seller"}.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Total Medicines</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">
                {dashboard.totalMedicines}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Total Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{dashboard.totalSales}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">
                ৳{Number(dashboard.totalRevenue).toFixed(2)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Pending Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">
                {dashboard.pendingOrders}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Link
              href="/seller/medicines"
              className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800"
            >
              Manage Medicines
            </Link>
            <Link
              href="/seller/orders"
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              Manage Orders
            </Link>
            <Link
              href="/profile"
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              Update Profile
            </Link>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
