import { getAdminUsersAction } from "@/actions/admin.actions";
import { AdminListPager } from "@/components/modules/admin/admin-list-pager";
import { getAuthStateAction } from "@/actions/user.actions";
import { AdminUserBanToggle } from "@/components/modules/admin/admin-user-ban-toggle";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Roles } from "@/constants/role";
import Link from "next/link";
import { redirect } from "next/navigation";

type AdminUsersPageProps = {
  searchParams?: Promise<{
    page?: string;
    role?: "CUSTOMER" | "SELLER" | "ADMIN";
    search?: string;
  }>;
};

export default async function AdminUsersPage({
  searchParams,
}: AdminUsersPageProps) {
  const authState = await getAuthStateAction();

  if (!authState.isAuthenticated) redirect("/login");
  if (authState.role !== Roles.ADMIN) redirect("/");

  const query = (await searchParams) ?? {};
  const page = Number.parseInt(query.page ?? "1", 10);

  const usersData = await getAdminUsersAction({
    page: Number.isFinite(page) ? page : 1,
    limit: 10,
    role: query.role,
    search: query.search,
  });

  const currentPage = usersData.meta.page || 1;
  const totalPages = usersData.meta.totalPages || 1;

  return (
    <main className="min-h-[75vh] py-8">
      <div className="container space-y-4 mx-auto w-full max-w-[1280px] px-4 md:px-6 lg:px-8">
        <div>
          <h1 className="text-2xl font-semibold">Manage Users</h1>
          <p className="text-sm text-muted-foreground">
            Ban or unban customer and seller accounts.
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
              className="grid gap-3 lg:grid-cols-[1fr_180px_auto_auto]"
              method="GET"
            >
              <input
                name="search"
                defaultValue={query.search ?? ""}
                placeholder="Search by name or email"
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              />
              <select
                name="role"
                defaultValue={query.role ?? ""}
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">All roles</option>
                <option value="CUSTOMER">Customer</option>
                <option value="SELLER">Seller</option>
                <option value="ADMIN">Admin</option>
              </select>
              <button
                type="submit"
                className="h-10 rounded-md bg-emerald-600 px-4 text-sm font-medium text-white hover:bg-emerald-700"
              >
                Apply
              </button>
              <Link
                href="/admin/users"
                className="inline-flex h-10 items-center justify-center rounded-md border border-input px-4 text-sm font-medium hover:bg-muted"
              >
                Reset
              </Link>
            </form>
          </CardContent>
        </Card>

        <p className="text-sm text-muted-foreground">
          Showing {usersData.users.length} users on page {currentPage} of{" "}
          {Math.max(totalPages, 1)}.
        </p>

        <div className="space-y-3">
          {usersData.users.length === 0 ? (
            <EmptyState
              title="No Users Found"
              description="No users matched your current filters. Try changing role or search terms."
              actionLabel="Clear Filters"
              actionHref="/admin/users"
              className="bg-card"
            />
          ) : (
            usersData.users.map((user) => (
              <Card key={user.id}>
                <CardHeader>
                  <CardTitle className="text-base">
                    {user.name || "Unnamed User"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm">{user.email}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge variant="outline">{user.role}</Badge>
                      <Badge
                        variant={user.isBanned ? "destructive" : "secondary"}
                      >
                        {user.isBanned ? "Banned" : "Active"}
                      </Badge>
                    </div>
                  </div>
                  <AdminUserBanToggle
                    userId={user.id}
                    isBanned={user.isBanned}
                  />
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <AdminListPager
          basePath="/admin/users"
          currentPage={currentPage}
          totalPages={totalPages}
          query={{
            role: query.role,
            search: query.search,
          }}
        />
      </div>
    </main>
  );
}
