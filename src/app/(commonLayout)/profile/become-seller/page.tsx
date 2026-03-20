import { getProfilePageDataAction } from "@/actions/profile.actions";
import { SellerProfileForm } from "@/components/modules/profile/seller-profile-form";
import { Roles } from "@/constants/role";
import { redirect } from "next/navigation";

export default async function BecomeSellerPage() {
  const profileData = await getProfilePageDataAction();

  if (!profileData.isAuthenticated) {
    redirect("/login");
  }

  if (profileData.role !== Roles.CUSTOMER) {
    redirect("/profile");
  }

  return (
    <main className="min-h-[80vh] bg-[radial-gradient(circle_at_15%_0%,#f4fbf8_0%,#eef7f2_45%,#f8faf9_100%)] py-8">
      <div className="container space-y-6 mx-auto w-full max-w-[1280px] px-4 md:px-6 lg:px-8">
        <div className="rounded-2xl border border-emerald-100 bg-white/80 px-5 py-4 backdrop-blur dark:border-emerald-900/50 dark:bg-card/60">
          <h1 className="text-xl font-semibold text-emerald-800 dark:text-emerald-200 md:text-2xl">
            Create Seller Profile
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Complete this form to become a seller and unlock seller dashboard
            features.
          </p>
        </div>

        <SellerProfileForm mode="create" />
      </div>
    </main>
  );
}
