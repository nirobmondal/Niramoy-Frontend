import { getOrderByIdAction } from "@/actions/orders.actions";
import { getAuthStateAction } from "@/actions/user.actions";
import { OrderCancelButton } from "@/components/modules/orders/order-cancel-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Roles } from "@/constants/role";
import type { OrderStatus } from "@/types/order";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

type OrderDetailsPageProps = {
  params: Promise<{ id: string }>;
};

const statusSteps: OrderStatus[] = [
  "PLACED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

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

export default async function OrderDetailsPage({
  params,
}: OrderDetailsPageProps) {
  const authState = await getAuthStateAction();

  if (!authState.isAuthenticated) {
    redirect("/login");
  }

  if (authState.role !== Roles.CUSTOMER) {
    redirect("/");
  }

  const { id } = await params;
  const order = await getOrderByIdAction(id);

  if (!order) {
    notFound();
  }

  const currentStatus = (order.status ?? "PLACED") as OrderStatus;
  const displayStatus = getDisplayStatus(order.sellerOrders, currentStatus);
  const sellerOrders = order.sellerOrders ?? [];
  const canCancel =
    sellerOrders.length > 0
      ? sellerOrders.every(
          (sellerOrder) => (sellerOrder.status ?? "PLACED") === "PLACED",
        )
      : currentStatus === "PLACED";

  return (
    <main className="min-h-[75vh] py-8">
      <div className="container space-y-4 mx-auto w-full max-w-[1280px] px-4 md:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl font-semibold">Order Details</h1>
            <p className="text-sm text-muted-foreground">Order #{order.id}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{displayStatus}</Badge>
            <Button asChild type="button" variant="outline" size="sm">
              <Link href="/orders">Back to Orders</Link>
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Seller Status Timelines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {sellerOrders.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No seller-level statuses available yet.
              </p>
            ) : (
              sellerOrders.map((sellerOrder) => {
                const sellerStatus = sellerOrder.status ?? "PLACED";
                const sellerIndex = Math.max(
                  0,
                  statusSteps.indexOf(sellerStatus),
                );

                return (
                  <div
                    key={sellerOrder.id}
                    className="space-y-2 rounded-lg border border-border/70 px-3 py-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium">
                        {sellerOrder.seller?.storeName ||
                          "Niramoy Partner Store"}
                      </p>
                      <Badge variant="outline">{sellerStatus}</Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {statusSteps.map((status, index) => {
                        const isDone =
                          sellerStatus === "CANCELLED"
                            ? status === "CANCELLED"
                            : index <= sellerIndex;

                        return (
                          <span
                            key={`${sellerOrder.id}-${status}`}
                            className={`rounded-full border px-3 py-1 text-xs font-medium ${
                              isDone
                                ? "border-emerald-300 bg-emerald-100 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200"
                                : "border-border bg-muted/50 text-muted-foreground"
                            }`}
                          >
                            {status}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="space-y-1 py-4">
              <p className="text-sm text-muted-foreground">Shipping Address</p>
              <p className="font-medium">
                {order.shippingAddress || "No address available"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-1 py-4">
              <p className="text-sm text-muted-foreground">Created At</p>
              <p className="font-medium">
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleString()
                  : "N/A"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-1 py-4">
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="text-lg font-semibold text-emerald-700">
                ৳{Number(order.totalPrice ?? 0).toFixed(2)}
              </p>
            </CardContent>
          </Card>
        </div>

        {order.sellerOrders && order.sellerOrders.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Stores</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {order.sellerOrders.map((sellerOrder) => (
                <div
                  key={sellerOrder.id}
                  className="rounded-lg border border-border/70 px-3 py-2 text-sm"
                >
                  <p className="font-medium">
                    {sellerOrder.seller?.storeName || "Niramoy Partner Store"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Status: {sellerOrder.status ?? "PLACED"}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        ) : null}

        {order.items && order.items.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border border-border/70 px-3 py-2"
                >
                  <div>
                    <p className="font-medium">
                      {item.medicine?.name ?? "Medicine"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-foreground">
                    ৳{Number(item.price ?? 0).toFixed(2)}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        ) : null}

        <OrderCancelButton orderId={order.id} canCancel={canCancel} />
      </div>
    </main>
  );
}
