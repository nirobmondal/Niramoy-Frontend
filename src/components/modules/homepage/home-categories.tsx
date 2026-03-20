import type { Category } from "@/types/medicine";
import {
  BadgePlus,
  HeartPulse,
  Pill,
  Shield,
  Stethoscope,
  Syringe,
} from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/shared/empty-state";

const icons = [Pill, HeartPulse, Stethoscope, Syringe, Shield, BadgePlus];

type HomeCategoriesProps = {
  categories: Category[];
};

export function HomeCategories({ categories }: HomeCategoriesProps) {
  const items = categories.slice(0, 6);

  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Categories
          </h2>
          <p className="text-lg text-muted-foreground">
            Discover medicines by healthcare category.
          </p>
        </div>
        <Link
          href="/shop"
          className="inline-flex h-10 items-center rounded-lg border border-border px-4 text-sm font-medium hover:bg-muted"
        >
          Show All Categories
        </Link>
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="No Categories Available"
          description="Categories are not available yet. Admin can add categories from the dashboard."
          actionLabel="Go To Shop"
          actionHref="/shop"
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((category, index) => {
            const Icon = icons[index % icons.length];
            return (
              <Link
                key={category.id}
                href={`/shop?categoryId=${category.id}`}
                className="group rounded-2xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
              >
                <div className="inline-flex size-10 items-center justify-center rounded-xl bg-muted text-primary">
                  <Icon className="size-5" />
                </div>
                <h3 className="mt-3 font-semibold text-foreground group-hover:text-primary">
                  {category.name}
                </h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {category.description || "Browse products in this category"}
                </p>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
