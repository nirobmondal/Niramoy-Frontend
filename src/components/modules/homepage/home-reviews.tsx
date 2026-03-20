import { Star } from "lucide-react";

const reviews = [
  {
    name: "Fariha Ahmed",
    rating: 5,
    comment:
      "The ordering process is very smooth and delivery was right on time.",
  },
  {
    name: "Mahin Rahman",
    rating: 5,
    comment:
      "Product quality and packaging were excellent. Highly recommended.",
  },
  {
    name: "Nabila Islam",
    rating: 4,
    comment:
      "Easy to find medicines with filters. Support team was responsive.",
  },
];

export function HomeReviews() {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">
          Customer Reviews
        </h2>
        <p className="text-lg text-muted-foreground">
          What customers are saying about Niramoy.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {reviews.map((review) => (
          <article
            key={review.name}
            className="rounded-xl border border-border bg-card p-5 py-8"
          >
            <div className="flex items-center gap-1 text-amber-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`size-4 ${i < review.rating ? "fill-current" : "text-amber-200"}`}
                />
              ))}
            </div>
            <p className="mt-3 text-md text-muted-foreground">
              &ldquo;{review.comment}&rdquo;
            </p>
            <p className="mt-4 text-sm font-semibold text-foreground">
              {review.name}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
