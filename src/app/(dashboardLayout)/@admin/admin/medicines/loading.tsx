import { FullPageLoader } from "@/components/shared/full-page-loader";

export default function AdminMedicinesLoading() {
  return (
    <main className="min-h-[70vh] py-8">
      <div className="container mx-auto w-full max-w-[1280px] px-4 md:px-6 lg:px-8">
        <FullPageLoader label="Loading medicines..." />
      </div>
    </main>
  );
}
