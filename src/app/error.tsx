"use client";

import { AppErrorState } from "@/components/shared/app-error-state";
import { useEffect } from "react";

export default function GlobalError({
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
    <main className="bg-background py-8 md:py-10">
      <div className="container mx-auto max-w-6xl">
        <AppErrorState
          title="We hit a temporary issue"
          description="The page could not be loaded. This can happen during network interruptions."
          onRetry={reset}
        />
      </div>
    </main>
  );
}
