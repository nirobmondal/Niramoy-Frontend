import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Cross } from "lucide-react";
import Link from "next/link";

type FooterProps = {
  className?: string;
};

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Medicines", href: "/shop" },
  { label: "Categories", href: "/shop" },
  { label: "Dashboard", href: "/dashboard" },
];

export function Footer({ className }: FooterProps) {
  return (
    <footer
      className={cn("mt-16 border-t border-border/80 bg-background", className)}
    >
      <div className="container py-12 mx-auto w-full max-w-[1280px] px-4 md:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <Cross className="size-5" />
              </span>
              <span className="text-3xl font-extrabold text-foreground">
                Niramoy
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-md leading-relaxed text-muted-foreground">
              Your trusted online medicine shop for safe and reliable
              healthcare.
            </p>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold uppercase tracking-wide text-foreground">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2 text-md">
              {quickLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground text-base transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold uppercase tracking-wide text-foreground">
              Support
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="text-muted-foreground text-base">
                Tracking Order
              </li>
              <li className="text-muted-foreground text-md">
                Cash On Delivery (COD)
              </li>
              <li className="text-muted-foreground text-md">Fast Delivery</li>
              <li className="text-muted-foreground text-md">
                Trusted Medicine
              </li>
            </ul>
          </div>

          <div className="lg:col-span-4">
            <h3 className="text-lg font-semibold uppercase tracking-wide text-foreground">
              Newsletter
            </h3>
            <p className="mt-4 text-muted-foreground text-md">
              Get health tips, new arrivals, and special offers in your inbox.
            </p>
            <form className="mt-4 flex flex-col gap-2 sm:flex-row" action="#">
              <Input
                type="email"
                required
                placeholder="Enter your email"
                className="h-10"
              />
              <Button className="h-10 bg-primary px-5 text-primary-foreground hover:opacity-95 text-md">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-10 border-t border-border/70 pt-5 text-center text-sm text-muted-foreground">
          © 2026 Niramoy. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
