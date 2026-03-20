import { Skeleton } from "@/components/ui/skeleton";

export default function ShopLoading() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6 lg:px-8">
      <Skeleton className="mb-6 h-24 w-full rounded-2xl" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <Skeleton className="h-[420px] w-full rounded-2xl md:h-[640px]" />

        <div className="space-y-5">
          <Skeleton className="h-16 w-full rounded-xl" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton key={index} className="h-80 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
