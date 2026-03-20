import { Button } from "@/components/ui/button";
import { Ambulance, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";

export function HomeHero() {
  return (
    <section className="rounded-md border border-border bg-card px-6 py-10 shadow-sm md:px-10 md:py-14">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <p className="inline-flex rounded-full border border-border bg-muted px-3 py-2 text-xs font-semibold uppercase tracking-wide text-foreground">
            Safe OTC Healthcare
          </p>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground md:text-5xl">
            Your Trusted Online Medicine Shop
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
            Order quality medicines from verified sellers with transparent
            pricing, fast delivery, and dependable support for your
            family&apos;s everyday healthcare needs.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              asChild
              className="bg-primary px-5 text-primary-foreground hover:opacity-95 text-md py-5"
            >
              <Link href="/shop">Shop Medicines</Link>
            </Button>
            <Button asChild variant="outline" className="px-5 text-md py-5">
              <Link href="/shop">Browse Categories</Link>
            </Button>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-muted-foreground md:text-sm">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="size-4 text-primary" />
              Verified medicines
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Truck className="size-4 text-primary" />
              Fast delivery
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Ambulance className="size-4 text-primary" />
              Support anytime
            </span>
          </div>
        </div>

        <div className="relative">
          <div className="mx-auto max-w-md rounded-md border border-border bg-background p-6 shadow-md">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-sm bg-muted p-4">
                <p className="text-sm text-muted-foreground">
                  Orders delivered
                </p>
                <p className="mt-2 text-xl font-bold text-foreground">10k+</p>
              </div>
              <div className="rounded-sm bg-muted p-4">
                <p className="text-sm text-muted-foreground">
                  Verified sellers
                </p>
                <p className="mt-2 text-xl font-bold text-foreground">500+</p>
              </div>
              <div className="col-span-2 rounded-sm bg-muted p-4">
                <p className="text-sm text-muted-foreground">
                  On-time delivery rate
                </p>
                <p className="mt-2 text-xl font-bold text-foreground">98.7%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
