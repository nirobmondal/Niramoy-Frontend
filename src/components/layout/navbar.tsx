import { getNavbarCartCountAction } from "@/actions/cart.actions";
import { getNavbarUserAction } from "@/actions/user.actions";
import { NavbarClient } from "./navbar-client";

export async function Navbar() {
  const [userStateResult, cartCountResult] = await Promise.allSettled([
    getNavbarUserAction(),
    getNavbarCartCountAction(),
  ]);

  const userState =
    userStateResult.status === "fulfilled"
      ? userStateResult.value
      : { isLoggedIn: false, user: null };

  const cartCount =
    cartCountResult.status === "fulfilled" ? cartCountResult.value : 0;

  return (
    <NavbarClient
      isLoggedIn={userState.isLoggedIn}
      user={userState.user}
      cartCount={cartCount}
    />
  );
}
