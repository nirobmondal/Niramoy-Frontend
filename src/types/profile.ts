import type { AppRole } from "@/types/auth";

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: AppRole;
  phone?: string | null;
  address?: string | null;
  image?: string | null;
  isBanned?: boolean;
  createdAt?: string;
};

export type SellerProfile = {
  id: string;
  userId: string;
  storeName: string;
  storeLogo?: string | null;
  address: string;
  contactNumber: string;
  openingTime: string;
  closingTime: string;
  offDay: string;
};
