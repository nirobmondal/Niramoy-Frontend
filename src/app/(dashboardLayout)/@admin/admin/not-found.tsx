import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function AdminNotFound() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center px-4 py-8">
      <div className="max-w-md space-y-3 text-center">
        <h1 className="text-xl font-semibold">Admin route not found</h1>
        <p className="text-sm text-muted-foreground">
          The admin page you tried to open is unavailable.
        </p>
        <Button asChild className="bg-emerald-700 hover:bg-emerald-800">
          <Link href="/admin/dashboard">Go to Admin Dashboard</Link>
        </Button>
      </div>
    </main>
  );
}
