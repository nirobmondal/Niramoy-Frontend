import { getAuthStateAction } from "@/actions/user.actions";
import { AdminListPager } from "@/components/modules/admin/admin-list-pager";
import { AdminReviewDeleteButton } from "@/components/modules/admin/admin-review-delete-button";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Roles } from "@/constants/role";
import { getMedicineById } from "@/services/medicines.service";
import { reviewsService } from "@/services/reviews.service";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

type AdminMedicineReviewsPageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ page?: string }>;
};

const REVIEWS_PER_PAGE = 10;

export default async function AdminMedicineReviewsPage({
  params,
  searchParams,
}: AdminMedicineReviewsPageProps) {
  const authState = await getAuthStateAction();

  if (!authState.isAuthenticated) {
    redirect("/login");
  }

  if (authState.role !== Roles.ADMIN) {
    redirect("/");
  }

  const { id } = await params;
  const query = (await searchParams) ?? {};
  const page = Number.parseInt(query.page ?? "1", 10);
  const currentPage = Number.isFinite(page) && page > 0 ? page : 1;

  const [medicine, reviewsData] = await Promise.all([
    getMedicineById(id).catch(() => null),
    reviewsService.getMedicineReviews(id),
  ]);

  if (!medicine?.id) {
    notFound();
  }

  const startIndex = (currentPage - 1) * REVIEWS_PER_PAGE;
  const pageReviews = reviewsData.reviews.slice(
    startIndex,
    startIndex + REVIEWS_PER_PAGE,
  );
  const totalPages = Math.max(
    1,
    Math.ceil(reviewsData.reviews.length / REVIEWS_PER_PAGE),
  );

  return (
    <main className="min-h-[75vh] py-8">
      <div className="container space-y-4 mx-auto w-full max-w-[1280px] px-4 md:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl font-semibold">Medicine Reviews</h1>
            <p className="text-sm text-muted-foreground">
              Moderate customer reviews for this medicine.
            </p>
            <Link
              href="/admin/dashboard"
              className="mt-2 inline-flex text-sm font-medium text-emerald-700 underline underline-offset-4"
            >
              Back to Admin Dashboard
            </Link>
          </div>
          <Link
            href="/admin/medicines"
            className="text-sm font-medium text-emerald-700 underline underline-offset-4"
          >
            Back to Medicines
          </Link>
        </div>

        <Card>
          <CardContent className="flex flex-wrap items-center justify-between gap-3 py-4">
            <div>
              <p className="font-semibold text-foreground">{medicine.name}</p>
              <p className="text-sm text-muted-foreground">
                Average rating: {reviewsData.averageRating.toFixed(1)}
              </p>
            </div>
            <Badge variant="outline">{reviewsData.totalReviews} reviews</Badge>
          </CardContent>
        </Card>

        {pageReviews.length === 0 ? (
          <EmptyState
            title="No Reviews Found"
            description="No reviews have been submitted for this medicine yet."
            actionLabel="Back to Medicines"
            actionHref="/admin/medicines"
            className="bg-card"
          />
        ) : (
          <div className="space-y-3">
            {pageReviews.map((review) => (
              <Card key={review.id}>
                <CardHeader>
                  <CardTitle className="text-base">
                    {review.user?.name ?? "Anonymous Customer"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <span>Rating: {review.rating}/5</span>
                    {review.createdAt ? (
                      <span>
                        Reviewed on{" "}
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    ) : null}
                  </div>

                  <p className="text-sm text-foreground">
                    {review.comment?.trim() || "No comment provided."}
                  </p>

                  <AdminReviewDeleteButton
                    medicineId={medicine.id}
                    reviewId={review.id}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {pageReviews.length > 0 ? (
          <AdminListPager
            basePath={`/admin/medicines/${medicine.id}/reviews`}
            currentPage={currentPage}
            totalPages={totalPages}
            query={{}}
          />
        ) : null}
      </div>
    </main>
  );
}
