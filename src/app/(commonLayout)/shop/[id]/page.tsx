import Link from "next/link"
import { notFound } from "next/navigation"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getMedicineById } from "@/services/medicine"

type MedicineDetailsPageProps = {
  params: Promise<{ id: string }> | { id: string }
}

export default async function MedicineDetailsPage({ params }: MedicineDetailsPageProps) {
  const { id } = await params

  try {
    const medicine = await getMedicineById(id)

    if (!medicine.id) {
      notFound()
    }

    return (
      <main className="mx-auto w-full max-w-5xl px-4 py-8 md:px-6 lg:px-8">
        <Button asChild variant="ghost" className="mb-4 px-0">
          <Link href="/shop">Back to Shop</Link>
        </Button>

        <Card className="overflow-hidden border-border/70">
          <div className="grid grid-cols-1 gap-0 md:grid-cols-2">
            {medicine.imageUrl ? (
              <div className="aspect-square w-full overflow-hidden bg-muted/40">
                <img src={medicine.imageUrl} alt={medicine.name} className="h-full w-full object-cover" />
              </div>
            ) : (
              <div className="flex aspect-square items-center justify-center bg-gradient-to-br from-cyan-100 via-emerald-100 to-lime-100 text-sm text-muted-foreground">
                No image available
              </div>
            )}

            <CardContent className="space-y-4 p-6">
              <Badge variant="outline">{medicine.category?.name ?? "Uncategorized"}</Badge>
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{medicine.name}</h1>
              <p className="text-sm text-muted-foreground">
                Manufacturer: <span className="font-medium text-foreground">{medicine.manufacturer}</span>
              </p>
              <p className="text-3xl font-bold text-primary">${medicine.price.toFixed(2)}</p>

              <div className="grid grid-cols-2 gap-3 rounded-xl border border-border/60 bg-muted/30 p-4 text-sm">
                <p>
                  <span className="text-muted-foreground">Stock:</span> {medicine.stock}
                </p>
                <p>
                  <span className="text-muted-foreground">Availability:</span>{" "}
                  {medicine.isAvailable ? "Available" : "Unavailable"}
                </p>
                <p>
                  <span className="text-muted-foreground">Form:</span> {medicine.dosageForm || "N/A"}
                </p>
                <p>
                  <span className="text-muted-foreground">Strength:</span> {medicine.strength || "N/A"}
                </p>
              </div>

              <p className="text-sm leading-relaxed text-muted-foreground">
                {medicine.description || "No additional description is available for this medicine."}
              </p>
            </CardContent>
          </div>
        </Card>
      </main>
    )
  } catch {
    notFound()
  }
}
