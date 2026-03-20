import Link from "next/link";
import { Inbox } from "lucide-react";

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  className?: string;
};

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  className,
}: EmptyStateProps) {
  return (
    <section
      className={`rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-12 text-center ${className ?? ""}`}
    >
      <span className="mx-auto inline-flex size-12 items-center justify-center rounded-xl bg-background text-muted-foreground">
        <Inbox className="size-5" />
      </span>
      <h3 className="mt-3 text-xl font-semibold text-foreground">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        {description}
      </p>

      {actionLabel && actionHref ? (
        <Link
          href={actionHref}
          className="mt-4 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-95"
        >
          {actionLabel}
        </Link>
      ) : null}
    </section>
  );
}
