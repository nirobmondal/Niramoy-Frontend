import {
  getAdminOrdersAction,
  getAdminUsersAction,
} from "@/actions/admin.actions";
import { AdminListPager } from "@/components/modules/admin/admin-list-pager";
import { getAuthStateAction } from "@/actions/user.actions";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Roles } from "@/constants/role";
import Link from "next/link";
import { redirect } from "next/navigation";

type AdminOrdersPageProps = {
  searchParams?: Promise<{
    page?: string;
    customer?: string;
    seller?: string;
  }>;
};

export default async function AdminOrdersPage({
  searchParams,
}: AdminOrdersPageProps) {
  const authState = await getAuthStateAction();

  if (!authState.isAuthenticated) redirect("/login");
  if (authState.role !== Roles.ADMIN) redirect("/");

  const query = (await searchParams) ?? {};
  const page = Number.parseInt(query.page ?? "1", 10);

  const ordersData = await getAdminOrdersAction({
    page: Number.isFinite(page) ? page : 1,
    limit: 10,
    customer: query.customer,
    seller: query.seller,
  });
  const sellerUsers = await getAdminUsersAction({
    role: "SELLER",
    page: 1,
    limit: 100,
  });

  const currentPage = ordersData.meta.page || 1;
  const totalPages = ordersData.meta.totalPages || 1;

  return (
    <main className="min-h-[75vh] py-8">
      <div className="container space-y-4 mx-auto w-full max-w-[1280px] px-4 md:px-6 lg:px-8">
        <div>
          <h1 className="text-2xl font-semibold">All Orders</h1>
          <p className="text-sm text-muted-foreground">
            Monitor all order activity across customers and sellers.
          </p>
          <Link
            href="/admin/dashboard"
            className="mt-2 inline-flex text-sm font-medium text-emerald-700 underline underline-offset-4"
          >
            Back to Admin Dashboard
          </Link>
        </div>

        <Card>
          <CardContent className="pt-6">
            <form
              method="GET"
              className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_240px_auto_auto]"
            >
              <input
                name="customer"
                defaultValue={query.customer ?? ""}
                placeholder="Search customer name, email, or id"
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              />
              <select
                name="seller"
                defaultValue={query.seller ?? ""}
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">All sellers</option>
                {sellerUsers.users.map((seller) => (
                  <option key={seller.id} value={seller.id}>
                    {seller.name || seller.email}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="h-10 rounded-md bg-emerald-600 px-4 text-sm font-medium text-white hover:bg-emerald-700"
              >
                Apply
              </button>
              <Link
                href="/admin/orders"
                className="inline-flex h-10 items-center justify-center rounded-md border border-input px-4 text-sm font-medium hover:bg-muted"
              >
                Reset
              </Link>
            </form>
          </CardContent>
        </Card>

        <p className="text-sm text-muted-foreground">
          Showing {ordersData.orders.length} orders on page {currentPage} of{" "}
          {Math.max(totalPages, 1)}.
        </p>

        <div className="space-y-3">
          {ordersData.orders.length === 0 ? (
            <EmptyState
              title="No Orders Found"
              description="No orders matched your current customer/seller filters."
              actionLabel="Clear Filters"
              actionHref="/admin/orders"
              className="bg-card"
            />
          ) : (
            ordersData.orders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <CardTitle className="text-base">
                    Order #{order.id.slice(0, 8)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>
                      Customer:{" "}
                      {order.customer?.name || order.customer?.email || "N/A"}
                    </p>
                    <p>Email: {order.customer?.email || "N/A"}</p>
                    <p>Total: ৳{Number(order.totalPrice ?? 0).toFixed(2)}</p>
                  </div>

                  <div className="space-y-2 text-right">
                    <div className="flex flex-wrap justify-end gap-2">
                      {(order.sellerOrders ?? []).length === 0 ? (
                        <Badge variant="outline">
                          No seller status available
                        </Badge>
                      ) : (
                        (order.sellerOrders ?? []).map((sellerOrder) => (
                          <Badge
                            key={sellerOrder.id}
                            variant="secondary"
                            className="max-w-full whitespace-normal break-words text-left"
                          >
                            {(sellerOrder.seller?.storeName ||
                              "Unknown Store") +
                              ": " +
                              (sellerOrder.status ?? "PLACED")}
                          </Badge>
                        ))
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <AdminListPager
          basePath="/admin/orders"
          currentPage={currentPage}
          totalPages={totalPages}
          query={{
            customer: query.customer,
            seller: query.seller,
          }}
        />
      </div>
    </main>
  );
}
