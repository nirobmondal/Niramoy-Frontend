import { Skeleton } from "@/components/ui/skeleton"

export default function MedicineDetailsLoading() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 md:px-6 lg:px-8">
      <Skeleton className="mb-4 h-8 w-32" />
      <Skeleton className="h-[560px] w-full rounded-2xl" />
    </main>
  )
}
