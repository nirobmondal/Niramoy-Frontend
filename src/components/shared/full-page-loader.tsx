import { Loader2 } from "lucide-react";

export function FullPageLoader({
  label = "Loading your experience...",
}: {
  label?: string;
}) {
  return (
    <section className="relative isolate flex min-h-[60vh] items-center justify-center overflow-hidden rounded-xl border border-border/60 bg-card/80 px-6 py-16">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,oklch(0.9_0.03_170/.35),transparent_55%),radial-gradient(ellipse_at_bottom,oklch(0.95_0.02_240/.45),transparent_60%)]" />
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-primary/12 text-primary">
          <Loader2 className="size-7 animate-spin" />
        </span>
        <p className="text-base font-medium text-foreground">{label}</p>
        <p className="max-w-md text-sm text-muted-foreground">
          Preparing medicines, categories, and offers for you.
        </p>
      </div>
    </section>
  );
}
