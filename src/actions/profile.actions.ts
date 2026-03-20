"use server";

import { Roles } from "@/constants/role";
import {
  becomeSellerSchema,
  updateProfileSchema,
  updateSellerSchema,
} from "@/components/modules/profile/profile.schemas";
import { sellerService } from "@/services/seller.service";
import { userService } from "@/services/user.service";
import type { RoleValue } from "@/constants/role";
import type { SellerProfile, UserProfile } from "@/types/profile";

type ProfilePageData = {
  isAuthenticated: boolean;
  role: RoleValue | null;
  profile: UserProfile | null;
  sellerProfile: SellerProfile | null;
  canBecomeSeller: boolean;
};

function normalizeRole(role?: string): RoleValue {
  if (role === Roles.ADMIN) return Roles.ADMIN;
  if (role === Roles.SELLER) return Roles.SELLER;
  return Roles.CUSTOMER;
}

export async function getProfilePageDataAction(): Promise<ProfilePageData> {
  const sessionResult = await userService.getSession();
  const sessionUser = sessionResult.data?.user;

  if (!sessionUser) {
    return {
      isAuthenticated: false,
      role: null,
      profile: null,
      sellerProfile: null,
      canBecomeSeller: false,
    };
  }

  const role = normalizeRole(sessionUser.role);

  const [profileResult, sellerProfileResult] = await Promise.all([
    userService.getMyProfile(),
    role === Roles.SELLER
      ? sellerService.getSellerProfile()
      : Promise.resolve({ data: null, error: null }),
  ]);

  const fallbackProfile: UserProfile = {
    id: sessionUser.id,
    name: sessionUser.name,
    email: sessionUser.email,
    role,
    image: sessionUser.image ?? null,
    isBanned: sessionUser.isBanned ?? false,
  };

  return {
    isAuthenticated: true,
    role,
    profile: profileResult.data ?? fallbackProfile,
    sellerProfile: sellerProfileResult.data,
    canBecomeSeller: role === Roles.CUSTOMER,
  };
}

export async function updateProfileAction(input: {
  name: string;
  phone?: string;
  address?: string;
  image?: string;
}) {
  const parsed = updateProfileSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Invalid profile data",
    };
  }

  const result = await userService.updateMyProfile(parsed.data);

  if (result.error) {
    return {
      success: false,
      message: result.error.message,
    };
  }

  return {
    success: true,
    message: "Profile updated successfully",
  };
}

export async function becomeSellerAction(input: {
  storeName: string;
  storeLogo?: string;
  address: string;
  contactNumber: string;
  openingTime: string;
  closingTime: string;
  offDay: string;
}) {
  const session = await userService.getSession();
  const role = normalizeRole(session.data?.user?.role);

  if (role !== Roles.CUSTOMER) {
    return {
      success: false,
      message: "Only users can become sellers",
    };
  }

  const parsed = becomeSellerSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Invalid seller data",
    };
  }

  const result = await sellerService.createSellerProfile(parsed.data);

  if (result.error) {
    return {
      success: false,
      message: result.error.message,
    };
  }

  return {
    success: true,
    message: "You are now a seller",
  };
}

export async function updateSellerProfileAction(input: {
  storeName: string;
  storeLogo?: string;
  address: string;
  contactNumber: string;
  openingTime: string;
  closingTime: string;
  offDay: string;
}) {
  const session = await userService.getSession();
  const role = normalizeRole(session.data?.user?.role);

  if (role !== Roles.SELLER) {
    return {
      success: false,
      message: "Only sellers can update seller profile",
    };
  }

  const parsed = updateSellerSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Invalid seller profile data",
    };
  }

  const result = await sellerService.updateSellerProfile(parsed.data);

  if (result.error) {
    return {
      success: false,
      message: result.error.message,
    };
  }

  return {
    success: true,
    message: "Seller profile updated successfully",
  };
}
