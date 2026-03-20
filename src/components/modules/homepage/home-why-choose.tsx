import { Clock3, PackageCheck, ShieldCheck, ShoppingBag } from "lucide-react";

const highlights = [
  {
    title: "Trusted Medicines",
    description:
      "Only verified OTC products from trusted and monitored sellers.",
    icon: ShieldCheck,
  },
  {
    title: "Fast Delivery",
    description: "Reliable delivery network to reach your doorstep quickly.",
    icon: Clock3,
  },
  {
    title: "Verified Sellers",
    description: "Sellers are profiled and tracked for quality assurance.",
    icon: PackageCheck,
  },
  {
    title: "Easy Ordering",
    description: "Search, filter, and checkout in a smooth streamlined flow.",
    icon: ShoppingBag,
  },
];

export function HomeWhyChoose() {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">
          Why Choose Niramoy
        </h2>
        <p className="text-lg text-muted-foreground">
          Built for secure, simple, and dependable medicine shopping.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {highlights.map((item) => (
          <article
            key={item.title}
            className="rounded-xl border border-border bg-card p-5"
          >
            <span className="inline-flex size-10 items-center justify-center rounded-xl bg-muted text-primary">
              <item.icon className="size-5" />
            </span>
            <h3 className="mt-3 font-semibold text-foreground">{item.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {item.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
