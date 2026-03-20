import Link from "next/link";

export default function SellerOrderNotFound() {
  return (
    <main className="min-h-[65vh] py-10">
      <div className="container text-center mx-auto w-full max-w-[1280px] px-4 md:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold">Seller Order Not Found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This order does not exist or you do not have access.
        </p>
        <Link
          href="/seller/orders"
          className="mt-5 inline-flex rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800"
        >
          Back to Seller Orders
        </Link>
      </div>
    </main>
  );
}
