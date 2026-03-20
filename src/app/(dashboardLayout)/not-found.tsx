import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function DashboardNotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-10">
      <div className="max-w-md space-y-3 text-center">
        <h1 className="text-2xl font-semibold">Dashboard page not found</h1>
        <p className="text-sm text-muted-foreground">
          The dashboard route you requested does not exist.
        </p>
        <Button asChild className="mt-1 bg-emerald-700 hover:bg-emerald-800">
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    </main>
  );
}
