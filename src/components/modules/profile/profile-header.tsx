import { Roles, type RoleValue } from "@/constants/role";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

type ProfileHeaderProps = {
  name: string;
  email: string;
  image?: string | null;
  role: RoleValue;
};

export function ProfileHeader({
  name,
  email,
  image,
  role,
}: ProfileHeaderProps) {
  const initials =
    name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "U";

  const roleLabel =
    role === Roles.ADMIN ? "Admin" : role === Roles.SELLER ? "Seller" : "User";

  return (
    <Card className="border-emerald-100 dark:border-emerald-900/60">
      <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="size-16 border border-emerald-100 dark:border-emerald-900/60">
            <AvatarImage src={image ?? undefined} alt={name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-xl font-semibold text-foreground">{name}</p>
            <p className="text-sm text-muted-foreground">{email}</p>
          </div>
        </div>

        <Badge
          variant="secondary"
          className="h-7 rounded-full px-3 text-sm font-semibold"
        >
          {roleLabel}
        </Badge>
      </CardContent>
    </Card>
  );
}
