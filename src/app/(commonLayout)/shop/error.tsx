"use client"

import { Button } from "@/components/ui/button"

type ShopErrorProps = {
  error: Error
  reset: () => void
}

export default function ShopError({ error, reset }: ShopErrorProps) {
  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-7xl items-center justify-center px-4 py-8 md:px-6 lg:px-8">
      <div className="w-full max-w-lg rounded-2xl border border-destructive/30 bg-card p-6 text-center shadow-sm">
        <h2 className="text-xl font-semibold">Could not load medicines</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {error.message || "Something unexpected happened while fetching medicines."}
        </p>
        <Button className="mt-4" onClick={reset}>
          Try Again
        </Button>
      </div>
    </main>
  )
}
