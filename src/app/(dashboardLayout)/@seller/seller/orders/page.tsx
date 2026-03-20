import { getSellerOrdersAction } from "@/actions/seller.actions";
import { getAuthStateAction } from "@/actions/user.actions";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Roles } from "@/constants/role";
import Link from "next/link";
import { redirect } from "next/navigation";

type SellerOrdersPageProps = {
  searchParams?: Promise<{ page?: string; status?: string }>;
};

export default async function SellerOrdersPage({
  searchParams,
}: SellerOrdersPageProps) {
  const authState = await getAuthStateAction();

  if (!authState.isAuthenticated) {
    redirect("/login");
  }

  if (authState.role !== Roles.SELLER) {
    redirect("/");
  }

  const query = (await searchParams) ?? {};
  const page = Number.parseInt(query.page ?? "1", 10);

  const ordersData = await getSellerOrdersAction({
    page: Number.isFinite(page) ? page : 1,
    limit: 10,
    status: query.status as never,
  });

  return (
    <main className="min-h-[75vh] py-8">
      <div className="container space-y-4 mx-auto w-full max-w-[1280px] px-4 md:px-6 lg:px-8">
        <div>
          <h1 className="text-2xl font-semibold">Seller Orders</h1>
          <p className="text-sm text-muted-foreground">
            Track and process incoming seller orders.
          </p>
          <Link
            href="/seller/dashboard"
            className="mt-2 inline-flex text-sm font-medium text-emerald-700 underline underline-offset-4"
          >
            Back to Seller Dashboard
          </Link>
        </div>

        <div className="space-y-3">
          {ordersData.orders.length === 0 ? (
            <EmptyState
              title="No Seller Orders"
              description="No orders are available for the selected filter right now."
              actionLabel="View All Orders"
              actionHref="/seller/orders"
              className="bg-card"
            />
          ) : (
            ordersData.orders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <CardTitle className="text-base">
                    Seller Order #{order.id.slice(0, 8)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleString()
                        : "Date unavailable"}
                    </p>
                    <p className="text-sm">
                      Subtotal: ৳{Number(order.subtotal ?? 0).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{order.status}</Badge>
                    <Link
                      href={`/seller/orders/${order.id}`}
                      className="text-sm font-medium text-emerald-700 underline underline-offset-4"
                    >
                      Manage
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
