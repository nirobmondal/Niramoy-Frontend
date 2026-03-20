import { getAuthStateAction } from "@/actions/user.actions";
import { Roles } from "@/constants/role";
import { redirect } from "next/navigation";

export default async function DashboardEntryPage() {
  const authState = await getAuthStateAction();

  if (!authState.isAuthenticated) {
    redirect("/login");
  }

  if (authState.role === Roles.ADMIN) {
    redirect("/admin/dashboard");
  }

  if (authState.role === Roles.SELLER) {
    redirect("/seller/dashboard");
  }

  redirect("/");
}
