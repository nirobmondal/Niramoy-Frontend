"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { ArrowLeft, CircleCheck, PackageX } from "lucide-react";

import { AddToCartButton } from "@/components/modules/medicine/add-to-cart-button";
import { MedicineCard } from "@/components/modules/medicine/medicine-card";
import { MedicineReviews } from "@/components/modules/medicine/medicine-reviews";
import { QuantitySelector } from "@/components/modules/medicine/quantity-selector";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { RoleValue } from "@/constants/role";
import type { Medicine } from "@/types/medicine";
import type { MedicineReviewsData } from "@/types/review";

type MedicineDetailsProps = {
  medicine: Medicine;
  relatedMedicines?: Medicine[];
  reviewsData: MedicineReviewsData;
  currentUser?: {
    id: string;
  } | null;
  currentUserRole?: RoleValue | null;
};

export function MedicineDetails({
  medicine,
  relatedMedicines = [],
  reviewsData,
  currentUser,
  currentUserRole,
}: MedicineDetailsProps) {
  const purchasableStock = Math.max(0, medicine.stock);
  const isOutOfStock = !medicine.isAvailable || purchasableStock < 1;
  const maxQuantity = Math.max(1, purchasableStock);

  const [quantity, setQuantity] = useState(1);
  const manufacturerLabel =
    medicine.manufacturer?.name || medicine.manufacturerId || "N/A";

  const totalPrice = useMemo(
    () => medicine.price * quantity,
    [medicine.price, quantity],
  );

  return (
    <main className="min-h-[80vh] bg-[radial-gradient(circle_at_20%_0%,#f8fcff_0%,#edf3f7_35%,#eef4f7_100%)] py-6">
      <div className="mx-auto w-full max-w-[1280px] px-4 md:px-6 lg:px-8">
        <Button
          asChild
          variant="ghost"
          className="mb-4 h-10 px-0 text-[#355464] hover:bg-transparent hover:text-[#0f8f8f]"
        >
          <Link href="/shop" aria-label="Back to medicine listing page">
            <ArrowLeft className="size-4" />
            Back to Shop
          </Link>
        </Button>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1.08fr_1fr]">
          <Card className="overflow-hidden rounded-2xl border-[#d8e5ec] bg-white py-0 shadow-[0_18px_42px_-28px_rgba(15,76,117,0.35)]">
            {medicine.imageUrl ? (
              <Image
                src={medicine.imageUrl}
                alt={medicine.name}
                width={1200}
                height={900}
                unoptimized
                className="h-full max-h-[560px] w-full object-cover"
                loading="eager"
              />
            ) : (
              <div className="flex h-[420px] items-center justify-center bg-[#eef4f7] text-sm text-[#68808d] md:h-[560px]">
                No image available
              </div>
            )}
          </Card>

          <div className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
            <Card className="rounded-2xl border-[#d8e5ec] bg-white shadow-[0_18px_42px_-28px_rgba(15,76,117,0.35)]">
              <CardContent className="space-y-4 p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="border border-[#d7ebe9] bg-[#ecf9f8] text-[#0f7f7f]">
                    {medicine.category?.name ?? "Uncategorized"}
                  </Badge>
                  {isOutOfStock ? (
                    <Badge
                      variant="secondary"
                      className="bg-rose-100 text-rose-700"
                    >
                      <PackageX className="mr-1 size-3.5" />
                      Out of Stock
                    </Badge>
                  ) : (
                    <Badge
                      variant="secondary"
                      className="bg-emerald-100 text-emerald-700"
                    >
                      <CircleCheck className="mr-1 size-3.5" />
                      In Stock
                    </Badge>
                  )}
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-[#1b2f3b] md:text-4xl">
                  {medicine.name}
                </h1>

                <p className="text-sm text-[#5f7784]">
                  Manufacturer:{" "}
                  <span className="font-semibold text-[#2b4452]">
                    {manufacturerLabel}
                  </span>
                </p>

                <div className="rounded-xl border border-[#d8e5ec] bg-[#f8fbfd] p-4">
                  <p className="text-xs font-medium text-[#647d8b]">
                    Unit Price
                  </p>
                  <p className="mt-1 text-4xl font-bold tracking-tight text-[#0f8f8f]">
                    ৳{medicine.price.toFixed(2)}
                  </p>
                </div>

                <p className="text-sm leading-relaxed text-[#5f7784]">
                  {medicine.description ||
                    "No detailed description is currently available for this medicine."}
                </p>

                <div className="grid grid-cols-1 gap-2 rounded-xl border border-[#d8e5ec] bg-[#fbfdff] p-4 text-sm text-[#476272] sm:grid-cols-2">
                  <p>
                    Stock:{" "}
                    <span className="font-semibold text-[#2b4452]">
                      {purchasableStock}
                    </span>
                  </p>
                  <p>
                    Dosage Form:{" "}
                    <span className="font-semibold text-[#2b4452]">
                      {medicine.dosageForm || "N/A"}
                    </span>
                  </p>
                  <p>
                    Strength:{" "}
                    <span className="font-semibold text-[#2b4452]">
                      {medicine.strength || "N/A"}
                    </span>
                  </p>
                  <p>
                    Store:{" "}
                    <span className="font-semibold text-[#2b4452]">
                      {medicine.seller?.storeName || "Niramoy Partner"}
                    </span>
                  </p>
                </div>

                <Separator />

                <div className="space-y-4 rounded-xl border border-[#d8e5ec] bg-[#f8fbfd] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-[#2a4250]">
                      Select Quantity
                    </p>
                    <QuantitySelector
                      value={quantity}
                      min={1}
                      max={maxQuantity}
                      disabled={isOutOfStock}
                      onChange={setQuantity}
                    />
                  </div>

                  <div className="space-y-1 text-sm text-[#4e6674]">
                    <p>
                      Unit Price:{" "}
                      <span className="font-semibold text-[#1f3543]">
                        ৳{medicine.price.toFixed(2)}
                      </span>
                    </p>
                    <p>
                      Quantity:{" "}
                      <span className="font-semibold text-[#1f3543]">
                        {quantity}
                      </span>
                    </p>
                    <p className="text-base">
                      Total:{" "}
                      <span className="font-bold text-[#0f8f8f]">
                        ৳{totalPrice.toFixed(2)}
                      </span>
                    </p>
                  </div>

                  <AddToCartButton
                    medicineId={medicine.id}
                    quantity={quantity}
                    disabled={
                      isOutOfStock || quantity < 1 || quantity > maxQuantity
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mt-8 space-y-5">
          <Card className="rounded-2xl border-[#d8e5ec] bg-white shadow-[0_18px_42px_-28px_rgba(15,76,117,0.25)]">
            <CardContent className="space-y-2 p-6">
              <h2 className="text-xl font-semibold tracking-tight text-[#1d3340]">
                Description
              </h2>
              <p className="text-sm leading-relaxed text-[#5f7784]">
                {medicine.description ||
                  "No additional description is available for this medicine."}
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-[#d8e5ec] bg-white shadow-[0_18px_42px_-28px_rgba(15,76,117,0.25)]">
            <CardContent className="space-y-2 p-6">
              <h2 className="text-xl font-semibold tracking-tight text-[#1d3340]">
                Manufacturer Information
              </h2>
              <p className="text-sm text-[#5f7784]">
                {manufacturerLabel ||
                  "Manufacturer information is not available."}
              </p>
            </CardContent>
          </Card>

          {relatedMedicines.length > 0 ? (
            <Card className="rounded-2xl border-[#d8e5ec] bg-white shadow-[0_18px_42px_-28px_rgba(15,76,117,0.25)]">
              <CardContent className="space-y-4 p-6">
                <h2 className="text-xl font-semibold tracking-tight text-[#1d3340]">
                  Related Medicines
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {relatedMedicines.map((relatedMedicine) => (
                    <MedicineCard
                      key={relatedMedicine.id}
                      medicine={relatedMedicine}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : null}

          <MedicineReviews
            medicineId={medicine.id}
            reviewsData={reviewsData}
            currentUserId={currentUser?.id ?? null}
            currentUserRole={currentUserRole ?? null}
          />
        </section>
      </div>
    </main>
  );
}
