"use client";

import { updateAdminUserBanAction } from "@/actions/admin.actions";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type AdminUserBanToggleProps = {
  userId: string;
  isBanned: boolean;
};

export function AdminUserBanToggle({
  userId,
  isBanned,
}: AdminUserBanToggleProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function handleToggle() {
    setIsPending(true);
    const result = await updateAdminUserBanAction({
      userId,
      isBanned: !isBanned,
    });

    if (!result.success) {
      toast.error(result.message);
      setIsPending(false);
      return;
    }

    toast.success(result.message);
    router.refresh();
    setIsPending(false);
  }

  return (
    <Button
      type="button"
      variant={isBanned ? "outline" : "destructive"}
      disabled={isPending}
      onClick={handleToggle}
    >
      {isPending ? "Updating..." : isBanned ? "Unban" : "Ban"}
    </Button>
  );
}
