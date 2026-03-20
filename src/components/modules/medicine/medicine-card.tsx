import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Medicine } from "@/types/medicine";

type MedicineCardProps = {
  medicine: Medicine;
};

export function MedicineCard({ medicine }: MedicineCardProps) {
  const manufacturerLabel =
    medicine.manufacturer?.name ||
    medicine.manufacturerId ||
    "Unknown manufacturer";

  return (
    <Card className="group h-full overflow-hidden rounded-2xl border-[#d7e3ea] bg-white py-0 shadow-none transition duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="relative">
        {medicine.imageUrl ? (
          <Image
            src={medicine.imageUrl}
            alt={medicine.name}
            width={440}
            height={250}
            unoptimized
            className="h-64 w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            loading="lazy"
          />
        ) : (
          <div className="flex h-64 w-full items-center justify-center bg-[#eef4f7] text-sm text-[#708492]">
            No image available
          </div>
        )}

        <Badge className="absolute top-3 left-3 border border-[#d7ebe9] bg-[#eef9f8] text-[#0f7f7f]">
          {medicine.category?.name ?? "OTC"}
        </Badge>
      </div>

      <CardHeader className="space-y-2 p-4 pb-2">
        <p className="line-clamp-1 text-xs font-medium text-[#67808f]">
          {manufacturerLabel}
        </p>
        <CardTitle className="line-clamp-1 text-lg leading-tight text-[#1b2f3b]">
          {medicine.name}
        </CardTitle>
        <p className="line-clamp-1 text-xs text-[#758a97]">
          Shop:{" "}
          <span className="font-medium text-[#526a77]">
            {medicine.seller?.storeName || "Niramoy Partner"}
          </span>
        </p>
      </CardHeader>

      <CardContent className="space-y-2 px-4 pb-4">
        <p className="text-2xl font-bold tracking-tight text-[#0f8f8f]">
          ৳{medicine.price.toFixed(2)}
        </p>
        <p className="line-clamp-2 min-h-10 text-sm text-[#6c7f8c]">
          {medicine.description ||
            "Trusted OTC medicine from a verified seller."}
        </p>
      </CardContent>

      <CardFooter className="grid grid-cols-2 gap-2 border-t border-[#e4edf2] bg-[#f8fbfd] p-4">
        <Button
          asChild
          className="bg-[#0f8f8f] text-white hover:bg-[#0b7a7a]"
          aria-label={`Select quantity for ${medicine.name}`}
        >
          <Link href={`/shop/${medicine.id}`}>
            <ShoppingCart className="size-4" />
            Add to Cart
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="border-[#d7e3ea] bg-white text-[#2a4351] hover:bg-[#edf3f7]"
          aria-label={`View details for ${medicine.name}`}
        >
          <Link href={`/shop/${medicine.id}`}>Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
