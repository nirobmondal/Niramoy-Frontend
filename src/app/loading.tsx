import { FullPageLoader } from "@/components/shared/full-page-loader";

export default function GlobalLoading() {
  return (
    <main className="bg-background py-8 md:py-10">
      <div className="container mx-auto max-w-6xl">
        <FullPageLoader label="Loading MediStore..." />
      </div>
    </main>
  );
}
