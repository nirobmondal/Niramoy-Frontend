import { MedicineCard } from "@/components/modules/medicine/medicine-card";
import { EmptyState } from "@/components/shared/empty-state";
import type { Medicine } from "@/types/medicine";
import Link from "next/link";

type HomeFeaturedMedicinesProps = {
  medicines: Medicine[];
};

export function HomeFeaturedMedicines({
  medicines,
}: HomeFeaturedMedicinesProps) {
  const featured = medicines.slice(0, 6);

  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-3">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">
          Featured Medicines
        </h2>
        <Link
          href="/shop"
          className="inline-flex h-10 items-center rounded-lg border border-border px-4 text-sm font-medium hover:bg-muted"
        >
          Show All Medicines
        </Link>
      </div>

      <p className="text-lg text-muted-foreground">
        Top picks from verified sellers.
      </p>

      {featured.length === 0 ? (
        <EmptyState
          title="No Featured Medicines"
          description="Featured medicines are not available yet. Add products from the seller panel to populate this section."
          actionLabel="Explore Shop"
          actionHref="/shop"
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((medicine) => (
            <MedicineCard key={medicine.id} medicine={medicine} />
          ))}
        </div>
      )}
    </section>
  );
}
