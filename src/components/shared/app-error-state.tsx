"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

export function AppErrorState({
  title = "Something went wrong",
  description = "We could not load this page right now. Please try again.",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <section className="relative isolate flex min-h-[60vh] items-center justify-center overflow-hidden rounded-3xl border border-border/60 bg-card/80 px-6 py-16">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,oklch(0.83_0.08_45/.16),transparent_50%),radial-gradient(ellipse_at_bottom,oklch(0.95_0.02_240/.4),transparent_62%)]" />
      <div className="flex max-w-lg flex-col items-center gap-4 text-center">
        <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-destructive/12 text-destructive">
          <AlertTriangle className="size-7" />
        </span>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          {title}
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
        <Button onClick={onRetry} className="mt-1">
          <RefreshCw className="mr-2 size-4" />
          Try again
        </Button>
      </div>
    </section>
  );
}
