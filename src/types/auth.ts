export type AppRole = "CUSTOMER" | "SELLER" | "ADMIN";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role?: AppRole;
  isBanned?: boolean;
};

export type SessionData = {
  user: SessionUser;
};
