import { Roles, type RoleValue } from "@/constants/role";
import { AccountForm } from "./account-form";
import { BecomeSellerCard } from "./become-seller-card";
import { DashboardCards } from "./dashboard-cards";
import { ProfileHeader } from "./profile-header";
import { SellerProfileForm } from "./seller-profile-form";

type ProfileManagementProps = {
  role: RoleValue;
  profile: {
    image?: string | null;
    name: string;
    email: string;
    phone?: string | null;
    address?: string | null;
  };
  sellerProfile?: {
    storeName: string;
    storeLogo?: string | null;
    address: string;
    contactNumber: string;
    openingTime: string;
    closingTime: string;
    offDay: string;
  } | null;
  canBecomeSeller: boolean;
};

export function ProfileManagement({
  role,
  profile,
  sellerProfile,
  canBecomeSeller,
}: ProfileManagementProps) {
  return (
    <div className="space-y-6">
      <ProfileHeader
        name={profile.name}
        email={profile.email}
        image={profile.image}
        role={role}
      />

      <AccountForm profile={profile} />

      {role === Roles.SELLER ? (
        <SellerProfileForm
          mode="update"
          initialValues={{
            storeName: sellerProfile?.storeName ?? "",
            storeLogo: sellerProfile?.storeLogo ?? "",
            address: sellerProfile?.address ?? "",
            contactNumber: sellerProfile?.contactNumber ?? "",
            openingTime: sellerProfile?.openingTime ?? "",
            closingTime: sellerProfile?.closingTime ?? "",
            offDay: sellerProfile?.offDay ?? "",
          }}
          title="Seller Profile"
          description="Update your store details and business schedule."
          submitLabel="Save Changes"
        />
      ) : null}

      {canBecomeSeller ? <BecomeSellerCard /> : null}

      <DashboardCards role={role} />
    </div>
  );
}
