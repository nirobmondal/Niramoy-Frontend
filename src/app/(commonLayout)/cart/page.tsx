import { getCartAction } from "@/actions/cart.actions";
import { CartItemsManager } from "@/components/modules/cart/cart-items-manager";
import { EmptyState } from "@/components/shared/empty-state";
import { getAuthStateAction } from "@/actions/user.actions";
import { Roles } from "@/constants/role";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function CartPage() {
  const authState = await getAuthStateAction();

  if (!authState.isAuthenticated) {
    redirect("/login");
  }

  if (authState.role !== Roles.CUSTOMER) {
    redirect("/");
  }

  const cart = await getCartAction();
  const items = cart?.items ?? [];

  return (
    <main className="min-h-[75vh] py-8">
      <div className="container space-y-4 mx-auto w-full max-w-[1280px] px-4 md:px-6 lg:px-8">
        <div>
          <h1 className="text-2xl font-semibold">My Cart</h1>
          <p className="text-sm text-muted-foreground">
            Review your selected medicines before checkout.
          </p>
          <Link
            href="/shop"
            className="mt-2 inline-flex text-sm font-medium text-emerald-700 underline underline-offset-4"
          >
            Back to Shop
          </Link>
        </div>

        {items.length === 0 ? (
          <EmptyState
            title="Your Cart Is Empty"
            description="Add medicines from the shop to continue to checkout."
            actionLabel="Browse Medicines"
            actionHref="/shop"
            className="bg-card"
          />
        ) : (
          <CartItemsManager cart={cart!} />
        )}
      </div>
    </main>
  );
}
