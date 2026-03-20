"use client";

import {
  createAdminCategoryAction,
  deleteAdminCategoryAction,
  updateAdminCategoryAction,
} from "@/actions/admin.actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { AdminCategory } from "@/types/admin";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type AdminCategoryManagerProps = {
  categories: AdminCategory[];
};

export function AdminCategoryManager({
  categories,
}: AdminCategoryManagerProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);
    const result = await createAdminCategoryAction({ name, description });

    if (!result.success) {
      toast.error(result.message);
      setIsSubmitting(false);
      return;
    }

    toast.success(result.message);
    setName("");
    setDescription("");
    router.refresh();
    setIsSubmitting(false);
  }

  async function handleUpdate(
    categoryId: string,
    name: string,
    description: string,
  ) {
    const result = await updateAdminCategoryAction({
      categoryId,
      name,
      description,
    });
    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
    router.refresh();
  }

  async function handleDelete(categoryId: string) {
    const result = await deleteAdminCategoryAction(categoryId);
    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Add Category</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]"
            onSubmit={handleCreate}
          >
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Category name"
            />
            <Input
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Description (optional)"
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
          <CardTitle>Category List</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {categories.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No categories found.
            </p>
          ) : (
            categories.map((category) => (
              <form
                key={category.id}
                className="grid gap-2 rounded-lg border border-border p-3 sm:grid-cols-[1fr_1fr_auto_auto]"
                onSubmit={(event) => {
                  event.preventDefault();
                  const formData = new FormData(event.currentTarget);
                  handleUpdate(
                    category.id,
                    String(formData.get("name") ?? category.name),
                    String(
                      formData.get("description") ?? category.description ?? "",
                    ),
                  );
                }}
              >
                <Input name="name" defaultValue={category.name} />
                <Input
                  name="description"
                  defaultValue={category.description ?? ""}
                />
                <Button type="submit" variant="outline">
                  Update
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => handleDelete(category.id)}
                >
                  Delete
                </Button>
              </form>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
