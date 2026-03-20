import { getAdminManufacturersAction } from "@/actions/admin.actions";
import { getAuthStateAction } from "@/actions/user.actions";
import { AdminManufacturerManager } from "@/components/modules/admin/admin-manufacturer-manager";
import { Roles } from "@/constants/role";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AdminManufacturersPage() {
  const authState = await getAuthStateAction();

  if (!authState.isAuthenticated) redirect("/login");
  if (authState.role !== Roles.ADMIN) redirect("/");

  const manufacturers = await getAdminManufacturersAction();

  return (
    <main className="min-h-[75vh] py-8">
      <div className="container space-y-4 mx-auto w-full max-w-[1280px] px-4 md:px-6 lg:px-8">
        <div>
          <h1 className="text-2xl font-semibold">Manage Manufacturers</h1>
          <p className="text-sm text-muted-foreground">
            Create manufacturer names for seller medicine management and
            filtering.
          </p>
          <Link
            href="/admin/dashboard"
            className="mt-2 inline-flex text-sm font-medium text-emerald-700 underline underline-offset-4"
          >
            Back to Admin Dashboard
          </Link>
        </div>

        <AdminManufacturerManager manufacturers={manufacturers} />
      </div>
    </main>
  );
}
