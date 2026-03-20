import { getAuthStateAction } from "@/actions/user.actions";
import { Roles } from "@/constants/role";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  admin,
  seller,
}: {
  admin: React.ReactNode;
  seller: React.ReactNode;
}) {
  const authState = await getAuthStateAction();

  if (!authState.isAuthenticated) {
    redirect("/login");
  }

  if (authState.role === Roles.ADMIN) {
    return <>{admin}</>;
  }

  if (authState.role === Roles.SELLER) {
    return <>{seller}</>;
  }

  redirect("/");
}
