import { getSellerOrderByIdAction } from "@/actions/seller.actions";
import { getAuthStateAction } from "@/actions/user.actions";
import { SellerOrderStatusUpdater } from "@/components/modules/seller/seller-order-status-updater";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Roles } from "@/constants/role";
import type { OrderStatus } from "@/types/order";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

type SellerOrderDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function SellerOrderDetailsPage({
  params,
}: SellerOrderDetailsPageProps) {
  const authState = await getAuthStateAction();

  if (!authState.isAuthenticated) {
    redirect("/login");
  }

  if (authState.role !== Roles.SELLER) {
    redirect("/");
  }

  const { id } = await params;
  const order = await getSellerOrderByIdAction(id);

  if (!order) {
    notFound();
  }

  const currentStatus = (order.status ?? "PLACED") as OrderStatus;

  return (
    <main className="min-h-[75vh] py-8">
      <div className="container space-y-4 mx-auto w-full max-w-[1280px] px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl font-semibold">Manage Seller Order</h1>
            <Link
              href="/seller/orders"
              className="mt-2 inline-flex text-sm font-medium text-emerald-700 underline underline-offset-4"
            >
              Back to Seller Orders
            </Link>
          </div>
          <Badge variant="outline">{currentStatus}</Badge>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              <span className="font-medium">Order ID:</span> {order.id}
            </p>
            <p>
              <span className="font-medium">Subtotal:</span> ৳
              {Number(order.subtotal ?? 0).toFixed(2)}
            </p>
            <p>
              <span className="font-medium">Customer:</span>{" "}
              {order.order?.customer?.name ?? "N/A"}
            </p>
            <p>
              <span className="font-medium">Shipping:</span>{" "}
              {order.order?.shippingAddress ?? "N/A"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Update Status</CardTitle>
          </CardHeader>
          <CardContent>
            <SellerOrderStatusUpdater
              sellerOrderId={order.id}
              currentStatus={currentStatus}
            />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
