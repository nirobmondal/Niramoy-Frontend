import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function MedicineNotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-5xl items-center justify-center px-4 py-8 md:px-6 lg:px-8">
      <div className="w-full max-w-md rounded-2xl border border-border/70 bg-card p-6 text-center shadow-sm">
        <h1 className="text-2xl font-semibold">Medicine not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The medicine you requested does not exist or may have been removed.
        </p>
        <Button asChild className="mt-4">
          <Link href="/shop">Back to Shop</Link>
        </Button>
      </div>
    </main>
  )
}
