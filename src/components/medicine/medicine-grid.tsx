import { MedicineCard } from "@/components/medicine/medicine-card"
import type { Medicine } from "@/types/medicine"

type MedicineGridProps = {
  medicines: Medicine[]
}

export function MedicineGrid({ medicines }: MedicineGridProps) {
  if (medicines.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[#cfdde7] bg-white p-10 text-center">
        <h3 className="text-lg font-semibold text-[#203340]">No medicines found</h3>
        <p className="mt-2 text-sm text-[#6f8390]">
          Try adjusting your search, filters, or price range.
        </p>
      </div>
    )
  }

  return (
    <section aria-label="Medicine results" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {medicines.map((medicine) => (
        <MedicineCard key={medicine.id} medicine={medicine} />
      ))}
    </section>
  )
}
