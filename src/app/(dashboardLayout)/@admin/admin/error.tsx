"use client";

import { AppErrorState } from "@/components/shared/app-error-state";
import { useEffect } from "react";

export default function AdminSegmentError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-[70vh] py-8">
      <div className="container mx-auto w-full max-w-[1280px] px-4 md:px-6 lg:px-8">
        <AppErrorState
          title="Admin Panel Error"
          description="Admin data could not be loaded at the moment."
          onRetry={reset}
        />
      </div>
    </main>
  );
}
