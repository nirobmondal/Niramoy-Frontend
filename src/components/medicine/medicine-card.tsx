"use client"

import Link from "next/link"
import { useState } from "react"
import { ShoppingCart, Star } from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { Medicine } from "@/types/medicine"

type MedicineCardProps = {
  medicine: Medicine
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api"

export function MedicineCard({ medicine }: MedicineCardProps) {
  const [isAdding, setIsAdding] = useState(false)
  const rating = medicine.averageRating ?? 4.8

  const handleAddToCart = async () => {
    try {
      setIsAdding(true)

      const response = await fetch(`${API_BASE_URL}/cart/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          medicineId: medicine.id,
          quantity: 1,
        }),
      })

      const payload = (await response.json()) as { message?: string }

      if (!response.ok) {
        toast.error(payload.message ?? "Could not add medicine to cart")
        return
      }

      toast.success(payload.message ?? `${medicine.name} added to cart`)
    } catch {
      toast.error("Something went wrong while adding to cart")
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <Card className="h-full rounded-xl border border-[#dbe5eb] bg-white py-0 shadow-none transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative px-3 pt-3">
        <Badge className="absolute top-5 left-5 z-10 bg-[#ecf9f8] text-[10px] font-semibold tracking-wide text-[#0f8f8f]">
          {medicine.category?.name ?? "OTC"}
        </Badge>
      </div>

      {medicine.imageUrl ? (
        <div className="mx-3 mt-3 flex aspect-[4/3] items-center justify-center overflow-hidden rounded-sm bg-[#f5f7fa]">
          <img
            src={medicine.imageUrl}
            alt={medicine.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="mx-3 mt-3 flex aspect-[4/3] items-center justify-center rounded-sm bg-[#f5f7fa] text-sm text-muted-foreground">
          No image available
        </div>
      )}

      <CardHeader className="space-y-1 px-3 pt-3">
        <div className="flex items-center justify-between">
          <p className="line-clamp-1 text-[10px] font-semibold tracking-wide text-[#6c7e8a] uppercase">
            {medicine.manufacturer || "Unknown Manufacturer"}
          </p>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#d18b00]">
            <Star className="size-3 fill-current" />
            {rating.toFixed(1)}
          </span>
        </div>
        <CardTitle className="line-clamp-1 text-[23px] leading-tight font-semibold tracking-tight text-[#1a2833]">
          {medicine.name}
        </CardTitle>
        <p className="line-clamp-1 text-[11px] text-[#7c8f9a]">
          Store: <span className="font-medium text-[#50606c]">{medicine.seller?.storeName || "Niramoy Partner Store"}</span>
        </p>
      </CardHeader>

      <CardContent className="space-y-2 px-3 pb-3">
        <div className="flex items-end gap-2">
          <span className="text-[28px] leading-none font-bold tracking-tight text-[#0c8f8a]">
            ${medicine.price.toFixed(2)}
          </span>
        </div>
        <p className="line-clamp-2 min-h-9 text-[11px] text-[#7f8e99]">
          {medicine.description || "Trusted OTC medicine from verified sellers."}
        </p>
      </CardContent>

      <CardFooter className="mt-auto grid grid-cols-2 gap-2 border-t border-[#e4eaee] bg-[#f8fafb] p-3">
        <Button
          onClick={handleAddToCart}
          disabled={isAdding || !medicine.isAvailable || medicine.stock < 1}
          className="w-full bg-[#0f8f8f] text-white hover:bg-[#0b7c7c]"
          aria-label={`Add ${medicine.name} to cart`}
        >
          <ShoppingCart className="size-4" />
          {isAdding ? "Adding" : "Add"}
        </Button>
        <Button asChild variant="outline" className="w-full border-[#dce5ec] bg-[#eef3f6] text-[#223240] hover:bg-[#e4edf2]" aria-label={`View details for ${medicine.name}`}>
          <Link href={`/shop/${medicine.id}`}>Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
