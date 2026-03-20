import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function GlobalNotFound() {
  return (
    <main className="min-h-[70vh] bg-background py-10 sm:py-14">
      <div className="container mx-auto w-full max-w-6xl px-4 md:px-6 lg:px-8">
        <section className="mx-auto flex max-w-2xl flex-col items-center rounded-2xl border border-border bg-card px-6 py-10 text-center shadow-sm sm:px-8 sm:py-12">
          <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground">
            404
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Page not found
          </h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
            The page you are looking for does not exist or may have been moved.
            Try navigating from the homepage.
          </p>

          <div className="mt-6 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button asChild className="w-full sm:w-auto">
              <Link href="/">Go to Homepage</Link>
            </Button>
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href="/shop">Browse Medicines</Link>
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}
