import {
  getAdminCategoriesAction,
  getAdminMedicinesAction,
  getAdminUsersAction,
} from "@/actions/admin.actions";
import { AdminListPager } from "@/components/modules/admin/admin-list-pager";
import { getAuthStateAction } from "@/actions/user.actions";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Roles } from "@/constants/role";
import Link from "next/link";
import { redirect } from "next/navigation";

type AdminMedicinesPageProps = {
  searchParams?: Promise<{
    page?: string;
    search?: string;
    category?: string;
    seller?: string;
  }>;
};

export default async function AdminMedicinesPage({
  searchParams,
}: AdminMedicinesPageProps) {
  const authState = await getAuthStateAction();

  if (!authState.isAuthenticated) redirect("/login");
  if (authState.role !== Roles.ADMIN) redirect("/");

  const query = (await searchParams) ?? {};
  const page = Number.parseInt(query.page ?? "1", 10);

  const medicinesData = await getAdminMedicinesAction({
    page: Number.isFinite(page) ? page : 1,
    limit: 10,
    search: query.search,
    category: query.category,
    seller: query.seller,
  });
  const categories = await getAdminCategoriesAction();
  const sellerUsers = await getAdminUsersAction({
    role: "SELLER",
    page: 1,
    limit: 100,
  });

  const currentPage = medicinesData.meta.page || 1;
  const totalPages = medicinesData.meta.totalPages || 1;

  return (
    <main className="min-h-[75vh] py-8">
      <div className="container space-y-4 mx-auto w-full max-w-[1280px] px-4 md:px-6 lg:px-8">
        <div>
          <h1 className="text-2xl font-semibold">All Medicines</h1>
          <p className="text-sm text-muted-foreground">
            Review medicine inventory and seller availability status.
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
              className="grid gap-3 lg:grid-cols-[1fr_220px_220px_auto_auto]"
            >
              <input
                name="search"
                defaultValue={query.search ?? ""}
                placeholder="Search medicines"
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              />
              <select
                name="category"
                defaultValue={query.category ?? ""}
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">All categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <select
                name="seller"
                defaultValue={query.seller ?? ""}
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">All sellers</option>
                {sellerUsers.users.map((seller) => (
                  <option key={seller.id} value={seller.id}>
                    {seller.name || seller.email}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="h-10 rounded-md bg-emerald-600 px-4 text-sm font-medium text-white hover:bg-emerald-700"
              >
                Apply
              </button>
              <Link
                href="/admin/medicines"
                className="inline-flex h-10 items-center justify-center rounded-md border border-input px-4 text-sm font-medium hover:bg-muted"
              >
                Reset
              </Link>
            </form>
          </CardContent>
        </Card>

        <p className="text-sm text-muted-foreground">
          Showing {medicinesData.medicines.length} medicines on page{" "}
          {currentPage} of {Math.max(totalPages, 1)}.
        </p>

        <div className="space-y-3">
          {medicinesData.medicines.length === 0 ? (
            <EmptyState
              title="No Medicines Found"
              description="No medicines matched your current filters."
              actionLabel="Clear Filters"
              actionHref="/admin/medicines"
              className="bg-card"
            />
          ) : (
            medicinesData.medicines.map((medicine) => (
              <Card key={medicine.id}>
                <CardHeader>
                  <CardTitle className="text-base">{medicine.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>Seller: {medicine.seller?.storeName || "Unknown"}</p>
                    <p>Category: {medicine.category?.name || "N/A"}</p>
                    <p>Stock: {medicine.stock ?? 0}</p>
                    <p>Price: ৳{Number(medicine.price ?? 0).toFixed(2)}</p>
                  </div>
                  <Badge
                    variant={medicine.isAvailable ? "secondary" : "destructive"}
                  >
                    {medicine.isAvailable ? "Available" : "Unavailable"}
                  </Badge>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <AdminListPager
          basePath="/admin/medicines"
          currentPage={currentPage}
          totalPages={totalPages}
          query={{
            search: query.search,
            category: query.category,
            seller: query.seller,
          }}
        />
      </div>
    </main>
  );
}
