import {
  getSellerMedicineFormOptionsAction,
  getSellerMedicinesAction,
} from "@/actions/seller.actions";
import { getAuthStateAction } from "@/actions/user.actions";
import { SellerMedicinesManager } from "@/components/modules/seller/seller-medicines-manager";
import { Roles } from "@/constants/role";
import Link from "next/link";
import { redirect } from "next/navigation";

type SellerMedicinesPageProps = {
  searchParams?: Promise<{ page?: string; search?: string }>;
};

export default async function SellerMedicinesPage({
  searchParams,
}: SellerMedicinesPageProps) {
  const authState = await getAuthStateAction();

  if (!authState.isAuthenticated) {
    redirect("/login");
  }

  if (authState.role !== Roles.SELLER) {
    redirect("/");
  }

  const query = (await searchParams) ?? {};
  const page = Number.parseInt(query.page ?? "1", 10);

  const [medicinesData, options] = await Promise.all([
    getSellerMedicinesAction({
      page: Number.isFinite(page) ? page : 1,
      limit: 10,
      search: query.search,
    }),
    getSellerMedicineFormOptionsAction(),
  ]);

  return (
    <main className="min-h-[75vh] py-8">
      <div className="container space-y-4 mx-auto w-full max-w-[1280px] px-4 md:px-6 lg:px-8">
        <div>
          <h1 className="text-2xl font-semibold">Manage Medicines</h1>
          <p className="text-sm text-muted-foreground">
            Add new medicines, update stock, and remove unavailable items.
          </p>
          <Link
            href="/seller/dashboard"
            className="mt-2 inline-flex text-sm font-medium text-emerald-700 underline underline-offset-4"
          >
            Back to Seller Dashboard
          </Link>
        </div>

        <SellerMedicinesManager
          medicines={medicinesData.medicines}
          categories={options.categories}
          manufacturers={options.manufacturers}
        />
      </div>
    </main>
  );
}
