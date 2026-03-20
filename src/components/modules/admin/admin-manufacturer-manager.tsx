"use client";

import { createAdminManufacturerAction } from "@/actions/admin.actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { AdminManufacturer } from "@/types/admin";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type AdminManufacturerManagerProps = {
  manufacturers: AdminManufacturer[];
};

export function AdminManufacturerManager({
  manufacturers,
}: AdminManufacturerManagerProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);
    const result = await createAdminManufacturerAction({ name });

    if (!result.success) {
      toast.error(result.message);
      setIsSubmitting(false);
      return;
    }

    toast.success(result.message);
    setName("");
    router.refresh();
    setIsSubmitting(false);
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Add Manufacturer</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-wrap gap-2" onSubmit={handleCreate}>
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Manufacturer name"
              className="max-w-sm"
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-emerald-700 hover:bg-emerald-800"
            >
              {isSubmitting ? "Adding..." : "Add"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manufacturer List</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {manufacturers.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No manufacturers found.
            </p>
          ) : (
            manufacturers.map((manufacturer) => (
              <div
                key={manufacturer.id}
                className="rounded-lg border border-border px-3 py-2"
              >
                <p className="font-medium">{manufacturer.name}</p>
                <p className="text-xs text-muted-foreground">
                  ID: {manufacturer.id}
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
