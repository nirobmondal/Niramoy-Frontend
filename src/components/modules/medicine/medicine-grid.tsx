import { MedicineCard } from "./medicine-card";
import { EmptyState } from "@/components/shared/empty-state";
import type { Medicine } from "@/types/medicine";

type MedicineGridProps = {
  medicines: Medicine[];
};

export function MedicineGrid({ medicines }: MedicineGridProps) {
  if (medicines.length === 0) {
    return (
      <EmptyState
        title="No Medicines Found"
        description="Try changing your search, category, manufacturer, or price range to see matching products."
        actionLabel="Clear Filters"
        actionHref="/shop"
        className="border-[#c5d8e2] bg-white"
      />
    );
  }

  return (
    <section
      aria-label="Medicine results"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      {medicines.map((medicine) => (
        <MedicineCard key={medicine.id} medicine={medicine} />
      ))}
    </section>
  );
}
