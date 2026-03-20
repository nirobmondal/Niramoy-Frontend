import Link from "next/link";
import { redirect } from "next/navigation";

import { getAdminReviewsAction } from "@/actions/admin.actions";
import { getAuthStateAction } from "@/actions/user.actions";
import { AdminListPager } from "@/components/modules/admin/admin-list-pager";
import { AdminReviewRowActions } from "@/components/modules/admin/admin-review-row-actions";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Roles } from "@/constants/role";

type AdminReviewsPageProps = {
  searchParams?: Promise<{
    page?: string;
    search?: string;
    rating?: string;
  }>;
};

export default async function AdminReviewsPage({
  searchParams,
}: AdminReviewsPageProps) {
  const authState = await getAuthStateAction();

  if (!authState.isAuthenticated) {
    redirect("/login");
  }

  if (authState.role !== Roles.ADMIN) {
    redirect("/");
  }

  const query = (await searchParams) ?? {};
  const rawPage = Number.parseInt(query.page ?? "1", 10);
  const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;

  const rawRating = Number.parseInt(query.rating ?? "", 10);
  const rating =
    Number.isFinite(rawRating) && rawRating >= 1 && rawRating <= 5
      ? rawRating
      : undefined;

  const reviewsData = await getAdminReviewsAction({
    page,
    limit: 10,
    search: query.search,
    rating,
  });

  return (
    <main className="min-h-[75vh] py-8">
      <div className="container space-y-4 mx-auto w-full max-w-[1280px] px-4 md:px-6 lg:px-8">
        <div>
          <h1 className="text-2xl font-semibold">Manage Reviews</h1>
          <p className="text-sm text-muted-foreground">
            Moderate all customer reviews across medicines.
          </p>
          <Link
            href="/admin/dashboard"
            className="mt-2 inline-flex text-sm font-medium text-emerald-700 underline underline-offset-4"
          >
            Back to Admin Dashboard
          </Link>
        </div>

        <Card>
          <CardContent className="pt-6">
            <form
              method="GET"
              className="grid gap-3 lg:grid-cols-[1fr_180px_auto_auto]"
            >
              <input
                name="search"
                defaultValue={query.search ?? ""}
                placeholder="Search by medicine, user, or comment"
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              />
              <select
                name="rating"
                defaultValue={query.rating ?? ""}
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">All ratings</option>
                <option value="5">5 stars</option>
                <option value="4">4 stars</option>
                <option value="3">3 stars</option>
                <option value="2">2 stars</option>
                <option value="1">1 star</option>
              </select>
              <button
                type="submit"
                className="h-10 rounded-md bg-emerald-600 px-4 text-sm font-medium text-white hover:bg-emerald-700"
              >
                Apply
              </button>
              <Link
                href="/admin/reviews"
                className="inline-flex h-10 items-center justify-center rounded-md border border-input px-4 text-sm font-medium hover:bg-muted"
              >
                Reset
              </Link>
            </form>
          </CardContent>
        </Card>

        <p className="text-sm text-muted-foreground">
          Showing {reviewsData.reviews.length} reviews on page{" "}
          {reviewsData.meta.page} of {Math.max(reviewsData.meta.totalPages, 1)}.
        </p>

        {reviewsData.reviews.length === 0 ? (
          <EmptyState
            title="No Reviews Found"
            description="No reviews matched your current filters."
            actionLabel="Clear Filters"
            actionHref="/admin/reviews"
            className="bg-card"
          />
        ) : (
          <div className="space-y-3">
            {reviewsData.reviews.map((review) => {
              const medicineId = review.medicine?.id ?? "";
              const medicineName = review.medicine?.name ?? "Unknown medicine";
              const reviewer =
                review.user?.name || review.user?.email || "Anonymous user";

              return (
                <Card key={review.id}>
                  <CardHeader>
                    <CardTitle className="text-base">{medicineName}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="outline">{review.rating}/5</Badge>
                      <span>By: {reviewer}</span>
                      {review.createdAt ? (
                        <span>
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      ) : null}
                    </div>

                    <p className="text-sm text-foreground">
                      {review.comment?.trim() || "No comment provided."}
                    </p>

                    {medicineId ? (
                      <AdminReviewRowActions
                        reviewId={review.id}
                        medicineId={medicineId}
                        currentRating={review.rating}
                        currentComment={review.comment}
                      />
                    ) : (
                      <p className="text-xs text-amber-700">
                        This review cannot be edited because medicine reference
                        is missing.
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <AdminListPager
          basePath="/admin/reviews"
          currentPage={reviewsData.meta.page}
          totalPages={Math.max(reviewsData.meta.totalPages, 1)}
          query={{
            search: query.search,
            rating: query.rating,
          }}
        />
      </div>
    </main>
  );
}
