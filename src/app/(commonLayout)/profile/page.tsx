import { getProfilePageDataAction } from "@/actions/profile.actions";
import { ProfileManagement } from "@/components/modules/profile/profile-management";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const profileData = await getProfilePageDataAction();

  if (
    !profileData.isAuthenticated ||
    !profileData.profile ||
    !profileData.role
  ) {
    redirect("/login");
  }

  return (
    <main className="min-h-[80vh] bg-[radial-gradient(circle_at_15%_0%,#f4fbf8_0%,#eef7f2_45%,#f8faf9_100%)] py-8">
      <div className="container mx-auto w-full max-w-[1280px] px-4 md:px-6 lg:px-8">
        <div className="mb-6 rounded-2xl border border-emerald-100 bg-white/80 px-5 py-4 backdrop-blur dark:border-emerald-900/50 dark:bg-card/60">
          <h1 className="text-xl font-semibold text-emerald-800 dark:text-emerald-200 md:text-2xl">
            My Profile
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your personal information and seller status.
          </p>
        </div>

        <ProfileManagement
          role={profileData.role}
          profile={profileData.profile}
          sellerProfile={profileData.sellerProfile}
          canBecomeSeller={profileData.canBecomeSeller}
        />
      </div>
    </main>
  );
}
