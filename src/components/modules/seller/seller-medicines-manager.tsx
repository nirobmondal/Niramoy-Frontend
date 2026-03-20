"use client";

import {
  createSellerMedicineAction,
  deleteSellerMedicineAction,
  updateSellerMedicineAction,
  updateSellerMedicineStockAction,
} from "@/actions/seller.actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useForm } from "@tanstack/react-form";
import type { Category } from "@/types/medicine";
import type { ManufacturerOption, SellerMedicine } from "@/types/seller";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import * as z from "zod";

const sellerMedicineSchema = z.object({
  name: z.string().min(2, "Medicine name is required"),
  description: z.string().min(5, "Description is required"),
  price: z.coerce.number().positive("Price must be greater than 0"),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
  manufacturerId: z.string().min(1, "Manufacturer is required"),
  imageUrl: z
    .string()
    .url("Image URL must be valid")
    .optional()
    .or(z.literal("")),
  dosageForm: z.string().min(1, "Dosage form is required"),
  strength: z.string().min(1, "Strength is required"),
  categoryId: z.string().min(1, "Category is required"),
});

type SellerMedicinesManagerProps = {
  medicines: SellerMedicine[];
  categories: Category[];
  manufacturers: ManufacturerOption[];
};

export function SellerMedicinesManager({
  medicines,
  categories,
  manufacturers,
}: SellerMedicinesManagerProps) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);

  const createForm = useForm({
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      stock: 0,
      manufacturerId: "",
      imageUrl: "",
      dosageForm: "",
      strength: "",
      categoryId: "",
    },
    onSubmit: async ({ value }) => {
      const parsed = sellerMedicineSchema.safeParse(value);

      if (!parsed.success) {
        toast.error(parsed.error.issues[0]?.message ?? "Invalid medicine data");
        return;
      }

      const toastId = toast.loading("Creating medicine...");
      const result = await createSellerMedicineAction(parsed.data);

      if (!result.success) {
        toast.error(result.message, { id: toastId });
        return;
      }

      toast.success(result.message, { id: toastId });
      router.refresh();
    },
  });

  async function handleDelete(medicineId: string) {
    setPendingId(medicineId);
    const result = await deleteSellerMedicineAction(medicineId);

    if (!result.success) {
      toast.error(result.message);
      setPendingId(null);
      return;
    }

    toast.success(result.message);
    router.refresh();
    setPendingId(null);
  }

  async function handleStockUpdate(medicineId: string, stockValue: string) {
    const stock = Number.parseInt(stockValue, 10);

    if (!Number.isFinite(stock) || stock < 0) {
      toast.error("Stock must be a non-negative number");
      return;
    }

    setPendingId(medicineId);
    const result = await updateSellerMedicineStockAction(medicineId, stock);

    if (!result.success) {
      toast.error(result.message);
      setPendingId(null);
      return;
    }

    toast.success(result.message);
    router.refresh();
    setPendingId(null);
  }

  async function handleMedicineUpdate(
    medicineId: string,
    data: { price: number; isAvailable: boolean },
  ) {
    if (!Number.isFinite(data.price) || data.price <= 0) {
      toast.error("Price must be greater than 0");
      return;
    }

    setPendingId(medicineId);
    const result = await updateSellerMedicineAction(medicineId, {
      price: data.price,
      isAvailable: data.isAvailable,
    });

    if (!result.success) {
      toast.error(result.message);
      setPendingId(null);
      return;
    }

    toast.success(result.message);
    router.refresh();
    setPendingId(null);
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Add Medicine</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              createForm.handleSubmit();
            }}
          >
            <FieldGroup>
              <createForm.Field name="name">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                    />
                    {!field.state.meta.isValid && field.state.meta.isTouched ? (
                      <FieldError errors={field.state.meta.errors} />
                    ) : null}
                  </Field>
                )}
              </createForm.Field>

              <createForm.Field name="description">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                    />
                  </Field>
                )}
              </createForm.Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <createForm.Field name="price">
                  {(field) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Price</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="number"
                        min={0}
                        step="1"
                        value={String(field.state.value)}
                        onBlur={field.handleBlur}
                        onChange={(event) =>
                          field.handleChange(Number(event.target.value))
                        }
                      />
                    </Field>
                  )}
                </createForm.Field>

                <createForm.Field name="stock">
                  {(field) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Stock</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="number"
                        min={0}
                        value={String(field.state.value)}
                        onBlur={field.handleBlur}
                        onChange={(event) =>
                          field.handleChange(Number(event.target.value))
                        }
                      />
                    </Field>
                  )}
                </createForm.Field>
              </div>

              <createForm.Field name="manufacturerId">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Manufacturer</FieldLabel>
                    <select
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                    >
                      <option value="">Select manufacturer</option>
                      {manufacturers.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                    {!field.state.meta.isValid && field.state.meta.isTouched ? (
                      <FieldError errors={field.state.meta.errors} />
                    ) : null}
                  </Field>
                )}
              </createForm.Field>

              <createForm.Field name="dosageForm">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Dosage Form</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      placeholder="Tablet, Capsule, Syrup"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                    />
                    {!field.state.meta.isValid && field.state.meta.isTouched ? (
                      <FieldError errors={field.state.meta.errors} />
                    ) : null}
                  </Field>
                )}
              </createForm.Field>

              <createForm.Field name="strength">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Strength</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      placeholder="500mg, 2000 IU"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                    />
                    {!field.state.meta.isValid && field.state.meta.isTouched ? (
                      <FieldError errors={field.state.meta.errors} />
                    ) : null}
                  </Field>
                )}
              </createForm.Field>

              <createForm.Field name="categoryId">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Category</FieldLabel>
                    <select
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                    >
                      <option value="">Select category</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    {!field.state.meta.isValid && field.state.meta.isTouched ? (
                      <FieldError errors={field.state.meta.errors} />
                    ) : null}
                  </Field>
                )}
              </createForm.Field>

              <createForm.Field name="imageUrl">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>
                      Image URL (Optional)
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      placeholder="https://example.com/medicine-image.jpg"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                    />
                  </Field>
                )}
              </createForm.Field>

              <Button
                type="submit"
                className="bg-emerald-700 hover:bg-emerald-800"
              >
                Add Medicine
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {medicines.length === 0 ? (
          <Card>
            <CardContent className="py-5 text-sm text-muted-foreground">
              No medicines found. Add your first medicine from the form above.
            </CardContent>
          </Card>
        ) : (
          medicines.map((medicine) => (
            <Card key={medicine.id}>
              <CardContent className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold">{medicine.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Price: ৳{Number(medicine.price).toFixed(2)} | Stock:{" "}
                    {medicine.stock}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Input
                    defaultValue={String(medicine.stock)}
                    type="number"
                    min={0}
                    className="w-24"
                    onBlur={(event) =>
                      handleStockUpdate(medicine.id, event.target.value)
                    }
                  />

                  <form
                    key={`${medicine.id}-${medicine.price}-${medicine.isAvailable ? "1" : "0"}`}
                    className="flex items-center gap-2"
                    onSubmit={(event) => {
                      event.preventDefault();
                      const formData = new FormData(event.currentTarget);
                      const price = Number(formData.get("price") ?? 0);
                      const isAvailable = formData.get("isAvailable") === "on";
                      handleMedicineUpdate(medicine.id, { price, isAvailable });
                    }}
                  >
                    <Input
                      name="price"
                      defaultValue={String(medicine.price)}
                      type="number"
                      min={0}
                      step="0.01"
                      className="w-28"
                    />
                    <label className="flex items-center gap-1 text-xs text-muted-foreground">
                      <input
                        name="isAvailable"
                        type="checkbox"
                        defaultChecked={medicine.isAvailable}
                      />
                      Available
                    </label>
                    <Button
                      type="submit"
                      variant="outline"
                      disabled={pendingId === medicine.id}
                    >
                      Update
                    </Button>
                  </form>

                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => handleDelete(medicine.id)}
                    disabled={pendingId === medicine.id}
                  >
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
