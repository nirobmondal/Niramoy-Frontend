import { Skeleton } from "@/components/ui/skeleton";

export default function MedicineDetailsLoading() {
  return (
    <main className="min-h-[80vh] bg-[radial-gradient(circle_at_20%_0%,#f8fcff_0%,#edf3f7_35%,#eef4f7_100%)] py-6">
      <div className="mx-auto w-full max-w-[1280px] px-4 md:px-6 lg:px-8">
        <Skeleton className="mb-4 h-10 w-36 rounded-lg" />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.08fr_1fr]">
          <Skeleton className="h-[420px] w-full rounded-2xl md:h-[560px]" />
          <Skeleton className="h-[560px] w-full rounded-2xl" />
        </div>

        <div className="mt-8 space-y-5">
          <Skeleton className="h-36 w-full rounded-2xl" />
          <Skeleton className="h-36 w-full rounded-2xl" />
          <Skeleton className="h-44 w-full rounded-2xl" />
        </div>
      </div>
    </main>
  );
}
