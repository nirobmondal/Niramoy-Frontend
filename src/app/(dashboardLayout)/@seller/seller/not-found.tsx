import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function SellerNotFound() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center px-4 py-8">
      <div className="max-w-md space-y-3 text-center">
        <h1 className="text-xl font-semibold">Seller route not found</h1>
        <p className="text-sm text-muted-foreground">
          The seller page you requested could not be found.
        </p>
        <Button asChild className="bg-emerald-700 hover:bg-emerald-800">
          <Link href="/seller/dashboard">Go to Seller Dashboard</Link>
        </Button>
      </div>
    </main>
  );
}
