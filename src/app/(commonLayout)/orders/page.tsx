import { getMyOrdersAction } from "@/actions/orders.actions";
import { getAuthStateAction } from "@/actions/user.actions";
import { EmptyState } from "@/components/shared/empty-state";
import { Roles } from "@/constants/role";
import type { OrderStatus } from "@/types/order";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { redirect } from "next/navigation";

type OrdersPageProps = {
  searchParams?: Promise<{ placed?: string }>;
};

function getDisplayStatus(
  sellerOrders: Array<{ status?: OrderStatus }> | undefined,
  fallbackStatus: OrderStatus,
) {
  if (!sellerOrders || sellerOrders.length === 0) {
    return fallbackStatus;
  }

  const statuses = sellerOrders.map(
    (sellerOrder) => sellerOrder.status ?? "PLACED",
  );
  const allSame = statuses.every((status) => status === statuses[0]);
  return allSame ? statuses[0] : "MIXED";
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const authState = await getAuthStateAction();

  if (!authState.isAuthenticated) {
    redirect("/login");
  }

  const query = (await searchParams) ?? {};
  const showPlacedSuccess = query.placed === "1";

  if (authState.role !== Roles.CUSTOMER) {
    redirect("/");
  }

  const ordersResult = await getMyOrdersAction({ page: 1, limit: 10 });
  const orders = ordersResult?.orders ?? [];

  return (
    <main className="min-h-[75vh] py-8">
      <div className="container space-y-4 mx-auto w-full max-w-[1280px] px-4 md:px-6 lg:px-8">
        <div>
          <h1 className="text-2xl font-semibold">My Orders</h1>
          <p className="text-sm text-muted-foreground">
            Track your recent medicine orders.
          </p>
          <Link
            href="/shop"
            className="mt-2 inline-flex text-sm font-medium text-emerald-700 underline underline-offset-4"
          >
            Back to Shop
          </Link>
        </div>

        {showPlacedSuccess ? (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900/70 dark:bg-emerald-900/30 dark:text-emerald-200">
            Your order has been placed successfully. You can monitor status
            updates below.
          </div>
        ) : null}

        {orders.length === 0 ? (
          <EmptyState
            title="No Orders Yet"
            description="Once you place an order, it will appear here with status tracking."
            actionLabel="Start Shopping"
            actionHref="/shop"
            className="bg-card"
          />
        ) : (
          <div className="space-y-3">
            {orders.map((order) => {
              const displayStatus = getDisplayStatus(
                order.sellerOrders,
                order.status ?? "PLACED",
              );

              return (
                <Card key={order.id}>
                  <CardContent className="flex flex-wrap items-center justify-between gap-3 py-4">
                    <div>
                      <p className="font-medium">
                        Order #{order.id.slice(0, 8)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString()
                          : "Date unavailable"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Stores:{" "}
                        {order.sellerOrders
                          ?.map((sellerOrder) => sellerOrder.seller?.storeName)
                          .filter(Boolean)
                          .join(", ") || "Niramoy Partner Store"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{displayStatus}</Badge>
                      <Badge>৳{Number(order.totalPrice ?? 0).toFixed(2)}</Badge>
                      <Link
                        href={`/orders/${order.id}`}
                        className="text-xs font-medium text-emerald-700 underline underline-offset-4"
                      >
                        Details
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
