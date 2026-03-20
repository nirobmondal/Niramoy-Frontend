import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Store } from "lucide-react";
import Link from "next/link";

export function BecomeSellerCard() {
  return (
    <Card className="border-dashed border-emerald-200 bg-emerald-50/40 dark:border-emerald-900/70 dark:bg-emerald-950/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200">
          <Store className="size-5" />
          Become a Seller
        </CardTitle>
        <CardDescription>
          Create your seller profile to start listing medicines and managing
          orders.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild className="bg-emerald-700 hover:bg-emerald-800">
          <Link href="/profile/become-seller">Create Seller Profile</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
