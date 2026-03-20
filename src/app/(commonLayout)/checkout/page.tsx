import { getCartAction } from "@/actions/cart.actions";
import { getAuthStateAction } from "@/actions/user.actions";
import { CheckoutForm } from "@/components/modules/checkout/checkout-form";
import { EmptyState } from "@/components/shared/empty-state";
import { Roles } from "@/constants/role";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function CheckoutPage() {
  const authState = await getAuthStateAction();

  if (!authState.isAuthenticated) {
    redirect("/login");
  }

  if (authState.role !== Roles.CUSTOMER) {
    redirect("/");
  }

  const cart = await getCartAction();
  const hasItems = Boolean(cart?.items?.length);

  return (
    <main className="min-h-[75vh] py-8">
      <div className="container space-y-4 mx-auto w-full max-w-[1280px] px-4 md:px-6 lg:px-8">
        <div>
          <h1 className="text-2xl font-semibold">Checkout</h1>
          <p className="text-sm text-muted-foreground">
            Confirm shipping details and place your order.
          </p>
          <Link
            href="/cart"
            className="mt-2 inline-flex text-sm font-medium text-emerald-700 underline underline-offset-4"
          >
            Back to Cart
          </Link>
        </div>

        {!hasItems ? (
          <EmptyState
            title="Your Cart Is Empty"
            description="Add medicines to your cart before continuing to checkout."
            actionLabel="Go To Shop"
            actionHref="/shop"
            className="bg-card"
          />
        ) : (
          <CheckoutForm cartTotal={cart?.total ?? 0} />
        )}
      </div>
    </main>
  );
}
